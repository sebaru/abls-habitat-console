/******************************************************************************************************************************/
 function Go_to_dls_source ()
  { vars = window.location.pathname.split('/');
    Redirect ( "/dls/"+vars[3] );
  }
/******************************************************************************************************************************/
 function Go_to_mnemos ()
  { vars = window.location.pathname.split('/');
    Redirect ( "/dls/mnemos/"+vars[3] );
  }
/******************************************************************************************************************************/
 async function Dls_monitor_set ( table, classe, acronyme, valeur )
  { vars = window.location.pathname.split('/');
    var json_request = JSON.stringify(
     { classe: classe,
       tech_id : vars[3],
       acronyme: acronyme,
       valeur: valeur
     });

  }
/******************************************************************************************************************************/
 function Dls_monitor_refresh ( table )
  { $('#'+table).DataTable().ajax.reload(null, false); }
/******************************************************************************************************************************/
 function Dls_monitor_MONO_set ( acronyme )
  { Dls_monitor_set ( "idTableMONO", "MONO", acronyme, true ); }
/******************************************************************************************************************************/
 function Dls_monitor_BI_set ( acronyme )
  { Dls_monitor_set ( "idTableBI", "BI", acronyme, true ); }
/******************************************************************************************************************************/
 function Dls_monitor_BI_reset ( acronyme )
  { Dls_monitor_set ( "idTableBI", "BI", acronyme, false ); }

/*********************************************** Monitoring temps réel du plugin **********************************************/
 var Dls_monitor_tech_id    = null;
 var Dls_monitor_watcher_id = null;
 var Dls_monitor_keepalive  = null;

 var DLS_MONITOR_TABLES = { DI: "idTableEntreeTOR", AI: "idTableEntreeANA",
                            DO: "idTableSortieTOR", AO: "idTableSortieANA",
                            CI: "idTableCI",        CH: "idTableCH",
                            MONO: "idTableMONO",    BI: "idTableBI",
                            REGISTRE: "idTableRegistre",
                            VISUEL: "idTableVisuel", WATCHDOG: "idTableWatchdog",
                            MSG: "idTableMessages" };
/******************************************************************************************************************************/
 function Dls_monitor_set_badge ( nbr_watchers )
  { if (nbr_watchers > 0) $('#idDlsRunMonitor').html( Badge("success", "Le moteur D.L.S remonte les changements de bits", "Temps réel") );
                     else $('#idDlsRunMonitor').html( Badge("secondary", "Les valeurs affichées proviennent de la base", "Différé") );
  }
/******************************************************************************************************************************/
/* Dls_monitor_apply_bit: Met à jour en place la ligne du bit reçu, sans recharger la table                                   */
/******************************************************************************************************************************/
 function Dls_monitor_apply_bit ( bit, redrawn )
  { var table_id = DLS_MONITOR_TABLES[bit.classe];
    if (!table_id) return;
    if (DataTable.isDataTable('#'+table_id) == false) return;

    var table   = $('#'+table_id).DataTable();
    var indexes = table.rows( function ( index, data, node )
                   { return ( data.tech_id == bit.tech_id && data.acronyme == bit.acronyme ); } ).indexes();
    if (!indexes.length) return;

    var row  = table.row ( indexes[0] );
    var data = row.data();
    [ "etat", "valeur", "in_range", "unite", "libelle",
      "mode", "color", "badge", "cligno", "noshow", "disable", "decompte" ].forEach ( function (champ)
     { if (bit[champ] !== undefined) data[champ] = bit[champ]; } );
    row.data( data );
    redrawn[table_id] = true;
  }
/******************************************************************************************************************************/
/* Dls_monitor_on_monitor: Traite un lot de bits remonté par le moteur D.L.S via l'API                                       */
/******************************************************************************************************************************/
 function Dls_monitor_on_monitor ( target, Response )
  { if (!Response || !Response.bits) return;
    if (target != Dls_monitor_tech_id) return;

    var redrawn = {};
    Response.bits.forEach ( function (bit) { Dls_monitor_apply_bit ( bit, redrawn ); } );
    Object.keys(redrawn).forEach ( function (table_id) { $('#'+table_id).DataTable().draw(false); } );
  }
/******************************************************************************************************************************/
/* Dls_monitor_watch: Déclare ou retire ce navigateur de la liste des observateurs du plugin                                   */
/******************************************************************************************************************************/
 function Dls_monitor_watch ( watch )
  { var json_request = { tech_id: Dls_monitor_tech_id, watcher_id: Dls_monitor_watcher_id, enable: watch };
    Send_to_API ( "POST", "/dls/monitor", json_request, function (Response)
     { Dls_monitor_set_badge ( watch ? Response.nbr_watchers : 0 ); }, null );
  }
/******************************************************************************************************************************/
/* Unload_page: Appelé par le routeur quand on quitte la page                                                                 */
/******************************************************************************************************************************/
 function Unload_page ()
  { if (Dls_monitor_keepalive) { clearInterval ( Dls_monitor_keepalive ); Dls_monitor_keepalive = null; }
    Mqtt_unset_handler ( "DLS_MONITOR" );
    if (!Dls_monitor_tech_id) return;
    Mqtt_unsubscribe ( "DLS_MONITOR/" + Dls_monitor_tech_id );
    Dls_monitor_watch ( false );
    Dls_monitor_tech_id = null;
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    if (vars[3] == null) Redirect ("/dls");

    var techId = decodeURIComponent(vars[3]);
    $('#idTitle').html(techId);
    Set_page_context ( "Etat du module '" + techId + "'" );

    Dls_monitor_tech_id    = techId;
    Dls_monitor_watcher_id = (crypto.randomUUID ? crypto.randomUUID() : "w" + Date.now() + Math.random());
    Load_mqtt();
    Mqtt_set_handler ( "DLS_MONITOR", Dls_monitor_on_monitor );
    Mqtt_subscribe ( "DLS_MONITOR/" + techId );
    window.addEventListener ( "beforeunload", Unload_page );
    $('#idTableEntreeTOR').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/monitor", type : "GET", data: { tech_id: vars[3], classe: "DI" }, dataSrc: "DI",
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "mnemo_di_id",
       columns:
         [ { "data": "acronyme",   "title":"Acronyme",   "className": "align-middle text-center" },
           { "data": null, "title":"Map on", "className": "align-middle text-center",
             "render": function (item)
               { if (item.thread_tech_id==null)
                  { if (item.acronyme.endsWith("_CLIC")) return("Clic Synoptique");
                    if (item.acronyme == "OSYN_ACQUIT") return("Clic Synoptique");
                    return ( "Not Mapped" );
                  }
                 else return ( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id )+":"+item.thread_acronyme );
               },
           },
           { "data": null, "title":"Etat", "className": "align-middle ",
             "render": function (item)
               { if (item.etat==true) { return( Bouton ( "success", "Activée", null, null, "Active" ) );        }
                                 else { return( Bouton ( "outline-secondary", "Désactivée", null, null, "Inactive" ) ); }
               },
           },
         ],
       /*order: [ [0, "desc"] ],*/
     });

    $('#idTableEntreeANA').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/monitor", type : "GET", data: { tech_id: vars[3], classe: "AI" }, dataSrc: "AI",
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "mnemo_ai_id",
       columns:
         [ { "data": null, "title":"Acronyme", "className": "align-middle text-center",
             "render": function (item)
               { return ( Lien ("/courbe/"+item.tech_id+"/"+item.acronyme+"/HOUR'", "Voir le graphe", item.acronyme ) ); },
           },
           { "data": null, "title":"Map on", "className": "align-middle d-none d-md-table-cell ",
             "render": function (item)
               { if (item.thread_tech_id==null) return("Not Mapped");
                 else return ( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id )+":"+item.thread_acronyme );
               },
           },
           { "data": "valeur", "title":"Valeur", "className": "align-middle text-center " },
           { "data": "unite", "title":"Unité", "className": "align-middle text-center d-none d-md-table-cell " },
           { "data": null, "title":"in_range", "className": "align-middle d-none d-lg-table-cell ",
             "render": function (item)
               { if (item.in_range==true) { return( Bouton ( "outline-success", "Dans les clous !", null, null, "Oui" ) );        }
                                     else { return( Bouton ( "warning", "Pb !", null, null, "Non" ) ); }
               },
           },
         ],
       /*order: [ [0, "desc"] ],*/
     });

    $('#idTableSortieTOR').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/monitor", type : "GET", data: { tech_id: vars[3], classe: "DO" }, dataSrc: "DO",
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "mnemo_do_id",
       columns:
         [ { "data": "acronyme",   "title":"Acronyme",   "className": "align-middle text-center" },
           { "data": null, "title":"Map on", "className": "align-middle ",
             "render": function (item)
               { if (item.thread_tech_id==null) return("Not Mapped");
                 else return ( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id )+":"+item.thread_acronyme );
               },
           },
           { "data": null, "title":"Etat", "className": "align-middle ",
             "render": function (item)
               { if (item.etat==true) { return( Bouton ( "success", "Activée", null, null, "Active" ) );        }
                                 else { return( Bouton ( "outline-secondary", "Désactivée", null, null, "Inactive" ) ); }
               },
           },
         ],
       /*order: [ [0, "desc"] ],*/
     });

    $('#idTableSortieANA').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/monitor", type : "GET", data: { tech_id: vars[3], classe: "AO" }, dataSrc: "AO",
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "mnemo_ao_id",
       columns:
         [ { "data": null, "title":"Acronyme", "className": "align-middle text-center",
             "render": function (item)
              { return ( Lien ("/courbe/"+item.tech_id+"/"+item.acronyme+"/HOUR'", "Voir le graphe", item.acronyme ) ); }
           },
           { "data": null, "title":"Map on", "className": "align-middle d-none d-md-table-cell ",
             "render": function (item)
               { if (item.thread_tech_id==null) return("Not Mapped");
                 else return ( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id )+":"+item.thread_acronyme );
               },
           },
           { "data": "valeur", "title":"Valeur", "className": "align-middle text-center " },
           { "data": "unite", "title":"Unité", "className": "align-middle text-center d-none d-md-table-cell " },
         ],
       /*order: [ [0, "desc"] ],*/
     });

    $('#idTableCI').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/monitor", type : "GET", data: { tech_id: vars[3], classe: "CI" }, dataSrc: "CI",
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "mnemo_ci_id",
       columns:
         [ { "data": null, "title":"Acronyme", "className": "align-middle text-center",
             "render": function (item)
               { return ( Lien ("/courbe/"+item.tech_id+"/"+item.acronyme+"/HOUR'", "Voir le graphe", item.acronyme ) ); },
           },
           { "data": null, "title":"Etat", "className": "",
             "render": function (item)
               { if (item.etat==true) { return( Bouton ( "success", "Le bit est a 1", null, null, "1" ) );        }
                                 else { return( Bouton ( "outline-secondary", "Le bit est a 0", null, null, "0" ) ); }
               },
           },
           { "data": "valeur",     "title":"Valeur",     "className": "text-center align-middle" },
           { "data": "unite",      "title":"Unité", "className": "text-center align-middle " },
         ],
       /*order: [ [0, "desc"] ],*/
     });

    $('#idTableCH').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/monitor",  type : "GET", data: { tech_id: vars[3], classe: "CH" }, dataSrc: "CH",
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "mnemo_ch_id",
       columns:
         [ { "data": null, "title":"Acronyme", "className": "align-middle text-center",
             "render": function (item)
               { return ( Lien ("/courbe/"+item.tech_id+"/"+item.acronyme+"/HOUR'", "Voir le graphe", item.acronyme ) ); },
           },
           { "data": null, "title":"Etat", "className": "",
             "render": function (item)
               { if (item.etat==true) { return( Bouton ( "success", "Le bit est a 1", null, null, "1" ) );        }
                                 else { return( Bouton ( "outline-secondary", "Le bit est a 0", null, null, "0" ) ); }
               },
           },
           { "data": null, "title":"Valeur",     "className": "text-center align-middle",
             "render": function (item)
               { return ( item.valeur + "s = " + (Math.floor(item.valeur/3600)) + "h" );
               },
           },         ],
       /*order: [ [0, "desc"] ],*/
     });

    $('#idTableRegistre').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/monitor", type : "GET", data: { tech_id: vars[3], classe: "REGISTRE" }, dataSrc: "REGISTRE",
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "mnemo_registre_id",
       columns:
         [ { "data": null, "title":"Acronyme", "className": "align-middle text-center",
             "render": function (item)
               { return ( Lien ("/courbe/"+item.tech_id+"/"+item.acronyme+"/HOUR'", "Voir le graphe", item.acronyme ) ); },
           },
           { "data": "valeur",     "title":"Valeur",   "className": "align-middle " },
           { "data": "unite",      "title":"Unité",    "className": "align-middle " },
         ],
       /*order: [ [0, "desc"] ],*/
     });

    $('#idTableMONO').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/monitor", type : "GET", data: { tech_id: vars[3], classe: "MONO" }, dataSrc: "MONO",
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "mnemo_mono_id",
       columns:
         [ { "data": "acronyme",   "title":"Acronyme",   "className": "align-middle text-center" },
           { "data": null, "title":"Etat", "className": "align-middle ",
             "render": function (item)
               { if (item.etat==true) { return( Bouton ( "success", "Le bit est a 1", null, null, "1" ) );        }
                                 else { return( Bouton ( "outline-secondary", "Le bit est a 0", null, null, "0" ) ); }
               },
           },
         ],
       /*order: [ [0, "desc"] ],*/
     });

    $('#idTableBI').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/monitor", type : "GET", data: { tech_id: vars[3], classe: "BI" }, dataSrc: "BI",
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "mnemo_bi_id",
       columns:
         [ { "data": "acronyme",   "title":"Acronyme",   "className": "align-middle text-center" },
           { "data": null, "title":"Etat", "className": "align-middle ",
             "render": function (item)
               { if (item.etat==true) { return( Bouton ( "success", "Le bit est a 1", null, null, "1" ) );        }
                                 else { return( Bouton ( "outline-secondary", "Le bit est a 0", null, null, "0" ) ); }
               },
           },
         ],
       /*order: [ [0, "desc"] ],*/
     });


    $('#idTableVisuel').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/monitor", type : "GET", data: { tech_id: vars[3], classe: "VISUEL" }, dataSrc: "VISUEL",
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "mnemo_visuel_id",
       columns:
         [ { "data": "acronyme",   "title":"Acronyme",    "className": "align-middle text-center" },
           { "data": "libelle",    "title":"Libellé",     "className": "align-middle text-center" },
           { "data": "mode",       "title":"Mode",        "className": "align-middle text-center" },
           { "data": "color",      "title":"Couleur",     "className": "align-middle text-center" },
           { "data": null, "title":"Cligno", "className": "align-middle text-center",
             "render": function (item)
               { if (item.cligno==true) { return( Bouton ( "outline-success", "Le visuel clignote", null, null, "Oui" ) );          }
                                   else { return( Bouton ( "outline-secondary", "Le visuel ne clignote pas", null, null, "Non" ) ); }
               },
           },
           { "data": null, "title":"Disable", "className": "align-middle text-center",
             "render": function (item)
               { if (item.disable==true) { return( Bouton ( "outline-secondary", "Le visuel est désactivé", null, null, "Oui" ) ); }
                                    else { return( Bouton ( "outline-success", "Le visuel est activé", null, null, "Non" ) ); }
               },
           },
         ],
       /*order: [ [0, "desc"] ],*/
     });

    $('#idTableWatchdog').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/monitor", type : "GET", data: { tech_id: vars[3], classe: "WATCHDOG" }, dataSrc: "WATCHDOG",
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "watchdog_id",
       columns:
         [ { "data": "acronyme",   "title":"Acronyme",  "className": "align-middle text-center" },
           { "data": null, "title":"Etat", "className": "align-middle ",
             "render": function (item)
               { if (item.etat==true) { return( Bouton ( "success", "Le compteur décompte", null, null, "En décompte" ) );  }
                                 else { return( Bouton ( "warning", "Le compteur est échu", null, null, "échu" ) ); }
               },
           },
        /*   { "data": null, "title":"Reste en décompte", "className": "align-middle text-center",
             "render": function (item)
               { return ( item.decompte/10.0 + "s" ); },
           },*/
         ],
       /*order: [ [0, "desc"] ],*/
     });

    $('#idTableMessages').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/monitor", type : "GET", data: { tech_id: vars[3], classe: "MSG" }, dataSrc: "MSG",
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "mnemo_msg_id",
       columns:
         [ { "data": "acronyme",   "title":"Acronyme",   "className": "align-middle text-center" },
           { "data": null, "title":"Etat", "className": "align-middle ",
             "render": function (item)
               { if (item.etat==true) { return( Bouton ( "success", "Le message est a 1", null, null, "Actif" ) );        }
                                 else { return( Bouton ( "outline-secondary", "Le message est a 0", null, null, "Inactif" ) ); }
               },
           },
         ],
       /*order: [ [0, "desc"] ],*/
     });

    Dls_monitor_watch ( true );                           /* Les tables existent: le moteur D.L.S peut commencer à les alimenter */
    Dls_monitor_keepalive = setInterval ( function () { Dls_monitor_watch ( true ); }, 10000 );
  }
