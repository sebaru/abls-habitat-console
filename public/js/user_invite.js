
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Domain_Save ( target_domain_uuid )
  { var json_request =
       { target_domain_uuid: target_domain_uuid,
         domain_name       : $("#idDomainName").val(),
       };

    Send_to_API ( "POST", "/domain/set", json_request, function(Response)
     { Load_page();
       Show_toast_ok ( "Modifications sauvegardées." );
     }, null );

  }
/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  { console.log ("in load domain !");

    $("#idDomainLabel").text( localStorage.getItem ("domain_name" ) );
    $("#idUserInviteAccessLevel").replaceWith ( Select_Access_level ( "idUserInviteAccessLevel", null ) );
  }
/******************************************************************************************************************************/
