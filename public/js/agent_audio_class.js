/************************************ Demande de refresh **********************************************************************/
 function AUDIO_Refresh ( )
  { $('#idTableAUDIO').DataTable().ajax.reload(null, false);
  }
/********************************************* Activation du thread audio *****************************************************/
 function AUDIO_Toggle ( agent_tech_id, newState, toggle )
  { toggle.prop('disabled', true);
    Send_to_API ( "POST", "/agent/enable", { agent_tech_id: agent_tech_id, enable: newState },
                  function(Response)
                   { Show_toast_ok ( "Agent audio " + (newState ? "activé." : "désactivé.") );
                     toggle.prop('disabled', false);
                     AUDIO_Refresh();
                   },
                  function(Response)
                   { toggle.prop('checked', !newState).prop('disabled', false);
                     Show_shell_error ( "Erreur lors de la modification de l'agent audio." );
                   } );
  }
/**************************************** Edition de la configuration du thread audio ****************************************/
 function AUDIO_Edit ( agent_tech_id )
  { var audio = $('#idTableAUDIO').DataTable().row("#"+agent_tech_id).data();
    if (!audio) { Show_shell_error ( "Aucune configuration audio pour '"+agent_tech_id+"'." ); return; }

    $('#idAUDIOEditTitre').text( "Editer la configuration audio " + agent_tech_id );
    Select_from_api ( "idTargetServer", "/servers/list", null, "servers", "server_uuid", function (Response)
                        { return ( Response.agent_tech_id ); }, audio.server_uuid );
    $('#idAUDIODescription').val( audio.description );
    $('#idAUDIOLanguage').val( audio.language );
    $('#idAUDIODevice').val( audio.device );
    $('#idAUDIOVolume').val( audio.volume );
    $('#idAUDIOValider').off("click").on( "click", function ()
     { var json_request =
        { server_uuid   : $('#idTargetServer').val(),
          agent_tech_id : audio.agent_tech_id,
          language      : $('#idAUDIOLanguage').val(),
          device        : $('#idAUDIODevice').val(),
          volume        : parseInt($('#idAUDIOVolume').val()),
          description   : $('#idAUDIODescription').val(),
        };
       if (json_request.language.length==0) json_request.language = "fr";
       if (json_request.device.length==0)   json_request.device   = "default";

       $('#idAUDIOEdit').modal("hide");
       Send_to_API ( "POST", "/audio/set", json_request,
                     function(Response)
                      { Show_toast_ok ( "Modifications sauvegardées." );
                        AUDIO_Refresh();
                      },
                     function(Response) { Show_shell_error ( "Erreur à la sauvegarde de la configuration audio." ); } );
     });
    $('#idAUDIOEdit').modal("show");
  }
/**************************************** Supprime un thread audio ************************************************************/
 function AUDIO_Del (agent_tech_id)
  { selection = $('#idTableAUDIO').DataTable().row("#"+agent_tech_id).data();
    Show_modal_del ( "Supprimer le thread audio "+selection.agent_tech_id,
                     "Etes-vous sûr de vouloir supprimer ce thread audio ?",
                     selection.agent_tech_id + " - " + selection.description,
                     function () { Send_to_API ( "DELETE", "/agent/delete", { agent_tech_id: selection.agent_tech_id },
                                                 function(Response) { AUDIO_Refresh(); }, null ); } ) ;
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableAUDIO').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/audio/list", type : "GET", contentType: "application/json", dataSrc: "audio",
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "agent_tech_id",
       columns:
        [ { "data": null, "title":"Serveur", "className": "align-middle text-center",
            "render": function (item)
              { return( htmlEncode(item.server_hostname) ); }
          },
          { "data": null, "title":"Activé", "className": "align-middle text-center d-none d-md-table-cell",
            "render": function (item)
             { return( Switch ( "idAUDIOSwitch_"+item.agent_tech_id, "Activer ou désactiver l'agent audio", item.enable,
                          "audio-toggle-switch", "data-agent-tech-id='"+htmlEncode(item.agent_tech_id)+"'" ) );
             },
          },
          { "data": null, "title":"Tech_id", "className": "align-middle text-center",
            "render": function (item)
              { return( Lien ( "/agents/audio/"+encodeURIComponent(item.agent_tech_id), "Gérer les zones de diffusion", item.agent_tech_id ) ); }
          },
          { "data": "description", "title":"Description", "className": "align-middle text-center d-none d-lg-table-cell " },
          { "data": null, "title":"Langue", "className": "align-middle text-center d-none d-lg-table-cell",
            "render": function (item)
              { return( htmlEncode(item.language || "-") ); }
          },
          { "data": null, "title":"Volume", "className": "align-middle text-center d-none d-md-table-cell",
            "render": function (item)
              { return( item.volume + " %" ); }
          },
          { "data": null, "title":"Status", "className": "align-middle text-center d-none d-xl-table-cell",
            "render": function (item)
              { if (item.is_alive) return( Badge("success", "Agent actif", "UP") );
                return( Badge("danger", "Agent inactif", "DOWN") );
              }
          },
          { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
            "render": function (item)
              { boutons = Bouton_deroulant_start ( );
                boutons += Bouton_deroulant_add ( "primary", "Editer la configuration audio", "AUDIO_Edit", item.agent_tech_id, "pen" );
                boutons += Bouton_deroulant_add ( "primary", "Gérer les zones de diffusion", "Redirect", "/agents/audio/"+encodeURIComponent(item.agent_tech_id), "directions" );
                boutons += Bouton_deroulant_add ( "info", "Monitorer l'agent", "Redirect", "/agent/"+encodeURIComponent(item.agent_tech_id), "chart-line" );
                boutons += Bouton_deroulant_add_spacer ();
                boutons += Bouton_deroulant_add ( "danger", "Supprimer le thread", "AUDIO_Del", item.agent_tech_id, "trash" );
                boutons += Bouton_deroulant_end ();
                return(boutons);
              },
          }
         ],
       /*order: [ [0, "desc"] ],*/
     });

    $(document).off('change', '.audio-toggle-switch').on('change', '.audio-toggle-switch', function()
      { var toggle = $(this);
        AUDIO_Toggle ( toggle.data('agent-tech-id'), toggle.is(':checked'), toggle );
      });
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
