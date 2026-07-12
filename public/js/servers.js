/************************************ Demande de refresh **********************************************************************/
 function SERVERS_Refresh ( )
  { $('#idTableSERVERS').DataTable().ajax.reload(null, false);
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
        [ { "data": null, "title":"Rôle", "className": "align-middle text-center",
            "render": function (item)
              { if (item.is_master) return( Badge( "warning", "Master", "Master" ) );
                return( Badge( "secondary", "Slave", "Slave" ) );
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
              { if (item.headless) return( Badge( "info", "Sans interface locale", "Oui" ) );
                return( Badge( "success", "Interface locale active", "Non" ) );
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
  }
