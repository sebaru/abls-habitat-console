 var ModeArchivage = [ { valeur: 0, texte: "Aucun" },
                       { valeur: 1, texte: "Un pour 5 secondes" },
                       { valeur: 2, texte: "Un par minute" },
                       { valeur: 3, texte: "Un par heure" },
                       { valeur: 4, texte: "Un par jour" },
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
/********************************************* Thread_Delete ******************************************************************/
 function Thread_delete ( thread_tech_id, fonction_ok, fonction_nok )
  { var json_request = { thread_tech_id: thread_tech_id };
    Send_to_API ( 'DELETE', "/thread/delete", json_request, function(Response)
     { Show_toast_ok ( "Thread "+thread_tech_id+" supprimé.");
       if (fonction_ok) fonction_ok(Response);
     }, fonction_nok );
  }
/********************************************* Renvoi un Select d'archivage ***************************************************/
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
       Popover_show ( input, 'Caractères autorisés', 'lettres, chiffres, _ et .' );
     }
    else
     { Send_to_API ( "GET", "/mnemos/tech_ids", null, function(Response)
        { tech_id = input.val().toUpperCase();
          if ( Response.tech_ids.map ( function (item) { return(item.tech_id); } ).includes(tech_id) &&
              (tech_id_initial == null || tech_id_initial != tech_id) )
           { input.addClass("bg-danger");
             $('#'+id_modal+'Valider').attr("disabled", true);
             Popover_show ( input, 'Erreur !', 'Ce tech_id est déjà pris' );
           }
          else
           { input.removeClass("bg-danger");
             $('#'+id_modal+'Valider').attr("disabled", false);
             Popover_hide(input);
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
       Popover_show ( input, 'Attention', 'Ce champ doit être numérique' );
     }
    else
     { input.removeClass("bg-danger");
       $('#'+id_modal+'Valider').attr("disabled", false);
       Popover_hide(input);
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
