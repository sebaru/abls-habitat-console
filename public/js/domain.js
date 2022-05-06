
/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  { console.log ("in load domain !");

    let card = $("<div id='idpluscard'>").addClass("card shadow m-1 bg-light");
    let header = $("<h4>").text( "Nouveau" );
    card.append ( $("<div>").addClass("card-header text-center").append(header) );

    let body = $("<img>").css("cursor","pointer").addClass("wtd-img-card")
               .click( function () { Creer_domaine ( element.domain_uuid ); } )
               .attr ("src", "https://static.abls-habitat.fr/img/plus_green.svg" );
    card.append ( $("<div>").addClass("card-body text-center").append(body) );

    let footer = $("<button>").addClass("btn btn-primary")
                  .click( function () { Creer_domaine ( element.domain_uuid ); } )
                  .text("Ajouter");
    card.append ( $("<div>").addClass("card-footer text-center").append( footer ) );
    $("#idCardContainer").append(card);

    Token.grants.forEach ( function (element, index)
     { console.debug ( element );

       var json_request = { search_domain_uuid: element.domain_uuid };
       Send_to_API ( 'POST', "/domain/image", json_request, function (Response)
        { let card = $("<div>").addClass("card shadow m-1 bg-light");

          let header = $("<h4>").text( element.description );
          card.append ( $("<div>").addClass("card-header text-center").append(header) );

          let body = $("<img>").css("cursor","pointer").addClass("wtd-img-card")
                     .click( function () { Changer_domaine ( element.domain_uuid ); } );
          if (Response.image) body.attr ("src", Response.image );
                         else body.attr ("src", "https://static.abls-habitat.fr/img/syn_accueil.png" );
          card.append ( $("<div>").addClass("card-body text-center").append(body) );

          let footer = $("<button>").addClass("btn btn-primary")
                         .click( function () { Redirect("/domain/"+ element.domain_uuid ); } )
                         .text("Configurer");

          card.append ( $("<div>").addClass("card-footer text-center").append( footer ) );

          card.insertBefore("#idpluscard");
        });
     });

  }
/******************************************************************************************************************************/
 function Changer_domaine ( domain_uuid )
  { localStorage.setItem ( "domain_uuid", domain_uuid );
    Redirect("/");
  }
