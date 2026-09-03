/************************************ Demande de refresh **********************************************************************/
 function METEO_Refresh ( )
  { $('#idTableMETEO').DataTable().ajax.reload(null, false);
  }
/********************************************* Activation de l'agent meteo ****************************************************/
 function METEO_Toggle ( agent_tech_id, newState, toggle )
  { toggle.prop('disabled', true);
    Send_to_API ( "POST", "/agent/enable", { agent_tech_id: agent_tech_id, enable: newState },
                  function(Response)
                   { Show_toast_ok ( "Agent météo " + (newState ? "activé." : "désactivé.") );
                     toggle.prop('disabled', false);
                     METEO_Refresh();
                   },
                  function(Response)
                   { toggle.prop('checked', !newState).prop('disabled', false);
                     Show_shell_error ( "Erreur lors de la modification de l'agent météo." );
                   } );
  }
/************************************ Envoi la configuration de l'agent meteo *************************************************/
 function METEO_Set ( )
  { var json_request =
     { server_uuid   : $('#idTargetServer').val(),
       agent_tech_id : $('#idMETEOTechID').val().toUpperCase(),
       token         : $('#idMETEOToken').val(),
       description   : $('#idMETEODescription').val(),
       code_insee    : $('#idMETEOCodeInsee').val(),
     };

    $('#idMETEOEdit').modal("hide");
    Send_to_API ( "POST", "/meteo/set", json_request,
                  function(Response) { Show_toast_ok ( "Modifications sauvegardées." );
                                       METEO_Refresh();
                                     },
                  function(Response) { Show_shell_error ( "Erreur à la sauvegarde de la configuration météo." ); } );
  }
/**************************************** Edition de la configuration de l'agent meteo ****************************************/
 function METEO_Edit ( agent_tech_id )
  { var meteo = $('#idTableMETEO').DataTable().row("#"+agent_tech_id).data();
    if (!meteo) { Show_shell_error ( "Aucune configuration météo pour '"+agent_tech_id+"'." ); return; }

    $('#idMETEOTitre').text( "Editer la configuration météo " + agent_tech_id );
    Select_from_api ( "idTargetServer", "/servers/list", null, "servers", "server_uuid", function (Response)
                        { return ( Response.agent_tech_id ); }, meteo.server_uuid );
    $('#idMETEOTechID').prop ("disabled", true).val( meteo.agent_tech_id );
    $('#idMETEODescription').val( meteo.description );
    $('#idMETEOToken').val( meteo.token );
    $('#idMETEOCodeInsee').val( meteo.code_insee );
    $('#idMETEOValider').off("click").on( "click", function () { METEO_Set(); } );
    $('#idMETEOEdit').modal("show");
  }
/**************************************** Ajout d'un agent meteo **************************************************************/
 function METEO_Add ( )
  { $('#idMETEOTitre').text( "Ajouter un agent météo" );
    Select_from_api ( "idTargetServer", "/servers/list", null, "servers", "server_uuid", function (Response)
                        { return ( Response.agent_tech_id ); }, null );
    $('#idMETEOTechID').prop ("disabled", false).val("")
      .off("input").on("input", function () { Controle_tech_id( "idMETEO", null ); } ).trigger("input");
    $('#idMETEODescription').val( "" );
    $('#idMETEOToken').val( "" );
    $('#idMETEOCodeInsee').val( "" );
    $('#idMETEOValider').off("click").on( "click", function () { METEO_Set(); } );
    $('#idMETEOEdit').modal("show");
  }
/**************************************** Supprime un agent meteo *************************************************************/
 function METEO_Del ( agent_tech_id )
  { selection = $('#idTableMETEO').DataTable().row("#"+agent_tech_id).data();
    Show_modal_del ( "Supprimer l'agent météo "+selection.agent_tech_id,
                     "Etes-vous sûr de vouloir supprimer cet agent ?",
                     selection.agent_tech_id + " - " + selection.description,
                     function () { Send_to_API ( "DELETE", "/agent/delete", { agent_tech_id: selection.agent_tech_id },
                                                 function(Response) { METEO_Refresh(); }, null ); } ) ;
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableMETEO').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/meteo/list", type : "GET", dataSrc: "meteo", contentType: "application/json",
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
             { return( Switch ( "idMETEOSwitch_"+item.agent_tech_id, "Activer ou désactiver l'agent météo", item.enable,
                                "meteo-toggle-switch", "data-agent-tech-id='"+htmlEncode(item.agent_tech_id)+"'" ) );
            },
          },
          { "data": null, "title":"Tech_id", "className": "align-middle text-center",
            "render": function (item)
              { return( Lien ( "/agents/meteo/"+encodeURIComponent(item.agent_tech_id), "Voir les mnémoniques", item.agent_tech_id ) ); }
          },
          { "data": "description", "title":"Description", "className": "align-middle text-center d-none d-lg-table-cell " },
          { "data": "code_insee", "title":"Code Insee", "className": "align-middle text-center d-none d-lg-table-cell " },
          { "data": null, "title":"Status", "className": "align-middle text-center d-none d-xl-table-cell",
            "render": function (item)
              { if (item.is_alive) return( Badge("success", "Agent actif", "UP") );
                return( Badge("danger", "Agent inactif", "DOWN") );
              }
          },
          { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
            "render": function (item)
              { boutons = Bouton_deroulant_start ( );
                boutons += Bouton_deroulant_add ( "primary", "Editer la configuration météo", "METEO_Edit", item.agent_tech_id, "pen" );
                boutons += Bouton_deroulant_add ( "primary", "Voir les mnémoniques", "Redirect", "/agents/meteo/"+encodeURIComponent(item.agent_tech_id), "sliders" );
                boutons += Bouton_deroulant_add ( "info", "Monitorer l'agent", "Redirect", "/agent/"+encodeURIComponent(item.agent_tech_id), "chart-line" );
                boutons += Bouton_deroulant_add_spacer ();
                boutons += Bouton_deroulant_add ( "danger", "Supprimer l'agent", "METEO_Del", item.agent_tech_id, "trash" );
                boutons += Bouton_deroulant_end ();
                return(boutons);
              },
          }
         ],
       /*order: [ [0, "desc"] ],*/
     });

    $(document).off('change', '.meteo-toggle-switch').on('change', '.meteo-toggle-switch', function()
      { var toggle = $(this);
        METEO_Toggle ( toggle.data('agent-tech-id'), toggle.is(':checked'), toggle );
      });
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
