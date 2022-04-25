
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
       $("#idDomainDescription").val( Response.description );
       if (Response.image) $("#idDomainImage").attr ("src", "data:image/png;base64," + Response.image );
                      else $("#idDomainImage").attr ("src", "https://static.abls-habitat.fr/img/syn_accueil.png" );

     });
  }
/******************************************************************************************************************************/
