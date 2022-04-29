
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Domain_Delete ( target_domain_uuid )
  {
    if ($("#idDomainDeleteText").val() != "ok to delete "+target_domain_uuid )
     { Show_toast_ko ( "Erreur: delete impossible." );
       $("#idDomainDeleteText").val("");
       return;
     }

    var json_request =
     { target_domain_uuid: target_domain_uuid,
     };

    Send_to_API ( "POST", "/domain/delete", json_request, function(Response)
     { Load_common();
       Show_toast_ok ( "Modifications effectuées." );
     }, function ()
     { Show_toast_ko ( "Erreur, suppression impossible." );
     } );
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Domain_Transfer ( target_domain_uuid )
  { var json_request =
     { target_domain_uuid: target_domain_uuid,
       owner             : $("#idDomainOwner").val(),
     };

    Send_to_API ( "POST", "/domain/transfer", json_request, function(Response)
     { Load_common();
       Show_toast_ok ( "Modifications effectuées." );
     }, function ()
     { Show_toast_ko ( "Erreur, transfert impossible." );
     } );
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Domain_Change_image ( target_domain_uuid )
  {

    var reader = new FileReader();
    reader.readAsDataURL($("#idDomainInputFile")[0].files[0]);

    reader.onload = function ()
     { var json_request =
        { target_domain_uuid: target_domain_uuid,
          image             : reader.result
        };

       Send_to_API ( "POST", "/domain/set_image", json_request, function(Response)
        { Load_common();
          Show_toast_ok ( "Image modifiée." );
        }, function ()
        { Show_toast_ko ( "Erreur, image non sauvegardée." );
        } );
     };
   reader.onerror = function (error) { Show_toast_ko ( "Erreur : " + error ); };
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Domain_Save ( target_domain_uuid )
  { var json_request =
       { target_domain_uuid: target_domain_uuid,
         description       : $("#idDomainDescription").val(),
       };

    Send_to_API ( "POST", "/domain/set", json_request, function(Response)
     { Load_common();
       Show_toast_ok ( "Modifications sauvagardées." );
     }, function ()
     { Show_toast_ko ( "Erreur, modifications non sauvegardées" );
     } );
  }
/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  { console.log ("in load domain !");
    vars = window.location.pathname.split('/');

    var json_request = { search_domain_uuid: vars[2] };

    Send_to_API ( 'POST', "/domain/get", json_request, function (Response)
     {
       $("#idDomainLabel").text( Response.description);
       $("#idDomainUuid").val( Response.domain_uuid );
       $("#idDomainDateCreate").val( Response.date_create );
       $("#idDomainOwner").val( Response.owner );
       $("#idDomainSecret").val( Response.domain_secret );
       $("#idDomainSecret").off("mouseenter").mouseenter( function () { $("#idDomainSecret").prop("type", "text"); }  );
       $("#idDomainSecret").off("mouseleave").mouseleave( function () { $("#idDomainSecret").prop("type", "password"); }  );
       $("#idDomainDescription").val( Response.description );
       $("#idDomainImage").css( "max-width", "256px" );
       if (Response.image) $("#idDomainImage").attr ("src", Response.image );
                      else $("#idDomainImage").attr ("src", "https://static.abls-habitat.fr/img/syn_accueil.png" );
       $("#idDomainImage")            .off("click").click( function () { $("#idDomainInputFile").trigger("click"); });
       $("#idDomainInputFile")        .off("change").change (function () { Domain_Change_image( vars[2] ); } );
       $("#idDomainSaveButton")       .off("click").click( function () { Domain_Save( vars[2] ); } );
       $("#idDomainTransferButton")   .off("click").click( function () { Domain_Transfer( vars[2] ); } );
       $("#idDomainDeleteButton")     .off("click").click( function () { Domain_Delete( vars[2] ); } );
       $("#idDomainChangeImageButton").off("click").click( function () { $("#idDomainInputFile").trigger("click"); });
     }, function() { Redirect("/domain"); } );
  }
/******************************************************************************************************************************/
