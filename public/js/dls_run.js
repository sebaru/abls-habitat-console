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
 async function Dls_run_set ( table, classe, acronyme, valeur )
  { vars = window.location.pathname.split('/');
    var json_request = JSON.stringify(
     { classe: classe,
       tech_id : vars[3],
       acronyme: acronyme,
       valeur: valeur
     });
   /* let response = await fetch ( localStorage.getItem( "master_url" ) + "/dls/run/set",
                                 { method: 'POST', headers: { 'Content-Type': 'application/json;charset=utf-8' },
                                   body: json_request
                                 });
    if (response.ok)
     { $('#'+table).DataTable().ajax.reload(null, false); }*/
  }
/******************************************************************************************************************************/
 function Dls_run_refresh ( table )
  { $('#'+table).DataTable().ajax.reload(null, false); }
/******************************************************************************************************************************/
 function Dls_run_MONO_set ( acronyme )
  { Dls_run_set ( "idTableMONO", "MONO", acronyme, true ); }
/******************************************************************************************************************************/
 function Dls_run_BI_set ( acronyme )
  { Dls_run_set ( "idTableBI", "BI", acronyme, true ); }
/******************************************************************************************************************************/
 function Dls_run_BI_reset ( acronyme )
  { Dls_run_set ( "idTableBI", "BI", acronyme, false ); }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    if (vars[3] == null) Redirect ("/dls");

    $('#idTitle').html(vars[3]);
    setInterval( function()
                  { Dls_run_refresh ( "idTableEntreeTOR" );
                    Dls_run_refresh ( "idTableEntreeANA" );
                    Dls_run_refresh ( "idTableSortieTOR" );
                    Dls_run_refresh ( "idTableSortieANA" );
                    Dls_run_refresh ( "idTableCI"        );
                    Dls_run_refresh ( "idTableCH"        );
                    Dls_run_refresh ( "idTableMONO"      );
                    Dls_run_refresh ( "idTableBI"        );
                    Dls_run_refresh ( "idTableRegistre"  );
                    Dls_run_refresh ( "idTableVisuel"    );
                  },
                 5000
               );
    $('#idTableEntreeTOR').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/run", type : "GET", data: { tech_id: vars[3], classe: "DI" }, dataSrc: "DI",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
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
       /*responsive: true,*/
     });

    $('#idTableEntreeANA').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/run", type : "GET", data: { tech_id: vars[3], classe: "AI" }, dataSrc: "AI",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "mnemo_ai_id",
       columns:
         [ { "data": null, "title":"Acronyme", "className": "align-middle text-center",
             "render": function (item)
               { return ( Lien ("/courbe/"+item.tech_id+"/"+item.acronyme+"/HOUR'", "Voir le graphe", item.acronyme ) ); },
           },
           { "data": null, "title":"Map on", "className": "align-middle ",
             "render": function (item)
               { if (item.thread_tech_id==null) return("Not Mapped");
                 else return ( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id )+":"+item.thread_acronyme );
               },
           },
           { "data": "valeur", "title":"Valeur", "className": "align-middle text-center " },
           { "data": "unite", "title":"Unité", "className": "align-middle text-center " },
           { "data": null, "title":"in_range", "className": "align-middle",
             "render": function (item)
               { if (item.in_range==true) { return( Bouton ( "outline-success", "Dans les clous !", null, null, "Oui" ) );        }
                                     else { return( Bouton ( "warning", "Pb !", null, null, "Non" ) ); }
               },
           },
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

    $('#idTableSortieTOR').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/run", type : "GET", data: { tech_id: vars[3], classe: "DO" }, dataSrc: "DO",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
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
       /*responsive: true,*/
     });

    $('#idTableSortieANA').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/run", type : "GET", data: { tech_id: vars[3], classe: "AO" }, dataSrc: "AO",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "mnemo_ao_id",
       columns:
         [ { "data": null, "title":"Acronyme", "className": "align-middle text-center",
             "render": function (item)
              { return ( Lien ("/courbe/"+item.tech_id+"/"+item.acronyme+"/HOUR'", "Voir le graphe", item.acronyme ) ); }
           },
           { "data": null, "title":"Map on", "className": "align-middle ",
             "render": function (item)
               { if (item.thread_tech_id==null) return("Not Mapped");
                 else return ( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id )+":"+item.thread_acronyme );
               },
           },
           { "data": "valeur", "title":"Valeur", "className": "align-middle text-center " },
           { "data": "unite", "title":"Unité", "className": "align-middle text-center " },
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

    $('#idTableCI').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/run", type : "GET", data: { tech_id: vars[3], classe: "CI" }, dataSrc: "CI",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
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
           { "data": "multi",      "title":"Multiplicateur", "className": "text-center align-middle " },
           { "data": "unite",      "title":"Unité", "className": "text-center align-middle " },
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

    $('#idTableCH').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/run",  type : "GET", data: { tech_id: vars[3], classe: "CH" }, dataSrc: "CH",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
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
       /*responsive: true,*/
     });

    $('#idTableRegistre').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/run", type : "GET", data: { tech_id: vars[3], classe: "REGISTRE" }, dataSrc: "REGISTRE",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
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
       /*responsive: true,*/
     });

    $('#idTableMONO').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/run", type : "GET", data: { tech_id: vars[3], classe: "MONO" }, dataSrc: "MONO",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
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
        /*   { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "success", "Activer le bit", "Dls_run_MONO_set", item.acronyme, "power-off", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }*/
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

    $('#idTableBI').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/run", type : "GET", data: { tech_id: vars[3], classe: "BI" }, dataSrc: "BI",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
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
       /*    { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "success", "Activer le bit", "Dls_run_BI_set", item.acronyme, "power-off", null );
                 boutons += Bouton_actions_add ( "secondary", "Désactiver le bit", "Dls_run_BI_reset", item.acronyme, "power-off", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }*/
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });


    $('#idTableVisuel').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/run", type : "GET", data: { tech_id: vars[3], classe: "VISUEL" }, dataSrc: "VISUEL",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
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
       /*responsive: true,*/
     });

    $('#idTableWatchdog').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/run", type : "GET", data: { tech_id: vars[3], classe: "WATCHDOG" }, dataSrc: "WATCHDOG",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
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
       /*responsive: true,*/
     });

    $('#idTableMessages').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/run", type : "GET", data: { tech_id: vars[3], classe: "MSG" }, dataSrc: "MSG",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
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
       /*responsive: true,*/
     });
  }
