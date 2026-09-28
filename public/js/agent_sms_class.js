/* agent_sms_class.js
 * Liste et gestion des agents SMS.
 */

/************************************ Actualise la liste des agents SMS ***********************************************/
 function SMS_Refresh ()
  { $('#idTableSMS').DataTable().ajax.reload ( null, false );
  }

/************************************ Active ou désactive un agent SMS ***********************************************/
 function SMS_Toggle ( agent_tech_id, newState, toggle )
  { toggle.prop ( 'disabled', true );
    Send_to_API ( "POST", "/agent/enable", { agent_tech_id: agent_tech_id, enable: newState },
                  function ( Response )
                   { Show_toast_ok ( "Agent SMS " + ( newState ? "activé." : "désactivé." ) );
                     toggle.prop ( 'disabled', false );
                     SMS_Refresh();
                   },
                  function ( Response )
                   { toggle.prop ( 'checked', !newState ).prop ( 'disabled', false );
                     Show_shell_error ( "Erreur lors de la modification de l'agent SMS." );
                   } );
  }

/************************************ Enregistre la configuration d'un agent SMS ************************************/
 function SMS_Set ()
  { var request =
     { server_uuid: $('#idTargetServer').val(), agent_tech_id: $('#idSMSTechID').val().toUpperCase(),
       description: $('#idSMSDescription').val(), ovh_service_name: $('#idSMSOVHServiceName').val(),
       ovh_application_key: $('#idSMSOVHApplicationKey').val(), ovh_application_secret: $('#idSMSOVHApplicationSecret').val(),
       ovh_consumer_key: $('#idSMSOVHConsumerKey').val() };
    $('#idSMSEdit').modal ( 'hide' );
    Send_to_API ( 'POST', '/sms/set', request,
                  function ( Response ) { Show_toast_ok ( 'Modifications sauvegardées.' ); SMS_Refresh(); },
                  function ( Response ) { Show_shell_error ( 'Erreur à la sauvegarde de la configuration SMS.' ); } );
  }

/************************************ Affiche la configuration d'un agent SMS ***************************************/
 function SMS_Edit ( agent_tech_id )
  { var sms = $('#idTableSMS').DataTable().row ( '#'+agent_tech_id ).data();
    if ( !sms ) { Show_shell_error ( "Aucune configuration SMS pour '"+agent_tech_id+"'." ); return; }
    $('#idSMSTitre').text ( 'Editer la configuration SMS '+agent_tech_id );
    Select_from_api ( 'idTargetServer', '/servers/list', null, 'servers', 'server_uuid',
                      function ( item ) { return item.agent_tech_id; }, sms.server_uuid );
    $('#idSMSTechID').prop ( 'disabled', true ).val ( sms.agent_tech_id );
    $('#idSMSDescription').val ( sms.description );
    $('#idSMSOVHServiceName').val ( sms.ovh_service_name );
    $('#idSMSOVHApplicationKey').val ( sms.ovh_application_key );
    $('#idSMSOVHApplicationSecret').val ( sms.ovh_application_secret );
    $('#idSMSOVHConsumerKey').val ( sms.ovh_consumer_key );
    $('#idSMSValider').off ( 'click' ).on ( 'click', SMS_Set );
    $('#idSMSEdit').modal ( 'show' );
  }

/************************************ Prépare l'ajout d'un agent SMS ***********************************************/
 function SMS_Add ()
  { $('#idSMSTitre').text ( 'Ajouter un agent SMS' );
    Select_from_api ( 'idTargetServer', '/servers/list', null, 'servers', 'server_uuid',
                      function ( item ) { return item.agent_tech_id; }, null );
    $('#idSMSTechID').prop ( 'disabled', false ).val ( '' ).off ( 'input' )
      .on ( 'input', function () { Controle_tech_id ( 'idSMS', null ); } ).trigger ( 'input' );
    $('#idSMSDescription,#idSMSOVHServiceName,#idSMSOVHApplicationKey,#idSMSOVHApplicationSecret,#idSMSOVHConsumerKey').val ( '' );
    $('#idSMSValider').off ( 'click' ).on ( 'click', SMS_Set );
    $('#idSMSEdit').modal ( 'show' );
  }

/************************************ Supprime un agent SMS *******************************************************/
 function SMS_Del ( agent_tech_id )
  { var sms = $('#idTableSMS').DataTable().row ( '#'+agent_tech_id ).data();
    Show_modal_del ( "Supprimer l'agent SMS "+sms.agent_tech_id, "Etes-vous sûr de vouloir supprimer cet agent ?",
                     sms.agent_tech_id+' - '+sms.description,
                     function ()
                      { Send_to_API ( 'DELETE', '/agent/delete', { agent_tech_id: sms.agent_tech_id },
                                      function ( Response ) { SMS_Refresh(); }, null );
                      } );
  }

/************************************ Charge la page de gestion des agents SMS ***************************************/
 function Load_page ()
  { $('#idTableSMS').DataTable(
     { pageLength: 50, fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url: $ABLS_API+'/sms/list', type: 'GET', dataSrc: 'sms', contentType: 'application/json',
               error: function ( xhr ) { Show_shell_error ( xhr.statusText ); }
             },
       rowId: 'agent_tech_id',
       columns:
        [ { data: null, title: 'Serveur', className: 'align-middle text-center',
            render: function ( item ) { return htmlEncode ( item.server_hostname ); }
          },
          { data: null, title: 'Activé', className: 'align-middle text-center d-none d-md-table-cell',
            render: function ( item )
             { return Switch ( 'idSMSSwitch_'+item.agent_tech_id, "Activer ou désactiver l'agent SMS", item.enable,
                               'sms-toggle-switch', "data-agent-tech-id='"+htmlEncode ( item.agent_tech_id )+"'" );
             }
          },
          { data: null, title: 'Tech_id', className: 'align-middle text-center',
            render: function ( item )
             { return Lien ( '/agents/sms/'+encodeURIComponent ( item.agent_tech_id ), 'Voir les mnémoniques', item.agent_tech_id ); }
          },
          { data: 'description', title: 'Description', className: 'align-middle text-center d-none d-lg-table-cell' },
          { data: 'ovh_service_name', title: 'Service OVH', className: 'align-middle text-center d-none d-lg-table-cell' },
          { data: null, title: 'Status', className: 'align-middle text-center d-none d-xl-table-cell',
            render: function ( item )
             { return item.is_alive ? Badge ( 'success', 'Agent actif', 'UP' ) : Badge ( 'danger', 'Agent inactif', 'DOWN' ); }
          },
          { data: null, title: 'Actions', orderable: false, className: 'align-middle text-center',
            render: function ( item )
             { var b = Bouton_deroulant_start();
               b += Bouton_deroulant_add ( 'primary', 'Editer la configuration SMS', 'SMS_Edit', item.agent_tech_id, 'pen' );
               b += Bouton_deroulant_add ( 'primary', 'Voir les mnémoniques', 'Redirect', '/agents/sms/'+encodeURIComponent ( item.agent_tech_id ), 'sliders' );
               b += Bouton_deroulant_add ( 'info', "Monitorer l'agent", 'Redirect', '/agent/'+encodeURIComponent ( item.agent_tech_id ), 'chart-line' );
               b += Bouton_deroulant_add_spacer();
               b += Bouton_deroulant_add ( 'danger', "Supprimer l'agent", 'SMS_Del', item.agent_tech_id, 'trash' );
               return b+Bouton_deroulant_end();
             }
          }
        ]
     } );
    $(document).off ( 'change', '.sms-toggle-switch' ).on ( 'change', '.sms-toggle-switch', function ()
     { var toggle = $(this);
       SMS_Toggle ( toggle.data ( 'agent-tech-id' ), toggle.is ( ':checked' ), toggle );
     } );
  }
