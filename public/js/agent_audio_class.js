/************************************ Demande de refresh **********************************************************************/
 function AUDIO_Refresh ( )
  { $('#idTableAUDIO').DataTable().ajax.reload(null, false);
  }
/********************************************* Activation du thread audio *****************************************************/
 function AUDIO_Disable (agent_tech_id)
  { $("#idButtonSpinner_AUDIO_Disable_"+agent_tech_id).show();
    Send_to_API ( "POST", "/agent/enable", { agent_tech_id: agent_tech_id, enable: false },
                  function(Response) { AUDIO_Refresh(); }, function(Response) { AUDIO_Refresh(); } );
  }
/********************************************* Activation du thread audio *****************************************************/
 function AUDIO_Enable (agent_tech_id)
  { $("#idButtonSpinner_AUDIO_Enable_"+agent_tech_id).show();
    Send_to_API ( "POST", "/agent/enable", { agent_tech_id: agent_tech_id, enable: true },
                  function(Response) { AUDIO_Refresh(); }, function(Response) { AUDIO_Refresh(); } );
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
       ajax: { url : $ABLS_API+"/agent/list", type : "GET", contentType: "application/json",
               dataSrc: function (Response)                            /* L'API ne filtre pas encore sur le paramètre classe */
                { if (!Response || !Response.agents) return [];
                  return ( Response.agents.filter ( function (item) { return ( item.agent_classe === "audio" ); } ) );
                },
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "agent_tech_id",
       columns:
        [ { "data": null, "title":"Serveur", "className": "align-middle text-center",
            "render": function (item)
              { return( htmlEncode(item.server_hostname) ); }
          },
          { "data": null, "title":"Enable", "className": "align-middle text-center d-none d-md-table-cell",
            "render": function (item)
             { if (item.enable==true)
                { return( Bouton ( "success", "Désactiver le thread", "AUDIO_Disable", item.agent_tech_id, "Actif" ) ); }
               else
                { return( Bouton ( "outline-secondary", "Activer le thread", "AUDIO_Enable", item.agent_tech_id, "Désactivé" ) ); }
             },
          },
          { "data": null, "title":"Tech_id", "className": "align-middle text-center",
            "render": function (item)
              { return( Lien ( "/agents/audio/"+encodeURIComponent(item.agent_tech_id), "Configurer la diffusion audio", item.agent_tech_id ) ); }
          },
          { "data": "description", "title":"Description", "className": "align-middle text-center d-none d-lg-table-cell " },
          { "data": null, "title":"Status", "className": "align-middle text-center d-none d-xl-table-cell",
            "render": function (item)
              { if (item.is_alive) return( Badge("success", "Agent actif", "UP") );
                return( Badge("danger", "Agent inactif", "DOWN") );
              }
          },
          { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
            "render": function (item)
              { boutons = Bouton_deroulant_start ( );
                boutons += Bouton_deroulant_add ( "primary", "Configurer la diffusion audio", "Redirect", "/agents/audio/"+encodeURIComponent(item.agent_tech_id), "sliders" );
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
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
