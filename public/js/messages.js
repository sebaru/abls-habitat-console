/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');

    Send_to_API ( "GET", "/messages", (vars[2] ? "tech_id="+vars[2] : null), function(Response)
     { /*$("#idSourceTitle").text( "(#"+Response.dls_id+") - " + Response.tech_id + " - " + Response.shortname);
       $("#idSourceSynoptique").text(Response.page);
       SourceCode.getDoc().setValue(Response.sourcecode);
       $("#idErrorLog").html(Response.errorlog.replace(/(?:\r\n|\r|\n)/g, '<br>'));
            if (Response.error_count)   { $("#idErrorLog").addClass("alert-danger"); }                        /* Error */
      /* else if (Response.warning_count) { $("#idErrorLog").addClass("alert-warning"); }                          /* OK */
      /* else $("#idErrorLog").addClass("alert-success").html("No error");*/
     }, null);
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
