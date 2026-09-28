/* agent_imsg_class.js
 * Liste et gestion des agents de messagerie XMPP.
 */

/************************************ Demande de refresh **********************************************************************/
 function IMSG_Refresh ()
  { $('#idTableIMSG').DataTable().ajax.reload ( null, false );
  }

/********************************************* Activation de l'agent XMPP *****************************************************/
 function IMSG_Toggle ( agent_tech_id, newState, toggle )
  { toggle.prop ( 'disabled', true );
    Send_to_API ( 'POST', '/agent/enable', { agent_tech_id: agent_tech_id, enable: newState },
                  function ( Response )
                   { Show_toast_ok ( 'Agent XMPP ' + ( newState ? 'activé.' : 'désactivé.' ) );
                     toggle.prop ( 'disabled', false );
                     IMSG_Refresh();
                   },
                  function ( Response )
                   { toggle.prop ( 'checked', !newState ).prop ( 'disabled', false );
                     Show_shell_error ( "Erreur lors de la modification de l'agent XMPP." );
                   } );
  }

/************************************ Envoie les informations de configuration XMPP **************************************/
 function IMSG_Set ()
  { var request =
     { server_uuid: $('#idTargetServer').val(),
       agent_tech_id: $('#idIMSGTechID').val().toUpperCase(),
       description: $('#idIMSGDescription').val(),
       jabberid: $('#idIMSGJabberID').val(),
       password: $('#idIMSGPassword').val()
     };
    $('#idIMSGEdit').modal ( 'hide' );
    Send_to_API ( 'POST', '/imsg/set', request,
                  function ( Response )
                   { Show_toast_ok ( 'Modifications sauvegardées.' );
                     IMSG_Refresh();
                   },
                  function ( Response )
                   { Show_shell_error ( 'Erreur à la sauvegarde de la configuration XMPP.' ); } );
  }

/**************************************** Edition de la configuration de l'agent XMPP ***************************************/
 function IMSG_Edit ( agent_tech_id )
  { var imsg = $('#idTableIMSG').DataTable().row ( '#' + agent_tech_id ).data();
    if ( !imsg ) { Show_shell_error ( "Aucune configuration XMPP pour '" + agent_tech_id + "'." ); return; }
    $('#idIMSGTitre').text ( 'Editer la configuration XMPP ' + agent_tech_id );
    Select_from_api ( 'idTargetServer', '/servers/list', null, 'servers', 'server_uuid',
                      function ( item ) { return item.agent_tech_id; }, imsg.server_uuid );
    $('#idIMSGTechID').prop ( 'disabled', true ).val ( imsg.agent_tech_id );
    $('#idIMSGDescription').val ( imsg.description );
    $('#idIMSGJabberID').val ( imsg.jabberid );
    $('#idIMSGPassword').val ( imsg.password );
    $('#idIMSGValider').off ( 'click' ).on ( 'click', IMSG_Set );
    $('#idIMSGEdit').modal ( 'show' );
  }

/********************************************* Ajout d'un agent XMPP **********************************************************/
 function IMSG_Add ()
  { $('#idIMSGTitre').text ( 'Ajouter un agent XMPP' );
    Select_from_api ( 'idTargetServer', '/servers/list', null, 'servers', 'server_uuid',
                      function ( item ) { return item.agent_tech_id; }, null );
    $('#idIMSGTechID').prop ( 'disabled', false ).val ( '' )
      .off ( 'input' ).on ( 'input', function () { Controle_tech_id ( 'idIMSG', null ); } ).trigger ( 'input' );
    $('#idIMSGDescription,#idIMSGJabberID,#idIMSGPassword').val ( '' );
    $('#idIMSGValider').off ( 'click' ).on ( 'click', IMSG_Set );
    $('#idIMSGEdit').modal ( 'show' );
  }

/********************************************* Suppression d'un agent XMPP ****************************************************/
 function IMSG_Del ( agent_tech_id )
  { var imsg = $('#idTableIMSG').DataTable().row ( '#' + agent_tech_id ).data();
    Show_modal_del ( "Supprimer l'agent XMPP " + imsg.agent_tech_id,
                     'Etes-vous sûr de vouloir supprimer cet agent ?',
                     imsg.agent_tech_id + ' - ' + imsg.jabberid,
                     function ()
                      { Send_to_API ( 'DELETE', '/agent/delete', { agent_tech_id: imsg.agent_tech_id },
                                      function ( Response ) { IMSG_Refresh(); }, null );
                      } );
  }

/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableIMSG').DataTable(
     { pageLength: 50, fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url: $ABLS_API + '/imsg/list', type: 'GET', dataSrc: 'imsg', contentType: 'application/json',
               error: function ( xhr ) { Show_shell_error ( xhr.statusText ); }
             },
       rowId: 'agent_tech_id',
       columns:
        [ { data: null, title: 'Serveur', className: 'align-middle text-center',
            render: function ( item ) { return htmlEncode ( item.server_hostname ); }
          },
          { data: null, title: 'Activé', className: 'align-middle text-center d-none d-md-table-cell',
            render: function ( item )
             { return Switch ( 'idIMSGSwitch_' + item.agent_tech_id, "Activer ou désactiver l'agent XMPP", item.enable,
                               'imsg-toggle-switch', "data-agent-tech-id='" + htmlEncode ( item.agent_tech_id ) + "'" ); }
          },
          { data: null, title: 'Tech_id', className: 'align-middle text-center',
            render: function ( item )
             { return Lien ( '/agents/imsg/' + encodeURIComponent ( item.agent_tech_id ), 'Voir la connexion XMPP', item.agent_tech_id ); }
          },
          { data: 'description', title: 'Description', className: 'align-middle text-center d-none d-lg-table-cell' },
          { data: 'jabberid', title: 'JabberID', className: 'align-middle text-center d-none d-lg-table-cell' },
          { data: null, title: 'Status', className: 'align-middle text-center d-none d-xl-table-cell',
            render: function ( item )
             { return item.is_alive ? Badge ( 'success', 'Agent actif', 'UP' ) : Badge ( 'danger', 'Agent inactif', 'DOWN' ); }
          },
          { data: null, title: 'Actions', orderable: false, className: 'align-middle text-center',
            render: function ( item )
             { var b = Bouton_deroulant_start();
               b += Bouton_deroulant_add ( 'primary', 'Editer la configuration XMPP', 'IMSG_Edit', item.agent_tech_id, 'pen' );
               b += Bouton_deroulant_add ( 'primary', 'Voir la connexion XMPP', 'Redirect', '/agents/imsg/' + encodeURIComponent ( item.agent_tech_id ), 'sliders' );
               b += Bouton_deroulant_add ( 'info', "Monitorer l'agent", 'Redirect', '/agent/' + encodeURIComponent ( item.agent_tech_id ), 'chart-line' );
               b += Bouton_deroulant_add_spacer();
               b += Bouton_deroulant_add ( 'danger', "Supprimer l'agent", 'IMSG_Del', item.agent_tech_id, 'trash' );
               return b + Bouton_deroulant_end();
             }
          }
        ]
     } );
    $(document).off ( 'change', '.imsg-toggle-switch' ).on ( 'change', '.imsg-toggle-switch', function ()
     { var toggle = $(this);
       IMSG_Toggle ( toggle.data ( 'agent-tech-id' ), toggle.is ( ':checked' ), toggle );
     } );
  }
/*----------------------------------------------------------------------------------------------------------------------------*/