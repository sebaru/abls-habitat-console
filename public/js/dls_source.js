
 var SourceCode;

 function Go_to_messages ()
  { vars = window.location.pathname.split('/');
    Redirect ( "/messages/"+vars[2] );
  }
 function Go_to_source ()
  { vars = window.location.pathname.split('/');
    Redirect ( "/dls/"+vars[2] );
  }
 function Go_to_dls_run ()
  { vars = window.location.pathname.split('/');
    Redirect ( "/dls/run/"+vars[2] );
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
            if (Response.error_count)   { $("#idErrorLog").addClass("alert-danger"); }                               /* Error */
       else if (Response.warning_count) { $("#idErrorLog").addClass("alert-warning"); }                                 /* OK */
       else $("#idErrorLog").addClass("alert-success").html("No error");
     }, null );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    if (vars[2] == null) Redirect ("/dls");

    SourceCode = CodeMirror.fromTextArea( document.getElementById("idSourceCode"), { lineNumbers: true } );
    SourceCode.setSize( null, "100%");

    Send_to_API ( "GET", "/dls/source", "tech_id="+vars[2], function(Response)
     { $("#idSourceTitle").text( "(#"+Response.dls_id+") - " + Response.tech_id + " - " + Response.shortname);
       $("#idSourceSynoptique").empty().append( $("<a>").attr("href", "/atelier/"+Response.page).attr("target","_blank").text(Response.page) );
       SourceCode.getDoc().setValue(Response.sourcecode);
       $("#idErrorLog").html(Response.errorlog.replace(/(?:\r\n|\r|\n)/g, '<br>'));
            if (Response.error_count)   { $("#idErrorLog").addClass("alert-danger"); }                        /* Error */
       else if (Response.warning_count) { $("#idErrorLog").addClass("alert-warning"); }                          /* OK */
       else $("#idErrorLog").addClass("alert-success").html("No error");
     }, null);
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
