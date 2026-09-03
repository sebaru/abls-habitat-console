/************************************ Demande de refresh **********************************************************************/
 function UPS_Refresh ( )
  { $('#idTableUPS').DataTable().ajax.reload(null, false);
  }
/********************************************* Activation de l'agent ups ******************************************************/
 function UPS_Toggle ( agent_tech_id, newState, toggle )
  { toggle.prop('disabled', true);
    Send_to_API ( "POST", "/agent/enable", { agent_tech_id: agent_tech_id, enable: newState },
                  function(Response)
                   { Show_toast_ok ( "Agent onduleur " + (newState ? "activé." : "désactivé.") );
                     toggle.prop('disabled', false);
                     UPS_Refresh();
                   },
                  function(Response)
                   { toggle.prop('checked', !newState).prop('disabled', false);
                     Show_shell_error ( "Erreur lors de la modification de l'agent onduleur." );
                   } );
  }
/************************************ Envoi la configuration de l'agent ups ***************************************************/
 function UPS_Set ( )
  { var json_request =
     { server_uuid    : $('#idTargetServer').val(),
       agent_tech_id  : $('#idUPSTechID').val().toUpperCase(),
       description    : $('#idUPSDescription').val(),
       name           : $('#idUPSName').val(),
       host           : $('#idUPSHost').val(),
       admin_username : $('#idUPSAdminUsername').val(),
       admin_password : $('#idUPSAdminPassword').val(),
     };

    $('#idUPSEdit').modal("hide");
    Send_to_API ( "POST", "/ups/set", json_request,
                  function(Response) { Show_toast_ok ( "Modifications sauvegardées." );
                                       UPS_Refresh();
                                     },
                  function(Response) { Show_shell_error ( "Erreur à la sauvegarde de la configuration onduleur." ); } );
  }
/**************************************** Edition de la configuration de l'agent ups ******************************************/
 function UPS_Edit ( agent_tech_id )
  { var ups = $('#idTableUPS').DataTable().row("#"+agent_tech_id).data();
    if (!ups) { Show_shell_error ( "Aucune configuration onduleur pour '"+agent_tech_id+"'." ); return; }

    $('#idUPSTitre').text( "Editer la configuration onduleur " + agent_tech_id );
    Select_from_api ( "idTargetServer", "/servers/list", null, "servers", "server_uuid", function (Response)
                        { return ( Response.agent_tech_id ); }, ups.server_uuid );
    $('#idUPSTechID').prop ("disabled", true).val( ups.agent_tech_id );
    $('#idUPSDescription').val( ups.description );
    $('#idUPSName').val( ups.name );
    $('#idUPSHost').val( ups.host );
    $('#idUPSAdminUsername').val( ups.admin_username );
    $('#idUPSAdminPassword').val( ups.admin_password );
    $('#idUPSValider').off("click").on( "click", function () { UPS_Set(); } );
    $('#idUPSEdit').modal("show");
  }
/**************************************** Ajout d'un agent ups ****************************************************************/
 function UPS_Add ( )
  { $('#idUPSTitre').text( "Ajouter un agent onduleur" );
    Select_from_api ( "idTargetServer", "/servers/list", null, "servers", "server_uuid", function (Response)
                        { return ( Response.agent_tech_id ); }, null );
    $('#idUPSTechID').prop ("disabled", false).val("")
      .off("input").on("input", function () { Controle_tech_id( "idUPS", null ); } ).trigger("input");
    $('#idUPSDescription').val( "" );
    $('#idUPSName').val( "" );
    $('#idUPSHost').val( "" );
    $('#idUPSAdminUsername').val( "" );
    $('#idUPSAdminPassword').val( "" );
    $('#idUPSValider').off("click").on( "click", function () { UPS_Set(); } );
    $('#idUPSEdit').modal("show");
  }
/**************************************** Supprime un agent ups ***************************************************************/
 function UPS_Del ( agent_tech_id )
  { selection = $('#idTableUPS').DataTable().row("#"+agent_tech_id).data();
    Show_modal_del ( "Supprimer l'agent onduleur "+selection.agent_tech_id,
                     "Etes-vous sûr de vouloir supprimer cet agent ?",
                     selection.agent_tech_id + " - " + selection.host + " - " + selection.description,
                     function () { Send_to_API ( "DELETE", "/agent/delete", { agent_tech_id: selection.agent_tech_id },
                                                 function(Response) { UPS_Refresh(); }, null ); } ) ;
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableUPS').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/ups/list", type : "GET", dataSrc: "ups", contentType: "application/json",
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
             { return( Switch ( "idUPSSwitch_"+item.agent_tech_id, "Activer ou désactiver l'agent onduleur", item.enable,
                                "ups-toggle-switch", "data-agent-tech-id='"+htmlEncode(item.agent_tech_id)+"'" ) );
            },
          },
          { "data": null, "title":"Tech_id", "className": "align-middle text-center",
            "render": function (item)
              { return( Lien ( "/agents/ups/"+encodeURIComponent(item.agent_tech_id), "Voir les mnémoniques", item.agent_tech_id ) ); }
          },
          { "data": "description", "title":"Description", "className": "align-middle text-center d-none d-lg-table-cell " },
          { "data": "name", "title":"Nom", "className": "align-middle text-center d-none d-lg-table-cell " },
          { "data": "host", "title":"Host", "className": "align-middle text-center d-none d-lg-table-cell " },
          { "data": "admin_username", "title":"Username", "className": "align-middle text-center d-none d-xl-table-cell " },
          { "data": null, "title":"Status", "className": "align-middle text-center d-none d-xl-table-cell",
            "render": function (item)
              { if (item.is_alive) return( Badge("success", "Agent actif", "UP") );
                return( Badge("danger", "Agent inactif", "DOWN") );
              }
          },
          { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
            "render": function (item)
              { boutons = Bouton_deroulant_start ( );
                boutons += Bouton_deroulant_add ( "primary", "Editer la configuration onduleur", "UPS_Edit", item.agent_tech_id, "pen" );
                boutons += Bouton_deroulant_add ( "primary", "Voir les mnémoniques", "Redirect", "/agents/ups/"+encodeURIComponent(item.agent_tech_id), "sliders" );
                boutons += Bouton_deroulant_add ( "info", "Monitorer l'agent", "Redirect", "/agent/"+encodeURIComponent(item.agent_tech_id), "chart-line" );
                boutons += Bouton_deroulant_add_spacer ();
                boutons += Bouton_deroulant_add ( "danger", "Supprimer l'agent", "UPS_Del", item.agent_tech_id, "trash" );
                boutons += Bouton_deroulant_end ();
                return(boutons);
              },
          }
         ],
       /*order: [ [0, "desc"] ],*/
     });

    $(document).off('change', '.ups-toggle-switch').on('change', '.ups-toggle-switch', function()
      { var toggle = $(this);
        UPS_Toggle ( toggle.data('agent-tech-id'), toggle.is(':checked'), toggle );
      });
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
