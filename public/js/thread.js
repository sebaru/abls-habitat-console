/************************************ Demande de refresh **********************************************************************/
 function THREAD_Refresh ( )
  { $('#idTableTHREAD').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function THREAD_Disable (thread_id)
  { $("#idButtonSpinner_"+thread_id).show();
    selection = $('#idTableTHREAD').DataTable().row("#"+thread_id).data();
    Thread_enable ( selection.thread_tech_id, false, function(Response) { THREAD_Refresh(); }, function(Response) { THREAD_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function THREAD_Enable (thread_id)
  { $("#idButtonSpinner_"+modbus_id).show();
    selection = $('#idTableTHREAD').DataTable().row("#"+thread_id).data();
    Thread_enable ( selection.thread_tech_id, true, function(Response) { THREAD_Refresh(); }, function(Response) { THREAD_Refresh(); } );
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function THREAD_Del_Valider ( selection )
  { var json_request = { agent_uuid : selection.agent_uuid, thread_tech_id: selection.thread_tech_id };
    Send_to_API ( 'DELETE', "/thread/delete", json_request, function(Response)
     { Show_toast_ok ( "Equipement GSM supprimé");
       THREAD_Refresh();
     }, function(Response) { THREAD_Refresh(); } );
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function THREAD_Del ( thread_id )
  { table = $('#idTableTHREAD').DataTable();
    selection = table.ajax.json().config.filter( function(item) { return item.id==id } )[0];
    Show_modal_del ( "Supprimer la connexion "+selection.thread_tech_id,
                     "Etes-vous sûr de vouloir supprimer cette connexion ?",
                     selection.thread_tech_id + " - "+selection.description,
                     function () { THREAD_Del_Valider( selection ) } ) ;
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableTHREAD').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/thread/list", type : "POST", dataSrc: "threads", contentType: "application/json",
               data: function() { return ( JSON.stringify( { "domain_uuid": localStorage.getItem('domain_uuid') } ) ); },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request) { request.setRequestHeader('Authorization', 'Bearer ' + Token); }
             },
       rowId: "thread_id",
       columns:
         [ { "data": null, "title":"Agent", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.agent_hostname) ); }
           },
           { "data": null, "title":"Enable", "className": "align-middle text-center",
              "render": function (item)
               { if (item.enable==true)
                 { return( Bouton ( "success", "Désactiver le gsm", "THREAD_Disable", item.thread_id, "Actif" ) ); }
                else
                 { return( Bouton ( "outline-secondary", "Activer le gsm", "THREAD_Enable", item.thread_id, "Désactivé" ) ); }
               },
           },
           { "data": null, "title":"Tech_id", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/tech/dls_source/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
           },
           { "data": "description", "title":"Description", "className": "align-middle " },
           { "data": null, "title":"IO_COMM", "className": "align-middle text-center",
             "render": function (item)
               { if (item.comm==true) { return( Bouton ( "success", "Comm OK", null, null, "1" ) );        }
                                 else { return( Bouton ( "outline-secondary", "Comm Failed", null, null, "0" ) ); }
               },
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "danger", "Supprimer le thread", "THREAD_Del", item.thread_id, "trash", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
       responsive: true,
     });

  }
