/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  {
    Send_to_API ( 'GET', "/domain/get", "domain_uuid="+localStorage.getItem("domain_uuid"), function (Response)
     {
       $("#idAGENTLink").text( "sudo Watchdogd --link"+
                               " --api-url " + window.location.protocol + "//" + window.location.host +
                               " --domain-uuid " + localStorage.getItem("domain_uuid") +
                               " --domain-secret " + Response.domain_secret
                               );
     }, null );
  }
/******************************************************************************************************************************/
