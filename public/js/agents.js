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
/******************************************* Upgrade tous les slaves **********************************************************/
 function AGENT_Update_All_Slaves ( )
  { selection = $('#idTableAGENT').DataTable().rows().data().toArray()
                .filter ( agent => agent.is_master === false )
                .map ( agent => ( { agent_hostname: agent.agent_hostname, agent_uuid: agent.agent_uuid }) );
    console.log(selection);
    Show_modal_del ( "Upgrader les slaves",
                     "Etes-vous sûr de vouloir upgrader les slaves suivants ?",
                     selection.map ( agent => agent.agent_hostname ).toString(),
                     function ()
                      { selection.forEach ( (agent, index ) => { AGENT_Upgrade_Valider( agent ); } ); } ) ;
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
       ajax: { url : "/api/agent/list", type : "GET", dataSrc: "agents",
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
               { var icone;
                 if (item.is_master) { icone = "crown"; } else { icone = "asterisk"; }
                 if (item.is_alive)  { color = "success"; } else { color = "danger"; }
                 return ("<i class='fas fa-2x fa-"+icone+" text-"+color+"'></i>");
               }
           },
           { "data": null, "title":"Branche", "className": "align-middle text-center d-none d-lg-table-cell",
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
           { "data": null, "title":"Version", "className": "align-middle text-center d-none d-md-table-cell",
             "render": function (item)
              { return( item.version );
              }
           },
           { "data": null, "title":"Start/Heartbeat", "className": "align-middle text-center d-none d-xl-table-cell",
             "render": function (item)
              { return( item.start_time +"<br>" + item.heartbeat_time);
              }
           },
           { "data": null, "title":"Description", "className": "align-middle d-none d-lg-table-cell",
             "render": function (item)
              { return( htmlEncode ( item.description ) );
              }
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_deroulant_start ( (item.is_alive ? "primary" : "secondary"), "" );
                 if (item.is_alive)
                  { boutons += Bouton_deroulant_add ( "warning", "Upgrader",  "AGENT_Upgrade", item.agent_id, "download" );
                    boutons += Bouton_deroulant_add ( "warning", "Restarter", "AGENT_Reset",   item.agent_id, "redo" );
                    boutons += Bouton_deroulant_add_spacer();
                  }
                 if (item.is_master === false && item.is_alive)
                  { boutons += Bouton_deroulant_add ( "danger", "Set Master", "AGENT_Set_master", item.agent_id, "crown" );
                    boutons += Bouton_deroulant_add_spacer();
                  }
                 boutons += Bouton_deroulant_add ( "danger",  "Supprimer", "AGENT_Delete",  item.agent_id, "trash" );
                 boutons += Bouton_deroulant_end ();
                 return(boutons);
               },
           }
         ],
       order: [ [0, "desc"] ],
     });
    setInterval ( function () { AGENT_Refresh (); }, 30000 );
  }
