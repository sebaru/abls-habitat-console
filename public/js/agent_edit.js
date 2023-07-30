/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AGENT_Save ( agent_uuid )
  { var json_request =
     { agent_uuid : agent_uuid,
       description: $("#idAGENTDescription").val(),
       headless   : ($("#idAGENTHeadless").val()=="true" ? true : false),
       log_level  : parseInt($("#idAGENTLogLevel").val()),
       log_msrv   : ($("#idAGENTLogMSRV").val()=="true" ? true : false),
       log_bus    : ($("#idAGENTLogBUS").val()=="true" ? true : false),
       log_dls    : ($("#idAGENTLogDLS").val()=="true" ? true : false),
       branche    : $("#idAGENTBranche").val(),
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
       $("#idAGENTHostname").val( Response.agent_hostname + " - " + Response.version );
       $("#idAGENTUUID").val( Response.agent_uuid );
       $("#idAGENTDescription").val( Response.description );
       $("#idAGENTBranche").val( Response.branche );

       $("#idAGENTLinkNatif").text( "sudo Watchdogd --save"+
                                    " --api-url " + Response.api_url +
                                    " --domain-uuid " + localStorage.getItem("domain_uuid") +
                                    " --domain-secret '" + Response.domain_secret + "'"
                                  );
       $("#idAGENTLinkPodman").text( "podman rm abls-agent; "+
                                     "podman run -d --name abls-agent "+
                                     "--restart always -v /dev/log:/dev/log --tz local -p 5559:5559 "+
                                     "--env ABLS_API_URL="+Response.api_url + " "+
                                     "--env ABLS_DOMAIN_UUID="+localStorage.getItem("domain_uuid") + " "+
                                     "--env ABLS_DOMAIN_SECRET='"+Response.domain_secret + "' "+
                                     "--group-add keep-groups "+
                                     "docker.io/sebaru/abls-agent:latest "
                                  );

       $("#idAGENTHeadless").replaceWith ( Select ( "idAGENTHeadless", null,
                                                    [ { valeur: true, texte: "Oui" }, { valeur: false, texte: "Non" } ], Response.headless ) );
       $("#idAGENTLogMSRV").replaceWith ( Select ( "idAGENTLogMSRV", null,
                                                   [ { valeur: false, texte: "No" }, { valeur: true, texte: "Yes" } ], Response.log_msrv ) );
       $("#idAGENTLogBUS").replaceWith ( Select ( "idAGENTLogBUS", null,
                                                  [ { valeur: false, texte: "No" }, { valeur: true, texte: "Yes" } ], Response.log_bus ) );
       $("#idAGENTLogDLS").replaceWith ( Select ( "idAGENTLogDLS", null,
                                                  [ { valeur: false, texte: "No" }, { valeur: true, texte: "Yes" } ], Response.log_dls ) );
       $("#idAGENTLogLevel").replaceWith ( Select ( "idAGENTLogLevel", null,
                                                    [ { valeur: 7, texte: "Debug" },  { valeur: 6, texte: "Info" },
                                                      { valeur: 5, texte: "Notice" }, { valeur: 4, texte: "Warning" },
                                                      { valeur: 3, texte: "Error" } ], Response.log_level ) );
       $("#idAGENTSaveButton").off("click").click( function () { AGENT_Save( vars[2] ); } );
     }, null );
  }
/******************************************************************************************************************************/
