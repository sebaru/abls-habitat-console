
/************************************ Demande de refresh **********************************************************************/
 function METEO_Refresh ( )
  { $('#idTableMETEO').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function METEO_Disable (meteo_id)
  { $("#idButtonSpinner_"+meteo_id).show();
    selection = $('#idTableMETEO').DataTable().row("#"+meteo_id).data();
    Thread_enable ( selection.thread_tech_id, false, function(Response) { METEO_Refresh(); }, function(Response) { METEO_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function METEO_Enable (meteo_id)
  { $("#idButtonSpinner_"+modbus_id).show();
    selection = $('#idTableMETEO').DataTable().row("#"+meteo_id).data();
    Thread_enable ( selection.thread_tech_id, true, function(Response) { METEO_Refresh(); }, function(Response) { METEO_Refresh(); } );
  }
/************************************ Demande l'envoi d'un SMS de test ********************************************************/
 function METEO_Test ( meteo_id )
  { selection = $('#idTableMETEO').DataTable().row("#"+meteo_id).data();
    var json_request =
     { thread_tech_id: selection.thread_tech_id,
       tag : "test"
     };
    Send_to_API ( 'POST', "/thread/send", json_request, null );
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function METEO_Del_Valider ( selection )
  { var json_request = { agent_uuid : selection.agent_uuid, thread_tech_id: selection.thread_tech_id };
    Send_to_API ( 'DELETE', "/thread/delete", json_request, function(Response)
     { Show_toast_ok ( "Compte IMSG supprimé");
       METEO_Refresh();
     }, function(Response) { METEO_Refresh(); } );
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function METEO_Del ( meteo_id )
  { selection = $('#idTableMETEO').DataTable().row("#"+meteo_id).data();
    Show_modal_del ( "Supprimer la connexion "+selection.thread_tech_id,
                     "Etes-vous sûr de vouloir supprimer cette connexion ?",
                     selection.thread_tech_id + " - "+selection.jabberid,
                     function () { METEO_Del_Valider( selection ) } ) ;
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function METEO_Set ( selection )
  { var json_request =
       { agent_uuid     : $('#idTargetAgent').val(),
         thread_tech_id: $('#idMETEOTechID').val().toUpperCase(),
         token         : $('#idMETEOToken').val(),
         description   : $('#idMETEODescription').val(),
         code_insee    : $('#idMETEOCodeInsee').val(),
       };

    Send_to_API ( "POST", "/meteo/set", json_request, function(Response)
     { Show_toast_ok ( "Modification sauvegardée.");
       METEO_Refresh();
     }, function(Response) { METEO_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function METEO_Edit ( meteo_id )
  { selection = $('#idTableMETEO').DataTable().row("#"+meteo_id).data();
    $('#idMETEOTitre').text("Editer la connexion " + selection.thread_tech_id);
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, selection.agent_uuid );
    $('#idMETEOTechID').prop ("disabled", true).val( selection.thread_tech_id );
    $('#idMETEODescription').val( selection.description );
    $('#idMETEOToken').val( selection.token );
    $('#idMETEOCodeInsee').val( selection.code_insee );
    $('#idMETEOValider').off("click").on( "click", function () { METEO_Set(selection); } );
    $('#idMETEOEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function METEO_Add ( )
  { $('#idMETEOTitre').text("Ajouter une connexion XMPP");
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, null );
    $('#idMETEOTechID').prop ("disabled", false).val("").off("input").on("input", function () { Controle_tech_id( "idMETEO", null ); } );
    $('#idMETEODescription').val( "" );
    $('#idMETEOToken').val( "" );
    $('#idMETEOCodeInsee').val( "" );
    $('#idMETEOValider').off("click").on( "click", function () { METEO_Set(null); } );
    $('#idMETEOEdit').modal("show");
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableMETEO').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/thread/list", type : "GET", dataSrc: "meteo", contentType: "application/json",
               data: function() { return ( "classe=meteo" ); },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "meteo_id",
       columns:
         [ { "data": null, "title":"Agent", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.agent_hostname) ); }
           },
           { "data": null, "title":"Enable", "className": "align-middle text-center",
              "render": function (item)
               { if (item.enable==true)
                 { return( Bouton ( "success", "Désactiver le compte", "METEO_Disable", item.meteo_id, "Actif" ) ); }
                else
                 { return( Bouton ( "outline-secondary", "Activer le compte", "METEO_Enable", item.meteo_id, "Désactivé" ) ); }
               },
           },
           { "data": null, "title":"Tech_id", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
           },
           { "data": "description", "title":"Description", "className": "align-middle " },
           { "data": "token", "title":"token", "className": "align-middle " },
           { "data": "code_insee", "title":"Code Insee", "className": "align-middle " },
           { "data": null, "title":"Last Comm", "className": "align-middle text-center",
             "render": function (item)
               { if (item.last_comm==null) return( Badge( "info", "Thread à l'arret", "Stopped" ) );
                 return( htmlEncode ( item.last_comm ) );
               },
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "primary", "Editer la connexion", "METEO_Edit", item.meteo_id, "pen", null );
                 boutons += Bouton_actions_add ( "outline-primary", "Test METEO", "METEO_Test", item.meteo_id, "question", null );
                 boutons += Bouton_actions_add ( "danger", "Supprimer la connexion", "METEO_Del", item.meteo_id, "trash", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
       responsive: true,
     });
  }
