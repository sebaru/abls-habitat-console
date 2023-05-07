/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  {
    Send_to_API ( 'GET', "/domain/get", "domain_uuid="+localStorage.getItem("domain_uuid"), function (Response)
     {
       $("#idAGENTLinkNatif").text( "sudo Watchdogd --link"+
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
                                     "--device /dev/serial/ "+
                                     "docker.io/sebaru/abls-agent:latest "
                                  );
     }, null );
  }
/******************************************************************************************************************************/
