/* agent_monitor.js
 * Monitoring et rafraichissement des informations d'un agent.
 */

 var AgentMonitorTimer = null;
/******************************************************************************************************************************/
 function Agent_monitor_get_tech_id ()
  { var agent = AGENT_from_path();
    return ( agent ? agent.agent_tech_id : null );
  }
/******************************************************************************************************************************/
 function Agent_monitor_format_datetime ( value )
  { if (!value || value === "0000-00-00 00:00:00") return("-");
    return(value);
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
          Show_shell_error("Aucun agent trouvé pour '"+techId+"'.");
          return;
        }

       $("#idAgentMonitorServerHostname").text(agent.server_hostname || "-");
       $("#idAgentMonitorStatus").text(agent.agent_status || "-");
       if (agent.is_alive) $("#idAgentMonitorHeartbeat").html( Badge("success", "Agent actif", "UP") );
                    else $("#idAgentMonitorHeartbeat").html( Badge("danger", "Agent inactif", "DOWN") );
       if (agent.mqtt_local_connected) $("#idAgentMonitorMqttLocal").html( Badge("success", "Connecté", "Connecté") );
                                     else $("#idAgentMonitorMqttLocal").html( Badge("danger", "Déconnecté", "Déconnecté") );
       $("#idAgentMonitorStartTime").text( Agent_monitor_format_datetime(agent.start_time) );
     }, function ()
     { $("#idAgentMonitorServerHostname").text("Inconnu");
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
 function Agent_monitor_tick ()
  { Agent_monitor_refresh_status();
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

    Agent_monitor_refresh_status();
    Agent_monitor_refresh_curves();

    if (AgentMonitorTimer) clearInterval(AgentMonitorTimer);
    AgentMonitorTimer = setInterval( Agent_monitor_tick, 10000 );
    window.Unload_page = function ()
     { if (AgentMonitorTimer) { clearInterval(AgentMonitorTimer); AgentMonitorTimer = null; } };
  }
/******************************************************************************************************************************/
