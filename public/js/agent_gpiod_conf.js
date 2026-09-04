var GPIOD_AGENT_TECH_ID = null;
var Modes_InOut = [ { valeur: false, texte: 'DI - DIGITAL-INPUT' }, { valeur: true, texte: 'DO - DIGITAL OUTPUT' } ];
var Modes_ActiveLow = [ { valeur: false, texte: 'FALSE' }, { valeur: true, texte: 'TRUE' } ];

/************************************ Demande de refresh **********************************************************************/
function GPIODCONF_Refresh ( )
 { $('#idTableGPIOD_IO').DataTable().ajax.reload(null, false);
 }

/********************************************* Edition d'une I/O GPIOD *******************************************************/
function GPIODCONF_Edit ( gpiod_io_id )
 { var io = $('#idTableGPIOD_IO').DataTable().row('#' + gpiod_io_id).data();
   $('#idGPIODEditIOTitre').text ( 'Configurer ' + io.agent_tech_id + ':' + io.agent_acronyme );
   $('#idGPIODEditIOLibelle').val(io.libelle);
   $('#idGPIODEditIOModeInOut').replaceWith(Select('idGPIODEditIOModeInOut', null, Modes_InOut, io.mode_inout));
   $('#idGPIODEditIOModeActiveLow').replaceWith(Select('idGPIODEditIOModeActiveLow', null, Modes_ActiveLow, io.mode_activelow));
   $('#idGPIODEditIOValider').off('click').on('click', function()
    { var request =
       { gpiod_io_id: parseInt(gpiod_io_id),
         mode_inout: $('#idGPIODEditIOModeInOut').val() == 'true',
         mode_activelow: $('#idGPIODEditIOModeActiveLow').val() == 'true',
         libelle: $('#idGPIODEditIOLibelle').val()
       };
      $('#idGPIODEditIO').modal('hide');
      Send_to_API('POST', '/gpiod/set/io', request, function(Response) { Show_toast_ok('Modifications sauvegardées.'); GPIODCONF_Refresh(); }, null);
    });
   $('#idGPIODEditIO').modal('show');
 }

/********************************************* Edition d'un mapping GPIOD *****************************************************/
function GPIODCONF_Map ( gpiod_io_id )
 { var io = $('#idTableGPIOD_IO').DataTable().row('#' + gpiod_io_id).data();
   $('#idMODALMapTitre').text('Mapper ' + io.agent_tech_id + ':' + io.agent_acronyme);
   $('#idMODALMapRechercherTechID').off('input').on('input', function() { Common_Updater_Choix_TechID('idMODALMap', io.mode_inout ? 'DO' : 'DI'); });
   Common_Updater_Choix_TechID('idMODALMap', io.mode_inout ? 'DO' : 'DI', io.tech_id, io.acronyme);
   $('#idMODALMapValider').off('click').on('click', function()
    { $('#idMODALMap').modal('hide');
      Send_to_API('POST', '/mapping/set', { agent_tech_id: io.agent_tech_id, agent_acronyme: io.agent_acronyme, tech_id: $('#idMODALMapSelectTechID').val(), acronyme: $('#idMODALMapSelectAcronyme').val() }, function() { GPIODCONF_Refresh(); }, null);
    });
   $('#idMODALMap').modal('show');
 }

/********************************************* Appelé au chargement de la page ************************************************/
function Load_page ( )
 { var parts = window.location.pathname.split('/');
   if (!parts[3]) { Redirect('/agents/gpiod'); return; }
   GPIOD_AGENT_TECH_ID = decodeURIComponent(parts[3]).toUpperCase();
   $('#idGPIODCONFTitle').text(GPIOD_AGENT_TECH_ID);
   Set_page_context('Configuration I/O GPIOD ' + GPIOD_AGENT_TECH_ID);
   $('#idTableGPIOD_IO').DataTable(
    { pageLength: 50, fixedHeader: true, paging: false, ordering: true, searching: true,
      ajax: { url: $ABLS_API + '/gpiod/list', type: 'GET', dataSrc: 'IO', contentType: 'application/json', data: function() { return 'classe=io'; }, error: function(xhr) { Show_shell_error(xhr.statusText); } },
      rowId: 'gpiod_io_id',
      columns:
       [ { data: null, title: 'GPIOD TechID', className: 'align-middle text-center', render: function(item) { return Lien('/dls/' + item.agent_tech_id, 'Voir la source', item.agent_tech_id); } },
         { data: 'agent_acronyme', title: 'GPIOD I/O', className: 'align-middle text-center' },
         { data: null, title: 'Mapped on', className: 'align-middle text-center d-none d-md-table-cell', render: function(item) { return item.tech_id ? Lien('/dls/' + item.tech_id, 'Voir la source', item.tech_id) + ':' + item.acronyme : '--'; } },
         { data: 'libelle', title: 'Description', className: 'align-middle text-center d-none d-lg-table-cell', render: function(item) { return htmlEncode(item); } },
         { data: null, title: 'In / Out', className: 'align-middle text-center d-none d-md-table-cell', render: function(item) { return item.mode_inout ? 'OUT' : 'IN'; } },
         { data: null, title: 'ActiveLow', className: 'align-middle text-center d-none d-xl-table-cell', render: function(item) { return item.mode_activelow ? 'TRUE' : 'FALSE'; } },
         { data: null, title: 'Actions', orderable: false, className: 'align-middle text-center', render: function(item) { var buttons = Bouton_deroulant_start(); buttons += Bouton_deroulant_add('primary', 'Editer cet objet', 'GPIODCONF_Edit', item.gpiod_io_id, 'pen'); buttons += Bouton_deroulant_add('primary', 'Mapper cet objet', 'GPIODCONF_Map', item.gpiod_io_id, 'directions'); if (item.mapping_id) { buttons += Bouton_deroulant_add_spacer(); buttons += Bouton_deroulant_add('danger', 'Supprimer le mapping', 'MAPPING_Unmap', item.mapping_id, 'trash', "'GPIODCONF_Refresh'"); } return buttons + Bouton_deroulant_end(); } }
       ]
    } );
 }