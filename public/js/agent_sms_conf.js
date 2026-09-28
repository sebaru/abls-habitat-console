/* agent_sms_conf.js
 * Configuration des mnémoniques de l'agent SMS.
 */

 var SMS_AGENT_TECH_ID = null;

/************************************ Actualise les tableaux de mnémoniques SMS ***************************************/
 function SMSCONF_Refresh ()
  { [ 'AI', 'CI' ].forEach ( function ( classe )
     { $('#idTableSMS_'+classe).DataTable().ajax.reload ( null, false ); } );
  }

/************************************ Configure le tableau des mnémoniques SMS ****************************************/
 function SMSCONF_Table ( classe )
  { $('#idTableSMS_'+classe).DataTable(
     { pageLength: 50, fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url: $ABLS_API+'/sms/get', type: 'GET', dataSrc: classe, contentType: 'application/json',
               data: function () { return 'agent_tech_id='+encodeURIComponent ( SMS_AGENT_TECH_ID ); },
               error: function ( xhr ) { Show_shell_error ( xhr.statusText ); }
             },
       rowId: 'mnemo_id',
       columns:
        [ { data: 'acronyme', title: 'Acronyme', className: 'align-middle text-center' },
          { data: 'agent_description', title: 'Description', className: 'align-middle text-center d-none d-md-table-cell',
            render: function ( description ) { return htmlEncode ( description || "" ); } },
          { data: null, title: 'Valeur', className: 'align-middle text-center',
            render: function ( item ) { return item.valeur+' '+htmlEncode ( item.unite || '' ); }
          },
          { data: 'archivage', title: 'Archivage', className: 'align-middle text-center d-none d-xl-table-cell',
            render: function ( item ) { return item.archivage+' s'; }
          },
          { data: null, title: 'Actions', orderable: false, className: 'align-middle text-center',
            render: function ( item )
             { var boutons = Bouton_deroulant_start();
               boutons += Bouton_deroulant_add ( 'primary', 'Voir la source DLS', 'Redirect', '/dls/'+encodeURIComponent ( item.tech_id ), 'code' );
               return boutons+Bouton_deroulant_end();
             }
          }
        ]
     } );
  }

/************************************ Chargement de la page de configuration SMS ***************************************/
 function Load_page ()
  { var parts = window.location.pathname.split ( '/' );
    if ( !parts[3] ) { Redirect ( '/agents/sms' ); return; }
    SMS_AGENT_TECH_ID = decodeURIComponent ( parts[3] ).toUpperCase();
    $('#idSMSCONFTitle').text ( SMS_AGENT_TECH_ID );
    Set_page_context ( "Mnémoniques de l'agent SMS "+SMS_AGENT_TECH_ID );
    [ 'AI', 'CI' ].forEach ( SMSCONF_Table );
  }
