 var Dls;
 var SourceCode;

 function Go_to_messages ()
  { vars = window.location.pathname.split('/');
    Redirect ( "/messages/"+Dls.tech_id );
  }
 function Go_to_source ()
  { Redirect ( "/dls/"+Dls.tech_id );
  }
 function Go_to_dls_run ()
  { Redirect ( "/dls/run/"+Dls.tech_id );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Compiler_valider ()
  { var json_request =
     { tech_id : Dls.tech_id,
       sourcecode: SourceCode.getDoc().getValue(),
     };
    Dls.nbr_ligne = SourceCode.lineCount();

    Send_to_API ( "POST", "/dls/compil", json_request, function(Response)
     { $("#idErrorLog").html(Response.errorlog.replace(/(?:\r\n|\r|\n)/g, '<br>'));
       $("#idErrorLog").removeClass("alert-info alert-warning alert-danger alert-success");
            if (Response.error_count)   { $("#idErrorLog").addClass("alert-danger"); }                               /* Error */
       else if (Response.warning_count) { $("#idErrorLog").addClass("alert-warning"); }                                 /* OK */
       else $("#idErrorLog").addClass("alert-success").html("No error");
     }, null );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Compiler ()
  { if (SourceCode.getDoc().getValue().length == 0)
     { Show_Error ( "Un plugin vide n'est pas autorisé" );
       return;
     }

    if (Dls.nbr_ligne <= 50) { Compiler_valider (); return; }
    var min = Dls.nbr_ligne * 0.8;
    var max = Dls.nbr_ligne * 1.2;
    if (SourceCode.lineCount() < min || SourceCode.lineCount() > max)
     { Show_modal_del ( "Confirmation de compilation",
                        "Beaucoup de lignes ont été modifiées. Etes-vous sûr d'appliquer ces changements ?",
                        "Nombre de lignes avant édition: "+ Dls.nbr_ligne +". Après édition: " + SourceCode.lineCount() + ".",
                        function () { Compiler_valider(); } );
       return;
     }
    else Compiler_valider ();
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
       Dls = Response; /* Sauvegarde de la reponse */
     }, null);
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
