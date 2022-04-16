 document.addEventListener('DOMContentLoaded', Load_page, false);

 function Load_page ( )
  { var token = localStorage.getItem("token");
    if (token !== null) Redirect ( "/" );
    else
     { $('#idLoginContainer').fadeIn("slow");
       $('#appareil').focus();
       $('#appareil').on("change", function () { $('#login').focus(); } );
       $('#login').on("change", function () { $('#password').focus(); } );
       $('#password').keypress( function(event)
        { var keycode = (event.keyCode ? event.keyCode : event.which);
          if(keycode == '13') { Send_credential(); }
        });
     }
  }
/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Send_credential ()
  { var appareil = localStorage.getItem ( "appareil" );
    if (appareil == null) appareil = "New Device";

    var json_request = JSON.stringify(
     { login : $('#login').val(),
       appareil : $('#appareil').val(),
       password : $('#password').val(),
       useragent : window.navigator.userAgent
     });

    Send_to_API ( 'POST', "/user/register", json_request, function (Response)
     { localStorage.setItem("login",        Response.login );
       localStorage.setItem("appareil",     Response.appareil );
       localStorage.setItem("access_level", Response.access_level );
       localStorage.setItem("token",        Response.token );
       window.location.replace("/");
     }, function() { $("#idLabel").text ( "Une erreur s'est produite."); } );
  }
