 function Load_login ( )
  { if (localStorage.getItem("token") !== null) { Redirect ( "/" ); return; }

    $('#idLoginContainer').fadeIn("slow");
    $('#appareil').val( localStorage.getItem ( "appareil" ) ).focus();
    $('#appareil').on("change", function () { $('#login').focus(); } );
    $('#login').on("change", function () { $('#password').focus(); } );
    $('#password').keypress( function(event)
     { var keycode = (event.keyCode ? event.keyCode : event.which);
       if(keycode == '13') { Send_credential(); }
     });
  }
/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Send_credential ()
  { var appareil = localStorage.getItem ( "appareil" );
    if (appareil == null) appareil = "New Device";

    var json_request =
     { login : $('#login').val(),
       appareil : $('#appareil').val(),
       password : $('#password').val(),
       useragent : window.navigator.userAgent
     };

    localStorage.setItem ( "appareil", json_request.appareil );

    Send_to_API ( 'POST', "/user/register", json_request, function (Response)
     { localStorage.setItem("token",              Response.token );                       /* Sauvegarde pour les autres pages */
       Token = JSON.parse(atob(Response.token.split(".")[1]));
       localStorage.setItem("domain_uuid", Token.default_domain_uuid ); /* Positionne les parametres domain par défaut */
       localStorage.setItem("domain_name", Token.default_domain_name );
       Redirect("/dashboard");
     }, function() { $("#idLabel").text ( "Une erreur s'est produite."); } );
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
