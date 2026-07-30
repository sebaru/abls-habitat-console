/******************************************************************************************************************************/
 var AgentMonitorTimer = null;
/******************************************************************************************************************************/
 function Agent_monitor_get_tech_id ()
  { var vars = window.location.pathname.split('/');
    return ( decodeURIComponent(vars[2]) || null );
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
          $("#idAgentMonitorMqttApi").html( Badge("secondary", "Etat inconnu", "N/A") );
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

       var configHref = "#";
       if (agent.agent_classe === "server")
        { configHref = "/servers"; }
       else if (agent.agent_classe && agent.agent_tech_id)
        { var classe = encodeURIComponent(agent.agent_classe);
          var agent_tech_id = encodeURIComponent(agent.agent_tech_id);
          configHref = "/io/"+classe+"/"+agent_tech_id;
        }
       $("#idAgentMonitorIoLink").attr("href", configHref);
     }, function ()
     { $("#idAgentMonitorServerHostname").text("Inconnu");
       $("#idAgentMonitorStatus").html( Badge("secondary", "Status inconnu", "N/A") );
       $("#idAgentMonitorHeartbeat").html( Badge("secondary", "Etat inconnu", "N/A") );
       $("#idAgentMonitorMqttApi").html( Badge("secondary", "Etat inconnu", "N/A") );
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
  {
    var techId = Agent_monitor_get_tech_id();
    if (!techId) { Redirect("/agents"); return; }
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
        [ { "data": null, "title":"Map from", "className": "align-middle text-center",
            "render": function (item)
             { if (item.agent_tech_id) return ( item.agent_tech_id+":"+item.agent_acronyme );
               return ( "-" );
             }
          },
          { "data": null, "title":"Acronyme", "className": "align-middle text-center",
            "render": function (item)
             { return ( Lien ( "/courbe/"+encodeURIComponent(item.tech_id)+"/"+encodeURIComponent(item.acronyme)+"/BY_HOUR_ON_2_DAYS",
                               "Voir la courbe",
                               item.tech_id+":"+item.acronyme ) ); }
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

    Agent_monitor_refresh_status();
    Agent_monitor_refresh_curves();

    if (AgentMonitorTimer) clearInterval(AgentMonitorTimer);
    AgentMonitorTimer = setInterval( Agent_monitor_tick, 10000 );
  }
/******************************************************************************************************************************/
