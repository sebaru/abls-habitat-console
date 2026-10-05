/* agent_modbus_io.js
 * Onglet Configuration I/O d'un agent Modbus.
 */

 var MODBUS_AGENT_TECH_ID = null;

/************************************ Affiche le bit DLS mappé et son libellé ***************************************/
 function MODBUSCONF_Render_Mapping ( io )
  { if ( !io.tech_id ) return '--';
    var html = Lien ( '/dls/'+io.tech_id, 'Voir la source', io.tech_id )+':' +
               Lien ( '/courbe/'+io.tech_id+'/'+io.acronyme, 'Voir le graphe', io.acronyme );
    if ( io.libelle ) html += '<br><small class="text-muted">'+htmlEncode ( io.libelle )+'</small>';
    return html;
  }

/************************************ Actualise les quatre tableaux Modbus *******************************************/
 function MODBUSCONF_Refresh ()
  { MODBUSCONF_Refresh_DI();
    MODBUSCONF_Refresh_DO();
    MODBUSCONF_Refresh_AI();
    MODBUSCONF_Refresh_AO();
  }

/*********************************************** Entrees digitales ***************************************************/
/************************************ Actualise le tableau des entrees digitales *************************************/
 function MODBUSCONF_Refresh_DI ()
  { $('#idTableMODBUS_DI').DataTable().ajax.reload ( null, false );
  }

/************************************ Charge le tableau des entrees digitales ****************************************/
 function MODBUSCONF_Load_DI ()
  { $('#idTableMODBUS_DI').DataTable(
     { pageLength: 50, fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url: $ABLS_API+"/modbus/get", type: "GET", dataSrc: 'DI', contentType: "application/json",
               data: function () { return "agent_tech_id="+encodeURIComponent ( MODBUS_AGENT_TECH_ID ); },
               error: function ( xhr ) { Show_shell_error ( xhr.statusText ); }
             },
       rowId: 'modbus_di_id',
       columns:
        [ { data: 'agent_acronyme', title: 'I/O', className: 'align-middle text-center' },
          { data: 'borne', title: 'Borne', className: 'align-middle text-center d-none d-md-table-cell' },
          { data: 'ed', title: 'ED', className: 'align-middle text-center d-none d-xl-table-cell' },
          { data: 'description', title: 'Description', className: 'align-middle text-center d-none d-lg-table-cell',
            render: function ( description ) { return htmlEncode ( description ); } },
          { data: 'archivage', title: 'Archivage (s)', className: 'align-middle text-center d-none d-xl-table-cell' },
          { data: null, title: 'Flip', className: 'align-middle text-center',
            render: function ( io ) { return io.flip ? 'Oui - logique inversée' : 'Non - logique normale'; } },
          { data: null, title: 'Mapping', className: 'align-middle text-center', render: MODBUSCONF_Render_Mapping },
          { data: null, title: 'Actions', orderable: false, className: 'align-middle text-center',
            render: function ( io )
             { var buttons = Bouton_deroulant_start();
               buttons += Bouton_deroulant_add ( 'primary', 'Editer cet objet', 'MODBUSCONF_Edit_DI', io.modbus_di_id, 'pen' );
               buttons += Bouton_deroulant_add ( 'primary', 'Mapper cet objet', 'MODBUSCONF_Map_DI', io.modbus_di_id, 'directions' );
               if ( io.mapping_id )
                { buttons += Bouton_deroulant_add_spacer();
                  buttons += Bouton_deroulant_add ( 'danger', 'Supprimer le mapping', 'MAPPING_Unmap', io.modbus_di_id, 'trash', "'idTableMODBUS_DI','MODBUSCONF_Refresh_DI'" );
                }
               return buttons+Bouton_deroulant_end();
             }
          }
        ]
     } );
  }

/************************************ Mappe une entree digitale Modbus ***********************************************/
 function MODBUSCONF_Map_DI ( io_id )
  { var io = $('#idTableMODBUS_DI').DataTable().row ( '#'+io_id ).data();
    $('#idMODALMapTitre').text ( "Mapper "+io.agent_tech_id+":"+io.agent_acronyme );
    $('#idMODALMapRechercherTechID').off ( "input" ).on ( "input", function ()
     { Common_Updater_Choix_TechID ( "idMODALMap", 'DI' ); } );
    Common_Updater_Choix_TechID ( "idMODALMap", 'DI', io.tech_id, io.acronyme );
    $('#idMODALMapValider').off ( "click" ).on ( "click", function ()
     { $('#idMODALMap').modal ( "hide" );
       COMMON_Map ( io.agent_tech_id, io.agent_acronyme, $('#idMODALMapSelectTechID').val(), $('#idMODALMapSelectAcronyme').val() );
       MODBUSCONF_Refresh_DI();
     } );
    $('#idMODALMap').modal ( "show" );
  }

/************************************ Edite une entree digitale Modbus ***********************************************/
 function MODBUSCONF_Edit_DI ( io_id )
  { var io = $('#idTableMODBUS_DI').DataTable().row ( '#'+io_id ).data();
    $('#idMODBUSDIEditTitre').text ( "Configurer "+io.agent_tech_id+":"+io.agent_acronyme );
    $('#idMODBUSDIId').val ( io.modbus_di_id );
    $('#idMODBUSDILibelle').val ( io.description );
    $('#idMODBUSDIBorne').val ( io.borne );
    $('#idMODBUSDIED').val ( io.ed );
    $('#idMODBUSDIArchivage').replaceWith ( Select ( 'idMODBUSDIArchivage', null, ModeArchivage, io.archivage ) );
    $('#idMODBUSDIFlip').val ( io.flip ? 1 : 0 );
    $('#idMODBUSDIValider').off ( "click" ).on ( "click", MODBUSCONF_Set_DI );
    $('#idMODBUSDIEdit').modal ( "show" );
  }

/************************************ Enregistre une entree digitale Modbus ******************************************/
 function MODBUSCONF_Set_DI ()
  { var payload =
     { modbus_di_id: parseInt ( $('#idMODBUSDIId').val() ),
       description: $('#idMODBUSDILibelle').val(),
       borne: $('#idMODBUSDIBorne').val(),
       ed: $('#idMODBUSDIED').val(),
       archivage: parseInt ( $('#idMODBUSDIArchivage').val() ),
       flip: $('#idMODBUSDIFlip').val() == 1
     };
    $('#idMODBUSDIEdit').modal ( "hide" );
    Send_to_API ( "POST", "/modbus/set/di", payload,
                  function ( Response ) { Show_toast_ok ( "Modifications sauvegardées." ); MODBUSCONF_Refresh_DI(); }, null );
  }

/*********************************************** Sorties digitales ***************************************************/
/************************************ Actualise le tableau des sorties digitales *************************************/
 function MODBUSCONF_Refresh_DO ()
  { $('#idTableMODBUS_DO').DataTable().ajax.reload ( null, false );
  }

/************************************ Charge le tableau des sorties digitales ****************************************/
 function MODBUSCONF_Load_DO ()
  { $('#idTableMODBUS_DO').DataTable(
     { pageLength: 50, fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url: $ABLS_API+"/modbus/get", type: "GET", dataSrc: 'DO', contentType: "application/json",
               data: function () { return "agent_tech_id="+encodeURIComponent ( MODBUS_AGENT_TECH_ID ); },
               error: function ( xhr ) { Show_shell_error ( xhr.statusText ); }
             },
       rowId: 'modbus_do_id',
       columns:
        [ { data: 'agent_acronyme', title: 'I/O', className: 'align-middle text-center' },
          { data: 'borne', title: 'Borne', className: 'align-middle text-center d-none d-md-table-cell' },
          { data: 'ed', title: 'ED', className: 'align-middle text-center d-none d-xl-table-cell' },
          { data: 'description', title: 'Description', className: 'align-middle text-center d-none d-lg-table-cell',
            render: function ( description ) { return htmlEncode ( description ); } },
          { data: 'archivage', title: 'Archivage (s)', className: 'align-middle text-center d-none d-xl-table-cell' },
          { data: null, title: 'Mapping', className: 'align-middle text-center', render: MODBUSCONF_Render_Mapping },
          { data: null, title: 'Actions', orderable: false, className: 'align-middle text-center',
            render: function ( io )
             { var buttons = Bouton_deroulant_start();
               buttons += Bouton_deroulant_add ( 'primary', 'Editer cet objet', 'MODBUSCONF_Edit_DO', io.modbus_do_id, 'pen' );
               buttons += Bouton_deroulant_add ( 'primary', 'Mapper cet objet', 'MODBUSCONF_Map_DO', io.modbus_do_id, 'directions' );
               if ( io.mapping_id )
                { buttons += Bouton_deroulant_add_spacer();
                  buttons += Bouton_deroulant_add ( 'danger', 'Supprimer le mapping', 'MAPPING_Unmap', io.modbus_do_id, 'trash', "'idTableMODBUS_DO','MODBUSCONF_Refresh_DO'" );
                }
               return buttons+Bouton_deroulant_end();
             }
          }
        ]
     } );
  }

/************************************ Mappe une sortie digitale Modbus ***********************************************/
 function MODBUSCONF_Map_DO ( io_id )
  { var io = $('#idTableMODBUS_DO').DataTable().row ( '#'+io_id ).data();
    $('#idMODALMapTitre').text ( "Mapper "+io.agent_tech_id+":"+io.agent_acronyme );
    $('#idMODALMapRechercherTechID').off ( "input" ).on ( "input", function ()
     { Common_Updater_Choix_TechID ( "idMODALMap", 'DO' ); } );
    Common_Updater_Choix_TechID ( "idMODALMap", 'DO', io.tech_id, io.acronyme );
    $('#idMODALMapValider').off ( "click" ).on ( "click", function ()
     { $('#idMODALMap').modal ( "hide" );
       COMMON_Map ( io.agent_tech_id, io.agent_acronyme, $('#idMODALMapSelectTechID').val(), $('#idMODALMapSelectAcronyme').val() );
       MODBUSCONF_Refresh_DO();
     } );
    $('#idMODALMap').modal ( "show" );
  }

/************************************ Edite une sortie digitale Modbus ***********************************************/
 function MODBUSCONF_Edit_DO ( io_id )
  { var io = $('#idTableMODBUS_DO').DataTable().row ( '#'+io_id ).data();
    $('#idMODBUSDOEditTitre').text ( "Configurer "+io.agent_tech_id+":"+io.agent_acronyme );
    $('#idMODBUSDOId').val ( io.modbus_do_id );
    $('#idMODBUSDOLibelle').val ( io.description );
    $('#idMODBUSDOBorne').val ( io.borne );
    $('#idMODBUSDOED').val ( io.ed );
    $('#idMODBUSDOArchivage').replaceWith ( Select ( 'idMODBUSDOArchivage', null, ModeArchivage, io.archivage ) );
    $('#idMODBUSDOValider').off ( "click" ).on ( "click", MODBUSCONF_Set_DO );
    $('#idMODBUSDOEdit').modal ( "show" );
  }

/************************************ Enregistre une sortie digitale Modbus ******************************************/
 function MODBUSCONF_Set_DO ()
  { var payload =
     { modbus_do_id: parseInt ( $('#idMODBUSDOId').val() ),
       description: $('#idMODBUSDOLibelle').val(),
       borne: $('#idMODBUSDOBorne').val(),
       ed: $('#idMODBUSDOED').val(),
       archivage: parseInt ( $('#idMODBUSDOArchivage').val() )
     };
    $('#idMODBUSDOEdit').modal ( "hide" );
    Send_to_API ( "POST", "/modbus/set/do", payload,
                  function ( Response ) { Show_toast_ok ( "Modifications sauvegardées." ); MODBUSCONF_Refresh_DO(); }, null );
  }

/*********************************************** Entrees analogiques *************************************************/
 var MODBUS_AI_TYPE_BORNE = [ { valeur: 3, texte: "750455 - 4/20 mA" }, { valeur: 4, texte: "750461 - Pt-100" } ];

/************************************ Libelle le type de borne d'une entree analogique *******************************/
 function MODBUSCONF_Type_Borne_Label_AI ( type_borne )
  { for ( var i = 0; i < MODBUS_AI_TYPE_BORNE.length; i++ )
     { if ( MODBUS_AI_TYPE_BORNE[i].valeur == type_borne ) return MODBUS_AI_TYPE_BORNE[i].texte; }
    return "Type inconnu ("+type_borne+")";
  }

/************************************ Actualise le tableau des entrees analogiques ***********************************/
 function MODBUSCONF_Refresh_AI ()
  { $('#idTableMODBUS_AI').DataTable().ajax.reload ( null, false );
  }

/************************************ Charge le tableau des entrees analogiques **************************************/
 function MODBUSCONF_Load_AI ()
  { $('#idTableMODBUS_AI').DataTable(
     { pageLength: 50, fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url: $ABLS_API+"/modbus/get", type: "GET", dataSrc: 'AI', contentType: "application/json",
               data: function () { return "agent_tech_id="+encodeURIComponent ( MODBUS_AGENT_TECH_ID ); },
               error: function ( xhr ) { Show_shell_error ( xhr.statusText ); }
             },
       rowId: 'modbus_ai_id',
       columns:
        [ { data: 'agent_acronyme', title: 'I/O', className: 'align-middle text-center' },
          { data: 'borne', title: 'Borne', className: 'align-middle text-center d-none d-md-table-cell' },
          { data: 'ed', title: 'ED', className: 'align-middle text-center d-none d-xl-table-cell' },
          { data: 'description', title: 'Description', className: 'align-middle text-center d-none d-lg-table-cell',
            render: function ( description ) { return htmlEncode ( description ); } },
          { data: 'archivage', title: 'Archivage (s)', className: 'align-middle text-center d-none d-xl-table-cell' },
          { data: 'type_borne', title: 'Type de borne', className: 'align-middle text-center',
            render: function ( type_borne ) { return MODBUSCONF_Type_Borne_Label_AI ( type_borne ); } },
          { data: 'min', title: 'Valeur mini', className: 'align-middle text-center' },
          { data: 'max', title: 'Valeur maxi', className: 'align-middle text-center' },
          { data: 'unite', title: 'Unité', className: 'align-middle text-center' },
          { data: null, title: 'Mapping', className: 'align-middle text-center', render: MODBUSCONF_Render_Mapping },
          { data: null, title: 'Actions', orderable: false, className: 'align-middle text-center',
            render: function ( io )
             { var buttons = Bouton_deroulant_start();
               buttons += Bouton_deroulant_add ( 'primary', 'Editer cet objet', 'MODBUSCONF_Edit_AI', io.modbus_ai_id, 'pen' );
               buttons += Bouton_deroulant_add ( 'primary', 'Mapper cet objet', 'MODBUSCONF_Map_AI', io.modbus_ai_id, 'directions' );
               if ( io.mapping_id )
                { buttons += Bouton_deroulant_add_spacer();
                  buttons += Bouton_deroulant_add ( 'danger', 'Supprimer le mapping', 'MAPPING_Unmap', io.modbus_ai_id, 'trash', "'idTableMODBUS_AI','MODBUSCONF_Refresh_AI'" );
                }
               return buttons+Bouton_deroulant_end();
             }
          }
        ]
     } );
  }

/************************************ Mappe une entree analogique Modbus *********************************************/
 function MODBUSCONF_Map_AI ( io_id )
  { var io = $('#idTableMODBUS_AI').DataTable().row ( '#'+io_id ).data();
    $('#idMODALMapTitre').text ( "Mapper "+io.agent_tech_id+":"+io.agent_acronyme );
    $('#idMODALMapRechercherTechID').off ( "input" ).on ( "input", function ()
     { Common_Updater_Choix_TechID ( "idMODALMap", 'AI' ); } );
    Common_Updater_Choix_TechID ( "idMODALMap", 'AI', io.tech_id, io.acronyme );
    $('#idMODALMapValider').off ( "click" ).on ( "click", function ()
     { $('#idMODALMap').modal ( "hide" );
       COMMON_Map ( io.agent_tech_id, io.agent_acronyme, $('#idMODALMapSelectTechID').val(), $('#idMODALMapSelectAcronyme').val() );
       MODBUSCONF_Refresh_AI();
     } );
    $('#idMODALMap').modal ( "show" );
  }

/************************************ Edite une entree analogique Modbus *********************************************/
 function MODBUSCONF_Edit_AI ( io_id )
  { var io = $('#idTableMODBUS_AI').DataTable().row ( '#'+io_id ).data();
    $('#idMODBUSAIEditTitre').text ( "Configurer "+io.agent_tech_id+":"+io.agent_acronyme );
    $('#idMODBUSAIId').val ( io.modbus_ai_id );
    $('#idMODBUSAILibelle').val ( io.description );
    $('#idMODBUSAIBorne').val ( io.borne );
    $('#idMODBUSAIED').val ( io.ed );
    $('#idMODBUSAIArchivage').replaceWith ( Select ( 'idMODBUSAIArchivage', null, ModeArchivage, io.archivage ) );
    var options = MODBUS_AI_TYPE_BORNE.slice();
    if ( MODBUSCONF_Type_Borne_Label_AI ( io.type_borne ).indexOf ( "Type inconnu" ) === 0 )
     options.push ( { valeur: io.type_borne, texte: "Type inconnu ("+io.type_borne+")" } );
    $('#idMODBUSAITypeBorne').replaceWith ( Select ( 'idMODBUSAITypeBorne', null, options, io.type_borne ) );
    $('#idMODBUSAIMin').val ( io.min );
    $('#idMODBUSAIMax').val ( io.max );
    $('#idMODBUSAIUnite').val ( io.unite );
    $('#idMODBUSAIValider').off ( "click" ).on ( "click", MODBUSCONF_Set_AI );
    $('#idMODBUSAIEdit').modal ( "show" );
  }

/************************************ Enregistre une entree analogique Modbus ****************************************/
 function MODBUSCONF_Set_AI ()
  { var payload =
     { modbus_ai_id: parseInt ( $('#idMODBUSAIId').val() ),
       description: $('#idMODBUSAILibelle').val(),
       borne: $('#idMODBUSAIBorne').val(),
       ed: $('#idMODBUSAIED').val(),
       archivage: parseInt ( $('#idMODBUSAIArchivage').val() ),
       type_borne: parseInt ( $('#idMODBUSAITypeBorne').val() ),
       min: parseFloat ( $('#idMODBUSAIMin').val() ),
       max: parseFloat ( $('#idMODBUSAIMax').val() ),
       unite: $('#idMODBUSAIUnite').val()
     };
    $('#idMODBUSAIEdit').modal ( "hide" );
    Send_to_API ( "POST", "/modbus/set/ai", payload,
                  function ( Response ) { Show_toast_ok ( "Modifications sauvegardées." ); MODBUSCONF_Refresh_AI(); }, null );
  }

/*********************************************** Sorties analogiques *************************************************/
 var MODBUS_AO_TYPE_BORNE = [ { valeur: 2, texte: "750550 - 0/10 V" } ];

/************************************ Libelle le type de borne d'une sortie analogique *******************************/
 function MODBUSCONF_Type_Borne_Label_AO ( type_borne )
  { for ( var i = 0; i < MODBUS_AO_TYPE_BORNE.length; i++ )
     { if ( MODBUS_AO_TYPE_BORNE[i].valeur == type_borne ) return MODBUS_AO_TYPE_BORNE[i].texte; }
    return "Type inconnu ("+type_borne+")";
  }

/************************************ Actualise le tableau des sorties analogiques ***********************************/
 function MODBUSCONF_Refresh_AO ()
  { $('#idTableMODBUS_AO').DataTable().ajax.reload ( null, false );
  }

/************************************ Charge le tableau des sorties analogiques **************************************/
 function MODBUSCONF_Load_AO ()
  { $('#idTableMODBUS_AO').DataTable(
     { pageLength: 50, fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url: $ABLS_API+"/modbus/get", type: "GET", dataSrc: 'AO', contentType: "application/json",
               data: function () { return "agent_tech_id="+encodeURIComponent ( MODBUS_AGENT_TECH_ID ); },
               error: function ( xhr ) { Show_shell_error ( xhr.statusText ); }
             },
       rowId: 'modbus_ao_id',
       columns:
        [ { data: 'agent_acronyme', title: 'I/O', className: 'align-middle text-center' },
          { data: 'borne', title: 'Borne', className: 'align-middle text-center d-none d-md-table-cell' },
          { data: 'ed', title: 'ED', className: 'align-middle text-center d-none d-xl-table-cell' },
          { data: 'description', title: 'Description', className: 'align-middle text-center d-none d-lg-table-cell',
            render: function ( description ) { return htmlEncode ( description ); } },
          { data: 'archivage', title: 'Archivage (s)', className: 'align-middle text-center d-none d-xl-table-cell' },
          { data: 'type_borne', title: 'Type de borne', className: 'align-middle text-center',
            render: function ( type_borne ) { return MODBUSCONF_Type_Borne_Label_AO ( type_borne ); } },
          { data: 'min', title: 'Valeur mini', className: 'align-middle text-center' },
          { data: 'max', title: 'Valeur maxi', className: 'align-middle text-center' },
          { data: 'unite', title: 'Unité', className: 'align-middle text-center' },
          { data: null, title: 'Mapping', className: 'align-middle text-center', render: MODBUSCONF_Render_Mapping },
          { data: null, title: 'Actions', orderable: false, className: 'align-middle text-center',
            render: function ( io )
             { var buttons = Bouton_deroulant_start();
               buttons += Bouton_deroulant_add ( 'primary', 'Editer cet objet', 'MODBUSCONF_Edit_AO', io.modbus_ao_id, 'pen' );
               buttons += Bouton_deroulant_add ( 'primary', 'Mapper cet objet', 'MODBUSCONF_Map_AO', io.modbus_ao_id, 'directions' );
               if ( io.mapping_id )
                { buttons += Bouton_deroulant_add_spacer();
                  buttons += Bouton_deroulant_add ( 'danger', 'Supprimer le mapping', 'MAPPING_Unmap', io.modbus_ao_id, 'trash', "'idTableMODBUS_AO','MODBUSCONF_Refresh_AO'" );
                }
               return buttons+Bouton_deroulant_end();
             }
          }
        ]
     } );
  }

/************************************ Mappe une sortie analogique Modbus *********************************************/
 function MODBUSCONF_Map_AO ( io_id )
  { var io = $('#idTableMODBUS_AO').DataTable().row ( '#'+io_id ).data();
    $('#idMODALMapTitre').text ( "Mapper "+io.agent_tech_id+":"+io.agent_acronyme );
    $('#idMODALMapRechercherTechID').off ( "input" ).on ( "input", function ()
     { Common_Updater_Choix_TechID ( "idMODALMap", 'AO' ); } );
    Common_Updater_Choix_TechID ( "idMODALMap", 'AO', io.tech_id, io.acronyme );
    $('#idMODALMapValider').off ( "click" ).on ( "click", function ()
     { $('#idMODALMap').modal ( "hide" );
       COMMON_Map ( io.agent_tech_id, io.agent_acronyme, $('#idMODALMapSelectTechID').val(), $('#idMODALMapSelectAcronyme').val() );
       MODBUSCONF_Refresh_AO();
     } );
    $('#idMODALMap').modal ( "show" );
  }

/************************************ Edite une sortie analogique Modbus *********************************************/
 function MODBUSCONF_Edit_AO ( io_id )
  { var io = $('#idTableMODBUS_AO').DataTable().row ( '#'+io_id ).data();
    $('#idMODBUSAOEditTitre').text ( "Configurer "+io.agent_tech_id+":"+io.agent_acronyme );
    $('#idMODBUSAOId').val ( io.modbus_ao_id );
    $('#idMODBUSAOLibelle').val ( io.description );
    $('#idMODBUSAOBorne').val ( io.borne );
    $('#idMODBUSAOED').val ( io.ed );
    $('#idMODBUSAOArchivage').replaceWith ( Select ( 'idMODBUSAOArchivage', null, ModeArchivage, io.archivage ) );
    var options = MODBUS_AO_TYPE_BORNE.slice();
    if ( MODBUSCONF_Type_Borne_Label_AO ( io.type_borne ).indexOf ( "Type inconnu" ) === 0 )
     options.push ( { valeur: io.type_borne, texte: "Type inconnu ("+io.type_borne+")" } );
    $('#idMODBUSAOTypeBorne').replaceWith ( Select ( 'idMODBUSAOTypeBorne', null, options, io.type_borne ) );
    $('#idMODBUSAOMin').val ( io.min );
    $('#idMODBUSAOMax').val ( io.max );
    $('#idMODBUSAOUnite').val ( io.unite );
    $('#idMODBUSAOValider').off ( "click" ).on ( "click", MODBUSCONF_Set_AO );
    $('#idMODBUSAOEdit').modal ( "show" );
  }

/************************************ Enregistre une sortie analogique Modbus ****************************************/
 function MODBUSCONF_Set_AO ()
  { var payload =
     { modbus_ao_id: parseInt ( $('#idMODBUSAOId').val() ),
       description: $('#idMODBUSAOLibelle').val(),
       borne: $('#idMODBUSAOBorne').val(),
       ed: $('#idMODBUSAOED').val(),
       archivage: parseInt ( $('#idMODBUSAOArchivage').val() ),
       type_borne: parseInt ( $('#idMODBUSAOTypeBorne').val() ),
       min: parseFloat ( $('#idMODBUSAOMin').val() ),
       max: parseFloat ( $('#idMODBUSAOMax').val() ),
       unite: $('#idMODBUSAOUnite').val()
     };
    $('#idMODBUSAOEdit').modal ( "hide" );
    Send_to_API ( "POST", "/modbus/set/ao", payload,
                  function ( Response ) { Show_toast_ok ( "Modifications sauvegardées." ); MODBUSCONF_Refresh_AO(); }, null );
  }

/************************************ Charge la page de configuration Modbus ******************************************/
 function Load_page ()
  { var agent = AGENT_from_path();
    if ( !agent ) { Redirect ( '/agents?classe=modbus' ); return; }
    MODBUS_AGENT_TECH_ID = agent.agent_tech_id;
    AGENT_Header ( 'modbus', MODBUS_AGENT_TECH_ID, 'io' );
    MODBUSCONF_Load_DI();
    MODBUSCONF_Load_DO();
    MODBUSCONF_Load_AI();
    MODBUSCONF_Load_AO();
  }