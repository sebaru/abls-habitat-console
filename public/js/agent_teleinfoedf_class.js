/************************************ Demande de refresh **********************************************************************/
function TELEINFO_Refresh ( )
 { $('#idTableTELEINFO').DataTable().ajax.reload(null, false);
 }

/********************************************* Activation de l'agent Téléinfo EDF ********************************************/
function TELEINFO_Toggle ( agent_tech_id, newState, toggle )
 { toggle.prop('disabled', true);
   Send_to_API ( 'POST', '/agent/enable', { agent_tech_id: agent_tech_id, enable: newState },
                 function(Response)
                  { Show_toast_ok ( 'Agent Téléinfo EDF ' + (newState ? 'activé.' : 'désactivé.') );
                    toggle.prop('disabled', false);
                    TELEINFO_Refresh();
                  },
                 function(Response)
                  { toggle.prop('checked', !newState).prop('disabled', false);
                    Show_shell_error ( "Erreur lors de la modification de l'agent Téléinfo EDF." );
                  } );
 }

/************************************ Envoi la configuration de l'agent Téléinfo EDF ******************************************/
function TELEINFO_Set ( )
 { var request =
    { server_uuid: $('#idTargetServer').val(),
      agent_tech_id: $('#idTELEINFOTechID').val().toUpperCase(),
      description: $('#idTELEINFODescription').val(),
      port: $('#idTELEINFOPort').val(),
      standard: $('#idTELEINFOStandard').val() == 'true'
    };
   $('#idTELEINFOEdit').modal('hide');
   Send_to_API ( 'POST', '/teleinfoedf/set', request,
                 function(Response) { Show_toast_ok ( 'Modifications sauvegardées.' ); TELEINFO_Refresh(); },
                 function(Response) { Show_shell_error ( 'Erreur à la sauvegarde de la configuration Téléinfo EDF.' ); } );
 }

/**************************************** Edition de la configuration Téléinfo EDF ******************************************/
function TELEINFO_Edit ( agent_tech_id )
 { var teleinfo = $('#idTableTELEINFO').DataTable().row('#' + agent_tech_id).data();
   if (!teleinfo) { Show_shell_error ( "Aucune configuration Téléinfo EDF pour '" + agent_tech_id + "'." ); return; }
   $('#idTELEINFOTitre').text ( 'Editer la configuration Téléinfo EDF ' + agent_tech_id );
   Select_from_api ( 'idTargetServer', '/servers/list', null, 'servers', 'server_uuid',
                     function(item) { return item.agent_tech_id; }, teleinfo.server_uuid );
   $('#idTELEINFOTechID').prop('disabled', true).val(teleinfo.agent_tech_id);
   $('#idTELEINFODescription').val(teleinfo.description);
   $('#idTELEINFOPort').val(teleinfo.port);
   $('#idTELEINFOStandard').replaceWith(Select('idTELEINFOStandard', null,
                                                [ { valeur: false, texte: 'Historique' }, { valeur: true, texte: 'Standard' } ],
                                                teleinfo.standard));
   $('#idTELEINFOValider').off('click').on('click', TELEINFO_Set);
   $('#idTELEINFOEdit').modal('show');
 }

/********************************************* Ajout d'un agent Téléinfo EDF **************************************************/
function TELEINFO_Add ( )
 { $('#idTELEINFOTitre').text ( 'Ajouter un agent Téléinfo EDF' );
   Select_from_api ( 'idTargetServer', '/servers/list', null, 'servers', 'server_uuid',
                     function(item) { return item.agent_tech_id; }, null );
   $('#idTELEINFOTechID').prop('disabled', false).val('')
     .off('input').on('input', function() { Controle_tech_id('idTELEINFO', null); }).trigger('input');
   $('#idTELEINFODescription').val('');
   $('#idTELEINFOPort').val('');
   $('#idTELEINFOStandard').replaceWith(Select('idTELEINFOStandard', null,
                                                [ { valeur: false, texte: 'Historique' }, { valeur: true, texte: 'Standard' } ],
                                                false));
   $('#idTELEINFOValider').off('click').on('click', TELEINFO_Set);
   $('#idTELEINFOEdit').modal('show');
 }

/********************************************* Suppression d'un agent Téléinfo EDF ********************************************/
function TELEINFO_Del ( agent_tech_id )
 { var teleinfo = $('#idTableTELEINFO').DataTable().row('#' + agent_tech_id).data();
   Show_modal_del ( "Supprimer l'agent Téléinfo EDF " + teleinfo.agent_tech_id,
                    'Etes-vous sûr de vouloir supprimer cet agent ?',
                    teleinfo.agent_tech_id + ' - ' + teleinfo.description,
                    function()
                     { Send_to_API ( 'DELETE', '/agent/delete', { agent_tech_id: teleinfo.agent_tech_id },
                                     function(Response) { TELEINFO_Refresh(); }, null );
                     } );
 }

/********************************************* Appelé au chargement de la page ************************************************/
function Load_page ( )
 { $('#idTableTELEINFO').DataTable(
    { pageLength: 50, fixedHeader: true, paging: false, ordering: true, searching: true,
      ajax:
       { url: $ABLS_API + '/teleinfoedf/list', type: 'GET', dataSrc: 'teleinfoedf', contentType: 'application/json',
         error: function(xhr) { Show_shell_error(xhr.statusText); }
       },
      rowId: 'agent_tech_id',
      columns:
       [ { data: 'server_hostname', title: 'Serveur', className: 'align-middle text-center', render: function(value) { return htmlEncode(value); } },
         { data: null, title: 'Activé', className: 'align-middle text-center d-none d-md-table-cell',
           render: function(item) { return Switch('idTELEINFOSwitch_' + item.agent_tech_id, "Activer ou désactiver l'agent Téléinfo EDF", item.enable, 'teleinfoedf-toggle-switch', "data-agent-tech-id='" + htmlEncode(item.agent_tech_id) + "'"); }
         },
         { data: null, title: 'Tech_id', className: 'align-middle text-center', render: function(item) { return Lien('/agents/teleinfoedf/' + encodeURIComponent(item.agent_tech_id), 'Voir la configuration Téléinfo EDF', item.agent_tech_id); } },
         { data: 'description', title: 'Description', className: 'align-middle text-center d-none d-lg-table-cell' },
         { data: 'port', title: 'Device Port', className: 'align-middle text-center d-none d-xl-table-cell' },
         { data: null, title: 'Mode', className: 'align-middle text-center d-none d-lg-table-cell', render: function(item) { return item.standard ? Badge('info', 'Mode TIC Standard', 'Standard') : Badge('secondary', 'Mode TIC Historique', 'Historique'); } },
         { data: null, title: 'Status', className: 'align-middle text-center d-none d-xl-table-cell', render: function(item) { return item.is_alive ? Badge('success', 'Agent actif', 'UP') : Badge('danger', 'Agent inactif', 'DOWN'); } },
         { data: null, title: 'Actions', orderable: false, className: 'align-middle text-center',
           render: function(item)
            { var buttons = Bouton_deroulant_start();
              buttons += Bouton_deroulant_add('primary', 'Editer la configuration Téléinfo EDF', 'TELEINFO_Edit', item.agent_tech_id, 'pen');
              buttons += Bouton_deroulant_add('primary', 'Voir la configuration Téléinfo EDF', 'Redirect', '/agents/teleinfoedf/' + encodeURIComponent(item.agent_tech_id), 'sliders');
              buttons += Bouton_deroulant_add('info', "Monitorer l'agent", 'Redirect', '/agent/' + encodeURIComponent(item.agent_tech_id), 'chart-line');
              buttons += Bouton_deroulant_add_spacer();
              buttons += Bouton_deroulant_add('danger', "Supprimer l'agent", 'TELEINFO_Del', item.agent_tech_id, 'trash');
              return buttons + Bouton_deroulant_end();
            }
         }
       ]
    } );
   $(document).off('change', '.teleinfoedf-toggle-switch').on('change', '.teleinfoedf-toggle-switch', function()
    { var toggle = $(this);
      TELEINFO_Toggle(toggle.data('agent-tech-id'), toggle.is(':checked'), toggle);
    });
 }
/*----------------------------------------------------------------------------------------------------------------------------*/
