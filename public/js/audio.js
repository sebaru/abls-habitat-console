/************************************ Demande de refresh **********************************************************************/
 function AUDIO_Refresh ( )
  { $('#idTableAUDIO').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function AUDIO_Disable (audio_id)
  { $("#idButtonSpinner_"+audio_id).show();
    selection = $('#idTableAUDIO').DataTable().row("#"+audio_id).data();
    Thread_enable ( selection.thread_tech_id, false, function(Response) { AUDIO_Refresh(); }, function(Response) { AUDIO_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function AUDIO_Enable (audio_id)
  { $("#idButtonSpinner_"+audio_id).show();
    selection = $('#idTableAUDIO').DataTable().row("#"+audio_id).data();
    Thread_enable ( selection.thread_tech_id, true, function(Response) { AUDIO_Refresh(); }, function(Response) { AUDIO_Refresh(); } );
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AUDIO_Set ( selection )
  { var json_request =
     { agent_uuid     : $('#idTargetAgent').val(),
       thread_tech_id : $('#idAUDIOTechID').val().toUpperCase(),
       language       : $('#idAUDIOLanguage').val(),
       device         : $('#idAUDIODevice').val(),
       description    : $('#idAUDIODescription').val(),
     };

    if (json_request.language.length==0) json_request.language = "fr";
    if (json_request.device.length==0)   json_request.device   = "default";

    Send_to_API ( "POST", "/audio/set", json_request, function(Response)
     { Show_toast_ok ( "Modification sauvegardée.");
       AUDIO_Refresh();
     }, function(Response) { AUDIO_Refresh(); } );
  }
/************************************ Demande l'envoi d'un SMS de test ********************************************************/
 function AUDIO_Test ( audio_id )
  { selection = $('#idTableAUDIO').DataTable().row("#"+audio_id).data();
    var json_request =
     { thread_tech_id: selection.thread_tech_id,
       tag : "test"
     };
    Send_to_API ( 'POST', "/thread/send", json_request, null );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function AUDIO_Edit ( audio_id )
  { selection = $('#idTableAUDIO').DataTable().row("#"+audio_id).data();
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, selection.agent_uuid );
    $('#idAUDIOTitre').text("Editer la connexion Audio " + selection.thread_tech_id);
    $('#idAUDIOTechID').prop ("disabled", true).val( selection.thread_tech_id );
    $('#idAUDIOLanguage').val( selection.language );
    $('#idAUDIODevice').val( selection.device );
    $('#idAUDIODescription').val( selection.description );
    $('#idAUDIOValider').off("click").on( "click", function () { AUDIO_Set(selection); } );
    $('#idAUDIOEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function AUDIO_Add ( )
  { $('#idAUDIOTitre').text("Ajouter une zone AUDIO");
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, null );
    $('#idAUDIOTechID').val("").prop ("disabled", false).val("").off("input").on("input", function () { Controle_tech_id( "idAUDIO", null ); } );
    $('#idAUDIOLanguage').val( "" );
    $('#idAUDIODevice').val( "" );
    $('#idAUDIODescription').val( "" );
    $('#idAUDIOValider').off("click").on( "click", function () { AUDIO_Set(null); } );
    $('#idAUDIOEdit').modal("show");
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function AUDIO_Del_Valider ( selection )
  { var json_request = { agent_uuid : selection.agent_uuid, thread_tech_id: selection.thread_tech_id };
    Send_to_API ( 'DELETE', "/thread/delete", json_request, function(Response)
     { Show_toast_ok ( "Zone de diffusion supprimée.");
       AUDIO_Refresh();
     }, function(Response) { AUDIO_Refresh(); } );
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function AUDIO_Del ( audio_id )
  { selection = $('#idTableAUDIO').DataTable().row("#"+audio_id).data();
    Show_modal_del ( "Supprimer la zone de diffusion "+selection.thread_tech_id,
                     "Etes-vous sûr de vouloir supprimer cette zone de diffusion ?",
                     selection.thread_tech_id + " - "+selection.description,
                     function () { AUDIO_Del_Valider( selection ) } ) ;
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableAUDIO').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/thread/list", type : "GET", dataSrc: "audio", contentType: "application/json",
               data: function() { return ( "classe=audio" ); },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "audio_id",
       columns:
         [ { "data": null, "title":"Agent", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.agent_hostname) ); }
           },
           { "data": null, "title":"Enabled", "className": "align-middle text-center",
             "render": function (item)
              { if (item.enable==true)
                 { return( Bouton ( "success", "Désactiver la zone de diffusion",
                                    "AUDIO_Disable", item.audio_id, "Actif" ) );
                 }
                else
                 { return( Bouton ( "outline-secondary", "Activer la zone de diffusion",
                                    "AUDIO_Enable", item.audio_id, "Désactivé" ) );
                 }
              },
           },
           { "data": null, "title":"Tech_id", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
           },
           { "data": null, "title":"Description", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.description) ); }
           },
           { "data": null, "title":"Language", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.language) ); }
           },
           { "data": null, "title":"Device", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.device) ); }
           },
           { "data": null, "title":"Last Comm", "className": "align-middle text-center",
             "render": function (item)
               { if (item.last_comm==null) return( Badge( "info", "Thread à l'arret", "Stopped" ) );
                 return( htmlEncode ( item.last_comm ) );
               },
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "primary", "Editer la zone de diffusion", "AUDIO_Edit", item.audio_id, "pen", null );
                 boutons += Bouton_actions_add ( "outline-primary", "Tester la diffusion", "AUDIO_Test", item.audio_id, "question", null );
                 boutons += Bouton_actions_add ( "danger", "Supprimer la zone", "AUDIO_Del", item.audio_id, "trash", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
       responsive: true,
     });

  }
/*----------------------------------------------------------------------------------------------------------------------------*/
