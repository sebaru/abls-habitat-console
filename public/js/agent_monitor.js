/******************************************************************************************************************************/
 var AgentMonitorTimer = null;
/******************************************************************************************************************************/
 function Agent_monitor_get_tech_id_raw ()
  { var vars = window.location.pathname.split('/');
    return ( decodeURIComponent(vars[2]) || null );
  }
/******************************************************************************************************************************/
 function Agent_monitor_refresh_status ()
    var techId = Agent_monitor_get_tech_id_raw();
    if (!techId) { Show_shell_error("Tech_id agent invalide."); return; }

    Send_to_API ( "GET", "/thread/list", null, function (Response)
     { var thread = null;
       $.each ( Response.threads || [], function (i, item)
        { if (item.thread_tech_id === techId) { thread = item; return(false); }
        }
       );

       if (!thread)
        { $("#idAgentMonitorHostname").text("Inconnu");
          $("#idAgentMonitorStatus").html( Badge("secondary", "Status inconnu", "N/A") );
          $("#idAgentMonitorAlive").html( Badge("secondary", "Etat inconnu", "N/A") );
          $("#idAgentMonitorMqtt").html( Badge("secondary", "Etat inconnu", "N/A") );
          $("#idAgentMonitorHeartbeat").text("-");
          Show_shell_error("Aucun thread trouvé pour '"+techId+"'.");
          return;
        }

       $("#idAgentMonitorHostname").text(thread.agent_hostname || "-");
       $("#idAgentMonitorStatus").text(thread.agent_status || "-");
       if (thread.is_alive) $("#idAgentMonitorAlive").html( Badge("success", "Connecté", "Connecté") );
                    else $("#idAgentMonitorAlive").html( Badge("danger", "Déconnecté", "Déconnecté") );
       if (thread.mqtt_connected) $("#idAgentMonitorMqtt").html( Badge("success", "Connecté", "Connecté") );
                             else $("#idAgentMonitorMqtt").html( Badge("danger", "Déconnecté", "Déconnecté") );
       $("#idAgentMonitorHeartbeat").text(thread.heartbeat_time || "-");

       var classe = encodeURIComponent(thread.thread_classe || "");
       var techIdUrl = encodeURIComponent(thread.thread_tech_id || "");
       $("#idAgentMonitorIoLink").attr("href", "/io/"+classe+"/"+techIdUrl);
     }, null );
  }
/******************************************************************************************************************************/
 function Agent_monitor_refresh_curves ()
  { var techId = Agent_monitor_get_tech_id();
    if (!techId) return;

    var period = $("#idAgentMonitorPeriod").val();
    if (!period) period = PeriodeTableau[5].valeur;

    Charger_une_courbe ( "idAgentCourbeMaxRss", techId, "MAX_RSS", period, "MAX" );
    Charger_une_courbe ( "idAgentCourbeTourParSec", techId, "TOUR_PAR_SEC", period, "AVG" );
    Charger_une_courbe ( "idAgentCourbeLogParMin", techId, "LOG_PAR_MIN", period, "MAX" );
  }
/******************************************************************************************************************************/
 function Agent_monitor_refresh_ai ()
  { if (!$.fn.DataTable.isDataTable('#idTableAgentAI')) return;
    $('#idTableAgentAI').DataTable().ajax.reload(null, false);
  }
/******************************************************************************************************************************/
 function Agent_monitor_refresh ()
  { Agent_monitor_refresh_status();
    Agent_monitor_refresh_curves();
    Agent_monitor_refresh_ai();
  }
/******************************************************************************************************************************/
 function Agent_monitor_tick ()
  { if (!window.location.pathname.match(/^\/agent\/[^/]+$/)) return;
    Agent_monitor_refresh_status();
    Agent_monitor_refresh_ai();
  }
/******************************************************************************************************************************/
 function Load_page ()
  { var techIdRaw = Agent_monitor_get_tech_id_raw();
    if (!techIdRaw) { Redirect("/agents"); return; }

    var techId = Agent_monitor_get_tech_id();
    $("#idAgentMonitorTitle").text(techId);
    Set_page_context ( "Monitoring agent '" + techId + "'" );

    $("#idAgentMonitorPeriod").replaceWith ( Select ( "idAgentMonitorPeriod", null, PeriodeTableau, "BY_HOUR_ON_2_WEEKS" ) );
    $("#idAgentMonitorPeriod").off("change").on("change", Agent_monitor_refresh_curves );

    $('#idTableAgentAI').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/dls/run", type : "GET", data: { tech_id: techId, classe: "AI" }, dataSrc: "AI",
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "mnemo_ai_id",
       columns:
        [ { "data": null, "title":"Acronyme", "className": "align-middle text-center",
            "render": function (item)
             { return ( Lien ( "/courbe/"+encodeURIComponent(item.tech_id || techId)+"/"+encodeURIComponent(item.acronyme || "")+"/BY_HOUR_ON_2_DAYS",
                               "Voir la courbe",
                               item.acronyme || "-" ) ); }
          },
          { "data": "valeur", "title":"Valeur", "className": "align-middle text-center" },
          { "data": "unite", "title":"Unité", "className": "align-middle text-center d-none d-md-table-cell" },
          { "data": null, "title":"In range", "className": "align-middle text-center d-none d-lg-table-cell",
            "render": function (item)
             { if (item.in_range==true) return( Badge("success", "Dans les clous", "Oui") );
               return( Badge("warning", "Hors plage", "Non") );
             }
          },
        ],
     });

    Agent_monitor_refresh();

    if (AgentMonitorTimer) clearInterval(AgentMonitorTimer);
    AgentMonitorTimer = setInterval( Agent_monitor_tick, 10000 );
  }
/******************************************************************************************************************************/
