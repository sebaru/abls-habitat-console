var TELEINFO_AGENT_TECH_ID = null;

/************************************ Demande de refresh **********************************************************************/
function TELEINFOCONF_Refresh ( )
 { Load_page();
 }

/********************************************* Appelé au chargement de la page ************************************************/
function Load_page ( )
 { var parts = window.location.pathname.split('/');
   if (!parts[3]) { Redirect('/agents/teleinfoedf'); return; }

   TELEINFO_AGENT_TECH_ID = decodeURIComponent(parts[3]).toUpperCase();
   Set_page_context('Configuration Téléinfo EDF ' + TELEINFO_AGENT_TECH_ID);
   Send_to_API ( 'GET', '/teleinfoedf/get', 'agent_tech_id=' + encodeURIComponent(TELEINFO_AGENT_TECH_ID),
                 function(teleinfo)
                  { $('#idTELEINFOCONFTitle').text(teleinfo.agent_tech_id);
                    $('#idTELEINFOCONFServer').text(teleinfo.server_hostname || '-');
                    $('#idTELEINFOCONFDescription').text(teleinfo.description || '-');
                    $('#idTELEINFOCONFPort').text(teleinfo.port || '-');
                    $('#idTELEINFOCONFMode').text(teleinfo.standard ? 'Standard' : 'Historique');
                    $('#idTELEINFOCONFStatus').html(teleinfo.is_alive ? Badge('success', 'Agent actif', 'UP') : Badge('danger', 'Agent inactif', 'DOWN'));
                  },
                 function(Response) { Show_shell_error ( "Aucune configuration Téléinfo EDF pour '" + TELEINFO_AGENT_TECH_ID + "'." ); } );
 }
/*----------------------------------------------------------------------------------------------------------------------------*/
