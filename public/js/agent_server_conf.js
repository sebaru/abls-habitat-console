var SERVER_UUID = null;
var SERVERCONF_server = null;
var SERVERCONF_alive = null;

function SERVERCONF_Refresh ()
 { if (!SERVER_UUID) return;
   Send_to_API ( 'GET', '/server/get', 'server_uuid=' + encodeURIComponent(SERVER_UUID),
                 function(server)
                  { var agents = server.local_agents || [];
                    SERVERCONF_server = AGENT_heartbeat_load(server);
                    SERVERCONF_Render();
                    $('#idSERVERCONFTitle').text(server.agent_tech_id || '-');
                    $('#idSERVERCONFUUID').text(server.server_uuid || SERVER_UUID);
                    $('#idSERVERCONFMaster').html(server.is_master ? Badge('primary', 'Serveur master', 'Master') : Badge('secondary', 'Serveur secondaire', 'Secondaire'));
                    $('#idSERVERCONFVersion').text(server.version || '-');
                    $('#idSERVERCONFStart').text(AGENT_datetime_display(server.start_time));
                    $('#idSERVERCONFDescription').text(server.description || '-');
                    $('#idSERVERCONFAgentCount').text(agents.length);
                    var rows = '';
                    agents.forEach(function(agent)
                     { rows += '<tr><td>' + htmlEncode(agent.agent_classe || '') + '</td><td>' + htmlEncode(agent.agent_tech_id || '') + '</td><td class="d-none d-md-table-cell">' + htmlEncode(agent.description || '') + '</td><td>' + (agent.enable ? 'Oui' : 'Non') + '</td></tr>'; });
                    if (!rows) rows = '<tr class="d-md-none"><td colspan="3" class="text-center fst-italic">Aucun agent local</td></tr>' +
                                     '<tr class="d-none d-md-table-row"><td colspan="4" class="text-center fst-italic">Aucun agent local</td></tr>';
                    $('#idSERVERCONFAgents').html(rows);
                  },
                 function() { Show_shell_error ( "Aucun serveur pour '" + SERVER_UUID + "'." ); } );
 }

function SERVERCONF_Render ()
 { if (!SERVERCONF_server) return;
   var server = SERVERCONF_server;
   var alive = AGENT_is_alive(server);
   var heartbeat = AGENT_heartbeat_display(server.heartbeat_time);
   $('#idSERVERCONFStatus').html(alive ? Badge('success', 'Dernier heartbeat : '+heartbeat, 'UP')
                                       : Badge('danger', 'Dernier heartbeat : '+heartbeat, 'DOWN'));
   $('#idSERVERCONFHeartbeat').text(heartbeat);
   SERVERCONF_alive = alive;
 }

function SERVERCONF_on_live ( type, msg )
 { if (type === 'RECONNECT') { SERVERCONF_Refresh(); return; }
   if (!SERVERCONF_server) return;
   if (type === 'HEARTBEAT' || type === 'STATUS')
    { if (!msg || msg.agent_tech_id !== SERVERCONF_server.agent_tech_id) return;
      AGENT_live_apply(SERVERCONF_server);
      SERVERCONF_Render();
    }
   else if (type === 'TICK')
    { var alive = AGENT_is_alive(SERVERCONF_server);
      if (alive !== SERVERCONF_alive) SERVERCONF_Render();
    }
 }

function Load_page ()
 { var parts = window.location.pathname.split('/');
   if (!parts[3]) { Redirect('/agents/server'); return; }
   SERVER_UUID = decodeURIComponent(parts[3]);
   Set_page_context('Détail serveur');
   AGENT_live_subscribe(SERVERCONF_on_live);
   SERVERCONF_Refresh();
   window.Unload_page = function ()
    { AGENT_live_unsubscribe(SERVERCONF_on_live);
      SERVERCONF_server = null;
    };
 }
