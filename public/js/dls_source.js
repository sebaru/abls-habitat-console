 var Dls;
 var SourceCode;
 var DlsIAHistory = [];
 var DlsIAErrorlog = "";
 var DlsIAPromptAction = "chat";

 function Go_to_messages ()
  { vars = window.location.pathname.split('/');
    Redirect ( "/messages/"+Dls.tech_id );
  }
 function Go_to_source ()
  { Redirect ( "/dls/"+Dls.tech_id );
  }
 function Go_to_dls_monitor ()
  { Redirect ( "/dls/monitor/"+Dls.tech_id );
  }

 function Dls_IA_append_message ( role, text )
  { var message = document.createElement("div");
    message.className = "mb-2 p-2 rounded " + (role == "user" ? "bg-primary-subtle ms-4" : "bg-light me-4");
    message.textContent = text;
    document.getElementById("idDlsIAConversation").appendChild(message);
    message.scrollIntoView({ block: "nearest" });
    return message;
  }

 function Dls_IA_add_proposal ( message, sourcecode )
  { var details = document.createElement("details");
    details.className = "mt-2";
    var summary = document.createElement("summary");
    summary.textContent = "Voir le source proposé";
    var preview = document.createElement("pre");
    preview.className = "small border rounded p-2 mt-2 overflow-auto";
    preview.style.maxHeight = "240px";
    preview.textContent = sourcecode;
    details.append(summary, preview);
    var apply = document.createElement("button");
    apply.type = "button";
    apply.className = "btn btn-sm btn-outline-success mt-2";
    apply.innerHTML = '<i class="fas fa-check"></i> Appliquer dans l’éditeur';
    apply.addEventListener("click", function ()
     { Show_modal_del ( "Appliquer la proposition IA", "Remplacer le source dans l’éditeur ?", "Cette action reste annulable avec Ctrl-Z. Elle ne compile pas le module.", function ()
        { var doc = SourceCode.getDoc();
         var lastLine = doc.lastLine();
         doc.replaceRange ( sourcecode, CodeMirror.Pos(doc.firstLine(), 0), CodeMirror.Pos(lastLine, doc.getLine(lastLine).length), "+input" );
        } );
     });
    message.append(details, apply);
  }

 function Dls_IA_quick_action ( action )
  { if (action == "explain") Dls_IA_send ( "explain", "Explique le fonctionnement de ce module et ses principaux mnémoniques." );
    if (action == "fix") Dls_IA_send ( "fix", "Corrige les erreurs de compilation récentes en conservant le comportement voulu." );
  }

 function Dls_IA_focus_prompt ()
  { DlsIAPromptAction = "modify";
    document.getElementById("idDlsIAPrompt").placeholder = "Décrivez la modification souhaitée";
    document.getElementById("idDlsIAPrompt").focus();
  }

 function Dls_IA_send ( action, quick_message )
  { if (!Dls || !SourceCode) return;
    if ($("#idDlsIASend").prop("disabled")) return;
    var prompt = quick_message || $("#idDlsIAPrompt").val().trim();
    if (!prompt) return;
    action = action || DlsIAPromptAction;
    DlsIAPromptAction = "chat";
    document.getElementById("idDlsIAPrompt").placeholder = "Posez une question ou décrivez la modification souhaitée";
    Dls_IA_append_message ( "user", prompt );
    if (!quick_message) $("#idDlsIAPrompt").val("");
    var json_request =
     { tech_id: Dls.tech_id,
       action: action,
       message: prompt,
       sourcecode: SourceCode.getDoc().getValue(),
       errorlog: DlsIAErrorlog,
       history: DlsIAHistory.slice(-20),
     };
    $("#idDlsIASend").prop("disabled", true).html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Envoi');
    Send_to_API ( "POST", "/dls/ia/chat", json_request, function(Response)
     { var reply = Response.reply || "Aucune réponse textuelle.";
       var message = Dls_IA_append_message ( "assistant", reply );
       if (Response.sourcecode) Dls_IA_add_proposal ( message, Response.sourcecode );
       DlsIAHistory.push ( { role: "user", content: prompt }, { role: "assistant", content: reply } );
       DlsIAHistory = DlsIAHistory.slice(-20);
       $("#idDlsIASend").prop("disabled", false).html('<i class="fas fa-paper-plane"></i> Envoyer');
     }, function()
     { $("#idDlsIASend").prop("disabled", false).html('<i class="fas fa-paper-plane"></i> Envoyer');
     } );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Dls_Restart ()
  { var json_request =
     { tech_id : Dls.tech_id,
     };

    Send_to_API ( "POST", "/dls/restart", json_request, function(Response)
     { Show_toast_ok ( "DLS "+ Dls.tech_id + " re-starté." ); }, null );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Dls_Compiler_valider ()
  { var json_request =
     { tech_id : Dls.tech_id,
       sourcecode: SourceCode.getDoc().getValue(),
     };
    Dls.nbr_ligne = SourceCode.lineCount();

    Send_to_API ( "POST", "/dls/compil", json_request, function(Response)
     { $("#idErrorLog").html(Response.errorlog.replace(/(?:\r\n|\r|\n)/g, '<br>'));
       DlsIAErrorlog = Response.errorlog || "";
       $("#idErrorLog").removeClass("alert-info alert-warning alert-danger alert-success");
            if (Response.error_count)   { $("#idErrorLog").addClass("alert-danger"); }                               /* Error */
       else if (Response.warning_count) { $("#idErrorLog").addClass("alert-warning"); }                                 /* OK */
       else { $("#idErrorLog").addClass("alert-success").html("No error"); }
     }, null );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Dls_Compiler ()
  { if (SourceCode.getDoc().getValue().length == 0)
     { Show_Error ( "Un plugin vide n'est pas autorisé" );
       return;
     }

    if (Dls.nbr_ligne <= 50) { Dls_Compiler_valider (); return; }
    var min = Dls.nbr_ligne * 0.8;
    var max = Dls.nbr_ligne * 1.2;
    if (SourceCode.lineCount() < min || SourceCode.lineCount() > max)
     { Show_modal_del ( "Confirmation de compilation",
                        "Beaucoup de lignes ont été modifiées. Etes-vous sûr d'appliquer ces changements ?",
                        "Nombre de lignes avant édition: "+ Dls.nbr_ligne +". Après édition: " + SourceCode.lineCount() + ".",
                        function () { Dls_Compiler_valider(); } );
       return;
     }
    else Dls_Compiler_valider ();
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    if (vars[2] == null) Redirect ("/dls");

    CodeMirror.defineSimpleMode("myDLSLangage", { start: myDLSLangageRegex });
    SourceCode = CodeMirror.fromTextArea( document.getElementById("idSourceCode"),
                                          { mode: "myDLSLangage", lineNumbers: true, theme: "material" }
                                        );
    SourceCode.setSize( null, "100%");
    $("#idDlsIAPrompt").off("keydown").on("keydown", function(event)
     { if (event.key == "Enter" && (event.ctrlKey || event.metaKey)) Dls_IA_send(); });

    Send_to_API ( "GET", "/dls/source", "tech_id="+vars[2], function(Response)
     { Set_page_context ( "Edition D.L.S (#"+Response.dls_id+") - " + Response.tech_id + " - " + Response.shortname );
       $("#idSourceSynoptique").empty().append( $("<a>").attr("href", "/atelier/"+Response.page).attr("target","_blank").text(Response.page) );
       SourceCode.getDoc().setValue(Response.sourcecode);
      DlsIAErrorlog = Response.errorlog || "";
       $("#idErrorLog").html(Response.errorlog.replace(/(?:\r\n|\r|\n)/g, '<br>'));
            if (Response.error_count)   { $("#idErrorLog").addClass("alert-danger"); }                        /* Error */
       else if (Response.warning_count) { $("#idErrorLog").addClass("alert-warning"); }                          /* OK */
       else $("#idErrorLog").addClass("alert-success").html("No error");
       Dls = Response; /* Sauvegarde de la reponse */
     }, null);
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
