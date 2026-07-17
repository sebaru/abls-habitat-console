

 var Shelly_Type = [ { texte: "Shelly PRO EM", id: "shellyproem50" } ];

 function SHELLY_Refresh ( )
  { $('#idTableSHELLY').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function SHELLY_Disable (shelly_id)
  { $("#idButtonSpinner_SHELLY_Disable_"+shelly_id).show();
    selection = $('#idTableSHELLY').DataTable().row("#"+shelly_id).data();
    Send_to_API ( "POST", "/agent/enable", { agent_tech_id: selection.agent_tech_id, enable: false },
                  function(Response) { SHELLY_Refresh(); }, function(Response) { SHELLY_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function SHELLY_Enable (shelly_id)
  { $("#idButtonSpinner_SHELLY_Enable_"+shelly_id).show();
    selection = $('#idTableSHELLY').DataTable().row("#"+shelly_id).data();
    Send_to_API ( "POST", "/agent/enable", { agent_tech_id: selection.agent_tech_id, enable: true },
                  function(Response) { SHELLY_Refresh(); }, function(Response) { SHELLY_Refresh(); } );
  }
/**************************************** Supprime une connexion shelly *******************************************************/
 function SHELLY_Del (shelly_id)
  { selection = $('#idTableSHELLY').DataTable().row("#"+shelly_id).data();
    Show_modal_del ( "Supprimer la connexion "+selection.agent_tech_id,
                     "Etes-vous sûr de vouloir supprimer cette connexion ?",
                     selection.agent_tech_id + " - "+selection.hostname +" - "+ selection.description,
                     function () { Send_to_API ( "DELETE", "/agent/delete", { agent_tech_id: selection.agent_tech_id },
                                                 function(Response) { SHELLY_Refresh(); }, null ); } ) ;
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function SHELLY_Set ( selection )
  { var json_request =
     { server_uuid:    $('#idTargetServer').val(),
       agent_tech_id:  $('#idSHELLYTechID').val().toUpperCase(),
       hostname:       $('#idSHELLYHostname').val(),
       description:    $('#idSHELLYDescription').val(),
       string_id:      $('#idSHELLYStringID').val(),
     };

    Send_to_API ( "POST", "/shelly/set", json_request,
                  (Response) => { Show_toast_ok ("Modifications sauvegardées.");
                                  SHELLY_Refresh();
                                }, null );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function SHELLY_Edit ( shelly_id )
  { selection = $('#idTableSHELLY').DataTable().row("#"+shelly_id).data();
    Select_from_api ( "idTargetServer", "/servers/list", null, "servers", "server_uuid", function (Response)
                        { return ( Response.server_hostname ); }, selection.server_uuid );
    $('#idSHELLYTitre').text("Editer la connexion SHELLY " + selection.agent_tech_id);
    $('#idSHELLYTechID').prop ("disabled", true).val( selection.agent_tech_id );
    $('#idSHELLYHostname').val ( selection.hostname );
    $('#idSHELLYDescription').val( selection.description );
    $('#idSHELLYStringID').val( selection.string_id );
    $('#idSHELLYValider').off("click").on( "click", function () { SHELLY_Set(selection); } );
    $('#idSHELLYEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function SHELLY_Add ( )
  { $('#idSHELLYTitre').text("Ajouter un SHELLY");
    Select_from_api ( "idTargetServer", "/servers/list", null, "servers", "server_uuid", function (Response)
                        { return ( Response.server_hostname ); }, null );
    $('#idSHELLYTechID').prop ("disabled", false).val("")
      .off("input").on("input", function () { Controle_tech_id( "idSHELLY", null ); } ).trigger("input");
    $('#idSHELLYHostname').val ( "" );
    $('#idSHELLYDescription').val( "" );
    $('#idSHELLYStringID').val( "" );
    $('#idSHELLYValider').off("click").on( "click", function () { SHELLY_Set(null); } );
    $('#idSHELLYEdit').modal("show");
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableSHELLY').DataTable(
     { pageLength : 50,
       fixedHeader: true,
       rowId: "agent_tech_id",
       ajax: { url : $ABLS_API+"/agent/list", type : "GET", dataSrc: "agents", contentType: "application/json",
               data: function() { return ( "classe=shelly" ); },
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       columns:
        [ { "data": null, "title":"Serveur", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.server_hostname) ); }
          },
          { "data": null, "title":"Enable", "className": "align-middle text-center d-none d-md-table-cell",
             "render": function (item)
              { if (item.enable==true)
                { return( Bouton ( "success", "Désactiver le module", "SHELLY_Disable", item.agent_tech_id, "Actif" ) ); }
               else
                { return( Bouton ( "outline-secondary", "Activer le module", "SHELLY_Enable", item.agent_tech_id, "Désactivé" ) ); }
              },
          },
          { "data": null, "title":"Tech_id", "className": "align-middle text-center",
            "render": function (item)
              { return( Lien ( "/dls/"+item.agent_tech_id, "Voir la source", item.agent_tech_id ) ); }
          },
          { "data": "description", "title":"Description", "className": "align-middle text-center d-none d-lg-table-cell " },
          { "data": "hostname", "title":"Hostname", "className": "align-middle text-center d-none d-lg-table-cell ",
            "render": function (item)
              { return( Lien ( "http://"+item, "Voir la page du Shelly", item ) );
              },
          },
          { "data": null, "title":"string_id", "className": "align-middle text-center d-none d-xl-table-cell",
            "render": function (item)
              { return( htmlEncode ( item.string_id ) );
              },
          },
          { "data": null, "title":"Actions", "orderable": false, "className": "align-middle text-center", "render": function (item)
              { boutons = Bouton_deroulant_start ( );
                boutons += Bouton_deroulant_add ( "primary", "Editer le module", "SHELLY_Edit", item.agent_tech_id, "pen" );
                boutons += Bouton_deroulant_add_spacer ();
                boutons += Bouton_deroulant_add ( "danger", "Supprimer le module", "SHELLY_Del", item.agent_tech_id, "trash" );
                boutons += Bouton_deroulant_end ();
                return(boutons);
              },
          }
        ],
       /*order: [ [0, "desc"] ],*/
     });
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
