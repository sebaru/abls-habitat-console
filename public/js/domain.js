
/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  { console.log ("in load domain !");

    Token.grants.forEach ( function (element, index)
     { console.debug ( element );

       var json_request = { search_domain_uuid: element.domain_uuid };
       Send_to_API ( 'POST', "/domain/image", json_request, function (Response)
        { let card = $("<div>").addClass("card shadow m-1 bg-light");

          let header = $("<h4>")
                       .click( function () { Changer_domaine ( element.domain_uuid ); } )
                       .text( element.description );
          card.append ( $("<div>").addClass("card-header text-center").append(header) );

          let body = $("<img>").css("cursor","pointer")
                     .click( function () { Changer_domaine ( element.domain_uuid ); } );
          if (Response.image) body.attr ("src", "data:image/png;base64," + Response.image );
                         else body.attr ("src", "https://static.abls-habitat.fr/img/syn_accueil.png" );
          card.append ( $("<div>").addClass("card-body text-center").append(body) );

          let footer = $("<button>").addClass("btn btn-primary")
                       .click( function () { Changer_domaine ( element.domain_uuid ); } )
                       .text("Sélectionner");
          card.append ( $("<div>").addClass("card-footer text-center").append(footer) );

          $("#idCardContainer").append(card);
        });
     });
  }
/******************************************************************************************************************************/
 function Changer_domaine ( domain_uuid )
  { localStorage.setItem ( "domain_uuid", domain_uuid );
    Load_common();
  }
