
 var Package;
 var SourceCode;
/********************************************* Appelé lors du clic sur compil all package *************************************/
 function Dls_Pkg_Compil ()
  { var json_request =
     { dls_package_id : Package.dls_package_id,
     };

    Send_to_API ( "POST", "/dls/compil_all", json_request, function(Response)
     { Show_toast_ok ( "Compilations en cours." );
     }, null );
  }
/********************************************* Appelé lors du clic sur Save ***************************************************/
 function Dls_Pkg_Save ()
  { var json_request =
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
