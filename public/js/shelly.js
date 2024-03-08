

 var Shelly_Type = [ { texte: "Shelly PRO EM", id: "shellyproem50" } ];

 function SHELLY_Refresh ( )
  { $('#idTableSHELLY').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function SHELLY_Disable (shelly_id)
  { $("#idButtonSpinner_SHELLY_Disable_"+shelly_id).show();
    selection = $('#idTableSHELLY').DataTable().row("#"+shelly_id).data();
    Thread_enable ( selection.thread_tech_id, false, function(Response) { SHELLY_Refresh(); }, function(Response) { SHELLY_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function SHELLY_Enable (shelly_id)
  { $("#idButtonSpinner_SHELLY_Enable_"+shelly_id).show();
    selection = $('#idTableSHELLY').DataTable().row("#"+shelly_id).data();
    Thread_enable ( selection.thread_tech_id, true, function(Response) { SHELLY_Refresh(); }, function(Response) { SHELLY_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function SHELLY_Debug (shelly_id)
  { $("#idButtonSpinner_SHELLY_Debug_"+shelly_id).show();
    selection = $('#idTableSHELLY').DataTable().row("#"+shelly_id).data();
    Thread_debug ( selection.thread_tech_id, true, function(Response) { SHELLY_Refresh(); }, function(Response) { SHELLY_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function SHELLY_Undebug (shelly_id)
  { $("#idButtonSpinner_SHELLY_Undebug_"+shelly_id).show();
    selection = $('#idTableSHELLY').DataTable().row("#"+shelly_id).data();
    Thread_debug ( selection.thread_tech_id, false, function(Response) { SHELLY_Refresh(); }, function(Response) { SHELLY_Refresh(); } );
  }
/**************************************** Supprime une connexion shelly *******************************************************/
 function SHELLY_Del (shelly_id)
  { selection = $('#idTableSHELLY').DataTable().row("#"+shelly_id).data();
    Show_modal_del ( "Supprimer la connexion "+selection.thread_tech_id,
                     "Etes-vous sûr de vouloir supprimer cette connexion ?",
                     selection.thread_tech_id + " - "+selection.hostname +" - "+ selection.description,
                     function () { Thread_delete ( selection.thread_tech_id, function(Response) { SHELLY_Refresh(); }, null ); } ) ;
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function SHELLY_Set ( selection )
  { var json_request =
     { agent_uuid:     $('#idTargetAgent').val(),
       thread_classe : "shelly",
       thread_tech_id: $('#idSHELLYTechID').val().toUpperCase(),
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
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, selection.agent_uuid );
    $('#idSHELLYTitre').text("Editer la connexion SHELLY " + selection.thread_tech_id);
    $('#idSHELLYTechID').prop ("disabled", true).val( selection.thread_tech_id );
    $('#idSHELLYHostname').val ( selection.hostname );
    $('#idSHELLYDescription').val( selection.description );
    $('#idSHELLYStringID').val( selection.string_id );
    $('#idSHELLYValider').off("click").on( "click", function () { SHELLY_Set(selection); } );
    $('#idSHELLYEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function SHELLY_Add ( )
  { $('#idSHELLYTitre').text("Ajouter un SHELLY");
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, null );
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
       rowId: "shelly_id",
       ajax: { url : $ABLS_API+"/thread/list", type : "GET", dataSrc: "shelly", contentType: "application/json",
               data: function() { return ( "classe=shelly" ); },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       columns:
        [ { "data": null, "title":"Agent", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.agent_hostname) ); }
          },
          { "data": null, "title":"Enable", "className": "align-middle text-center",
             "render": function (item)
              { if (item.enable==true)
                { return( Bouton ( "success", "Désactiver le module", "SHELLY_Disable", item.shelly_id, "Actif" ) ); }
               else
                { return( Bouton ( "outline-secondary", "Activer le module", "SHELLY_Enable", item.shelly_id, "Désactivé" ) ); }
              },
          },
           { "data": null, "title":"Debug", "className": "align-middle text-center",
             "render": function (item)
              { if (item.debug==true)
                 { return( Bouton ( "warning", "Désactiver le debug", "SHELLY_Undebug", item.shelly_id, "Actif" ) ); }
                else
                 { return( Bouton ( "outline-secondary", "Activer le debug", "SHELLY_Debug", item.shelly_id, "Désactivé" ) ); }
              },
           },
          { "data": null, "title":"Tech_id", "className": "align-middle text-center",
            "render": function (item)
              { return( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
          },
          { "data": "description", "title":"Description", "className": "align-middle text-center " },
          { "data": "hostname", "title":"Hostname", "className": "align-middle text-center " },
          { "data": null, "title":"string_id", "className": "align-middle text-center",
            "render": function (item)
              { return( htmlEncode ( item.string_id ) );
              },
          },
          { "data": null, "title":"Last Comm", "className": "align-middle text-center",
            "render": function (item)
              { if (item.last_comm==null) return( Badge( "info", "Thread à l'arret", "Stopped" ) );
                return( htmlEncode ( item.last_comm ) );
              },
          },
          { "data": null, "title":"Actions", "orderable": false, "className": "align-middle text-center", "render": function (item)
              { boutons = Bouton_actions_start ();
                boutons += Bouton_actions_add ( "outline-primary", "Editer le module", "SHELLY_Edit", item.shelly_id, "pen", null );
                boutons += Bouton_actions_add ( "danger", "Supprimer le module", "SHELLY_Del", item.shelly_id, "trash", null );
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
