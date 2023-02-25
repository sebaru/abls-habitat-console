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
    let response = await fetch ("https://"+master+":5559/dls/run/set",
                                 { method: 'POST', headers: { 'Content-Type': 'application/json;charset=utf-8' },
                                   body: json_request });
    if (response.ok)
     { $('#'+table).DataTable().ajax.reload(null, false); }
  }
/******************************************************************************************************************************/
 function Dls_run_refresh ( table )
  { $('#'+table).DataTable().ajax.reload(null, false); }
/******************************************************************************************************************************/
 function Dls_run_DI_set ( acronyme )
  { Dls_run_set ( "idTableEntreeTOR", "DI", acronyme, true ); }
/******************************************************************************************************************************/
 function Dls_run_DI_reset ( acronyme )
  { Dls_run_set ( "idTableEntreeTOR", "DI", acronyme, false ); }
/******************************************************************************************************************************/
 function Dls_run_MONO_set ( acronyme )
  { Dls_run_set ( "idTableBool", "MONO", acronyme, true ); }
/******************************************************************************************************************************/
 function Dls_run_BI_set ( acronyme )
  { Dls_run_set ( "idTableBool", "BI", acronyme, true ); }
/******************************************************************************************************************************/
 function Dls_run_BI_reset ( acronyme )
  { Dls_run_set ( "idTableBool", "BI", acronyme, false ); }
/******************************************************************************************************************************/
 function Dls_run_DO_set ( acronyme )
  { Dls_run_set ( "idTableSortieTOR", "DO", acronyme, true ); }
/******************************************************************************************************************************/
 function Dls_run_DO_reset ( acronyme )
  { Dls_run_set ( "idTableSortieTOR", "DO", acronyme, false ); }
/******************************************************************************************************************************/
 function Dls_run_MSG_set ( acronyme )
  { Dls_run_set ( "idTableMessages", "MSG", acronyme, true ); }
/******************************************************************************************************************************/
 function Dls_run_MSG_reset ( acronyme )
  { Dls_run_set ( "idTableMessages", "MSG", acronyme, false ); }

/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    if (vars[3] == null) Redirect ("/dls");

    master = localStorage.getItem( "master_hostname" );
    if (master == null) Redirect("/dls");

    $('#idTitle').html(vars[3]);

    $("#idAlertAgentNotConnected").hide();
    fetch ("https://"+master+":5559/status",
            { method: 'GET', headers: { 'Content-Type': 'application/json;charset=utf-8',
                                        'Authorization': 'Bearer ' + Token,
                                        'X-ABLS-DOMAIN': localStorage.getItem("domain_uuid")
                                      }
            })
         .then ( () => { } )
         .catch ( () => { $("#idAlertAgentNotConnected")
                          .html("Error when connecting, things you can do:<br>"+
                                "1/ See <a target=_blank href='https://"+master+":5559/status'>Agent Status</a>, accept SSL Exception and reload this page.<br>"+
                                "2/ Check DNS configuration for <strong>"+master+"</strong> hostname"
                               )
                          .slideDown(); } );

    $('#idTableEntreeTOR').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: {	url : "https://"+master+":5559/dls/run",	type : "GET", data: { tech_id: vars[3], classe: "DI" }, dataSrc: "DI",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "di_id",
       columns:
         [ { "data": "acronyme",   "title":"Acronyme",   "className": "align-middle text-center" },
           { "data": null, "title":"Map on", "className": "align-middle text-center",
             "render": function (item)
               { if (item.thread_tech_id==null)
                  { if (item.thread_tech_id.endsWith("_CLIC")) return("Clic Synoptique");
                    if (item.thread_tech_id == "OSYN_ACQUIT") return("Clic Synoptique");
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
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "success", "Activer l'entrée", "Dls_run_DI_set", item.acronyme, "power-off", null );
                 boutons += Bouton_actions_add ( "secondary", "Désactiver l'entrée", "Dls_run_DI_reset", item.acronyme, "power-off", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

    $('#idTableEntreeANA').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: {	url : "https://"+master+":5559/dls/run",	type : "GET", data: { tech_id: vars[3], classe: "AI" }, dataSrc: "AI",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "ai_id",
       columns:
         [ { "data": null, "title":"Acronyme", "className": "align-middle text-center",
             "render": function (item)
               { return ( Lien ("/tech/courbe/"+item.tech_id+"/"+item.acronyme+"/HOUR'", "Voir le graphe", item.acronyme ) ); },
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
           { "data": "last_arch", "title":"last_arch", "className": "align-middle text-center " },
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

    $('#idTableSortieTOR').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: {	url : "https://"+master+":5559/dls/run",	type : "GET", data: { tech_id: vars[3], classe: "DO" }, dataSrc: "DO",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "do_id",
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
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "success", "Activer la sortie", "Dls_run_DO_set", item.acronyme, "power-off", null );
                 boutons += Bouton_actions_add ( "secondary", "Désactiver la sortie", "Dls_run_DO_reset", item.acronyme, "power-off", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

    $('#idTableSortieANA').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: {	url : "https://"+master+":5559/dls/run",	type : "GET", data: { tech_id: vars[3], classe: "AO" }, dataSrc: "AO",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "ao_id",
       columns: [ { "data": "acronyme",   "title":"Acronyme",   "className": "align-middle text-center" },
                  { "data": null, "title":"Map on", "className": "align-middle ",
                    "render": function (item)
                      { if (item.thread_tech_id==null) return("Not Mapped");
                        else return ( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id )+":"+item.thread_acronyme );
                      },
                  },
                  { "data": "libelle",    "title":"Libellé",    "className": "align-middle " },
                ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

    $('#idTableCI').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: {	url : "https://"+master+":5559/dls/run",	type : "GET", data: { tech_id: vars[3], classe: "CI" }, dataSrc: "CI",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "ci_id",
       columns:
         [ { "data": null, "title":"Acronyme", "className": "align-middle text-center",
             "render": function (item)
               { return ( Lien ("/tech/courbe/"+item.tech_id+"/"+item.acronyme+"/HOUR'", "Voir le graphe", item.acronyme ) ); },
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
       ajax: {	url : "https://"+master+":5559/dls/run",	type : "GET", data: { tech_id: vars[3], classe: "CH" }, dataSrc: "CH",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "ch_id",
       columns:
         [ { "data": null, "title":"Acronyme", "className": "align-middle text-center",
             "render": function (item)
               { return ( Lien ("/tech/courbe/"+item.tech_id+"/"+item.acronyme+"/HOUR'", "Voir le graphe", item.acronyme ) ); },
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
       ajax: {	url : "https://"+master+":5559/dls/run",	type : "GET", data: { tech_id: vars[3], classe: "REGISTRE" }, dataSrc: "REGISTRE",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "registre_id",
       columns:
         [ { "data": null, "title":"Acronyme", "className": "align-middle text-center",
             "render": function (item)
               { return ( Lien ("/tech/courbe/"+item.tech_id+"/"+item.acronyme+"/HOUR'", "Voir le graphe", item.acronyme ) ); },
           },
           { "data": "valeur",     "title":"Valeur",   "className": "align-middle " },
           { "data": "unite",      "title":"Unité",    "className": "align-middle " },
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

    $('#idTableTempo').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: {	url : "https://"+master+":5559/dls/run",	type : "GET", data: { tech_id: vars[3], classe: "TEMPO" }, dataSrc: "TEMPO",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "tempo_id",
       columns:
         [ { "data": "acronyme",   "title":"Acronyme",   "className": "align-middle text-center" },
           { "data": null, "title":"Etat", "className": "align-middle ",
             "render": function (item)
               { if (item.etat==true) { return( Bouton ( "success", "La tempo compte le temps", null, null, "En décompte" ) );        }
                                 else { return( Bouton ( "outline-secondary", "La tempo ne compte pas", null, null, "Stoppée" ) ); }
               },
           },
           { "data": "status",     "title":"Status",   "className": "align-middle  text-center" },
           { "data": "daa",        "title":"daa",      "className": "align-middle  text-center" },
           { "data": "dma",        "title":"dma",      "className": "align-middle  text-center" },
           { "data": "dMa",        "title":"dMa",      "className": "align-middle  text-center" },
           { "data": "dad",        "title":"dad",      "className": "align-middle  text-center" },
           { "data": "date_on",    "title":"date_on",  "className": "align-middle  text-center" },
           { "data": "date_off",   "title":"date_off", "className": "align-middle  text-center" },
         ],
       /*responsive: true,*/
     });

    $('#idTableMONO').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: {	url : "https://"+master+":5559/dls/run",	type : "GET", data: { tech_id: vars[3], classe: "MONO" }, dataSrc: "MONO",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "mono_id",
       columns:
         [ { "data": "acronyme",   "title":"Acronyme",   "className": "align-middle text-center" },
           { "data": null, "title":"Etat", "className": "align-middle ",
             "render": function (item)
               { if (item.etat==true) { return( Bouton ( "success", "Le bit est a 1", null, null, "1" ) );        }
                                 else { return( Bouton ( "outline-secondary", "Le bit est a 0", null, null, "0" ) ); }
               },
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "success", "Activer le bit", "Dls_run_MONO_set", item.acronyme, "power-off", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

    $('#idTableBI').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: {	url : "https://"+master+":5559/dls/run",	type : "GET", data: { tech_id: vars[3], classe: "BI" }, dataSrc: "BI",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "bi_id",
       columns:
         [ { "data": "acronyme",   "title":"Acronyme",   "className": "align-middle text-center" },
           { "data": null, "title":"Etat", "className": "align-middle ",
             "render": function (item)
               { if (item.etat==true) { return( Bouton ( "success", "Le bit est a 1", null, null, "1" ) );        }
                                 else { return( Bouton ( "outline-secondary", "Le bit est a 0", null, null, "0" ) ); }
               },
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "success", "Activer le bit", "Dls_run_BI_set", item.acronyme, "power-off", null );
                 boutons += Bouton_actions_add ( "secondary", "Désactiver le bit", "Dls_run_BI_reset", item.acronyme, "power-off", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });


    $('#idTableVisuel').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: {	url : "https://"+master+":5559/dls/run",	type : "GET", data: { tech_id: vars[3], classe: "VISUEL" }, dataSrc: "VISUEL",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "visuel_id",
       columns:
         [ { "data": "acronyme",   "title":"Acronyme",    "className": "align-middle text-center" },
           { "data": "libelle",    "title":"Libellé",     "className": "align-middle text-center" },
           { "data": "mode",       "title":"Mode",        "className": "align-middle text-center" },
           { "data": "color",      "title":"Couleur",     "className": "align-middle text-center" },
           { "data": null, "title":"Cligno", "className": "align-middle ",
             "render": function (item)
               { if (item.cligno==true) { return( Bouton ( "outline-success", "Le visuel clignote", null, null, "Oui" ) );          }
                                   else { return( Bouton ( "outline-secondary", "Le visuel ne clignote pas", null, null, "Non" ) ); }
               },
           },
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

    $('#idTableWatchdog').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: {	url : "https://"+master+":5559/dls/run",	type : "GET", data: { tech_id: vars[3], classe: "WATCHDOG" }, dataSrc: "WATCHDOG",
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
           { "data": null, "title":"Reste en décompte", "className": "align-middle text-center",
             "render": function (item)
               { return ( item.decompte/10.0 + "s" ); },
           },
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

    $('#idTableMessages').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: {	url : "https://"+master+":5559/dls/run",	type : "GET", data: { tech_id: vars[3], classe: "MSG" }, dataSrc: "MSG",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "msg_id",
       columns:
         [ { "data": "acronyme",   "title":"Acronyme",   "className": "align-middle text-center" },
           { "data": null, "title":"Etat", "className": "align-middle ",
             "render": function (item)
               { if (item.etat==true) { return( Bouton ( "success", "Le message est a 1", null, null, "Actif" ) );        }
                                 else { return( Bouton ( "outline-secondary", "Le message est a 0", null, null, "Inactif" ) ); }
               },
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "success", "Activer le message", "Dls_run_MSG_set", item.acronyme, "power-off", null );
                 boutons += Bouton_actions_add ( "secondary", "Désactiver le message", "Dls_run_MSG_reset", item.acronyme, "power-off", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

    $('#idTabEntreeTor').tab('show');
  }
