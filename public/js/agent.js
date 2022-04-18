/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Refresh ( )
  { $('#idTableAGENT').DataTable().ajax.reload(null, false); }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Sauver_parametre ( id )
  { table = $('#idTableAGENT').DataTable();
    selection = table.ajax.json().agents.filter( function(item) { return item.id==id } )[0];
    var json_request =
     { agent      : selection.agent,
       description: $("#idAGENTDescription_"+id).val(),
       log_level  : parseInt($("#idAGENTLogLevel_"+id).val()),
       log_msrv   : ($("#idAGENTLogMSRV_"+id).val()=="true" ? true : false),
       log_db     : ($("#idAGENTLogDB_"+id).val()=="true" ? true : false),
       log_bus    : ($("#idAGENTLogBUS_"+id).val()=="true" ? true : false),
       log_trad   : ($("#idAGENTLogTRAD_"+id).val()=="true" ? true : false),
     };
    Send_to_API ( 'POST', "/agent", json_request, function ()
     { Show_toast_ok ( "Configuration sauvegardée." );
       AGENT_Refresh ();
     }, function ()
     { Show_toast_ko ( "Configuration non sauvegardée.") });
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Reset_Valider ( selection )
  { var json_request = { bus_tag: "AGENT_RESET", thread_tech_id: selection.agent };
    Send_to_API ( 'POST', "/api/process/send", JSON.stringify(json_request), function ()
     { Show_Info ( "Attendez le redémarrage" );
       Reload_when_ready();
     }, null );
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Reset ( id  )
  { table = $('#idTableAGENT').DataTable();
    selection = table.ajax.json().agents.filter( function(item) { return item.id==id } )[0];
    Show_modal_del ( "Restarter cet agent "+selection.agent,
                     "Etes-vous sûr de vouloir relancer cet agent ?",
                     selection.agent + " - "+selection.description,
                     function () { AGENT_Reset_Valider( selection ) } ) ;
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Upgrade_Valider ( selection )
  { var json_request = { bus_tag: "AGENT_UPGRADE", thread_tech_id: selection.agent };
    Send_to_API ( 'POST', "/api/process/send", JSON.stringify(json_request), function ()
     { Show_Info ( "Attendez le download et le redémarrage" );
     }, null );
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Upgrade ( id  )
  { table = $('#idTableAGENT').DataTable();
    selection = table.ajax.json().agents.filter( function(item) { return item.id==id } )[0];
    Show_modal_del ( "Upgrader cette agent "+selection.agent,
                     "Etes-vous sûr de vouloir upgrader cette agent ?",
                     selection.agent + " - "+selection.description,
                     function () { AGENT_Upgrade_Valider( selection ) } ) ;
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Reload_icons ( )
  { Send_to_API ( 'POST', "/api/agent/reload_icons", null, null, null ); }
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
       rowId: "id",
       columns:
         [ { "data": null, "title":"Master", "className": "align-middle text-center",
             "render": function (item)
              { if (item.is_master==true)
                 { return( Bouton ( "success", "Instance is Master", null, null, "Master" ) ); }
                else
                 { return( Bouton ( "secondary", "Master is "+item.master_host, null, null, "Slave" ) ); }
              }
           },
           { "data": "hostname",     "title":"Hostname", "className": "align-middle text-center" },
           { "data": "version", "title":"Version",   "className": "align-middle text-center" },
           { "data": "start_time", "title":"Start time",   "className": "align-middle text-center" },
           { "data": "install_time", "title":"Install time",   "className": "align-middle text-center" },
           { "data": null, "title":"Description", "className": "align-middle ",
             "render": function (item)
              { return( Input ( "text", "idAGENTDescription_"+item.id, "AGENT_Sauver_parametre("+item.id+")",
                                "Description de l'agent", item.description, null ) );
              }
           },
           { "data": null, "title":"Log_MSRV", "className": "align-middle text-center",
             "render": function (item)
              { var choix = [ { valeur: false, texte: "No" }, { valeur: true, texte: "Yes" } ];
                return( Select ( "idAGENTLogMSRV_"+item.id, "AGENT_Sauver_parametre("+item.id+")", choix, item.log_msrv ) );
              }
           },
           { "data": null, "title":"Log_BUS", "className": "align-middle text-center",
             "render": function (item)
              { var choix = [ { valeur: false, texte: "No" }, { valeur: true, texte: "Yes" } ];
                return( Select ( "idAGENTLogBUS_"+item.id, "AGENT_Sauver_parametre("+item.id+")", choix, item.log_bus ) );
              }           },
           { "data": null, "title":"Log Level", "className": "align-middle ",
             "render": function (item)
              { var choix = [ { valeur: 7, texte: "Debug" },
                              { valeur: 6, texte: "Info" },
                              { valeur: 5, texte: "Notice" },
                              { valeur: 4, texte: "Warning" },
                              { valeur: 3, texte: "Error" } ];
                return( Select ( "idAGENTLogLevel_"+item.id, "AGENT_Sauver_parametre("+item.id+")", choix, item.log_level ) );
              }
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "warning", "Upgrade l'agent", "AGENT_Upgrade", item.id, "download", null );
                 boutons += Bouton_actions_add ( "danger", "Restart l'agent", "AGENT_Reset", item.id, "redo", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       order: [ [0, "desc"] ],
       responsive: true,
     });
  }
