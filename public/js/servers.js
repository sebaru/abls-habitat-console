/************************************ Demande de refresh **********************************************************************/
 function SERVERS_Refresh ( )
  { $('#idTableSERVERS').DataTable().ajax.reload(null, false);
  }
/*********************************************** Active ou desactive le mode master ******************************************/
 function SERVER_Set_Master ( server_uuid, newState )
  { var selection = $('#idTableSERVERS').DataTable().row("#"+server_uuid).data();
    var $switch = $('#idSwitchMaster_' + server_uuid);

    if (selection && selection.is_master && newState === false)
     { $switch.prop('checked', true);
       Show_shell_error ( "Promouvez un autre serveur en tant que master pour que celui-ci ne le soit plus." );
       return;
     }

    $switch.prop('disabled', true);

    var json_request = { server_uuid: server_uuid, master: newState };
    Send_to_API ( "POST", "/server/set/master", json_request,
      function(Response)
       { Show_toast_ok ( "Serveur " + selection.agent_tech_id + " " + (newState ? "passe en master" : "sort du mode master") + "." );
         $switch.prop('disabled', false);
         SERVERS_Refresh();
       },
      function(Response)
       { $switch.prop('checked', !newState).prop('disabled', false);
         Show_shell_error ( "Erreur lors de la modification du mode master pour " + selection.agent_tech_id + "." );
       }
    );
  }
/******************************************* Supprime un serveur et ses agents ************************************************/
 function SERVER_Del ( server_uuid )
  { var selection = $('#idTableSERVERS').DataTable().row("#"+server_uuid).data();
    if (!selection) return;

    if (selection.is_master)
     { Show_shell_error ( "Le serveur master ne peut pas être supprimé. Promouvez un autre serveur au préalable." );
       return;
     }

    Send_to_API ( "GET", "/agent/list", null,
      function(Response)
       { var agents = [];
         if (Response && Response.agents)
          { agents = Response.agents.filter ( function(agent)
              { return ( agent.server_uuid == server_uuid && agent.agent_classe != 'server' ); } );
          }

         var html = "<p class='mb-1'>Agents dépendants qui seront également supprimés ("+agents.length+") :</p>";
         if (agents.length)
          { html += "<ul class='mb-0'>";
            agents.forEach ( function(agent)
              { html += "<li>"+htmlEncode(agent.agent_classe)+" - "+htmlEncode(agent.agent_tech_id)+
                        " - "+htmlEncode(agent.description)+"</li>"; } );
            html += "</ul>";
          }
         else html += "<p class='mb-0 fst-italic'>Aucun agent dépendant.</p>";

         Show_modal_del ( "Supprimer le serveur "+selection.agent_tech_id,
                          "Etes-vous sûr de vouloir supprimer ce serveur et tous les agents qui en dépendent ? "+
                          "Les plugins D.L.S associés seront également détruits.",
                          selection.agent_tech_id + " - " + selection.description,
                          function ()
                           { Send_to_API ( "DELETE", "/server/delete", { server_uuid: server_uuid },
                                           function(Response)
                                            { Show_toast_ok ( "Serveur "+selection.agent_tech_id+" supprimé" );
                                              SERVERS_Refresh();
                                            }, null );
                           },
                          { html: html } );
       }, null );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableSERVERS').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/servers/list", type : "GET", dataSrc: "servers", contentType: "application/json",
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "server_uuid",
       columns:
        [ { "data": null, "title":"Master", "className": "align-middle text-center",
            "render": function (item)
              { var extra_attributes = "data-server-uuid='" + item.server_uuid + "'";
                if (item.is_master) extra_attributes += " disabled";
                return( Switch ( "idSwitchMaster_" + item.server_uuid,
                                 "Mode master",
                                 item.is_master,
                                 "server-master-switch",
                                 extra_attributes ) );
              }
          },
          { "data": null, "title":"Hostname", "className": "align-middle text-center",
            "render": function (item)
              { return( htmlEncode(item.agent_tech_id) );
              }
          },
          { "data": null, "title":"Version", "className": "align-middle text-center d-none d-md-table-cell",
            "render": function (item)
              { return( htmlEncode(item.version) );
              }
          },
          { "data": null, "title":"Start/Heartbeat", "className": "align-middle text-center d-none d-xl-table-cell",
            "render": function (item)
              { return( htmlEncode(item.start_time) +"<br>"+ htmlEncode(item.heartbeat_time) );
              }
          },
          { "data": null, "title":"Description", "className": "align-middle d-none d-lg-table-cell",
            "render": function (item)
              { return( htmlEncode(item.description) );
              }
          },
          { "data": null, "title":"Actions", "orderable": false, "className": "align-middle text-center",
            "render": function (item)
              { if (item.is_master) return("-");
                var boutons = Bouton_deroulant_start ( );
                boutons += Bouton_deroulant_add ( "danger", "Supprimer le serveur", "SERVER_Del", item.server_uuid, "trash" );
                boutons += Bouton_deroulant_end ();
                return(boutons);
              }
          }
        ],
       order: [ [1, "asc"] ],
     });

    $(document).off('change.serversMaster', '.server-master-switch').on('change.serversMaster', '.server-master-switch', function()
      { var server_uuid = $(this).data('server-uuid');
        var newState = $(this).is(':checked');
        SERVER_Set_Master(server_uuid, newState);
      });
  }
