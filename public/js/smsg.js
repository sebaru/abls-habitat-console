/************************************ Demande de refresh **********************************************************************/
 function SMSG_Refresh ( )
  { $('#idTableSMSG').DataTable().ajax.reload(null, false);
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function SMSG_Set ( selection )
  { var json_request =
     { agent_uuid:             $('#idTargetAgent').val(),
       thread_tech_id:         $('#idSMSGTechID').val(),
       description:            $('#idSMSGDescription').val(),
       ovh_service_name:       $('#idSMSGOVHServiceName').val(),
       ovh_application_key:    $('#idSMSGOVHApplicationKey').val(),
       ovh_application_secret: $('#idSMSGOVHApplicationSecret').val(),
       ovh_consumer_key:       $('#idSMSGOVHConsumerKey').val(),
     };

    Send_to_API ( "POST", "/smsg/set", json_request, function(Response)
     { Show_toast_ok ( "Modification sauvegardée.");
       SMSG_Refresh();
     }, function(Response) { SMSG_Refresh(); } );
  }
/************************************ Demande l'envoi d'un SMS de test ********************************************************/
 function SMSG_Test_GSM ( smsg_id )
  { selection = $('#idTableSMSG').DataTable().row("#"+smsg_id).data();
    var json_request =
     { thread_tech_id: selection.thread_tech_id,
       tag: "test_gsm"
     };
    Send_to_API ( 'POST', "/thread/send", json_request, null );
  }
/************************************ Demande l'envoi d'un SMS de test ********************************************************/
 function SMSG_Test_OVH ( smsg_id )
  { selection = $('#idTableSMSG').DataTable().row("#"+smsg_id).data();
    var json_request =
     { thread_tech_id: selection.thread_tech_id,
       tag : "test_ovh"
     };
    Send_to_API ( 'POST', "/thread/send", json_request, null );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function SMSG_Edit ( smsg_id )
  { selection = $('#idTableSMSG').DataTable().row("#"+smsg_id).data();
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, selection.agent_uuid );
    $('#idSMSGTitre').text("Editer la connexion GSM " + selection.thread_tech_id);
    $('#idSMSGTechID').prop ("disabled", true).val( selection.thread_tech_id );
    $('#idSMSGDescription').val( selection.description );
    $('#idSMSGOVHServiceName').val( selection.ovh_service_name );
    $('#idSMSGOVHApplicationKey').val( selection.ovh_application_key );
    $('#idSMSGOVHApplicationSecret').val( selection.ovh_application_secret );
    $('#idSMSGOVHConsumerKey').val( selection.ovh_consumer_key );
    $('#idSMSGValider').off("click").on( "click", function () { SMSG_Set(selection); } );
    $('#idSMSGEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function SMSG_Add ( )
  { $('#idSMSGTitre').text("Ajouter un équipement GSM");
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, null );
    $('#idSMSGTechID').prop ("disabled", false).val("").off("input").on("input", function () { Controle_tech_id( "idSMSG", null ); } );
    $('#idSMSGDescription').val("");
    $('#idSMSGOVHServiceName').val("");
    $('#idSMSGOVHApplicationKey').val("");
    $('#idSMSGOVHApplicationSecret').val("");
    $('#idSMSGOVHConsumerKey').val("");
    $('#idSMSGValider').off("click").on( "click", function () { SMSG_Set(null); } );
    $('#idSMSGEdit').modal("show");
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function SMSG_Del_Valider ( selection )
  { var json_request = { agent_uuid : selection.agent_uuid, thread_tech_id: selection.thread_tech_id };
    Send_to_API ( 'DELETE', "/thread/delete", json_request, function(Response)
     { Show_toast_ok ( "Equipement GSM supprimé");
       SMSG_Refresh();
     }, function(Response) { SMSG_Refresh(); } );
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function SMSG_Del ( smsg_id )
  { table = $('#idTableSMSG').DataTable();
    selection = table.ajax.json().config.filter( function(item) { return item.id==id } )[0];
    Show_modal_del ( "Supprimer la connexion "+selection.thread_tech_id,
                     "Etes-vous sûr de vouloir supprimer cette connexion ?",
                     selection.thread_tech_id + " - "+selection.description,
                     function () { SMSG_Del_Valider( selection ) } ) ;
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableSMSG').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/thread/list", type : "POST", dataSrc: "smsg", contentType: "application/json",
               data: function() { return ( JSON.stringify( { "domain_uuid": localStorage.getItem('domain_uuid'),
                                                             "classe": "smsg" } ) ); },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request) { request.setRequestHeader('Authorization', 'Bearer ' + Token); }
             },
       rowId: "smsg_id",
       columns:
         [ { "data": null, "title":"Agent", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.agent_hostname) ); }
           },
           { "data": null, "title":"Tech_id", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/tech/dls_source/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
           },
           { "data": "description", "title":"Description", "className": "align-middle " },
           { "data": "ovh_consumer_key", "title":"OVH Consumer Key", "className": "align-middle " },
           { "data": "ovh_service_name", "title":"OVH Service Name", "className": "align-middle " },
           { "data": "ovh_application_key", "title":"OVH App Key", "className": "align-middle " },
           { "data": "ovh_application_secret", "title":"OVH App Secret", "className": "align-middle " },
           { "data": "nbr_sms", "title":"#SMS", "className": "align-middle " },
           { "data": null, "title":"IO_COMM", "className": "align-middle text-center",
             "render": function (item)
               { if (item.comm==true) { return( Bouton ( "success", "Comm OK", null, null, "1" ) );        }
                                 else { return( Bouton ( "outline-secondary", "Comm Failed", null, null, "0" ) ); }
               },
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "primary", "Editer la connexion", "SMSG_Edit", item.smsg_id, "pen", null );
                 boutons += Bouton_actions_add ( "outline-primary", "Test GSM", "SMSG_Test_GSM", item.smsg_id, "question", null );
                 boutons += Bouton_actions_add ( "outline-secondary", "Test OVH", "SMSG_Test_OVH", item.smsg_id, "question", null );
                 boutons += Bouton_actions_add ( "danger", "Supprimer la connexion", "SMSG_Del", item.smsg_id, "trash", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
       responsive: true,
     });

  }
