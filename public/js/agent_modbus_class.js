function MODBUS_Refresh ()
 { $('#idTableMODBUS').DataTable().ajax.reload(null, false); }

function MODBUS_Toggle ( agent_tech_id, newState, toggle )
 { toggle.prop('disabled', true);
   Send_to_API ( "POST", "/agent/enable", { agent_tech_id: agent_tech_id, enable: newState },
                 function(Response) { Show_toast_ok ( "Agent Modbus " + (newState ? "activé." : "désactivé.") ); toggle.prop('disabled', false); MODBUS_Refresh(); },
                 function(Response) { toggle.prop('checked', !newState).prop('disabled', false); Show_shell_error ( "Erreur lors de la modification de l'agent Modbus." ); } );
 }

function MODBUS_Set ()
 { var json_request =
    { server_uuid: $('#idTargetServer').val(), agent_tech_id: $('#idMODBUSTechID').val().toUpperCase(),
      hostname: $('#idMODBUSHostname').val(), description: $('#idMODBUSDescription').val(),
      watchdog: parseInt($('#idMODBUSWatchdog').val()), max_request_par_sec: parseInt($('#idMODBUSMaxRequestParSec').val()) };
   $('#idMODBUSEdit').modal("hide");
   Send_to_API ( "POST", "/modbus/set", json_request,
                 function(Response) { Show_toast_ok ("Modifications sauvegardées."); MODBUS_Refresh(); },
                 function(Response) { Show_shell_error ( "Erreur à la sauvegarde de la configuration Modbus." ); } );
 }

function MODBUS_Edit ( agent_tech_id )
 { var modbus = $('#idTableMODBUS').DataTable().row("#"+agent_tech_id).data();
   if (!modbus) { Show_shell_error ( "Aucune configuration Modbus pour '"+agent_tech_id+"'." ); return; }
   $('#idMODBUSTitre').text("Editer la configuration Modbus " + agent_tech_id);
   Select_from_api ( "idTargetServer", "/servers/list", null, "servers", "server_uuid", function (Response) { return Response.agent_tech_id; }, modbus.server_uuid );
   $('#idMODBUSTechID').prop("disabled", true).val(modbus.agent_tech_id);
   $('#idMODBUSHostname').val(modbus.hostname); $('#idMODBUSDescription').val(modbus.description);
   $('#idMODBUSWatchdog').val(modbus.watchdog); $('#idMODBUSMaxRequestParSec').val(modbus.max_request_par_sec);
   $('#idMODBUSValider').off("click").on("click", MODBUS_Set); $('#idMODBUSEdit').modal("show");
 }

function MODBUS_Add ()
 { $('#idMODBUSTitre').text("Ajouter un agent Modbus");
   Select_from_api ( "idTargetServer", "/servers/list", null, "servers", "server_uuid", function (Response) { return Response.agent_tech_id; }, null );
   $('#idMODBUSTechID').prop("disabled", false).val("").off("input").on("input", function () { Controle_tech_id("idMODBUS", null); }).trigger("input");
   $('#idMODBUSHostname, #idMODBUSDescription').val(""); $('#idMODBUSWatchdog').val("600"); $('#idMODBUSMaxRequestParSec').val("50");
   $('#idMODBUSValider').off("click").on("click", MODBUS_Set); $('#idMODBUSEdit').modal("show");
 }

function MODBUS_Del ( agent_tech_id )
 { var modbus = $('#idTableMODBUS').DataTable().row("#"+agent_tech_id).data();
   Show_modal_del ( "Supprimer l'agent Modbus "+modbus.agent_tech_id, "Etes-vous sûr de vouloir supprimer cet agent ?",
                    modbus.agent_tech_id + " - " + modbus.hostname + " - " + modbus.description,
                    function () { Send_to_API ( "DELETE", "/agent/delete", { agent_tech_id: modbus.agent_tech_id }, function(Response) { MODBUS_Refresh(); }, null ); } );
 }

function Load_page ()
 { $('#idTableMODBUS').DataTable(
    { pageLength: 50, fixedHeader: true, paging: false, ordering: true, searching: true,
      ajax: { url: $ABLS_API+"/modbus/list", type: "GET", dataSrc: "modbus", contentType: "application/json", error: function(xhr) { Show_shell_error(xhr.statusText); } },
      rowId: "agent_tech_id",
      columns:
       [ { data: null, title: "Serveur", className: "align-middle text-center", render: function(item) { return htmlEncode(item.server_hostname); } },
         { data: null, title: "Activé", className: "align-middle text-center d-none d-md-table-cell", render: function(item) { return Switch("idMODBUSSwitch_"+item.agent_tech_id, "Activer ou désactiver l'agent Modbus", item.enable, "modbus-toggle-switch", "data-agent-tech-id='"+htmlEncode(item.agent_tech_id)+"'"); } },
         { data: null, title: "Tech_id", className: "align-middle text-center", render: function(item) { return Lien("/agents/modbus/"+encodeURIComponent(item.agent_tech_id), "Gérer les I/O", item.agent_tech_id); } },
         { data: "description", title: "Description", className: "align-middle text-center d-none d-lg-table-cell" },
         { data: "hostname", title: "Hostname", className: "align-middle text-center d-none d-lg-table-cell" },
         { data: "watchdog", title: "Watchdog", className: "align-middle text-center d-none d-xl-table-cell" },
         { data: "max_request_par_sec", title: "Requêtes/s", className: "align-middle text-center d-none d-xl-table-cell" },
         { data: null, title: "Status", className: "align-middle text-center d-none d-xl-table-cell", render: function(item) { return item.is_alive ? Badge("success", "Agent actif", "UP") : Badge("danger", "Agent inactif", "DOWN"); } },
         { data: null, title: "Actions", orderable: false, className: "align-middle text-center", render: function(item) { var boutons=Bouton_deroulant_start(); boutons+=Bouton_deroulant_add("primary", "Editer la configuration Modbus", "MODBUS_Edit", item.agent_tech_id, "pen"); boutons+=Bouton_deroulant_add("primary", "Gérer les I/O", "Redirect", "/agents/modbus/"+encodeURIComponent(item.agent_tech_id), "sliders"); boutons+=Bouton_deroulant_add("info", "Monitorer l'agent", "Redirect", "/agent/"+encodeURIComponent(item.agent_tech_id), "chart-line"); boutons+=Bouton_deroulant_add_spacer(); boutons+=Bouton_deroulant_add("danger", "Supprimer l'agent", "MODBUS_Del", item.agent_tech_id, "trash"); return boutons+Bouton_deroulant_end(); } }
       ]
    });
   $(document).off('change', '.modbus-toggle-switch').on('change', '.modbus-toggle-switch', function() { var toggle=$(this); MODBUS_Toggle(toggle.data('agent-tech-id'), toggle.is(':checked'), toggle); });
 }
