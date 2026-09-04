var MODBUS_AGENT_TECH_ID = null;
var MODBUS_BORNE_TYPE = [ "none0", "none1", "750550 - 0/10 V", "750455 - 4/20 mA", "750461 - Pt-100" ];

function MODBUSCONF_Refresh () { ['DI', 'DO', 'AI', 'AO'].forEach(function(classe) { $('#idTableMODBUS_'+classe).DataTable().ajax.reload(null, false); }); }

function MODBUSCONF_Map ( classe, io_id )
 { var io = $('#idTableMODBUS_'+classe).DataTable().row('#'+io_id).data();
   $('#idMODALMapTitre').text("Mapper "+io.agent_tech_id+":"+io.agent_acronyme);
   $('#idMODALMapRechercherTechID').off("input").on("input", function () { Common_Updater_Choix_TechID("idMODALMap", classe); });
   Common_Updater_Choix_TechID("idMODALMap", classe, io.tech_id, io.acronyme);
   $('#idMODALMapValider').off("click").on("click", function () { $('#idMODALMap').modal("hide"); COMMON_Map(io.agent_tech_id, io.agent_acronyme, $('#idMODALMapSelectTechID').val(), $('#idMODALMapSelectAcronyme').val()); MODBUSCONF_Refresh(); });
   $('#idMODALMap').modal("show");
 }

function MODBUSCONF_Edit ( classe, io_id )
 { var io = $('#idTableMODBUS_'+classe).DataTable().row('#'+io_id).data();
   var id_name = 'modbus_'+classe.toLowerCase()+'_id';
   $('#idMODBUSIOEditTitre').text("Configurer "+io.agent_tech_id+":"+io.agent_acronyme);
   $('#idMODBUSIOClass').val(classe); $('#idMODBUSIOId').val(io[ id_name ]);
   $('#idMODBUSIOLibelle').val(io.libelle); $('#idMODBUSIOBorne').val(io.borne); $('#idMODBUSIOED').val(io.ed);
   $('#idMODBUSIOArchivage').replaceWith(Select("idMODBUSIOArchivage", null, ModeArchivage, io.archivage));
   $('.modbus-ai-field').toggle(classe === 'AI' || classe === 'AO'); $('.modbus-di-field').toggle(classe === 'DI');
   $('#idMODBUSIOFlip').val(io.flip ? 1 : 0); $('#idMODBUSIOMin').val(io.min); $('#idMODBUSIOMax').val(io.max); $('#idMODBUSIOUnite').val(io.unite);
   $('#idMODBUSIOTypeBorne').replaceWith(Select("idMODBUSIOTypeBorne", null, classe === 'AI' ? [ { valeur: 3, texte: MODBUS_BORNE_TYPE[3] }, { valeur: 4, texte: MODBUS_BORNE_TYPE[4] } ] : [ { valeur: 2, texte: MODBUS_BORNE_TYPE[2] } ], io.type_borne));
   $('#idMODBUSIOValider').off("click").on("click", function () {
     var payload = { archivage: parseInt($('#idMODBUSIOArchivage').val()), borne: $('#idMODBUSIOBorne').val(), ed: $('#idMODBUSIOED').val(), libelle: $('#idMODBUSIOLibelle').val() };
     payload[id_name] = parseInt($('#idMODBUSIOId').val());
     if (classe === 'DI') payload.flip = $('#idMODBUSIOFlip').val() == 1;
     if (classe === 'AI' || classe === 'AO') { payload.type_borne=parseInt($('#idMODBUSIOTypeBorne').val()); payload.min=parseInt($('#idMODBUSIOMin').val()); payload.max=parseInt($('#idMODBUSIOMax').val()); payload.unite=$('#idMODBUSIOUnite').val(); }
     $('#idMODBUSIOEdit').modal("hide"); Send_to_API("POST", "/modbus/set/"+classe.toLowerCase(), payload, function(Response) { Show_toast_ok("Modifications sauvegardées."); MODBUSCONF_Refresh(); }, null);
   });
   $('#idMODBUSIOEdit').modal("show");
 }

function MODBUSCONF_Load_table ( classe )
 { var id_field = 'modbus_'+classe.toLowerCase()+'_id';
   $('#idTableMODBUS_'+classe).DataTable({ pageLength: 50, fixedHeader: true, paging: false, ordering: true, searching: true,
     ajax: { url: $ABLS_API+"/modbus/get", type: "GET", dataSrc: classe, contentType: "application/json", data: function() { return "agent_tech_id="+encodeURIComponent(MODBUS_AGENT_TECH_ID); }, error: function(xhr) { Show_shell_error(xhr.statusText); } },
     rowId: id_field,
     columns: [
       { data: "agent_acronyme", title: "I/O", className: "align-middle text-center" },
       { data: "borne", title: "Borne", className: "align-middle text-center d-none d-md-table-cell" },
       { data: "ed", title: "ED", className: "align-middle text-center d-none d-xl-table-cell" },
       { data: null, title: "Mapped on", className: "align-middle text-center", render: function(io) { return io.tech_id ? Lien("/dls/"+io.tech_id, "Voir la source", io.tech_id)+":"+Lien("/courbe/"+io.tech_id+"/"+io.acronyme, "Voir le graphe", io.acronyme) : "--"; } },
       { data: "libelle", title: "Description", className: "align-middle text-center d-none d-lg-table-cell" },
       { data: null, title: "Type", className: "align-middle text-center d-none d-lg-table-cell", render: function(io) { return (classe === 'AI' || classe === 'AO') ? MODBUS_BORNE_TYPE[io.type_borne] : (classe === 'DI' ? (io.flip ? "Inversé" : "Normal") : ""); } },
       { data: "unite", title: "Unité", className: "align-middle text-center d-none d-xl-table-cell" },
       { data: null, title: "Actions", orderable: false, className: "align-middle text-center", render: function(io) { var buttons=Bouton_deroulant_start(); buttons+=Bouton_deroulant_add("primary", "Editer cet objet", "MODBUSCONF_Edit", classe+"','"+io[id_field], "pen"); buttons+=Bouton_deroulant_add("primary", "Mapper cet objet", "MODBUSCONF_Map", classe+"','"+io[id_field], "directions"); if (io.mapping_id) { buttons+=Bouton_deroulant_add_spacer(); buttons+=Bouton_deroulant_add("danger", "Supprimer le mapping", "MAPPING_Unmap", io.mapping_id, "trash", "'MODBUSCONF_Refresh'"); } return buttons+Bouton_deroulant_end(); } }
     ] });
 }

function Load_page ()
 { var parts=window.location.pathname.split('/'); if (!parts[3]) { Redirect('/agents/modbus'); return; }
   MODBUS_AGENT_TECH_ID=decodeURIComponent(parts[3]).toUpperCase(); $('#idMODBUSCONFTitle').text(MODBUS_AGENT_TECH_ID); Set_page_context("Configuration I/O Modbus "+MODBUS_AGENT_TECH_ID);
   ['DI', 'AI', 'DO', 'AO'].forEach(MODBUSCONF_Load_table);
 }
