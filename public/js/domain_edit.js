
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Domain_Delete ( target_domain_uuid )
  {
    if ($("#idDomainDeleteText").val() != "ok to delete "+target_domain_uuid )
     { $("#idDomainDeleteText").addClass("border border-danger shadow");
       Show_toast_ko ( "Clé de protection invalide. Controlez le champ de suppression." );
       $("#idDomainDeleteText").val("");
       return;
     }

    $("#idSpinnerDelete").show();
    Show_toast_ok ( "Suppression du domaine "+target_domain_uuid+" en cours, veuillez patienter." );
    var json_request =
     { target_domain_uuid: target_domain_uuid,
     };

    Send_to_API ( "DELETE", "/domain/delete", json_request, function(Response)
     { Redirect("/domain");
     }, null );
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Domain_Transfer ( target_domain_uuid )
  { var json_request =
     { target_domain_uuid: target_domain_uuid,
       new_owner_email   : $("#idDomainNewOwnerEmail").val(),
     };

    Send_to_API ( "POST", "/domain/transfer", json_request, function(Response)
     { Load_common();
       Show_toast_ok ( "Transfert effectué." );
     }, null );
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Domain_Change_image ( target_domain_uuid )
  { var reader = new FileReader();
    reader.readAsDataURL($("#idDomainInputFile")[0].files[0]);

    reader.onload = function ()
     { var json_request =
        { target_domain_uuid: target_domain_uuid,
          image             : reader.result
        };

       Send_to_API ( "POST", "/domain/set_image", json_request, function(Response)
        { Load_page();
          Show_toast_ok ( "Image modifiée." );
        }, null );
     };
   reader.onerror = function (error) { Show_toast_ko ( "Erreur : " + error ); };
  }
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
    vars = window.location.pathname.split('/');

    var json_request = { search_domain_uuid: vars[2] };

    Send_to_API ( 'POST', "/domain/get", json_request, function (Response)
     {
       $("#idDomainLabel").text( Response.domain_name );
       $("#idDomainUuid").val( Response.domain_uuid );
       $("#idDomainName").val( Response.domain_name )
                         .prop("disabled", (Response.access_level < 8) );

       $("#idDomainDateCreate").val( Response.date_create );
       $("#idDomainAccessLevel").html( Badge_Access_level ( Response.access_level ) + " - " + Access_level_description[Response.access_level].name );

       $("#idDomainSecret").val( Response.domain_secret );
       $("#idDomainSecret").off("mouseenter").mouseenter( function () { $("#idDomainSecret").prop("type", "text"); }  );
       $("#idDomainSecret").off("mouseleave").mouseleave( function () { $("#idDomainSecret").prop("type", "password"); }  );
       $("#idDomainImage").css( "max-width", "256px" );
       if (Response.image) $("#idDomainImage").attr ("src", Response.image );
                      else $("#idDomainImage").attr ("src", "https://static.abls-habitat.fr/img/syn_accueil.png" );
       if (Response.access_level >= 8) $("#idDomainImage").off("click").click( function () { $("#idDomainInputFile").trigger("click"); });

       $("#idDomainInputFile")        .off("change").change (function () { Domain_Change_image( vars[2] ); } );

       $("#idDomainChangeImageButton").off("click").click( function () { $("#idDomainInputFile").trigger("click"); })
                                      .prop("disabled", (Response.access_level < 8) );
       $("#idDomainSaveButton")       .off("click").click( function () { Domain_Save( vars[2] ); } )
                                      .prop("disabled", (Response.access_level < 8) );
       $("#idDomainNewOwnerEmail")    .prop("disabled", (Response.access_level < 9) );
       $("#idDomainTransferButton")   .off("click").click( function () { Domain_Transfer( vars[2] ); } )
                                      .prop("disabled", (Response.access_level < 9) );
       $("#idDomainDeleteButton")     .off("click").click( function () { Domain_Delete( vars[2] ); } )
                                      .prop("disabled", (Response.access_level < 9) );
       $("#idDomainDeleteText")       .prop("disabled", (Response.access_level < 9) );
     }, null );
  }
/******************************************************************************************************************************/
