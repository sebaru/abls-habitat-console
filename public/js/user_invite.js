
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Inviter (  )
  { var json_request =
       { friend_email: $("#idUserInviteEmail").val(),
         friend_level: parseInt($("#idUserInviteAccessLevel").val()),
       };

    Send_to_API ( "POST", "/user/invite", json_request, function(Response)
     { Show_toast_ok ( json_request.friend_email + " a été invité." );
     }, null );

  }
/********************************************* Chargement du synoptique 1 au démarrage ****************************************/
 function Load_page ()
  { console.log ("in load domain !");

    $("#idDomainLabel").text( localStorage.getItem ("domain_name") );
    $("#idUserInviteAccessLevel").replaceWith ( Select_Access_level ( "idUserInviteAccessLevel", null ) );
    $("#idUserInviteValider").off("click").on("click", function () { Inviter(); } );
  }
/******************************************************************************************************************************/
