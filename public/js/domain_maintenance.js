
/************************************ Envoi les infos de compilation **********************************************************/
 function Domain_Compil_all_DLS ()
  {
    Send_to_API ( "POST", "/dls/compil_all", null, function(Response)
     { Show_toast_ok ( "Full Compilation in progress." );
     }, null );

  }
/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  { console.log ("in load domain !");
    $("#idDomainCompilAllButton")  .off("click").click( function () { Domain_Compil_all_DLS(); } );
  }
/******************************************************************************************************************************/
