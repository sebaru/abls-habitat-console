/************************************ Demande de refresh **********************************************************************/
function IMSGS_Refresh ( )
 { $('#idTableIMSGS').DataTable().ajax.reload(null, false);
 }

/********************************************* Activation de l'agent XMPP *****************************************************/
function IMSGS_Toggle ( agent_tech_id, newState, toggle )
 { toggle.prop('disabled', true);
	 Send_to_API ( 'POST', '/agent/enable', { agent_tech_id: agent_tech_id, enable: newState },
								 function(Response)
									{ Show_toast_ok ( 'Agent XMPP ' + (newState ? 'activé.' : 'désactivé.') );
										toggle.prop('disabled', false);
										IMSGS_Refresh();
									},
								 function(Response)
									{ toggle.prop('checked', !newState).prop('disabled', false);
										Show_shell_error ( "Erreur lors de la modification de l'agent XMPP." );
									} );
 }

/************************************ Envoi les informations de configuration XMPP *********************************************/
function IMSGS_Set ( )
 { var request =
		{ server_uuid: $('#idTargetServer').val(),
			agent_tech_id: $('#idIMSGSTechID').val().toUpperCase(),
			description: $('#idIMSGSDescription').val(),
			jabberid: $('#idIMSGSJabberID').val(),
			password: $('#idIMSGSPassword').val()
		};
	 $('#idIMSGSEdit').modal('hide');
	 Send_to_API ( 'POST', '/imsgs/set', request,
								 function(Response)
									{ Show_toast_ok ( 'Modifications sauvegardées.' );
										IMSGS_Refresh();
									},
								 function(Response)
									{ Show_shell_error ( 'Erreur à la sauvegarde de la configuration XMPP.' );
									} );
 }

/**************************************** Edition de la configuration de l'agent XMPP ***************************************/
function IMSGS_Edit ( agent_tech_id )
 { var imsgs = $('#idTableIMSGS').DataTable().row('#' + agent_tech_id).data();
	 if (!imsgs) { Show_shell_error ( "Aucune configuration XMPP pour '" + agent_tech_id + "'." ); return; }

	 $('#idIMSGSTitre').text ( 'Editer la configuration XMPP ' + agent_tech_id );
	 Select_from_api ( 'idTargetServer', '/servers/list', null, 'servers', 'server_uuid',
										function(item) { return item.agent_tech_id; }, imsgs.server_uuid );
	 $('#idIMSGSTechID').prop('disabled', true).val(imsgs.agent_tech_id);
	 $('#idIMSGSDescription').val(imsgs.description);
	 $('#idIMSGSJabberID').val(imsgs.jabberid);
	 $('#idIMSGSPassword').val(imsgs.password);
	 $('#idIMSGSValider').off('click').on('click', IMSGS_Set);
	 $('#idIMSGSEdit').modal('show');
 }

/********************************************* Ajout d'un agent XMPP **********************************************************/
function IMSGS_Add ( )
 { $('#idIMSGSTitre').text ( 'Ajouter un agent XMPP' );
	 Select_from_api ( 'idTargetServer', '/servers/list', null, 'servers', 'server_uuid',
										function(item) { return item.agent_tech_id; }, null );
	 $('#idIMSGSTechID').prop('disabled', false).val('')
		 .off('input').on('input', function() { Controle_tech_id('idIMSGS', null); }).trigger('input');
	 $('#idIMSGSDescription,#idIMSGSJabberID,#idIMSGSPassword').val('');
	 $('#idIMSGSValider').off('click').on('click', IMSGS_Set);
	 $('#idIMSGSEdit').modal('show');
 }

/********************************************* Suppression d'un agent XMPP ****************************************************/
function IMSGS_Del ( agent_tech_id )
 { var imsgs = $('#idTableIMSGS').DataTable().row('#' + agent_tech_id).data();
	 Show_modal_del ( "Supprimer l'agent XMPP " + imsgs.agent_tech_id,
										'Etes-vous sûr de vouloir supprimer cet agent ?',
										imsgs.agent_tech_id + ' - ' + imsgs.jabberid,
										function()
										 { Send_to_API ( 'DELETE', '/agent/delete', { agent_tech_id: imsgs.agent_tech_id },
																		 function(Response) { IMSGS_Refresh(); }, null );
										 } );
 }

/********************************************* Appelé au chargement de la page ************************************************/
function Load_page ( )
 { $('#idTableIMSGS').DataTable(
		{ pageLength: 50,
			fixedHeader: true, paging: false, ordering: true, searching: true,
			ajax:
			 { url: $ABLS_API + '/imsgs/list', type: 'GET', dataSrc: 'imsgs', contentType: 'application/json',
				 error: function(xhr) { Show_shell_error(xhr.statusText); }
			 },
			rowId: 'agent_tech_id',
			columns:
			 [ { data: null, title: 'Serveur', className: 'align-middle text-center',
					 render: function(item) { return htmlEncode(item.server_hostname); }
				 },
				 { data: null, title: 'Activé', className: 'align-middle text-center d-none d-md-table-cell',
					 render: function(item)
						{ return Switch ( 'idIMSGSSwitch_' + item.agent_tech_id, "Activer ou désactiver l'agent XMPP", item.enable,
															'imsgs-toggle-switch', "data-agent-tech-id='" + htmlEncode(item.agent_tech_id) + "'" );
						}
				 },
				 { data: null, title: 'Tech_id', className: 'align-middle text-center',
					 render: function(item) { return Lien('/agents/imsgs/' + encodeURIComponent(item.agent_tech_id), 'Voir la connexion XMPP', item.agent_tech_id); }
				 },
				 { data: 'description', title: 'Description', className: 'align-middle text-center d-none d-lg-table-cell' },
				 { data: 'jabberid', title: 'JabberID', className: 'align-middle text-center d-none d-lg-table-cell' },
				 { data: null, title: 'Status', className: 'align-middle text-center d-none d-xl-table-cell',
					 render: function(item) { return item.is_alive ? Badge('success', 'Agent actif', 'UP') : Badge('danger', 'Agent inactif', 'DOWN'); }
				 },
				 { data: null, title: 'Actions', orderable: false, className: 'align-middle text-center',
					 render: function(item)
						{ var b = Bouton_deroulant_start();
							b += Bouton_deroulant_add('primary', 'Editer la configuration XMPP', 'IMSGS_Edit', item.agent_tech_id, 'pen');
							b += Bouton_deroulant_add('primary', 'Voir la connexion XMPP', 'Redirect', '/agents/imsgs/' + encodeURIComponent(item.agent_tech_id), 'sliders');
							b += Bouton_deroulant_add('info', "Monitorer l'agent", 'Redirect', '/agent/' + encodeURIComponent(item.agent_tech_id), 'chart-line');
							b += Bouton_deroulant_add_spacer();
							b += Bouton_deroulant_add('danger', "Supprimer l'agent", 'IMSGS_Del', item.agent_tech_id, 'trash');
							return b + Bouton_deroulant_end();
						}
				 }
			 ]
		} );
	 $(document).off('change', '.imsgs-toggle-switch').on('change', '.imsgs-toggle-switch',
		 function()
			{ var toggle = $(this);
				IMSGS_Toggle(toggle.data('agent-tech-id'), toggle.is(':checked'), toggle);
			} );
 }
/*----------------------------------------------------------------------------------------------------------------------------*/
