var IMSGS_AGENT_TECH_ID = null;

/************************************ Demande de refresh **********************************************************************/
function IMSGSCONF_Refresh ( )
 { Load_page();
 }

/********************************************* Appelé au chargement de la page ************************************************/
function Load_page ( )
 { var parts = window.location.pathname.split('/');
	 if (!parts[3]) { Redirect('/agents/imsgs'); return; }

	 IMSGS_AGENT_TECH_ID = decodeURIComponent(parts[3]).toUpperCase();
	 Set_page_context ( 'Connexion XMPP ' + IMSGS_AGENT_TECH_ID );
	 Send_to_API ( 'GET', '/imsgs/get', 'agent_tech_id=' + encodeURIComponent(IMSGS_AGENT_TECH_ID),
								 function(imsgs)
									{ $('#idIMSGSCONFTitle').text(imsgs.agent_tech_id);
										$('#idIMSGSCONFServer').text(imsgs.server_hostname || '-');
										$('#idIMSGSCONFDescription').text(imsgs.description || '-');
										$('#idIMSGSCONFJabberID').text(imsgs.jabberid || '-');
										$('#idIMSGSCONFStatus').html(imsgs.is_alive ? Badge('success', 'Agent actif', 'UP') : Badge('danger', 'Agent inactif', 'DOWN'));
									},
								 function(Response)
									{ Show_shell_error ( "Aucune configuration XMPP pour '" + IMSGS_AGENT_TECH_ID + "'." );
									} );
 }
/*----------------------------------------------------------------------------------------------------------------------------*/
