/********************************************* Active un agent ****************************************************************/
 var AGENT_refresh_timer = null;

 function AGENT_set_enable ( agent_tech_id )
  { var json_request = { enable: true, agent_tech_id: agent_tech_id, };
    Send_to_API ( "POST", "/agent/enable", json_request,
                  function(Response)
                   { Show_toast_ok ( "Agent "+agent_tech_id+" activé." );
                     AGENT_refresh();
                   },
                  function(Response)
                   { Show_shell_error ( "Erreur à l'activation de l'agent "+agent_tech_id ); }
                );
  }
/********************************************* Desactive un agent *************************************************************/
 function AGENT_set_disable ( agent_tech_id )
  { var json_request = { enable: false, agent_tech_id: agent_tech_id, };

    Send_to_API ( "POST", "/agent/enable", json_request,
                  function(Response)
                   { Show_toast_ok ( "Agent "+agent_tech_id+" désactivé." );
                     AGENT_refresh();
                   },
                  function(Response)
                   { Show_shell_error ( "Erreur à la désactivation de l'agent "+agent_tech_id ); }
                );
  }
/********************************************* Start Agent ******************************************************************/
 function AGENT_start ( agent_tech_id )
  { var json_request = { agent_tech_id: agent_tech_id };
    Send_to_API ( "POST", "/agent/start", json_request,
                  function(Response) { Show_toast_ok ( "Démarrage demandé pour l'agent "+agent_tech_id );
                                       AGENT_refresh(); },
                  function(Response) { Show_shell_error ( "Erreur au demarrage de l'agent "+agent_tech_id ); }
                );
  }
 /********************************************* Stop Agent *******************************************************************/
 function AGENT_stop ( agent_tech_id, fonction_ok, fonction_nok )
  { var json_request = { agent_tech_id: agent_tech_id };
    Send_to_API ( "POST", "/agent/stop", json_request,
                  function(Response) { Show_toast_ok ( "Arrêt demandé pour l'agent "+agent_tech_id );
                                       AGENT_refresh(); },
                  function(Response) { Show_shell_error ( "Erreur à l'arrêt de l'agent "+agent_tech_id ); }
                );
  }
 /********************************************* Restart Agent ****************************************************************/
 function AGENT_restart ( agent_tech_id, fonction_ok, fonction_nok )
  { var json_request = { agent_tech_id: agent_tech_id };
    Send_to_API ( "POST", "/agent/restart", json_request,
                  function(Response) { Show_toast_ok ( "Redémarrage demandé pour l'agent "+agent_tech_id );
                                       AGENT_refresh(); },
                  function(Response) { Show_shell_error ( "Erreur au redémarrage de l'agent "+agent_tech_id ); }
                );
  }
 /********************************************* Upgrade Agent ****************************************************************/
 function AGENT_upgrade ( agent_tech_id, fonction_ok, fonction_nok )
  { var json_request = { agent_tech_id: agent_tech_id };
    Send_to_API ( "POST", "/agent/upgrade", json_request,
                  function(Response) { Show_toast_ok ( "Upgrade demandé pour l'agent "+agent_tech_id );
                                       AGENT_refresh(); },
                  function(Response) { Show_shell_error ( "Erreur à l'upgrade de l'agent "+agent_tech_id ); }
                );
  }
 /********************************************* Reload Process *****************************************************************/
 function AGENT_set_log_level ( agent_tech_id, log_level )
  { var json_request =
     { agent_tech_id: agent_tech_id,
       log_level    : parseInt(log_level),
     };

    Send_to_API ( "POST", "/agent/log_level", json_request,
      function(Response) { Show_toast_ok ( "Agent "+agent_tech_id+" niveau de log = "+log_level+"." );
                           AGENT_refresh(); },
      function(Response) { Show_shell_error ( "Erreur lors de la modification du niveau de log de l'agent "+agent_tech_id+"." ); } );
  }
/********************************************* Render Log Level selector *****************************************************/
 function AGENT_log_level_selector ( agent_tech_id, current_level )
  { var current = parseInt(current_level);
    if (isNaN(current) || current < 0 || current > 7) current = 6;

    var options =
      [ { value: 7, label: "LOG_DEBUG" },
        { value: 6, label: "LOG_INFO" },
        { value: 5, label: "LOG_NOTICE" },
        { value: 4, label: "LOG_WARNING" },
        { value: 3, label: "LOG_ERR" },
        { value: 2, label: "LOG_CRIT" },
        { value: 1, label: "LOG_ALERT" },
        { value: 0, label: "LOG_EMERG" }
      ];

    var onChange = "AGENT_set_log_level('"+agent_tech_id+"', this.value )";
    var html = "<select class='form-select form-select-sm' onchange=\""+onChange+"\">";
    options.forEach(function(opt)
      { html += "<option value='"+opt.value+"'"+(opt.value === current ? " selected" : "")+">"+opt.label+"</option>";
      });
    html += "</select>";
    return(html);
  }
/********************************************* Navigation vers la page de monitoring *****************************************/
 function AGENT_monitor ( agent_tech_id )
  { Redirect ( "/agent/"+encodeURIComponent(agent_tech_id) ); }
/********************************************* Refresh de la table agents *****************************************************/
 function AGENT_refresh ()
  { if (typeof $ === "undefined" || !$.fn || !$.fn.dataTable) return;
    if (!$.fn.dataTable.isDataTable('#idTableAGENT')) return;
    $('#idTableAGENT').DataTable().ajax.reload(null, false);
  }

 function AGENT_start_auto_refresh ()
  { if (AGENT_refresh_timer) clearInterval(AGENT_refresh_timer);
    AGENT_refresh_timer = setInterval( function ()
     { if (window.location.pathname !== '/agents')
        { clearInterval(AGENT_refresh_timer);
          AGENT_refresh_timer = null;
          return;
        }
       AGENT_refresh();
     }, 30000 );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableAGENT').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/agent/list", type : "GET", dataSrc: "agents", contentType: "application/json",
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       /*rowId: "thread_id",*/
       columns:
        [ { "data": null, "title":"Server", "className": "align-middle text-center",
            "render": function (item)
              { return( htmlEncode(item.server_hostname) ); }
          },
          { "data": null, "title":"Tech_id", "className": "align-middle text-center",
            "render": function (item)
              { var classe = encodeURIComponent(item.agent_classe || "");
                var techId = encodeURIComponent(item.agent_tech_id || "");
                return( Lien ( "/io/"+classe+"/"+techId, "Voir la configuration du connecteur", item.agent_tech_id ) ); }
          },
          { "data": null, "title":"Classe", "className": "align-middle text-center d-none d-lg-table-cell",
            "render": function (item)
              { var classe = encodeURIComponent(item.agent_classe || "");
                var classeLabel = htmlEncode(item.agent_classe || "") + " - " + htmlEncode(item.version || "none");
                if (classe !== "server" ) return( Lien ( "/io/"+classe, "Voir la configuration du connecteur", classeLabel ) );
                else return ( Lien ("/servers", "Voir la configuration du serveur", classeLabel ) );
              }
          },
          { "data": null, "title":"Enable", "className": "align-middle text-center d-none d-md-table-cell",
             "render": function (item)
              { if (item.enable==true)
                { return( Bouton ( "success", "Désactiver l'agent", "AGENT_set_disable", item.agent_tech_id, "Actif" ) ); }
               else
                { return( Bouton ( "outline-secondary", "Activer l'agent", "AGENT_set_enable", item.agent_tech_id, "Désactivé" ) ); }
              },
          },
          { "data": null, "title":"Etat", "className": "align-middle text-center d-none d-md-table-cell",
            "render": function (item)
              { var ioBadge = Badge( (item.is_alive ? "success" : (item.enable ? "danger" : "secondary")), "Etat", (item.is_alive ? "UP" : "DOWN") );
                var mqttLocalBadge = Badge( (item.is_alive && item.mqtt_local_connected) ? "success" : "secondary", "MQTT Local", "MQTT Local" );
                return( ioBadge + " " + mqttLocalBadge );
              },
          },
          { "data": "description", "title":"Description", "className": "align-middle d-none d-lg-table-cell " },
          { "data": null, "title":"Status", "className": "align-middle text-center d-none d-xl-table-cell",
            "render": function (item)
             { return ( Lien ( "/agent/"+encodeURIComponent(item.agent_tech_id || ""),
                                "Voir le monitoring de l'agent",
                                item.agent_status || "-" ) ); }
          },
          { "data": null, "title":"Log_level", "className": "align-middle text-center d-none d-xl-table-cell",
            "render": function (item)
             { return( AGENT_log_level_selector ( item.agent_tech_id, item.log_level ) ); },
          },
          { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
            "render": function (item)
             { var boutons = Bouton_deroulant_start();
               if (item.is_alive == false)
                { boutons += Bouton_deroulant_add ( "success", "Démarrer", "AGENT_start", item.agent_tech_id, "play" ); }
               boutons += Bouton_deroulant_add ( "info", "Monitorer", "AGENT_monitor", item.agent_tech_id, "chart-line" );
               boutons += Bouton_deroulant_add_spacer();
               boutons += Bouton_deroulant_add ( "warning", "Upgrader", "AGENT_upgrade", item.agent_tech_id, "upload" );
               boutons += Bouton_deroulant_add ( "warning", "Redémarrer", "AGENT_restart", item.agent_tech_id, "sync-alt" );
               if (item.is_alive)
                { if (item.agent_classe !== "server")
                   { boutons += Bouton_deroulant_add_spacer();
                     boutons += Bouton_deroulant_add ( "danger", "Arrêter",   "AGENT_stop", item.agent_tech_id, "stop" );
                   }
                }
               boutons += Bouton_deroulant_end();
               return ( boutons );
             }
          },
        ],
               /*order: [ [0, "desc"] ],*/
     });

    AGENT_start_auto_refresh();
  }
