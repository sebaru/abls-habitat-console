/* agent_monitor.js
 * Monitoring et rafraichissement des informations d'un agent.
 */

 var AgentMonitor_agent = null;
 var AgentMonitor_alive = null;
/******************************************************************************************************************************/
 function Agent_monitor_get_tech_id ()
  { var agent = AGENT_from_path();
    return ( agent ? agent.agent_tech_id : null );
  }
/******************************************************************************************************************************/
 function Agent_monitor_render ()
  { var agent = AgentMonitor_agent;
    if (!agent) return;
    var alive = AGENT_is_alive(agent);
    var heartbeat = AGENT_heartbeat_display(agent.heartbeat_time);
    $("#idAgentMonitorServerHostname").text(agent.server_hostname || "-");
    $("#idAgentMonitorStatus").text(agent.agent_status || "-");
    $("#idAgentMonitorHeartbeat").html(
        Badge(alive ? "success" : "danger", AGENT_state_tooltip(agent), alive ? "UP" : "DOWN")+
        " <span class='ms-2'>"+htmlEncode(heartbeat)+"</span>" );
    if (agent.mqtt_local_connected) $("#idAgentMonitorMqttLocal").html( Badge("success", "Connecté", "Connecté") );
                                  else $("#idAgentMonitorMqttLocal").html( Badge("danger", "Déconnecté", "Déconnecté") );
    $("#idAgentMonitorStartTime").text( AGENT_datetime_display(agent.start_time) );
    AgentMonitor_alive = alive;
  }
/******************************************************************************************************************************/
 function Agent_monitor_refresh_status ()
  { var techId = Agent_monitor_get_tech_id();
    if (!techId) { Show_shell_error("Tech_id agent invalide."); return; }

    Send_to_API ( "GET", "/agent/get", "agent_tech_id="+encodeURIComponent(techId), function (agent)
     { if (!agent || !agent.agent_tech_id)
        { $("#idAgentMonitorServerHostname").text("Inconnu");
          $("#idAgentMonitorStatus").html( Badge("secondary", "Status inconnu", "N/A") );
          $("#idAgentMonitorHeartbeat").html( Badge("secondary", "Etat inconnu", "N/A") );
          $("#idAgentMonitorMqttLocal").html( Badge("secondary", "Etat inconnu", "N/A") );
          $("#idAgentMonitorStartTime").text("-");
        AgentMonitor_agent = null;
        AgentMonitor_alive = null;
        Show_shell_error("Aucun agent trouvé pour '"+techId+"'.");
        return;
      }

     if (Agent_monitor_get_tech_id() !== techId) return;
     AgentMonitor_agent = AGENT_heartbeat_load(agent);
     Agent_monitor_render();
     }, function ()
     { if (Agent_monitor_get_tech_id() !== techId) return;
     AgentMonitor_agent = null;
     AgentMonitor_alive = null;
     $("#idAgentMonitorServerHostname").text("Inconnu");
       $("#idAgentMonitorStatus").html( Badge("secondary", "Status inconnu", "N/A") );
       $("#idAgentMonitorHeartbeat").html( Badge("secondary", "Etat inconnu", "N/A") );
       $("#idAgentMonitorMqttLocal").html( Badge("secondary", "Etat inconnu", "N/A") );
       $("#idAgentMonitorStartTime").text("-");
     } );
  }
/******************************************************************************************************************************/
 function Agent_monitor_refresh_curves ()
  { var techId = Agent_monitor_get_tech_id();
    if (!techId) return;

    var period = $("#idAgentMonitorPeriod").val();
    if (!period) period = PeriodeTableau[5].valeur;

    Charger_une_courbe ( "idAgentCourbeRssMem", techId, "MEMORY_RSS", period, "MAX" );
    Charger_une_courbe ( "idAgentCourbeVirtMem", techId, "MEMORY_VIRTUAL", period, "MAX" );
    Charger_une_courbe ( "idAgentCourbeTourParSec", techId, "TOUR_PAR_SEC", period, "AVG" );
    Charger_une_courbe ( "idAgentCourbeLogParMin", techId, "LOG_PAR_MIN", period, "MAX" );
  }
/******************************************************************************************************************************/
 function Agent_monitor_refresh ()
  { Agent_monitor_refresh_status();
    Agent_monitor_refresh_curves();
  }
/******************************************************************************************************************************/
 function Agent_monitor_on_live ( type, msg )
  { if (type === "RECONNECT") { Agent_monitor_refresh_status(); return; }
    if (!AgentMonitor_agent) return;
    if (type === "STATUS")
     { if (!msg || msg.agent_tech_id !== AgentMonitor_agent.agent_tech_id) return;
       AGENT_live_apply(AgentMonitor_agent);
       Agent_monitor_render();
     }
    else if (type === "TICK")
     { var alive = AGENT_is_alive(AgentMonitor_agent);
       if (alive !== AgentMonitor_alive) Agent_monitor_render();
     }
  }
/******************************************************************************************************************************/
 function Load_page ()
  {
    var agent = AGENT_from_path();
    if (!agent) { Redirect("/agents"); return; }
    var techId = agent.agent_tech_id;
    AGENT_Header ( agent.classe, techId, null );

    $("#idAgentMonitorPeriod").replaceWith ( Select ( "idAgentMonitorPeriod", null, PeriodeTableau, "BY_HOUR_ON_2_WEEKS" ) );
    $("#idAgentMonitorPeriod").off("change").on("change", Agent_monitor_refresh_curves );

    AGENT_live_subscribe ( Agent_monitor_on_live );

    Agent_monitor_refresh_status();
    Agent_monitor_refresh_curves();

    window.Unload_page = function ()
     { AGENT_live_unsubscribe ( Agent_monitor_on_live );
       AGENT_Header_unload();
       AgentMonitor_agent = null;
     };
  }
/******************************************************************************************************************************/
