
/************************************ Envoi les infos de compilation **********************************************************/
 function Domain_Compil_all_DLS ()
  {
    Send_to_API ( "POST", "/dls/compil_all", null, function(Response)
     { Show_toast_ok ( "Full Compilation in progress." );
     }, null );
  }
/************************************ Vide le tampon des visuels **************************************************************/
 function Domain_Clear_Visuels ()
  {
    Send_to_API ( "DELETE", "/visuels/delete", null, function(Response)
     { Show_toast_ok ( "Visuels deleted." );
     }, null );
  }
/************************************ Envoi un tag aux agents *****************************************************************/
 function Domain_Send_to_Agent ( tag )
  { var json_request = { tag: tag };
    Send_to_API ( "POST", "/agent/send", json_request, function(Response)
     { Show_toast_ok ( tag.toUpperCase() + " Sent to Agents." );
     }, null );
  }
/************************************ Vide le tampon des visuels **************************************************************/
 function Domain_User_Notif ()
  { var json_request = { notif: $("#idDomainUserNotif").val() }
    Send_to_API ( "POST", "/domain/set_notif", json_request, function(Response)
     { Show_toast_ok ( "Notif saved." );
     }, null );
  }
/************************************ Vide le tampon des visuels **************************************************************/
 function Api_Reload_Icons ()
  { Send_to_API ( "POST", "/api/reload_icons", null, function(Response)
     { Show_toast_ok ( "Icons reloaded." );
     }, null );
  }
/************************************ Envoi les infos de modifications d'un bit interne ***************************************/
 function Domain_Rename_DLS_bit ( )
  { var json_request =
       { tech_id      : $("#idDomainDLSRenameBITTechID").val().toUpperCase(),
         old_acronyme : $("#idDomainDLSRenameBITAcronymeOLD").val().toUpperCase(),
         new_acronyme : $("#idDomainDLSRenameBITAcronymeNEW").val().toUpperCase(),
       };

    Send_to_API ( "POST", "/dls/rename/bit", json_request, function(Response)
     { Show_toast_ok("Bit "+json_request.tech_id+":"+json_request.old_acronyme+" renommé en " +
                            json_request.tech_id+":"+json_request.new_acronyme );
     });
  }
/************************************ Envoi les infos de modifications d'un bit interne ***************************************/
 function Domain_Rename_DLS ( )
  { var json_request =
       { old_tech_id: $("#idDomainDLSRenameDLSTechIDOLD").val().toUpperCase(),
         new_tech_id: $("#idDomainDLSRenameDLSTechIDNEW").val().toUpperCase(),
       };

    Send_to_API ( "POST", "/dls/rename", json_request, function(Response)
     { Show_toast_ok("DLS "+json_request.old_tech_id+" renommé en " + json_request.new_tech_id );
     });
  }
/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  { console.log ("in load domain !");
    $("#idDomainLabel").text( localStorage.getItem("domain_name") );
    $("#idDomainDLSRenameDLSButton").off("click").click( function () { Domain_Rename_DLS(); } );
    $("#idDomainDLSRenameBITButton").off("click").click( function () { Domain_Rename_DLS_bit(); } );
    $("#idDomainCompilAllButton").off("click").click( function () { Domain_Compil_all_DLS(); } );
    $("#idDomainRemap")          .off("click").click( function () { Domain_Send_to_Agent( "REMAP" ); } );
    $("#idDomainHorlogeReload")  .off("click").click( function () { Domain_Send_to_Agent( "RELOAD_HORLOGE_TICK" ); } );
    $("#idDomainHorlogeClearVisuel").off("click").click( function () { Domain_Clear_Visuels(); } );
    $("#idDomainUserNotifSend")  .off("click").click( function () { Domain_User_Notif(); } );
    $("#idApiReloadIcons").off("click").click( function () { Api_Reload_Icons(); } );
  }
/******************************************************************************************************************************/
