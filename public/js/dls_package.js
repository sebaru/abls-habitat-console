
 var Package;
 var SourceCode;

/********************************************* Appelé au chargement de la page ************************************************/
 function Dls_Pkg_Save ()
  { vars = window.location.pathname.split('/');
    var json_request =
     { dls_package_id : Package.dls_package_id,
       sourcecode     : SourceCode.getDoc().getValue(),
     };

    if (json_request.sourcecode.length == 0)
     { Show_Error ( "Un package vide n'est pas autorisé" );
       return;
     }

    Send_to_API ( "POST", "/dls/package/save", json_request, function(Response)
     { Show_toast_ok ( "Modifications sauvegardées." );
     }, null );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    if (vars[3] == null) Redirect ("/dls/packages");
    Name = vars[3];

    SourceCode = CodeMirror.fromTextArea( document.getElementById("idSourceCode"), { lineNumbers: true } );
    SourceCode.setSize( null, "100%");

    Send_to_API ( "GET", "/dls/package/source", "name="+Name, function(Response)
     { Package = Response;
       $("#idSourceTitle").text( "(#"+Package.dls_package_id+") - " + Package.name + " - " + Package.description);
       SourceCode.getDoc().setValue(Package.sourcecode);
     }, null);
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
