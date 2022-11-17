/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Creer_domaine ()
  { console.log ("in load domain !");
    $("#idSpinnerCreate").show();
    Show_toast_ok ( "Création d'un domaine en cours, veuillez patienter." );
    Send_to_API ( 'POST', "/domain/add", null, function (Response)
     { Show_toast_ok ( "Un nouveau domaine est créé" );
       $("#idCardContainer").empty();
       Changer_domaine ( Response );
       Load_page();
     }, null );
  }
/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  { if ( localStorage.getItem("domain_uuid") == null ) $("#idAlertNoDomain").slideDown("slow");
                                                 else  $("#idAlertNoDomain").slideUp("slow");

    let card = $("<div id='idpluscard'>").addClass("card shadow m-1 bg-light");
    let header = $("<h5>").text( "Nouveau" );
    card.append ( $("<div>").addClass("card-header text-center").append(header) );

    let body = $("<img>").css("cursor","pointer").addClass("wtd-img-card")
               .click( function () { Creer_domaine (); } )
               .attr ("src", "https://static.abls-habitat.fr/img/plus_green.svg" );
    card.append ( $("<div>").addClass("card-body text-center").append(body) );

    let footer = $("<button>").addClass("btn btn-primary")
                  .click( function () { Creer_domaine (); } )
                  .append ( $("<span>").addClass("spinner-border spinner-border-sm").css("display", "none").attr("id", "idSpinnerCreate"))
                  .append (" Ajouter");
    card.append ( $("<div>").addClass("card-footer text-center").append( footer ) );
    $("#idCardContainer").append(card);

    Send_to_API ( "GET", "/domain/list", null, function (Response)
     { Response.domains.forEach ( function (element, index)
        { let card = $("<div>").addClass("card shadow m-1 bg-light");

          let header = $("<h5>").html( Badge_Access_level ( element.access_level ) + " " + element.domain_name );
          card.append ( $("<div>").addClass("card-header text-center").append(header) );

          let body = $("<img>").css("cursor","pointer").addClass("wtd-img-card")
                     .click( function () { Changer_domaine ( element ); Redirect("/"); } );
          if (element.image) body.attr ("src", element.image );
                        else body.attr ("src", "https://static.abls-habitat.fr/img/syn_accueil.png" );
          card.append ( $("<div>").addClass("card-body text-center").append(body) );

          if (localStorage.getItem("domain_uuid") != null)
           { let footer = $("<button>").addClass("btn btn-primary")
                                       .click( function () { Redirect("/domain/"+ element.domain_uuid ); } )
                                       .text("Configurer");
             card.append ( $("<div>").addClass("card-footer text-center").append( footer ) );
           }

          card.insertBefore("#idpluscard");
        });
     }, null );
  }
/******************************************************************************************************************************/
 function Changer_domaine ( element )
  { console.log("Demande de changement de domaine : " + element.domain_uuid );
    localStorage.setItem ( "domain_uuid", element.domain_uuid );
    localStorage.setItem ( "domain_name", element.domain_name );
    element.target_domain_uuid = element.domain_uuid;
    Send_to_API ( 'POST', "/user/set_domain", element, function (Response)
     {
     }, null );

  }
