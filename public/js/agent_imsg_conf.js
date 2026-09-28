/* agent_imsg_conf.js
 * Configuration d'un agent de messagerie XMPP.
 */

 var IMSG_AGENT_TECH_ID = null;

/************************************ Demande de refresh **********************************************************************/
 function IMSGCONF_Refresh ()
  { Load_page();
  }

/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { var parts = window.location.pathname.split ( '/' );
    if ( !parts[3] ) { Redirect ( '/agents/imsg' ); return; }

    IMSG_AGENT_TECH_ID = decodeURIComponent ( parts[3] ).toUpperCase();
    Set_page_context ( 'Connexion XMPP ' + IMSG_AGENT_TECH_ID );
    Send_to_API ( 'GET', '/imsg/get', 'agent_tech_id=' + encodeURIComponent ( IMSG_AGENT_TECH_ID ),
                  function ( imsg )
                   { $('#idIMSGCONFTitle').text ( imsg.agent_tech_id );
                     $('#idIMSGCONFServer').text ( imsg.server_hostname || '-' );
                     $('#idIMSGCONFDescription').text ( imsg.description || '-' );
                     $('#idIMSGCONFJabberID').text ( imsg.jabberid || '-' );
                     $('#idIMSGCONFStatus').html ( imsg.is_alive ? Badge ( 'success', 'Agent actif', 'UP' ) : Badge ( 'danger', 'Agent inactif', 'DOWN' ) );
                   },
                  function ( Response )
                   { Show_shell_error ( "Aucune configuration XMPP pour '" + IMSG_AGENT_TECH_ID + "'." ); } );
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
