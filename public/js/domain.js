
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


/*  <div class="card h-100">
    <div class="card-header bg-highlight">
      <div class="row">
        <div class="col-4">
          <i class="fas fa-2x fa-image text-danger"></i>
        </div>
        <div class="col-8 mt-1"><h5>Synoptiques</h5></div>
      </div>
    </div>
    <div class="card-body">
      <ul>
      <li><h6 class="card-text"><span id="idNbrSyns">-</span> Synoptiques</h6></li>
      <li><h6 class="card-text"><span id="idNbrSynsVisuels">-</span> Motifs</h6></li>
      <li><h6 class="card-text"><span id="idNbrSynsLiens">-</span> Liens</h6></li>
      </ul>
      <!--<h3 class="card-text text-center"><strong>56</h3>-->
    </div>
    <!--<p class="card-text text-center"><small class="text-muted">Last updated 3 mins ago</small></p>-->
  </div>
</div>
*/
  }
