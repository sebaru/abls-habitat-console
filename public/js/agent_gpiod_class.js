/************************************ Demande de refresh **********************************************************************/
function GPIOD_Refresh ( )
 { $('#idTableGPIOD').DataTable().ajax.reload(null, false);
 }

/********************************************* Activation de l'agent GPIOD ****************************************************/
function GPIOD_Toggle ( agent_tech_id, newState, toggle )
 { toggle.prop('disabled', true);
   Send_to_API ( 'POST', '/agent/enable', { agent_tech_id: agent_tech_id, enable: newState },
                 function(Response)
                  { Show_toast_ok ( 'Agent GPIOD ' + (newState ? 'activé.' : 'désactivé.') );
                    toggle.prop('disabled', false);
                    GPIOD_Refresh();
                  },
                 function(Response)
                  { toggle.prop('checked', !newState).prop('disabled', false);
                    Show_shell_error ( "Erreur lors de la modification de l'agent GPIOD." );
                  } );
 }

/************************************ Envoi les informations de configuration GPIOD ******************************************/
function GPIOD_Set ( )
 { var request =
    { server_uuid: $('#idTargetServer').val(),
      agent_tech_id: $('#idGPIODTechID').val().toUpperCase(),
      description: $('#idGPIODDescription').val()
    };
   $('#idGPIODEdit').modal('hide');
   Send_to_API ( 'POST', '/gpiod/set', request,
                 function(Response) { Show_toast_ok ( 'Modifications sauvegardées.' ); GPIOD_Refresh(); },
                 function(Response) { Show_shell_error ( 'Erreur à la sauvegarde de la configuration GPIOD.' ); } );
 }

/**************************************** Edition de la configuration de l'agent GPIOD ***************************************/
function GPIOD_Edit ( agent_tech_id )
 { var gpiod = $('#idTableGPIOD').DataTable().row('#' + agent_tech_id).data();
   if (!gpiod) { Show_shell_error ( "Aucune configuration GPIOD pour '" + agent_tech_id + "'." ); return; }
   $('#idGPIODTitre').text ( 'Editer la configuration GPIOD ' + agent_tech_id );
    Select_from_api ( 'idTargetServer', '/servers/list', null, 'servers', 'server_uuid',
                function(item) { return item.agent_tech_id; }, gpiod.server_uuid );
   $('#idGPIODTechID').prop('disabled', true).val(gpiod.agent_tech_id);
   $('#idGPIODDescription').val(gpiod.description);
   $('#idGPIODValider').off('click').on('click', GPIOD_Set);
   $('#idGPIODEdit').modal('show');
 }

/********************************************* Ajout d'un agent GPIOD **********************************************************/
function GPIOD_Add ( )
 { $('#idGPIODTitre').text ( 'Ajouter un agent GPIOD' );
    Select_from_api ( 'idTargetServer', '/servers/list', null, 'servers', 'server_uuid',
                function(item) { return item.agent_tech_id; }, null );
   $('#idGPIODTechID').prop('disabled', false).val('')
     .off('input').on('input', function() { Controle_tech_id('idGPIOD', null); }).trigger('input');
   $('#idGPIODDescription').val('');
   $('#idGPIODValider').off('click').on('click', GPIOD_Set);
   $('#idGPIODEdit').modal('show');
 }

/********************************************* Suppression d'un agent GPIOD **************************************************/
function GPIOD_Del ( agent_tech_id )
 { var gpiod = $('#idTableGPIOD').DataTable().row('#' + agent_tech_id).data();
   Show_modal_del ( "Supprimer l'agent GPIOD " + gpiod.agent_tech_id,
                    'Etes-vous sûr de vouloir supprimer cet agent ?',
                    gpiod.agent_tech_id + ' - ' + gpiod.description,
                    function()
                     { Send_to_API ( 'DELETE', '/agent/delete', { agent_tech_id: gpiod.agent_tech_id },
                                     function(Response) { GPIOD_Refresh(); }, null );
                     } );
 }

/********************************************* Appelé au chargement de la page ************************************************/
function Load_page ( )
 { $('#idTableGPIOD').DataTable(
    { pageLength: 50, fixedHeader: true, paging: false, ordering: true, searching: true,
      ajax:
       { url: $ABLS_API + '/agent/list', type: 'GET', dataSrc: 'agents', contentType: 'application/json',
         data: function() { return 'classe=gpiod'; },
         error: function(xhr) { Show_shell_error(xhr.statusText); }
       },
      rowId: 'agent_tech_id',
      columns:
       [ { data: 'server_hostname', title: 'Serveur', className: 'align-middle text-center', render: function(value) { return htmlEncode(value); } },
         { data: null, title: 'Activé', className: 'align-middle text-center d-none d-md-table-cell',
           render: function(item) { return Switch('idGPIODSwitch_' + item.agent_tech_id, "Activer ou désactiver l'agent GPIOD", item.enable, 'gpiod-toggle-switch', "data-agent-tech-id='" + htmlEncode(item.agent_tech_id) + "'"); }
         },
         { data: null, title: 'Tech_id', className: 'align-middle text-center', render: function(item) { return Lien('/agents/gpiod/' + encodeURIComponent(item.agent_tech_id), 'Gérer les I/O', item.agent_tech_id); } },
         { data: 'description', title: 'Description', className: 'align-middle text-center d-none d-lg-table-cell' },
         { data: null, title: 'Status', className: 'align-middle text-center d-none d-xl-table-cell', render: function(item) { return item.is_alive ? Badge('success', 'Agent actif', 'UP') : Badge('danger', 'Agent inactif', 'DOWN'); } },
         { data: null, title: 'Actions', orderable: false, className: 'align-middle text-center',
           render: function(item)
            { var buttons = Bouton_deroulant_start();
              buttons += Bouton_deroulant_add('primary', 'Editer la configuration GPIOD', 'GPIOD_Edit', item.agent_tech_id, 'pen');
              buttons += Bouton_deroulant_add('primary', 'Gérer les I/O', 'Redirect', '/agents/gpiod/' + encodeURIComponent(item.agent_tech_id), 'sliders');
              buttons += Bouton_deroulant_add('info', "Monitorer l'agent", 'Redirect', '/agent/' + encodeURIComponent(item.agent_tech_id), 'chart-line');
              buttons += Bouton_deroulant_add_spacer();
              buttons += Bouton_deroulant_add('danger', "Supprimer l'agent", 'GPIOD_Del', item.agent_tech_id, 'trash');
              return buttons + Bouton_deroulant_end();
            }
         }
       ]
    } );
   $(document).off('change', '.gpiod-toggle-switch').on('change', '.gpiod-toggle-switch', function() { var toggle = $(this); GPIOD_Toggle(toggle.data('agent-tech-id'), toggle.is(':checked'), toggle); });
 }