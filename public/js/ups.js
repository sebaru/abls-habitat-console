/************************************ Demande de refresh **********************************************************************/
 function UPS_Refresh ( )
  { $('#idTableUPS').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function UPS_Disable (ups_id)
  { $("#idButtonSpinner_UPS_Disable_"+ups_id).show();
    selection = $('#idTableUPS').DataTable().row("#"+ups_id).data();
    Thread_enable ( selection.thread_tech_id, false, function(Response) { UPS_Refresh(); }, function(Response) { UPS_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function UPS_Enable (ups_id)
  { $("#idButtonSpinner_UPS_Enable_"+ups_id).show();
    selection = $('#idTableUPS').DataTable().row("#"+ups_id).data();
    Thread_enable ( selection.thread_tech_id, true, function(Response) { UPS_Refresh(); }, function(Response) { UPS_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function UPS_Debug (ups_id)
  { $("#idButtonSpinner_UPS_Debug_"+ups_id).show();
    selection = $('#idTableUPS').DataTable().row("#"+ups_id).data();
    Thread_debug ( selection.thread_tech_id, true, function(Response) { UPS_Refresh(); }, function(Response) { UPS_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function UPS_Undebug (ups_id)
  { $("#idButtonSpinner_UPS_Undebug_"+ups_id).show();
    selection = $('#idTableUPS').DataTable().row("#"+ups_id).data();
    Thread_debug ( selection.thread_tech_id, false, function(Response) { UPS_Refresh(); }, function(Response) { UPS_Refresh(); } );
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function UPS_Set ( selection )
  { var json_request =
     { agent_uuid    : $('#idTargetAgent').val(),
       thread_tech_id: $('#idUPSTechID').val().toUpperCase(),
       host:           $('#idUPSHost').val(),
       name:           $('#idUPSName').val(),
       admin_username: $('#idUPSAdminUsername').val(),
       admin_password: $('#idUPSAdminPassword').val(),
     };

    Send_to_API ( "POST", "/ups/set", json_request, function(Response)
     { Show_toast_ok ( "Modification sauvegardée.");
       UPS_Refresh();
     }, function(Response) { UPS_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function UPS_Edit ( ups_id )
  { selection = $('#idTableUPS').DataTable().row("#"+ups_id).data();
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, selection.agent_uuid );
    $('#idUPSTitre').text("Editer la connexion UPS " + selection.thread_tech_id);
    $('#idUPSTechID').prop ("disabled", true).val( selection.thread_tech_id );
    $('#idUPSHost').val( selection.host );
    $('#idUPSName').val( selection.name );
    $('#idUPSAdminUsername').val( selection.admin_username );
    $('#idUPSAdminPassword').val( selection.admin_password );
    $('#idUPSValider').off("click").on( "click", function () { UPS_Set(selection); } );
    $('#idUPSEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function UPS_Add ( )
  { $('#idUPSTitre').text("Ajouter un UPS");
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, null );
    $('#idUPSTechID').val("").prop ("disabled", false).val("").off("input").on("input", function () { Controle_tech_id( "idUPS", null ); } );
    $('#idUPSHost').val( "" );
    $('#idUPSName').val( "" );
    $('#idUPSAdminUsername').val( "" );
    $('#idUPSAdminPassword').val( "" );
    $('#idUPSValider').off("click").on( "click", function () { UPS_Set(null); } );
    $('#idUPSEdit').modal("show");
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function UPS_Del_Valider ( selection )
  { var json_request = { uuid : selection.uuid, thread_tech_id: selection.thread_tech_id };
    Send_to_API ( 'DELETE', "/thread/delete", json_request, function(Response)
     { Show_toast_ok ( "Alimentation UPS supprimée.");
       UPS_Refresh();
     }, function(Response) { UPS_Refresh(); } );
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function UPS_Del ( ups_id )
  { selection = $('#idTableUPS').DataTable().row("#"+ups_id).data();
    Show_modal_del ( "Supprimer la connexion "+selection.thread_tech_id,
                     "Etes-vous sûr de vouloir supprimer cette connexion ?",
                     selection.thread_tech_id + " - "+selection.name +"@"+ selection.host,
                     function () { UPS_Del_Valider( selection ) } ) ;
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableUPS').DataTable(
     { pageLength : 50,
       fixedHeader: true,
       rowId: "ups_id",
       ajax: { url : $ABLS_API+"/thread/list", type : "GET", dataSrc: "ups", contentType: "application/json",
               data: function() { return ( "classe=ups" ); },
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
            { "data": null, "title":"Enabled", "className": "align-middle text-center",
              "render": function (item)
               { if (item.enable==true)
                  { return( Bouton ( "success", "Désactiver l'UPS",
                                     "UPS_Disable", item.ups_id, "Actif" ) );
                  }
                 else
                  { return( Bouton ( "outline-secondary", "Activer l'UPS",
                                     "UPS_Enable", item.ups_id, "Désactivé" ) );
                  }
               },
           },
           { "data": null, "title":"Debug", "className": "align-middle text-center",
             "render": function (item)
              { if (item.debug==true)
                 { return( Bouton ( "warning", "Désactiver le debug", "UPS_Undebug", item.ups_id, "Actif" ) ); }
                else
                 { return( Bouton ( "outline-secondary", "Activer le debug", "UPS_Debug", item.ups_id, "Désactivé" ) ); }
              },
           },
           { "data": null, "title":"Tech_id", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
           },
           { "data": "description", "title":"Description", "className": "align-middle text-center " },
           { "data": "name", "title":"Name", "className": "align-middle text-center" },
           { "data": "host", "title":"Host", "className": "align-middle text-center" },
           { "data": "admin_username", "title":"Username", "className": "align-middle text-center" },
           { "data": "admin_password", "title":"Password", "className": "align-middle text-center" },
           { "data": null, "title":"Connexion", "className": "align-middle text-center",
             "render": function (item)
               { if (item.is_alive) return( Badge( "success", "Connecté", "Connecté" ) );
                 return( Badge( "info", "Déconnecté", "Déconnecté" ) );
               },
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "primary", "Editer la connexion", "UPS_Edit", item.ups_id, "pen", null );
                 boutons += Bouton_actions_add ( "danger", "Supprimer la connexion", "UPS_Del", item.ups_id, "trash", null );
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
