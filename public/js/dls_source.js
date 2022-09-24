
 var SourceCode;

 function Go_to_mnemos ()
  { vars = window.location.pathname.split('/');
    Redirect ( "/tech/mnemos/"+vars[2] );
  }
 function Go_to_source ()
  { vars = window.location.pathname.split('/');
    Redirect ( "/dls/"+vars[2] );
  }
 function Go_to_dls_run ()
  { vars = window.location.pathname.split('/');
    Redirect ( "/tech/dls_run/"+vars[2] );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Compiler ()
  { vars = window.location.pathname.split('/');
    var json_request =
     { tech_id : vars[2],
       sourcecode: SourceCode.getDoc().getValue(),
     };

    if (json_request.sourcecode.length == 0)
     { Show_Error ( "Un plugin vide n'est pas autorisé" );
       return;
     }

    Send_to_API ( "POST", "/dls/compil", json_request, function(Response)
     { $("#idErrorLog").html(Response.errorlog.replace(/(?:\r\n|\r|\n)/g, '<br>'));
       $("#idErrorLog").removeClass("alert-info alert-warning alert-danger alert-success");
            if (Response.compil_status==2) { $("#idErrorLog").addClass("alert-success"); }                              /* OK */
       else if (Response.compil_status==1) { $("#idErrorLog").addClass("alert-warning"); }                         /* Warning */
       else $("#idErrorLog").addClass("alert-danger");
     }, null );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    if (vars[2] == null) Redirect ("/dls");

    SourceCode = CodeMirror.fromTextArea( document.getElementById("idSourceCode"), { lineNumbers: true } );
    SourceCode.setSize( null, "100%");

    var json_request = { tech_id : vars[2] };

    Send_to_API ( "POST", "/dls/source", json_request, function(Response)
     { $("#idSourceTitle").text( "(#"+Response.dls_id+") - " + Response.tech_id + " - " + Response.shortname);
       $("#idSourceSynoptique").text(Response.page);
       SourceCode.getDoc().setValue(Response.sourcecode);
       $("#idErrorLog").html(Response.errorlog.replace(/(?:\r\n|\r|\n)/g, '<br>'));
            if (Response.compil_status==2) { $("#idErrorLog").addClass("alert-success"); }                              /* OK */
       else if (Response.compil_status==1) { $("#idErrorLog").addClass("alert-warning"); }                         /* Warning */
       else $("#idErrorLog").addClass("alert-danger");
     }, null);
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
