/************************************ Demande de refresh **********************************************************************/
 function PHIDGET_Refresh ( )
  { $('#idTablePHIDGET').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function PHIDGET_Disable (phidget_id)
  { $("#idButtonSpinner_PHIDGET_Disable_"+phidget_id).show();
    selection = $('#idTablePHIDGET').DataTable().row("#"+phidget_id).data();
    Send_to_API ( "POST", "/agent/enable", { agent_tech_id: selection.agent_tech_id, enable: false },
                  function(Response) { PHIDGET_Refresh(); }, function(Response) { PHIDGET_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function PHIDGET_Enable (phidget_id)
  { $("#idButtonSpinner_PHIDGET_Enable_"+phidget_id).show();
    selection = $('#idTablePHIDGET').DataTable().row("#"+phidget_id).data();
    Send_to_API ( "POST", "/agent/enable", { agent_tech_id: selection.agent_tech_id, enable: true },
                  function(Response) { PHIDGET_Refresh(); }, function(Response) { PHIDGET_Refresh(); } );
  }
/**************************************** Supprime une connexion PHIDGET *******************************************************/
 function PHIDGET_Del (phidget_id)
  { selection = $('#idTablePHIDGET').DataTable().row("#"+phidget_id).data();
    Show_modal_del ( "Supprimer la connexion "+selection.agent_tech_id,
                     "Etes-vous sûr de vouloir supprimer cette connexion ?",
                     selection.agent_tech_id + " - " + selection.hostname + " - " + selection.description,
                     function () { Send_to_API ( "DELETE", "/agent/delete", { agent_tech_id: selection.agent_tech_id },
                                                 function(Response) { PHIDGET_Refresh(); }, null ); } ) ;
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function PHIDGET_Set ( selection )
  { var json_request =
     { server_uuid:    $('#idTargetServer').val(),
       agent_tech_id:  $('#idPHIDGETTechID').val().toUpperCase(),
       description: $('#idPHIDGETDescription').val(),
       hostname   : $('#idPHIDGETHostname').val(),
       password   : $('#idPHIDGETPassword').val(),
       serial     : Number($('#idPHIDGETSerial').val())
     };
    Send_to_API ( "POST", "/phidget/set", json_request,
                  (Response) => { Show_toast_ok ("Modifications sauvegardées.");
                                  PHIDGET_Refresh();
                                }, null );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function PHIDGET_Edit ( phidget_id )
  { selection = $('#idTablePHIDGET').DataTable().row("#"+phidget_id).data();
    Select_from_api ( "idTargetServer", "/servers/list", null, "servers", "server_uuid", function (Response)
                        { return ( Response.server_hostname ); }, selection.server_uuid );
    $('#idPHIDGETTitre').text("Editer la connexion " + selection.agent_tech_id);
    $('#idPHIDGETTechID').prop ("disabled", true).val( selection.agent_tech_id );
    $('#idPHIDGETDescription').val( selection.description );
    $('#idPHIDGETHostname').val( selection.hostname );
    $('#idPHIDGETPassword').val( selection.password );
    $('#idPHIDGETSerial').attr({ min: 0, max: 999999, step: 1 }).val( selection.serial );
    $('#idPHIDGETValider').off("click").on( "click", function () { PHIDGET_Set(selection); } );
    $('#idPHIDGETEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function PHIDGET_Add ( )
  { $('#idPHIDGETTitre').text("Ajouter un équipement Phidget");
    Select_from_api ( "idTargetServer", "/servers/list", null, "servers", "server_uuid", function (Response)
                        { return ( Response.server_hostname ); }, null );
    $('#idPHIDGETTechID').prop ("disabled", false).val("")
      .off("input").on("input", function () { Controle_tech_id( "idPHIDGET", null ); } ).trigger("input");
    $('#idPHIDGETDescription').val("");
    $('#idPHIDGETHostname').val( "" );
    $('#idPHIDGETPassword').val( "" );
      $('#idPHIDGETSerial').attr({ min: 0, max: 999999, step: 1 }).val( "" );
    $('#idPHIDGETValider').off("click").on( "click", function () { PHIDGET_Set(null); } );
    $('#idPHIDGETEdit').modal("show");
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTablePHIDGET').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/agent/list", type : "GET", dataSrc: "agents", contentType: "application/json",
               data: function() { return ( "classe=phidget" ) },
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
      rowId: "agent_tech_id",
       columns:
        [ { "data": null, "title":"Serveur", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.server_hostname) ); }
          },
          { "data": null, "title":"Enable", "className": "align-middle text-center d-none d-md-table-cell",
             "render": function (item)
              { if (item.enable==true)
                { return( Bouton ( "success", "Désactiver le module", "PHIDGET_Disable", item.agent_tech_id, "Actif" ) ); }
               else
                { return( Bouton ( "outline-secondary", "Activer le module", "PHIDGET_Enable", item.agent_tech_id, "Désactivé" ) ); }
              },
          },
          { "data": null, "title":"Tech_id", "className": "align-middle text-center",
            "render": function (item)
              { return( Lien ( "/phidget/"+encodeURIComponent(item.agent_tech_id), "Editer les I/O", item.agent_tech_id ) ); }
          },
          { "data": "description", "title":"Description", "className": "align-middle text-center d-none d-lg-table-cell " },
          { "data": "hostname", "title":"Hostname", "className": "align-middle text-center d-none d-lg-table-cell " },
          { "data": "password", "title":"Password", "className": "align-middle text-center d-none d-xl-table-cell " },
          { "data": "serial", "title":"Serial Number", "className": "align-middle text-center d-none d-xl-table-cell " },
          { "data": null, "title":"Connexion", "className": "align-middle text-center d-none d-md-table-cell",
            "render": function (item)
              { if (item.is_alive) return( Badge( "success", "Connecté", "Connecté" ) );
                return( Badge( "danger", "Déconnecté", "Déconnecté" ) );
              },
          },
          { "data": null, "title":"MQTT", "className": "align-middle text-center d-none d-lg-table-cell",
            "render": function (item)
              { if (item.mqtt_connected) return( Badge( "success", "Connecté", "Connecté" ) );
                return( Badge( "danger", "Déconnecté", "Déconnecté" ) );
              },
          },
          { "data": null, "title":"Log level", "className": "align-middle text-center d-none d-xl-table-cell",
            "render": function (item)
              { return( Render_log_level_selector ( item.agent_tech_id, item.log_level ) );
              },
           },
          { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
            "render": function (item)
              { boutons = Bouton_deroulant_start ( );
                boutons += Bouton_deroulant_add ( "primary", "Editer la connexion", "PHIDGET_Edit", item.agent_tech_id, "pen" );
                boutons += Bouton_deroulant_add ( "primary", "Editer les I/O", "Redirect", "/phidget/"+encodeURIComponent(item.agent_tech_id), "sliders" );
                boutons += Bouton_deroulant_add_spacer ();
                boutons += Bouton_deroulant_add ( "primary", "Voir la source DLS", "Redirect", "/dls/"+encodeURIComponent(item.agent_tech_id), "code" );
                boutons += Bouton_deroulant_add_spacer ();
                boutons += Bouton_deroulant_add ( "danger", "Supprimer la connexion", "PHIDGET_Del", item.agent_tech_id, "trash" );
                boutons += Bouton_deroulant_end ();
                return(boutons);
              },
          }
         ],
       /*order: [ [0, "desc"] ],*/
     });
  }