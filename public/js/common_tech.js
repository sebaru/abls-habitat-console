 var ModeArchivage = [ { valeur: 864000, texte: "Tous les jours" },
                       { valeur: 72000,  texte: "Toutes les 2 heures" },
                       { valeur: 36000,  texte: "Toutes les heures" },
                       { valeur: 3000,   texte: "Toutes les 5 minutes" },
                       { valeur: 600,    texte: "Toutes les minutes" },
                       { valeur: 50,     texte: "Toutes les 5 secondes" },
                       { valeur: 0,      texte: "Aucun" },
                     ];

 var myDLSLangageRegex = [ { regex: /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//, token: "comment" }, // Commentaires #
                           { regex: /"(?:[^\\]|\\.)*?"/, token: "string" }, // Chaînes de caractères
                           { regex: "/\b_[A-Z].*/", token: "type" }, // Mots-clés
                           { regex: "#define", token: "def" }, // Mots-clés
                           { regex: "#link", token: "def" }, // Mots-clés
                           { regex: "#param", token: "def" }, // Mots-clés
                           { regex: "<->", token: "operator" }, // Mots-clés
                           { regex: "->", token: "operator" }, // Mots-clés
                           { regex: "-", token: "operator" }, // Mots-clés
                           { regex: "=", token: "operator" }, // Mots-clés
                           { regex: /\d+/, token: "number" }, // Nombres
                           { regex: /[A-Z][A-Za-z0-9_]*/, token: "variable" }, // Variables
                           { regex: /\b_[A-Z]*\b/g, token: "keyword" }, // Variables
                         ];

/********************************************* Reload Process *****************************************************************/
 function Thread_enable ( thread_tech_id, enable, fonction_ok, fonction_nok )
  { var json_request =
     { enable        : enable,
       thread_tech_id: thread_tech_id,
     };

    Send_to_API ( "POST", "/thread/enable", json_request, function(Response)
     { Show_toast_ok ( "Thread "+thread_tech_id+(enable ? " activé" : " désactivé") +".");
       if (fonction_ok) fonction_ok(Response);
     }, fonction_nok );
  }
/********************************************* Reload Process *****************************************************************/
 function Thread_debug ( thread_tech_id, enable, fonction_ok, fonction_nok )
  { var json_request =
     { debug         : enable,
       thread_tech_id: thread_tech_id,
     };

    Send_to_API ( "POST", "/thread/debug", json_request, function(Response)
     { Show_toast_ok ( "Thread "+thread_tech_id+(enable ? " en debug" : " hors debug") +".");
       if (fonction_ok) fonction_ok(Response);
     }, fonction_nok );
  }
 /********************************************* Start Agent ******************************************************************/
 function Agent_start ( agent_tech_id )
  { var json_request = { agent_tech_id: agent_tech_id };
    Send_to_API ( "POST", "/agent/start", json_request,
                  function(Response) { Show_toast_ok ( "Démarrage demandé pour l'agent "+agent_tech_id ); },
                  function(Response) { Show_shell_error ( "Erreur au demarrage de l'agent "+agent_tech_id ); }
                );
  }
 /********************************************* Stop Agent *******************************************************************/
 function Agent_stop ( agent_tech_id, fonction_ok, fonction_nok )
  { var json_request = { agent_tech_id: agent_tech_id };
    Send_to_API ( "POST", "/agent/stop", json_request,
                  function(Response) { Show_toast_ok ( "Arrêt demandé pour l'agent "+agent_tech_id ); },
                  function(Response) { Show_shell_error ( "Erreur à l'arrêt de l'agent "+agent_tech_id ); }
                );
  }
 /********************************************* Restart Agent ****************************************************************/
 function Agent_restart ( agent_tech_id, fonction_ok, fonction_nok )
  { var json_request = { agent_tech_id: agent_tech_id };
    Send_to_API ( "POST", "/agent/restart", json_request,
                  function(Response) { Show_toast_ok ( "Redémarrage demandé pour l'agent "+agent_tech_id ); },
                  function(Response) { Show_shell_error ( "Erreur au redémarrage de l'agent "+agent_tech_id ); }
                );
  }
 /********************************************* Upgrade Agent ****************************************************************/
 function Agent_upgrade ( agent_tech_id, fonction_ok, fonction_nok )
  { var json_request = { agent_tech_id: agent_tech_id };
    Send_to_API ( "POST", "/agent/upgrade", json_request,
                  function(Response) { Show_toast_ok ( "Upgrade demandé pour l'agent "+agent_tech_id ); },
                  function(Response) { Show_shell_error ( "Erreur à l'upgrade de l'agent "+agent_tech_id ); }
                );
  }
 /********************************************* Reload Process *****************************************************************/
 function Agent_set_log_level ( agent_tech_id, log_level )
  { var json_request =
     { agent_tech_id: agent_tech_id,
       log_level    : parseInt(log_level),
     };

    Send_to_API ( "POST", "/agent/log_level", json_request,
      function(Response) { Show_toast_ok ( "Agent "+agent_tech_id+" niveau de log = "+log_level+"." ); },
      function(Response) { Show_shell_error ( "Erreur lors de la modification du niveau de log de l'agent "+agent_tech_id+"." ); } );
  }
/********************************************* Render Log Level selector *****************************************************/
 function Render_log_level_selector ( agent_tech_id, current_level )
  { var current = parseInt(current_level);
    if (isNaN(current) || current < 0 || current > 7) current = 6;

    var options =
      [ { value: 7, label: "LOG_DEBUG" },
        { value: 6, label: "LOG_INFO" },
        { value: 5, label: "LOG_NOTICE" },
        { value: 4, label: "LOG_WARNING" },
        { value: 3, label: "LOG_ERR" },
        { value: 2, label: "LOG_CRIT" },
        { value: 1, label: "LOG_ALERT" },
        { value: 0, label: "LOG_EMERG" }
      ];

    var onChange = "Agent_set_log_level('"+agent_tech_id+"', this.value )";
    var html = "<select class='form-select form-select-sm' onchange=\""+onChange+"\">";
    options.forEach(function(opt)
      { html += "<option value='"+opt.value+"'"+(opt.value === current ? " selected" : "")+">"+opt.label+"</option>";
      });
    html += "</select>";
    return(html);
  }
/********************************************* Thread_Delete ******************************************************************/
 function Thread_delete ( thread_tech_id, fonction_ok, fonction_nok )
  { var json_request = { thread_tech_id: thread_tech_id };
    Send_to_API ( 'DELETE', "/thread/delete", json_request, function(Response)
     { Show_toast_ok ( "Thread "+thread_tech_id+" supprimé.");
       if (fonction_ok) fonction_ok(Response);
     }, fonction_nok );
  }
/********************************************* Supprime un mapping *********************************************************/
 function MAPPING_Unmap ( mapping_id, refresh_callback )
  { Send_to_API ( "DELETE", "/mapping/delete", { mapping_id: parseInt(mapping_id) },
                  (Response) => { Show_toast_ok ("Mapping supprimé.");
                                  if (typeof refresh_callback === 'function') refresh_callback();
                                  else if (typeof refresh_callback === 'string' && window[refresh_callback]) window[refresh_callback]();
                                },
                  (Response) => { Show_shell_error (Response ? Response.message : "Erreur lors de la suppression du mapping."); }
                );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function COMMON_Map ( thread_tech_id, thread_acronyme, tech_id, acronyme )
  { var json_request =
     { thread_tech_id : thread_tech_id,
       thread_acronyme: thread_acronyme,
       tech_id        : tech_id.toUpperCase(),
       acronyme       : acronyme.toUpperCase(),
     };
    Send_to_API ( 'POST', "/mapping/set", json_request, function () { Show_toast_ok("Mapping done.") }, null );
  }
/************************************ Controle de saisie avant envoi **********************************************************/
 function Controle_tech_id ( id_modal, tech_id_initial )
  { FormatPage = RegExp(/^[a-zA-Z0-9_\.]+$/);
    input = $('#'+id_modal+'TechID');

    if ( FormatPage.test(input.val())==false )
     { input.addClass("bg-danger");
       $('#'+id_modal+'Valider').attr("disabled", true);
     }
    else
     { Send_to_API ( "GET", "/mnemos/tech_ids", null, function(Response)
        { tech_id = input.val().toUpperCase();
          if ( Response.tech_ids.map ( function (item) { return(item.tech_id); } ).includes(tech_id) &&
              (tech_id_initial == null || tech_id_initial != tech_id) )
           { input.addClass("bg-danger");
             $('#'+id_modal+'Valider').attr("disabled", true);
           }
          else
           { input.removeClass("bg-danger");
             $('#'+id_modal+'Valider').attr("disabled", false);
           }
        });
     }
  }
/************************************ Controle de saisie avant envoi **********************************************************/
 function Controle_num ( id_modal, id_champ )
  { FormatTag = RegExp(/^[0-9-]+$/);
    input = $('#'+id_modal+id_champ);

    if ( FormatTag.test(input.val())==false )
     { input.addClass("bg-danger");
       $('#'+id_modal+'Valider').attr("disabled", true);
     }
    else
     { input.removeClass("bg-danger");
       $('#'+id_modal+'Valider').attr("disabled", false);
     }
  }
/********************************************* Controle du saisie du modal ****************************************************/
 function Common_Updater_Choix_Acronyme ( ids, classe, def_acronyme )
  {
    if ($('#'+ids+'SelectTechID').val()==null)
     { $('#'+ids+'SelectAcronyme').empty();
       return;
     }

    Send_to_API ( "GET", "/mnemos/validate", "tech_id="+$('#'+ids+'SelectTechID').val().toUpperCase()+"&acronyme=&classe="+classe, function (Response)
     { $('#'+ids+'SelectAcronyme').empty();
       $.each ( Response.acronymes_found, function ( i, item )
        { $('#'+ids+'SelectAcronyme').append("<option value='"+item.acronyme+"'>"+item.acronyme+" - "+htmlEncode(item.libelle)+"</option>"); } );
       if (def_acronyme != null) $('#'+ids+'SelectAcronyme').val( def_acronyme );
     }, null );
  }
/********************************************* Controle du saisie du modal ****************************************************/
 function Common_Updater_Choix_TechID ( ids, classe, def_tech_id, def_acronyme )
  { if (def_tech_id != null) { $('#'+ids+'RechercherTechID').val( '' ); }
    $('#'+ids+'SelectTechID').off("change").on("change", function () { Common_Updater_Choix_Acronyme ( ids, classe, def_acronyme ); } );

    Send_to_API ( "GET", "/mnemos/validate", "tech_id="+$('#'+ids+'RechercherTechID').val().toUpperCase()+"&acronyme=&classe="+classe, function (Response)
     { $('#'+ids+'SelectTechID').empty();
       $.each ( Response.tech_ids_found, function ( i, item )
        { $('#'+ids+'SelectTechID').append("<option value='"+item.tech_id+"'>"+item.tech_id+" - "+htmlEncode(item.name)+"</option>"); } );

       if (def_tech_id != null) $('#'+ids+'SelectTechID').val( def_tech_id );
       Common_Updater_Choix_Acronyme(ids, classe, def_acronyme );

       if ($('#'+ids+'SelectTechID').val() !== null)
        { $('#'+ids+'RechercherTechID').removeClass("border-warning");
          $('#'+ids+'Valider').prop("disabled", false);
        }
       else
        { $('#'+ids+'RechercherTechID').addClass("border-warning");
          $('#'+ids+'Valider').prop("disabled", true);
        }
     }, null );
  }
/*----------------------------------------------------------------------------------------------------------------------------*/

/********************************************* Remplissage d'un select avec la liste des synoptiques ***************************/
 function Fill_syn_select ( id, selected_syn_id )
  { Select_from_api ( id, "/syn/list", null, "synoptiques", "syn_id",
                      function(item) { return ( item.page+" - "+htmlEncode(item.libelle) + " (#" + item.syn_id +")" ); },
                      selected_syn_id || null );
  }
