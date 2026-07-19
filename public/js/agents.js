/************************************ Demande de refresh **********************************************************************/
 function THREAD_Refresh ( )
  { $('#idTableTHREAD').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function THREAD_set_disable (thread_tech_id)
  { $("#idButtonSpinner_THREAD_set_disable_"+thread_tech_id).show();
    Thread_enable ( thread_tech_id, false, function(Response) { THREAD_Refresh(); }, function(Response) { THREAD_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function THREAD_set_enable (thread_tech_id)
  { $("#idButtonSpinner_THREAD_set_enable_"+thread_tech_id).show();
    Thread_enable ( thread_tech_id, true, function(Response) { THREAD_Refresh(); }, function(Response) { THREAD_Refresh(); } );
  }
/********************************************* Navigation vers la page de monitoring *****************************************/
 function Agent_monitor ( agent_tech_id )
  { Redirect ( "/agent/"+encodeURIComponent(agent_tech_id) );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableTHREAD').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/agent/list", type : "GET", dataSrc: "agents", contentType: "application/json",
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       /*rowId: "thread_id",*/
       columns:
        [ { "data": null, "title":"Server", "className": "align-middle text-center",
            "render": function (item)
              { return( htmlEncode(item.agent_hostname) ); }
          },
          { "data": null, "title":"Tech_id", "className": "align-middle text-center",
            "render": function (item)
              { var classe = encodeURIComponent(item.thread_classe || "");
                var techId = encodeURIComponent(item.thread_tech_id || "");
                return( Lien ( "/io/"+classe+"/"+techId, "Voir la configuration du connecteur", item.thread_tech_id ) ); }
          },
          { "data": null, "title":"Classe", "className": "align-middle text-center d-none d-lg-table-cell",
            "render": function (item)
              { var classe = encodeURIComponent(item.thread_classe || "");
                return( Lien ( "/io/"+classe, "Voir la configuration du connecteur", htmlEncode(item.thread_classe) ) ); }
          },
          { "data": null, "title":"Enable", "className": "align-middle text-center d-none d-md-table-cell",
             "render": function (item)
              { if (item.enable==true)
                { return( Bouton ( "success", "Désactiver le thread", "THREAD_set_disable", item.thread_tech_id, "Actif" ) ); }
               else
                { return( Bouton ( "outline-secondary", "Activer le thread", "THREAD_set_enable", item.thread_tech_id, "Désactivé" ) ); }
              },
          },
          { "data": null, "title":"Connexion", "className": "align-middle text-center d-none d-md-table-cell",
            "render": function (item)
              { if (item.is_alive) return( Badge( "success", "Connecté", "Connecté" ) );
                return( Badge( "danger", "Déconnecté", "Déconnecté" ) );
              },
          },
          { "data": null, "title":"MQTT", "className": "align-middle text-center d-none d-lg-table-cell",
            "render": function (item)
              { if (item.mqtt_connected) return( Badge( "success", "Connecté", "Connecté" ) );
                return( Badge( "danger", "Déconnecté", "Déconnecté" ) );
              },
          },
          { "data": "description", "title":"Description", "className": "align-middle d-none d-lg-table-cell " },
          { "data": null, "title":"Status", "className": "align-middle text-center d-none d-xl-table-cell",
            "render": function (item)
             { return ( Lien ( "/agent/"+encodeURIComponent(item.thread_tech_id || ""),
                                "Voir le monitoring de l'agent",
                                item.agent_status || "-" ) ); }
          },
          { "data": null, "title":"Log_level", "className": "align-middle text-center d-none d-xl-table-cell",
            "render": function (item)
             { return( Render_log_level_selector ( item.thread_tech_id, item.debug ) ); },
          },
          { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
            "render": function (item)
             { var boutons = Bouton_deroulant_start();
               boutons += Bouton_deroulant_add ( "info", "Monitorer", "Agent_monitor", item.thread_tech_id, "chart-line" );
               boutons += Bouton_deroulant_add_spacer();
               if (item.enable)
                { boutons += Bouton_deroulant_add ( "warning", "Upgrader", "Agent_upgrade", item.thread_tech_id, "download" );
                  boutons += Bouton_deroulant_add ( "warning", "Redémarrer", "Agent_restart", item.thread_tech_id, "redo" );
                  boutons += Bouton_deroulant_add_spacer();
                  boutons += Bouton_deroulant_add ( "danger", "Arrêter",   "Agent_stop", item.thread_tech_id, "stop" );

                }
               else
                { boutons += Bouton_deroulant_add ( "success", "Démarrer", "Agent_start", item.thread_tech_id, "play" );
                }
               boutons += Bouton_deroulant_end();
               return ( boutons );
             }
          },
        ],
               /*order: [ [0, "desc"] ],*/
     });

  }
