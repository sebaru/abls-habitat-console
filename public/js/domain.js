/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Creer_domaine ()
  { console.log ("in load domain !");
    Send_to_API ( 'POST', "/domain/add", null, function (Response)
     { Show_toast_ok ( "Un nouveau domaine est créé" );
       $("#idCardContainer").empty();
       Load_page();
     }, null );
  }
/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  { console.log ("in load domain !");

    let card = $("<div id='idpluscard'>").addClass("card shadow m-1 bg-light");
    let header = $("<h5>").text( "Nouveau" );
    card.append ( $("<div>").addClass("card-header text-center").append(header) );

    let body = $("<img>").css("cursor","pointer").addClass("wtd-img-card")
               .click( function () { Creer_domaine (); } )
               .attr ("src", "https://static.abls-habitat.fr/img/plus_green.svg" );
    card.append ( $("<div>").addClass("card-body text-center").append(body) );

    let footer = $("<button>").addClass("btn btn-primary")
                  .click( function () { Creer_domaine ( element.domain_uuid ); } )
                  .text("Ajouter");
    card.append ( $("<div>").addClass("card-footer text-center").append( footer ) );
    $("#idCardContainer").append(card);

    Send_to_API ( 'POST', "/domain/list", null, function (Response)
     { Response.domains.forEach ( function (element, index)
        { let card = $("<div>").addClass("card shadow m-1 bg-light");

          let header = $("<h5>").html( Badge_Access_level ( element.access_level ) + " " + element.description );
          card.append ( $("<div>").addClass("card-header text-center").append(header) );

          let body = $("<img>").css("cursor","pointer").addClass("wtd-img-card")
                     .click( function () { Changer_domaine ( element.domain_uuid ); } );
          if (element.image) body.attr ("src", element.image );
                        else body.attr ("src", "https://static.abls-habitat.fr/img/syn_accueil.png" );
          card.append ( $("<div>").addClass("card-body text-center").append(body) );

          let footer = $("<button>").addClass("btn btn-primary")
                         .click( function () { Redirect("/domain/"+ element.domain_uuid ); } )
                         .text("Configurer");

          card.append ( $("<div>").addClass("card-footer text-center").append( footer ) );

          card.insertBefore("#idpluscard");
        });
     }, null );
  }
/******************************************************************************************************************************/
 function Changer_domaine ( domain_uuid )
  { localStorage.setItem ( "domain_uuid", domain_uuid );
    Redirect("/");
  }
