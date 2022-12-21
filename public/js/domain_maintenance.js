
/************************************ Envoi les infos de compilation **********************************************************/
 function Domain_Compil_all_DLS ()
  {
    Send_to_API ( "POST", "/dls/compil_all", null, function(Response)
     { Show_toast_ok ( "Full Compilation in progress." );
     }, null );

  }
/************************************ Envoi les infos de compilation **********************************************************/
 function Domain_Send_to_Agent ( tag )
  { var json_request = { tag: tag };
    Send_to_API ( "POST", "/agent/send", json_request, function(Response)
     { Show_toast_ok ( tag.toUpperCase() + " Sent to Agents." );
     }, null );
  }
/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  { console.log ("in load domain !");
    $("#idDomainLabel").text( localStorage.getItem("domain_name") );
    $("#idDomainCompilAllButton").off("click").click( function () { Domain_Compil_all_DLS(); } );
    $("#idDomainHorlogeReload")  .off("click").click( function () { Domain_Send_to_Agent( "RELOAD_HORLOGE_TICK" ); } );
    $("#idDomainRemap")          .off("click").click( function () { Domain_Send_to_Agent( "REMAP" ); } );
  }
/******************************************************************************************************************************/
