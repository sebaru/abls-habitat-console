var SERVER_UUID = null;

function SERVERCONF_Refresh ()
 { if (!SERVER_UUID) return;
   Send_to_API ( 'GET', '/server/get', 'server_uuid=' + encodeURIComponent(SERVER_UUID),
                 function(server)
                  { var agents = server.local_agents || [];
                    $('#idSERVERCONFTitle').text(server.agent_tech_id || '-');
                    $('#idSERVERCONFUUID').text(server.server_uuid || SERVER_UUID);
                    $('#idSERVERCONFStatus').html(server.is_alive ? Badge('success', 'Serveur connecté', 'UP') : Badge('danger', 'Serveur déconnecté', 'DOWN'));
                    $('#idSERVERCONFMaster').html(server.is_master ? Badge('primary', 'Serveur master', 'Master') : Badge('secondary', 'Serveur secondaire', 'Secondaire'));
                    $('#idSERVERCONFVersion').text(server.version || '-');
                    $('#idSERVERCONFStart').text(server.start_time || '-');
                    $('#idSERVERCONFHeartbeat').text(server.heartbeat_time || '-');
                    $('#idSERVERCONFDescription').text(server.description || '-');
                    $('#idSERVERCONFAgentCount').text(agents.length);
                    var rows = '';
                    agents.forEach(function(agent)
                     { rows += '<tr><td>' + htmlEncode(agent.agent_classe || '') + '</td><td>' + htmlEncode(agent.agent_tech_id || '') + '</td><td>' + htmlEncode(agent.description || '') + '</td><td>' + (agent.enable ? 'Oui' : 'Non') + '</td></tr>'; });
                    if (!rows) rows = '<tr><td colspan="4" class="text-center fst-italic">Aucun agent local</td></tr>';
                    $('#idSERVERCONFAgents').html(rows);
                  },
                 function() { Show_shell_error ( "Aucun serveur pour '" + SERVER_UUID + "'." ); } );
 }

function Load_page ()
 { var parts = window.location.pathname.split('/');
   if (!parts[3]) { Redirect('/agents/server'); return; }
   SERVER_UUID = decodeURIComponent(parts[3]);
   Set_page_context('Détail serveur');
   SERVERCONF_Refresh();
 }
