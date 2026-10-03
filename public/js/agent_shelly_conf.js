var SHELLY_AGENT_TECH_ID = null;

function SHELLYCONF_Refresh ()
 { if (!SHELLY_AGENT_TECH_ID) return;
   Send_to_API ( 'GET', '/shelly/get', 'agent_tech_id=' + encodeURIComponent(SHELLY_AGENT_TECH_ID),
                 function(shelly)
                  { $('#idSHELLYCONFTitle').text(shelly.agent_tech_id || SHELLY_AGENT_TECH_ID);
                    $('#idSHELLYCONFServer').text(shelly.server_hostname || '-');
                    $('#idSHELLYCONFStatus').html(shelly.is_alive ? Badge('success', 'Agent actif', 'UP') : Badge('danger', 'Agent inactif', 'DOWN'));
                    $('#idSHELLYCONFEnabled').html(shelly.enable ? Badge('success', 'Agent activé', 'Oui') : Badge('secondary', 'Agent désactivé', 'Non'));
                    $('#idSHELLYCONFHostname').text(shelly.hostname || '-');
                    $('#idSHELLYCONFStringID').text(shelly.string_id || '-');
                    $('#idSHELLYCONFDescription').text(shelly.description || '-');
                  },
                 function() { Show_shell_error ( "Aucune configuration Shelly pour '" + SHELLY_AGENT_TECH_ID + "'." ); } );
 }

function Load_page ()
 { var parts = window.location.pathname.split('/');
   if (!parts[3]) { Redirect('/agents/shelly'); return; }
   SHELLY_AGENT_TECH_ID = decodeURIComponent(parts[3]);
   Set_page_context('Détail Shelly ' + SHELLY_AGENT_TECH_ID);
   SHELLYCONF_Refresh();
 }
