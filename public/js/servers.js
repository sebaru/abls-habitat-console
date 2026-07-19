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
       { Show_toast_ok ( "Serveur " + selection.server_hostname + " " + (newState ? "passe en master" : "sort du mode master") + "." );
         $switch.prop('disabled', false);
         SERVERS_Refresh();
       },
      function(Response)
       { $switch.prop('checked', !newState).prop('disabled', false);
         Show_shell_error ( "Erreur lors de la modification du mode master pour " + selection.server_hostname + "." );
       }
    );
  }
/******************************************* Active ou desactive le mode headless ********************************************/
 function SERVER_Set_Headless ( server_uuid, newState )
  { var selection = $('#idTableSERVERS').DataTable().row("#"+server_uuid).data();
    var $switch = $('#idSwitchHeadless_' + server_uuid);
    $switch.prop('disabled', true);

    var json_request = { server_uuid: server_uuid, headless: newState };
    Send_to_API ( "POST", "/server/set/headless", json_request,
      function(Response)
       { Show_toast_ok ( "Serveur " + selection.server_hostname + " " + (newState ? "passé en headless" : "sort du mode headless") + "." );
         $switch.prop('disabled', false);
       },
      function(Response)
       { $switch.prop('checked', !newState).prop('disabled', false);
         Show_shell_error ( "Erreur lors de la modification du mode headless pour " + selection.server_hostname + "." );
       }
    );
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
              { return( htmlEncode(item.server_hostname) );
              }
          },
          { "data": null, "title":"Version", "className": "align-middle text-center d-none d-md-table-cell",
            "render": function (item)
              { return( htmlEncode(item.version) );
              }
          },
          { "data": null, "title":"Headless", "className": "align-middle text-center d-none d-md-table-cell",
            "render": function (item)
              { return( Switch ( "idSwitchHeadless_" + item.server_uuid,
                                 "Mode headless",
                                 item.headless,
                                 "server-headless-switch",
                                 "data-server-uuid='" + item.server_uuid + "'" ) );
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
          }
        ],
       order: [ [1, "asc"] ],
     });

    $(document).off('change.serversMaster', '.server-master-switch').on('change.serversMaster', '.server-master-switch', function()
      { var server_uuid = $(this).data('server-uuid');
        var newState = $(this).is(':checked');
        SERVER_Set_Master(server_uuid, newState);
      });

    $(document).off('change.serversHeadless', '.server-headless-switch').on('change.serversHeadless', '.server-headless-switch', function()
      { var server_uuid = $(this).data('server-uuid');
        var newState = $(this).is(':checked');
        SERVER_Set_Headless(server_uuid, newState);
      });
  }
