/************************************ Demande de refresh **********************************************************************/
 function TELEINFO_Refresh ( )
  { $('#idTableTELEINFO').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function TELEINFO_Disable (teleinfoedf_id)
  { $("#idButtonSpinner_TELEINFO_Disable_"+teleinfoedf_id).show();
    selection = $('#idTableTELEINFO').DataTable().row("#"+teleinfoedf_id).data();
    Thread_enable ( selection.thread_tech_id, false, function(Response) { TELEINFO_Refresh(); }, function(Response) { TELEINFO_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function TELEINFO_Enable (teleinfoedf_id)
  { $("#idButtonSpinner_TELEINFO_Enable_"+teleinfoedf_id).show();
    selection = $('#idTableTELEINFO').DataTable().row("#"+teleinfoedf_id).data();
    Thread_enable ( selection.thread_tech_id, true, function(Response) { TELEINFO_Refresh(); }, function(Response) { TELEINFO_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function TELEINFO_Debug (teleinfoedf_id)
  { $("#idButtonSpinner_TELEINFO_Debug_"+teleinfoedf_id).show();
    selection = $('#idTableTELEINFO').DataTable().row("#"+teleinfoedf_id).data();
    Thread_debug ( selection.thread_tech_id, true, function(Response) { TELEINFO_Refresh(); }, function(Response) { TELEINFO_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function TELEINFO_Undebug (teleinfoedf_id)
  { $("#idButtonSpinner_TELEINFO_Undebug_"+teleinfoedf_id).show();
    selection = $('#idTableTELEINFO').DataTable().row("#"+teleinfoedf_id).data();
    Thread_debug ( selection.thread_tech_id, false, function(Response) { TELEINFO_Refresh(); }, function(Response) { TELEINFO_Refresh(); } );
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function TELEINFO_Set ( selection )
  { var json_request =
     { agent_uuid    : $('#idTargetAgent').val(),
       thread_tech_id: $('#idTELEINFOTechID').val().toUpperCase(),
       description:    $('#idTELEINFODescription').val(),
       port:           $('#idTELEINFOPort').val(),
       standard:       $('#idTELEINFOStandard').val() == "true",
       /*standard:       (parseInt($('#idTELEINFOStandard').val()) == 1 ? true : false),*/
     };

    Send_to_API ( "POST", "/teleinfoedf/set", json_request, function(Response)
     { Show_toast_ok ( "Modification sauvegardée.");
       TELEINFO_Refresh();
     }, function(Response) { TELEINFO_Refresh(); } );

  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function TELEINFO_Edit ( teleinfoedf_id )
  { selection = $('#idTableTELEINFO').DataTable().row("#"+teleinfoedf_id).data();
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, selection.agent_uuid );
    $('#idTELEINFOTitre').text("Editer la connexion GSM " + selection.thread_tech_id);
    $('#idTELEINFOTechID').prop ("disabled", true).val( selection.thread_tech_id );
    $('#idTELEINFODescription').val( selection.description );
    $('#idTELEINFOStandard').replaceWith (
                                           Select ( "idTELEINFOStandard", null,
                                                    [ { valeur: false, texte: "Historique" }, { valeur: true, texte: "Standard" } ],
                                                    selection.standard )
                                         );
    $('#idTELEINFOPort').val( selection.port );
    $('#idTELEINFOValider').off("click").on( "click", function () { TELEINFO_Set(selection); } );
    $('#idTELEINFOEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function TELEINFO_Add ( )
  { $('#idTELEINFOTitre').text("Ajouter une téléinfo E.D.F");
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, null );
    $('#idTELEINFOTechID').prop ("disabled", false).val("").off("input").on("input", function () { Controle_thread_tech_id( "idTELEINFO", null ); } );
    $('#idTELEINFODescription').val("");
    $('#idTELEINFOPort').val("");
    $('#idTELEINFOStandard').replaceWith ( Select ( "idTELEINFOStandard", null,
                                                    [ { valeur: false, texte: "Historique" }, { valeur: true, texte: "Standard" } ],
                                                    false )
                                         );
    $('#idTELEINFOValider').off("click").on( "click", function () { TELEINFO_Set(null); } );
    $('#idTELEINFOEdit').modal("show");
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function TELEINFO_Del_Valider ( selection )
  { var json_request = { uuid : selection.uuid, thread_tech_id: selection.thread_tech_id };
    Send_to_API ( 'DELETE', "/thread/delete", json_request, function(Response)
     { Show_toast_ok ( "Téléinfo EDF supprimée.");
       TELEINFO_Refresh();
     }, function(Response) { TELEINFO_Refresh(); } );
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function TELEINFO_Del ( teleinfoedf_id )
  { selection = $('#idTableTELEINFO').DataTable().row("#"+teleinfoedf_id).data();
    Show_modal_del ( "Supprimer la connexion "+selection.thread_tech_id,
                     "Etes-vous sûr de vouloir supprimer cette connexion ?",
                     selection.thread_tech_id + " - "+selection.description,
                     function () { TELEINFO_Del_Valider( selection ) } ) ;
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableTELEINFO').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/thread/list", type : "GET", dataSrc: "teleinfoedf", contentType: "application/json",
               data: function() { return ( "classe=teleinfoedf" ); },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "teleinfoedf_id",
       columns:
         [ { "data": null, "title":"Agent", "className": "align-middle text-center",
              "render": function (item)
               { return( htmlEncode(item.agent_hostname) ); }
           },
           { "data": null, "title":"Enabled", "className": "align-middle text-center",
             "render": function (item)
              { if (item.enable==true)
                 { return( Bouton ( "success", "Désactiver la téléinfo",
                                    "TELEINFO_Disable", item.teleinfoedf_id, "Actif" ) );
                 }
                else
                 { return( Bouton ( "outline-secondary", "Activer la téléinfo",
                                    "TELEINFO_Enable", item.teleinfoedf_id, "Désactivé" ) );
                 }
              },
           },
           { "data": null, "title":"Debug", "className": "align-middle text-center",
             "render": function (item)
              { if (item.debug==true)
                 { return( Bouton ( "warning", "Désactiver le debug", "TELEINFO_Undebug", item.teleinfoedf_id, "Actif" ) ); }
                else
                 { return( Bouton ( "outline-secondary", "Activer le debug", "TELEINFO_Debug", item.teleinfoedf_id, "Désactivé" ) ); }
              },
           },
           { "data": null, "title":"Tech_id", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
           },
           { "data": "description", "title":"Description", "className": "align-middle " },
           { "data": "port", "title":"Device Port", "className": "align-middle " },
           { "data": null, "title":"Mode", "className": "align-middle text-center",
             "render": function (item)
              { if (item.standard) return ( Bouton( "info", "Mode TIC Standard", null, null, "Standard" ) );
                                   return ( Bouton( "secondary", "Mode TIC Historique", null, null, "Historique" ) );
              },
           },
           { "data": null, "title":"Connexion", "className": "align-middle text-center",
             "render": function (item)
               { if (item.is_alive) return( Badge( "success", "Connecté", "Connecté" ) );
                 return( Badge( "info", "Déconnecté", "Déconnecté" ) );
               },
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "primary", "Editer la connexion", "TELEINFO_Edit", item.teleinfoedf_id, "pen", null );
                 boutons += Bouton_actions_add ( "danger", "Supprimer la connexion", "TELEINFO_Del", item.teleinfoedf_id, "trash", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

  }
/*----------------------------------------------------------------------------------------------------------------------------*/
