
/************************************ Demande de refresh **********************************************************************/
 function IMSGS_Refresh ( )
  { $('#idTableIMSGS').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function IMSG_Disable (imsgs_id)
  { $("#idButtonSpinner_"+imsgs_id).show();
    selection = $('#idTableIMSG').DataTable().row("#"+imsgs_id).data();
    Thread_enable ( selection.thread_tech_id, false, function(Response) { IMSGS_Refresh(); }, function(Response) { IMSGS_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function IMSG_Enable (imsgs_id)
  { $("#idButtonSpinner_"+imsgs_id).show();
    selection = $('#idTableIMSG').DataTable().row("#"+imsgs_id).data();
    Thread_enable ( selection.thread_tech_id, true, function(Response) { IMSGS_Refresh(); }, function(Response) { IMSGS_Refresh(); } );
  }
/************************************ Demande l'envoi d'un IMSGS de test ******************************************************/
 function IMSGS_Test ( imsgs_id )
  { selection = $('#idTableIMSGS').DataTable().row("#"+imsgs_id).data();
    var json_request =
     { thread_tech_id: selection.thread_tech_id,
       tag : "test"
     };
    Send_to_API ( 'POST', "/thread/send", json_request, null );
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function IMSGS_Del_Valider ( selection )
  { var json_request = { agent_uuid : selection.agent_uuid, thread_tech_id: selection.thread_tech_id };
    Send_to_API ( 'DELETE', "/thread/delete", json_request, function(Response)
     { Show_toast_ok ( "Compte IMSG supprimé");
       IMSGS_Refresh();
     }, function(Response) { IMSGS_Refresh(); } );
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
       { agent_uuid     : $('#idTargetAgent').val(),
         thread_tech_id : $('#idIMSGSTechID').val().toUpperCase(),
         description: $('#idIMSGSDescription').val(),
         jabberid: $('#idIMSGSJabberID').val(),
         password: $('#idIMSGSPassword').val(),
       };

    Send_to_API ( "POST", "/imsgs/set", json_request, function(Response)
     { Show_toast_ok ( "Modification sauvegardée.");
       IMSGS_Refresh();
     }, function(Response) { IMSGS_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function IMSGS_Edit ( imsgs_id )
  { selection = $('#idTableIMSGS').DataTable().row("#"+imsgs_id).data();
    $('#idIMSGSTitre').text("Editer la connexion " + selection.thread_tech_id);
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, selection.agent_uuid );
    $('#idIMSGSTechID').prop ("disabled", true).val( selection.thread_tech_id );
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
    $('#idIMSGSTechID').prop ("disabled", false).val("").off("input").on("input", function () { Controle_tech_id( "idIMSGS", null ); } );
    $('#idIMSGSDescription').val("");
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
       ajax: { url : $ABLS_API+"/thread/list", type : "GET", dataSrc: "imsgs", contentType: "application/json",
               data: function() { return ( "classe=imsgs" ); },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "imsgs_id",
       columns:
         [ { "data": null, "title":"Agent", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.agent_hostname) ); }
           },
           { "data": null, "title":"Enable", "className": "align-middle text-center",
              "render": function (item)
               { if (item.enable==true)
                 { return( Bouton ( "success", "Désactiver le compte", "IMSG_Disable", item.imsg_id, "Actif" ) ); }
                else
                 { return( Bouton ( "outline-secondary", "Activer le compte", "IMSG_Enable", item.imsg_id, "Désactivé" ) ); }
               },
           },
           { "data": null, "title":"Tech_id", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
           },
           { "data": null, "title":"Description", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.description) ); }
           },
           { "data": null, "title":"JabberID", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.jabberid) ); }
           },
           { "data": null, "title":"IO_COMM", "className": "align-middle text-center",
             "render": function (item)
               { if (item.comm==true) { return( Bouton ( "success", "Comm OK", null, null, "1" ) );        }
                                 else { return( Bouton ( "outline-secondary", "Comm Failed", null, null, "0" ) ); }
               },
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "primary", "Editer la connexion", "IMSGS_Edit", item.imsgs_id, "pen", null );
                 boutons += Bouton_actions_add ( "outline-primary", "Test IMSGS", "IMSGS_Test", item.imsgs_id, "question", null );
                 boutons += Bouton_actions_add ( "danger", "Supprimer la connexion", "IMSGS_Del", item.imsgs_id, "trash", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
       responsive: true,
     });
  }
