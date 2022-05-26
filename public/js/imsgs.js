
/************************************ Demande de refresh **********************************************************************/
 function IMSGS_Refresh ( )
  { $('#idTableIMSGS').DataTable().ajax.reload(null, false);
  }
/************************************ Demande l'envoi d'un SMS de test ********************************************************/
 function IMSGS_Test ( imsgs_id )
  { selection = $('#idTableIMSGS').DataTable().row("#"+imsgs_id).data();
    var json_request =
     { thread_tech_id: selection.thread_tech_id,
       zmq_tag : "test"
     };
    Send_to_API ( 'POST', "/api/process/send", JSON.stringify(json_request), null );
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function IMSGS_Del_Valider ( selection )
  { var json_request = { uuid : selection.agent_uuid, thread_tech_id: selection.thread_tech_id };
    Send_to_API ( 'DELETE', "/thread/delete", json_request, function(Response)
     { Show_toast_ok ( "Compte IMSG supprimé");
       IMSGS_Refresh();
     }, null );
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function IMSGS_Del ( imsgs_id )
  { selection = $('#idTableIMSGS').DataTable().row("#"+imsgs_id).data();
    Show_modal_del ( "Supprimer la connexion "+selection.thread_tech_id,
                     "Etes-vous sûr de vouloir supprimer cette connexion ?",
                     selection.thread_tech_id + " - "+selection.jabberid,
                     function () { IMSGS_Del_Valider( selection ) } ) ;
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function IMSGS_Set ( selection )
  { var json_request =
       { agent_uuid     : $('#idTargetProcess').val(),
         thread_tech_id : $('#idIMSGSTechID').val(),
         description: $('#idIMSGSDescription').val(),
         jabberid: $('#idIMSGSJabberID').val(),
         password: $('#idIMSGSPassword').val(),
       };
    if (selection) json_request.imsg_id = parseInt(selection.imsg_id);                                  /* Ajout ou édition ? */

    Send_to_API ( "POST", "/imsgs/set", json_request, function(Response)
     { Show_toast_ok ( "Modification sauvegardée.");
       IMSGS_Refresh();
     }, null );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function IMSGS_Edit ( imsgs_id )
  { selection = $('#idTableIMSGS').DataTable().row("#"+imsgs_id).data();
    $('#idIMSGSTitre').text("Editer la connexion " + selection.thread_tech_id);
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, selection.agent_uuid );
    $('#idIMSGSTechID').val( selection.thread_tech_id ).off("input").on("input", function () { Controle_tech_id( "idIMSGS", selection.thread_tech_id ); } );
    $('#idIMSGSDescription').val( selection.description );
    $('#idIMSGSJabberID').val( selection.jabberid );
    $('#idIMSGSPassword').val( selection.password );
    $('#idIMSGSValider').off("click").on( "click", function () { IMSGS_Set(selection); } );
    $('#idIMSGSEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function IMSGS_Add ( )
  { $('#idIMSGSTitre').text("Ajouter une connexion XMPP");
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, null );
    $('#idIMSGSTechID').val("").off("input").on("input", function () { Controle_tech_id( "idIMSGS", null ); } );
    $('#idIMSGSJabberID').val( "" );
    $('#idIMSGSPassword').val( "" );
    $('#idIMSGSValider').off("click").on( "click", function () { IMSGS_Set(null); } );
    $('#idIMSGSEdit').modal("show");
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableIMSGS').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/imsgs/list", type : "POST", dataSrc: "imsgs", contentType: "application/json",
               data: function() { return ( JSON.stringify({"domain_uuid": localStorage.getItem('domain_uuid') } ) ); },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
             },
       rowId: "imsg_id",
       columns:
         [ { "data": null, "title":"Agent", "className": "align-middle text-center",
             "render": function (item)
               { return( item.agent_hostname ); }
           },
           { "data": null, "title":"Tech_id", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/tech/dls_source/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
           },
           { "data": "description", "title":"Description", "className": "align-middle text-center " },
           { "data": "jabberid", "title":"JabberID", "className": "align-middle " },
           { "data": null, "title":"IO_COMM", "className": "align-middle text-center",
             "render": function (item)
               { if (item.comm==true) { return( Bouton ( "success", "Comm OK", null, null, "1" ) );        }
                                 else { return( Bouton ( "outline-secondary", "Comm Failed", null, null, "0" ) ); }
               },
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "primary", "Editer la connexion", "IMSGS_Edit", item.imsg_id, "pen", null );
                 boutons += Bouton_actions_add ( "outline-primary", "Test IMSGS", "IMSGS_Test", item.imsg_id, "question", null );
                 boutons += Bouton_actions_add ( "danger", "Supprimer la connexion", "IMSGS_Del", item.imsg_id, "trash", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
       responsive: true,
     });
  }
