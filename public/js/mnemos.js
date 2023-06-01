/******************************************************************************************************************************/
 function Mnemos_AI_set_archivage ( acronyme )
  { table = $('#idTableEntreeAna').DataTable();
    selection = table.ajax.json().AI.filter( function(item) { return (item.acronyme==acronyme) } )[0];
    var json_request = JSON.stringify(
       { classe   : "AI",
         tech_id  : selection.tech_id,
         acronyme : selection.acronyme,
         archivage: parseInt($('#idAIArchivage'+acronyme).val())
       }
     );

    Send_to_API ( 'POST', "/api/mnemos/set", json_request, function ()
     { $('#idTableEntreeAna').DataTable().ajax.reload(null, false);
     });
  }
/******************************************************************************************************************************/
 function Mnemos_CI_set_archivage ( acronyme )
  { table = $('#idTableCptImp').DataTable();
    selection = table.ajax.json().CI.filter( function(item) { return (item.acronyme==acronyme) } )[0];
    var json_request = JSON.stringify(
       { classe   : "CI",
         tech_id  : selection.tech_id,
         acronyme : selection.acronyme,
         archivage: parseInt($('#idCIArchivage'+acronyme).val())
       }
     );

    Send_to_API ( 'POST', "/api/mnemos/set", json_request, function ()
     { $('#idTableCptImp').DataTable().ajax.reload(null, false);
     });
  }
/******************************************************************************************************************************/
 function Mnemos_R_set_archivage ( acronyme )
  { table = $('#idTableRegistre').DataTable();
    selection = table.ajax.json().R.filter( function(item) { return (item.acronyme==acronyme) } )[0];
    var json_request = JSON.stringify(
       { classe   : "R",
         tech_id  : selection.tech_id,
         acronyme : selection.acronyme,
         archivage: parseInt($('#idRArchivage'+acronyme).val())
       }
     );

    Send_to_API ( 'POST', "/api/mnemos/set", json_request, function ()
     { $('#idTableRegistre').DataTable().ajax.reload(null, false);
     });
  }
/******************************************************************************************************************************/
 function Mnemos_MSG_set ( acronyme )
  { table = $('#idTableMessage').DataTable();
    selection = table.ajax.json().MSG.filter( function(item) { return (item.acronyme==acronyme) } )[0];
    var json_request = JSON.stringify(
       { classe   : "MSG",
         tech_id  : selection.tech_id,
         acronyme : selection.acronyme,
         rate_limit : parseInt($('#idMSGRateLimit'+acronyme).val()),
         sms        : parseInt($('#idMSGSms'+acronyme).val()),
         audio_profil : $('#idMSGProfilAudio'+acronyme).val(),
         audio_libelle: $('#idMSGLibelleAudio'+acronyme).val(),
       }
     );

    Send_to_API ( 'POST', "/api/mnemos/set", json_request, function ()
     { $('#idTableMessage').DataTable().ajax.reload(null, false);
     });
  }
/******************************************************************************************************************************/
 function Mnemos_HORLOGE_set ( acronyme )
  { table = $('#idTableHorloge').DataTable();
    selection = table.ajax.json().HORLOGE.filter( function(item) { return (item.acronyme==acronyme) } )[0];
    var json_request = JSON.stringify(
       { classe   : "HORLOGE",
         tech_id  : selection.tech_id,
         acronyme : selection.acronyme,
         access_level : parseInt($('#idHORLOGELevel_'+acronyme).val()),
       }
     );

    Send_to_API ( 'POST', "/api/mnemos/set", json_request, null, null );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    console.log ("in load page !");
    /*$('#idTitle').html(vars[3]);*/
    var tech_id = vars[2];

    $('#idTableTempo').DataTable(
     { pageLength : 50,
       fixedHeader: true,
       ajax: {	url : $ABLS_API+"/mnemos/list",	type : "GET", data: { "classe": "TEMPO", "tech_id": tech_id }, dataSrc: "mnemos_TEMPO",
               error: function ( xhr, status, error ) { Show_Error(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "mnemo_tempo_id",
       columns:
         [ { "data": null, "title":"Tech_id", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/dls/"+item.tech_id, "Voir la source", item.tech_id ) ); }
           },
           { "data": "acronyme",   "title":"Acronyme",   "className": "align-middle text-center" },
           { "data": null, "title":"Libellé",    "className": "align-middle ",
             "render": function (item)
               { return(htmlEncode(item.libelle)); }
           },
         ],
     });

    $('#idTableRegistre').DataTable(
     { pageLength : 50,
       fixedHeader: true,
       ajax: {	url : $ABLS_API+"/mnemos/list",	type : "GET", data: { "classe": "R", "tech_id": tech_id }, dataSrc: "mnemos_REGISTRE",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "mnemo_registre_id",
       columns:
         [ { "data": null, "title":"Tech_id", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/dls/"+item.tech_id, "Voir la source", item.tech_id ) ); }
           },
           { "data": "acronyme",   "title":"Acronyme",   "className": "align-middle text-center" },
           { "data": null, "title":"Libellé",    "className": "align-middle ",
             "render": function (item)
               { return(htmlEncode(item.libelle)); }
           },
           { "data": null,      "title":"Unité",    "className": "align-middle hidden-xs",
             "render": function (item)
               { return(htmlEncode(item.unite)); }
           },
           { "data": null, "title":"Archivage", "className": "",
             "render": function (item)
               { return(Bouton_Archivage ( "idRArchivage"+item.acronyme, "Mnemos_R_set_archivage('"+item.acronyme+"')", item.archivage )); }
           },
         ],
       }
     );

    $('#idTableCptImp').DataTable(
     { pageLength : 50,
       fixedHeader: true,
       ajax: { url : $ABLS_API+"/mnemos/list", type : "GET", data: { "classe": "CI", "tech_id": tech_id }, dataSrc: "mnemos_CI",

               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "mnemo_ci_id",
       columns:
         [ { "data": null, "title":"Tech_id", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/dls/"+item.tech_id, "Voir la source", item.tech_id ) ); }
           },
           { "data": "acronyme",   "title":"Acronyme",   "className": "align-middle text-center" },
           { "data": null, "title":"Libellé",    "className": "align-middle ",
             "render": function (item)
               { return(htmlEncode(item.libelle)); }
           },
           { "data": "multi",      "title":"Multi.",   "className": "align-middle text-center " },
           { "data": null,      "title":"Unité",    "className": "align-middle hidden-xs",
             "render": function (item)
               { return(htmlEncode(item.unite)); }
           },
           { "data": null, "title":"Archivage", "className": "",
             "render": function (item)
               { return(Bouton_Archivage ( "idCIArchivage"+item.acronyme, "Mnemos_CI_set_archivage('"+item.acronyme+"')", item.archivage )); }
           },
         ],
     });

    $('#idTableCptH').DataTable(
     { pageLength : 50,
       fixedHeader: true,
       ajax: {	url : $ABLS_API+"/mnemos/list",	type : "GET", data: { "classe": "CH", "tech_id": tech_id }, dataSrc: "mnemos_CH",
               error: function ( xhr, status, error ) { Show_Error(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "mnemo_ch_id",
       columns:
         [ { "data": null, "title":"Tech_id", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/dls/"+item.tech_id, "Voir la source", item.tech_id ) ); }
           },
           { "data": "acronyme",   "title":"Acronyme",   "className": "align-middle text-center" },
           { "data": null, "title":"Libellé",    "className": "align-middle ",
             "render": function (item)
               { return(htmlEncode(item.libelle)); }
           },
           { "data": null, "title":"Archivage", "className": "",
             "render": function (item)
               { return(Bouton_Archivage ( "idCIArchivage"+item.acronyme, "Mnemos_CH_set_archivage('"+item.acronyme+"')", item.archivage )); }
           },
         ],
     });

    $('#idTableWatchdog').DataTable(
     { pageLength : 50,
       fixedHeader: true,
       ajax: {	url : $ABLS_API+"/mnemos/list",	type : "GET", data: { "classe": "WATCHDOG", "tech_id": tech_id }, dataSrc: "mnemos_WATCHDOG",
               error: function ( xhr, status, error ) { Show_Error(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "mnemo_watchdog_id",
       columns:
         [ { "data": null, "title":"Tech_id", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/dls/"+item.tech_id, "Voir la source", item.tech_id ) ); }
           },
           { "data": "acronyme",   "title":"Acronyme",   "className": "align-middle text-center" },
           { "data": null, "title":"Libellé",    "className": "align-middle ",
             "render": function (item)
               { return(htmlEncode(item.libelle)); }
           },
         ],
     });


    $('#idTableHorloge').DataTable(
     { pageLength : 50,
       fixedHeader: true,
       ajax: {	url : $ABLS_API+"/mnemos/list",	type : "GET", data: { "classe": "HORLOGE", "tech_id": tech_id }, dataSrc: "mnemos_HORLOGE",
               error: function ( xhr, status, error ) { Show_Error(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "mnemo_horloge_id",
       columns:
        [ { "data": null, "title":"Tech_id", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/dls/"+item.tech_id, "Voir la source", item.tech_id ) ); }
           },
          { "data": null, "title":"Acronyme", "className": "align-middle",
            "render": function (item)
              { return( Lien ( "/horloge/"+item.id, "Editer les ticks", item.acronyme ) ); }
          },
          { "data": null, "title":"Libellé", "className": "align-middle",
            "render": function (item)
              { return( Lien ( "/horloge/"+item.id, "Editer les ticks", item.libelle ) ); }
          },
          { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
            "render": function (item)
              { boutons = Bouton_actions_start ();
                boutons += Bouton_actions_add ( "primary", "Editer les ticks", "Redirect", "/home/horloge/"+item.id, "pen", null );
                boutons += Bouton_actions_end ();
                return(boutons);
              },
          }
        ],
     });

    $('#idTabRegistre').tab('show');
  }
