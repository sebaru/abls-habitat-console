/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Save ( agent_uuid )
  { var json_request =
     { agent_uuid : agent_uuid,
       description: $("#idAGENTDescription").val(),
       headless   : ($("#idAGENTHeadless").val()=="true" ? true : false),
       log_level  : parseInt($("#idAGENTLogLevel").val()),
       log_msrv   : ($("#idAGENTLogMSRV").val()=="true" ? true : false),
       log_bus    : ($("#idAGENTLogBUS").val()=="true" ? true : false),
     };
    Send_to_API ( 'POST', "/agent/set", json_request, function ()
     { Show_toast_ok ( "Configuration sauvegardée." );
     }, function ()
     { Show_toast_ko ( "Configuration non sauvegardée.") });
  }
/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  { console.log ("in load domain !");
    vars = window.location.pathname.split('/');

    Send_to_API ( 'GET', "/agent", "agent_uuid="+vars[2], function (Response)
     {
       $("#idAGENTLabel").text( Response.agent_hostname );
       $("#idAGENTHostname").val( Response.agent_hostname + " - " + Response.version + " - " + Response.branche );
       $("#idAGENTUUID").val( Response.agent_uuid );
       $("#idAGENTDescription").val( Response.description );

       $("#idAGENTLink").val( "sudo Watchdogd --link"+
                               " --api-url " + window.location.protocol + "//" + window.location.host +
                               " --domain-uuid " + localStorage.getItem("domain_uuid") +
                               " --domain-secret " + Response.domain_secret +
                               " --agent-uuid " + Response.agent_uuid
                            );

       $("#idAGENTHeadless").replaceWith ( Select ( "idAGENTHeadless", null,
                                                    [ { valeur: "1", texte: "Oui" }, { valeur: "0", texte: "Non" } ], Response.headless ) );
       $("#idAGENTLogMSRV").replaceWith ( Select ( "idAGENTLogMSRV", null,
                                                   [ { valeur: false, texte: "No" }, { valeur: true, texte: "Yes" } ], Response.log_msrv ) );
       $("#idAGENTLogBUS").replaceWith ( Select ( "idAGENTLogBUS", null,
                                                  [ { valeur: false, texte: "No" }, { valeur: true, texte: "Yes" } ], Response.log_bus ) );
       $("#idAGENTLogLevel").replaceWith ( Select ( "idAGENTLogLevel", null,
                                                    [ { valeur: 7, texte: "Debug" },  { valeur: 6, texte: "Info" },
                                                      { valeur: 5, texte: "Notice" }, { valeur: 4, texte: "Warning" },
                                                      { valeur: 3, texte: "Error" } ], Response.log_level ) );
       $("#idAGENTSaveButton").off("click").click( function () { AGENT_Save( vars[2] ); } );
     }, null );
  }
/******************************************************************************************************************************/
