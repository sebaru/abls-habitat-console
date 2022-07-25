/******************************************************************************************************************************/
 function User_set ( Response )
  { var json_request =
       { user_uuid   : Response.user_uuid,
         name        : $("#idUserName").val(),
         xmpp        : $("#idUserXmpp").val(),
         phone       : $("#idUserPhone").val(),
         can_send_txt: ($("#idUserCanSendTxt").val()==1 ? true : false),
         wanna_be_notified: ($("#idUserWannaBeNotified").val()==1 ? true : false),
       };
    if (TokenParsed.sub != Response.user_uuid) json_request.access_level = parseInt($("#idUserAccessLevel").val());

    Send_to_API ( 'POST', "/user/set", json_request, function ()
     { Show_toast_ok ( "Utilisateur "+Response.email+" modifié" );
     }, null);
  }
/******************************************************************************************************************************/
 function User_delete ( Response )
  { var json_request = { user_uuid   : Response.user_uuid };

    if ($("#idUserDeleteText").val() != "ok to delete "+Response.user_uuid )
     { $("#idUserDeleteText").addClass("border border-danger shadow");
       Show_toast_ko ( "Clé de protection invalide. Controlez le champ de suppression." );
       $("#idUserDeleteText").val("");
       return;
     }

    $("#idSpinnerDelete").show();

    Send_to_API ( 'DELETE', "/user/delete", json_request, function ()
     { Show_toast_ok ( "Utilisateur "+Response.email+" supprimé" );
       Redirect("/users");
     }, null);
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { console.log ("in load page !");
    vars = window.location.pathname.split('/');
    if (vars[2] == "me") vars[2] = TokenParsed.sub;                                           /* /user/me -> edit my profil ! */

    var json_request = { target_user_uuid: vars[2] };
    Send_to_API ( 'POST', "/user/get", json_request, function (Response)
     { $("#idUserLabel").text( Response.email );
       $("#idUserUUID").val( Response.user_uuid );
       $("#idUserEmail").val( Response.email );
       $("#idUserName").val( Response.username );
       $("#idUserPhone").val( Response.phone );
       $("#idUserXmpp").val( Response.xmpp );
       if (TokenParsed.sub == Response.user_uuid)
          { $("#idUserAccessLevel").html ( Badge_Access_level (Response.access_level) + " - " + Access_level_description[Response.access_level].name ); }
       else $("#idUserAccessLevel").replaceWith ( Select_Access_level ( "idUserAccessLevel", null ) );
       $("#idUserWannaBeNotified").replaceWith ( Select ( "idUserWannaBeNotified", null,
                                                     [ { valeur: "1", texte: "Oui" }, { valeur: "0", texte: "Non" } ], Response.wanna_be_notified ) );
       $("#idUserCanSendTxt").replaceWith ( Select ( "idUserCanSendTxt", null,
                                                     [ { valeur: "1", texte: "Oui" }, { valeur: "0", texte: "Non" } ], Response.can_send_txt ) );
       $("#idUserSaveButton").off("click").click ( function() { User_set(Response); } );
       $("#idUserDeleteButton").off("click").click ( function() { User_delete(Response); } );
     }, null );
  }
