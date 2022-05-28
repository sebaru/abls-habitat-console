/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Refresh ( )
  { $('#idTableAGENT').DataTable().ajax.reload(null, false); }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Sauver_parametre ( id )
  { selection = $('#idTableAGENT').DataTable().row("#"+id).data();
    var json_request =
     { agent_uuid : selection.agent_uuid,
       description: $("#idAGENTDescription_"+id).val(),
       headless   : ($("#idAGENTHeadless_"+id).val()=="true" ? true : false),
       log_level  : parseInt($("#idAGENTLogLevel_"+id).val()),
       log_msrv   : ($("#idAGENTLogMSRV_"+id).val()=="true" ? true : false),
       log_bus    : ($("#idAGENTLogBUS_"+id).val()=="true" ? true : false),
     };
    Send_to_API ( 'POST', "/agent/set", json_request, function ()
     { Show_toast_ok ( "Configuration sauvegardée." );
       AGENT_Refresh ();
     }, function ()
     { Show_toast_ko ( "Configuration non sauvegardée.") });
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Reset_Valider ( selection )
  { var json_request = { agent_uuid: selection.agent_uuid };
    Send_to_API ( 'POST', "/agent/reset", json_request, function ()
     { Show_toast_ok ( "Attendez 10 secondes" );
       setTimeout ( function () { AGENT_Refresh (); }, 10000 );
     }, null );
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Reset ( id  )
  { selection = $('#idTableAGENT').DataTable().row("#"+id).data();
    Show_modal_del ( "Restarter l'agent "+selection.agent_hostname,
                     "Etes-vous sûr de vouloir relancer cet agent ?",
                     selection.agent_hostname + " - "+selection.description,
                     function () { AGENT_Reset_Valider( selection ) } ) ;
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Set_master_Valider ( selection )
  { var json_request = { agent_uuid: selection.agent_uuid };
    Send_to_API ( 'POST', "/agent/set_master", json_request, function ()
     { Show_toast_ok ( "Attendez 10 secondes" );
       setTimeout ( function () { AGENT_Refresh (); }, 10000 );
     }, null );
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Set_master ( id  )
  { selection = $('#idTableAGENT').DataTable().row("#"+id).data();
    Show_modal_del ( "Promouvoir l'agent "+selection.agent_hostname+" comme master ?",
                     "Etes-vous sûr de vouloir promouvoir ce agent en tant que master ?",
                     selection.agent_hostname + " - "+selection.description,
                     function () { AGENT_Set_master_Valider( selection ) } ) ;
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Upgrade_Valider ( selection )
  { var json_request = { agent_uuid: selection.agent_uuid };
    Send_to_API ( 'POST', "/agent/upgrade", json_request, function ()
     { Show_toast_ok ( "Attendez le download et le redémarrage" );
     }, null );
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Upgrade ( id  )
  { selection = $('#idTableAGENT').DataTable().row("#"+id).data();
    Show_modal_del ( "Upgrader l'agent "+selection.agent_hostname,
                     "Etes-vous sûr de vouloir upgrader cet agent ?",
                     selection.agent_hostname + " - "+selection.description,
                     function () { AGENT_Upgrade_Valider( selection ) } ) ;
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Upgrade ( id  )
  { selection = $('#idTableAGENT').DataTable().row("#"+id).data();
    selection = table.ajax.json().agents.filter( function(item) { return item.agent_id==id } )[0];
    Show_modal_del ( "Upgrader l'agent "+selection.agent_hostname,
                     "Etes-vous sûr de vouloir upgrader cet agent ?",
                     selection.agent_hostname + " - "+selection.description,
                     function () { AGENT_Upgrade_Valider( selection ) } ) ;
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableAGENT').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/agent/list", type : "POST", dataSrc: "agents",
               contentType: "application/json",
               data: function() { return ( JSON.stringify({"domain_uuid": localStorage.getItem('domain_uuid')} ) ); },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
             },
       rowId: "agent_id",
       columns:
         [ { "data": null, "title":"Connected", "className": "align-middle text-center",
             "render": function (item)
              { if (item.ws_connected==true)
                 { return( Bouton ( "success", "Agent connecté", null, null, "Yes" ) ); }
                else
                 { return( Bouton ( "outline-danger", "Agent déconnecté", null, null, "No" ) ); }
              }
           },
           { "data": null, "title":"Hostname", "className": "align-middle text-center",
             "render": function (item)
              { if (item.is_master==true)
                 { return( item.agent_hostname + "<br>" + Badge ( "info", "Agent is Master", "Master" ) ); }
                else
                 { return( item.agent_hostname + "<br>" + Badge ( "secondary", "Agent is Slave", "Slave" ) ); }
              }
           },
           { "data": "version", "title":"Version",   "className": "align-middle text-center" },
           { "data": "start_time", "title":"Start time",   "className": "align-middle text-center" },
           { "data": null, "title":"Headless", "className": "align-middle text-center",
             "render": function (item)
              { var choix = [ { valeur: false, texte: "No" }, { valeur: true, texte: "Yes" } ];
                return( Select ( "idAGENTHeadless_"+item.agent_id, "AGENT_Sauver_parametre("+item.agent_id+")", choix, item.headless ) );
              }
           },
           { "data": null, "title":"Description", "className": "align-middle ",
             "render": function (item)
              { return( Input ( "text", "idAGENTDescription_"+item.agent_id, "AGENT_Sauver_parametre("+item.agent_id+")",
                                "Description de l'agent", item.description, null ) );
              }
           },
           { "data": null, "title":"Log_MSRV", "className": "align-middle text-center",
             "render": function (item)
              { var choix = [ { valeur: false, texte: "No" }, { valeur: true, texte: "Yes" } ];
                return( Select ( "idAGENTLogMSRV_"+item.agent_id, "AGENT_Sauver_parametre("+item.agent_id+")", choix, item.log_msrv ) );
              }
           },
           { "data": null, "title":"Log_BUS", "className": "align-middle text-center",
             "render": function (item)
              { var choix = [ { valeur: false, texte: "No" }, { valeur: true, texte: "Yes" } ];
                return( Select ( "idAGENTLogBUS_"+item.agent_id, "AGENT_Sauver_parametre("+item.agent_id+")", choix, item.log_bus ) );
              }
           },
           { "data": null, "title":"Log Level", "className": "align-middle ",
             "render": function (item)
              { var choix = [ { valeur: 7, texte: "Debug" },
                              { valeur: 6, texte: "Info" },
                              { valeur: 5, texte: "Notice" },
                              { valeur: 4, texte: "Warning" },
                              { valeur: 3, texte: "Error" } ];
                return( Select ( "idAGENTLogLevel_"+item.agent_id, "AGENT_Sauver_parametre("+item.agent_id+")", choix, item.log_level ) );
              }
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "info", "Promouvoir Master",
                                                 (item.is_master == false ? "AGENT_Set_master" : null),
                                                 item.agent_id, "asterisk", null );
                 boutons += Bouton_actions_add ( "warning", "Upgrader l'agent",
                                                 (item.ws_connected ? "AGENT_Upgrade" : null), item.agent_id, "download", null );
                 boutons += Bouton_actions_add ( "danger", "Restarter l'agent",
                                                 (item.ws_connected ? "AGENT_Reset" : null), item.agent_id, "redo", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       order: [ [0, "desc"] ],
       responsive: true,
     });
  }
