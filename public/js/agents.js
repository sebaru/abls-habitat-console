/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Refresh ( )
  { $('#idTableAGENT').DataTable().ajax.reload(null, false); }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Reset_Valider ( selection )
  { var json_request = { agent_uuid: selection.agent_uuid };
    Send_to_API ( 'POST', "/agent/reset", json_request, function ()
     { Show_toast_ok ( "Attendez 10 secondes" );
       /*setTimeout ( function () { AGENT_Refresh (); }, 10000 );*/
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
       /*setTimeout ( function () { AGENT_Refresh (); }, 10000 );*/
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
 function AGENT_Delete_Valider ( selection )
  { var json_request = { agent_uuid: selection.agent_uuid };
    Send_to_API ( 'DELETE', "/agent/delete", json_request, function ()
     { Show_toast_ok ( "Agent supprimé" );
     }, null );
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Delete ( id  )
  { selection = $('#idTableAGENT').DataTable().row("#"+id).data();
    Show_modal_del ( "Supprimer l'agent "+selection.agent_hostname,
                     "Etes-vous sûr de vouloir supprimer cet agent ?",
                     selection.agent_hostname + " - "+selection.description,
                     function () { AGENT_Delete_Valider( selection ) } ) ;
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableAGENT').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/agent/list", type : "GET", dataSrc: "agents",
               contentType: "application/json",
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request)
                              { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                                request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                              }
             },
       rowId: "agent_id",
       columns:
         [ { "data": null, "title":"Status", "className": "align-middle text-center",
             "render": function (item)
               { var mode, color;
                 if (item.is_alive) { mode = "Master"; color = "success"; } else { mode = "Slave"; color = "danger"; }
                 return ( Bouton ( color, mode, null, null, mode ) );
               }
           },
           { "data": null, "title":"Branche", "className": "align-middle text-center",
             "render": function (item)
              { result = Badge ( "secondary", "Branche is "+item.branche, item.branche )
                return(result);
              }
           },
           { "data": null, "title":"Hostname", "className": "align-middle text-center",
             "render": function (item)
              { result = Lien ( "/agent/"+item.agent_uuid, "Voir l'agent", item.agent_hostname + " " );
                return(result);
              }
           },
           { "data": null, "title":"Version", "className": "align-middle text-center",
             "render": function (item)
              { return( item.version );
              }
           },
           { "data": null, "title":"Start/Heartbeat", "className": "align-middle text-center",
             "render": function (item)
              { return( item.start_time +"<br>" + item.heartbeat_time);
              }
           },
           { "data": null, "title":"Description", "className": "align-middle ",
             "render": function (item)
              { return( htmlEncode ( item.description ) );
              }
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "info", "Promouvoir Master",
                                                 (item.is_master == false ? "AGENT_Set_master" : null),
                                                 item.agent_id, "asterisk", null );
                 boutons += Bouton_actions_add ( "primary", "Upgrader l'agent",  (item.is_alive ? "AGENT_Upgrade" : null), item.agent_id, "download", null );
                 boutons += Bouton_actions_add ( "warning", "Restarter l'agent", (item.is_alive ? "AGENT_Reset" : null),   item.agent_id, "redo", null );
                 boutons += Bouton_actions_add ( "danger",  "Supprimer l'agent", "AGENT_Delete",  item.agent_id, "trash", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       order: [ [0, "desc"] ],
       responsive: false,
     });
    setInterval ( function () { AGENT_Refresh (); }, 10000 );
  }
