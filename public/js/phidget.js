/************************************ Demande de refresh **********************************************************************/
 function PHIDGET_Refresh ( )
  { $('#idTablePHIDGET').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function PHIDGET_Disable (phidget_id)
  { $("#idButtonSpinner_"+phidget_id).show();
    selection = $('#idTablePHIDGET').DataTable().row("#"+phidget_id).data();
    Thread_enable ( selection.thread_tech_id, false, function(Response) { PHIDGET_Refresh(); }, function(Response) { PHIDGET_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function PHIDGET_Enable (phidget_id)
  { $("#idButtonSpinner_"+phidget_id).show();
    selection = $('#idTablePHIDGET').DataTable().row("#"+phidget_id).data();
    Thread_enable ( selection.thread_tech_id, true, function(Response) { PHIDGET_Refresh(); }, function(Response) { PHIDGET_Refresh(); } );
  }
/**************************************** Supprime une connexion phidget *******************************************************/
 function PHIDGET_Del (phidget_id)
  { selection = $('#idTablePHIDGET').DataTable().row("#"+phidget_id).data();
    Show_modal_del ( "Supprimer la connexion "+selection.thread_tech_id,
                     "Etes-vous sûr de vouloir supprimer cette connexion ?",
                     selection.thread_tech_id + " - "+selection.hostname +" - "+ selection.description,
                     function () { Thread_delete ( selection.thread_tech_id, function(Response) { PHIDGET_Refresh(); }, null ); } ) ;
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function PHIDGET_Set ( selection )
  { var json_request =
     { agent_uuid:     $('#idTargetAgent').val(),
       thread_classe : "phidget",
       thread_tech_id: $('#idPHIDGETTechID').val().toUpperCase(),
       description: $('#idPHIDGETDescription').val(),
       hostname   : $('#idPHIDGETHostname').val(),
       password   : $('#idPHIDGETPassword').val(),
       serial     : $('#idPHIDGETSerial').val(),
     };
    Send_to_API ( "POST", "/phidget/set", json_request,
                  (Response) => { Show_toast_ok ("Modifications sauvegardées.");
                                  PHIDGET_Refresh();
                                }, null );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function PHIDGET_Edit ( phidget_id )
  { selection = $('#idTablePHIDGET').DataTable().row("#"+phidget_id).data();
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, selection.agent_uuid );
    $('#idPHIDGETTitre').text("Editer la connexion " + selection.thread_tech_id);
    $('#idPHIDGETTechID').prop ("disabled", true).val( selection.thread_tech_id );
    $('#idPHIDGETDescription').val( selection.description );
    $('#idPHIDGETHostname').val( selection.hostname );
    $('#idPHIDGETPassword').val( selection.password );
    $('#idPHIDGETSerial').val( selection.serial );
    $('#idPHIDGETValider').off("click").on( "click", function () { PHIDGET_Set(selection); } );
    $('#idPHIDGETEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function PHIDGET_Add ( )
  { $('#idPHIDGETTitre').text("Ajouter un équipement Phidget");
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, null );
    $('#idPHIDGETTechID').prop ("disabled", false).val("")
      .off("input").on("input", function () { Controle_tech_id( "idPHIDGET", null ); } ).trigger("input");
    $('#idPHIDGETDescription').val("");
    $('#idPHIDGETHostname').val( "" );
    $('#idPHIDGETPassword').val( "" );
    $('#idPHIDGETSerial').val( "" );
    $('#idPHIDGETValider').off("click").on( "click", function () { PHIDGET_Set(null); } );
    $('#idPHIDGETEdit').modal("show");
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function PHIDGET_Del_Valider ( selection )
  { var json_request = { uuid : selection.uuid, thread_tech_id: selection.thread_tech_id };
    Send_to_API ( 'DELETE', "/api/process/config", JSON.stringify(json_request), function(Response)
     { Process_reload ( json_request.uuid );
       PHIDGET_Refresh();
     }, null );
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function PHIDGET_Del ( id )
  { table = $('#idTablePHIDGET').DataTable();
    selection = table.ajax.json().config.filter( function(item) { return item.id==id } )[0];
    Show_modal_del ( "Supprimer la connexion "+selection.thread_tech_id,
                     "Etes-vous sûr de vouloir supprimer cette connexion ?",
                     selection.thread_tech_id + " - "+selection.description,
                     function () { PHIDGET_Del_Valider( selection ) } ) ;
  }

/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTablePHIDGET').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/phidget/list", type : "GET", dataSrc: "phidget", contentType: "application/json",
               data: function() { return ( "classe=phidget" ) },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "phidget_id",
       columns:
        [ { "data": null, "title":"Agent", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.agent_hostname) ); }
          },
          { "data": null, "title":"Enable", "className": "align-middle text-center",
             "render": function (item)
              { if (item.enable==true)
                { return( Bouton ( "success", "Désactiver le module", "PHIDGET_Disable", item.phidget_id, "Actif" ) ); }
               else
                { return( Bouton ( "outline-secondary", "Activer le module", "PHIDGET_Enable", item.phidget_id, "Désactivé" ) ); }
              },
          },
          { "data": null, "title":"Tech_id", "className": "align-middle text-center",
            "render": function (item)
              { return( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
          },
          { "data": "description", "title":"Description", "className": "align-middle text-center " },
          { "data": "hostname", "title":"Hostname", "className": "align-middle text-center " },
          { "data": "password", "title":"Password", "className": "align-middle text-center " },
          { "data": "serial", "title":"Serial Number", "className": "align-middle text-center " },
          { "data": null, "title":"Last Comm", "className": "align-middle text-center",
            "render": function (item)
              { if (item.last_comm==null) return( Badge( "info", "Thread à l'arret", "Stopped" ) );
                return( htmlEncode ( item.last_comm ) );
              },
          },
          { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
            "render": function (item)
              { boutons = Bouton_actions_start ();
                boutons += Bouton_actions_add ( "outline-primary", "Editer la connexion", "PHIDGET_Edit", item.phidget_id, "pen", null );
                boutons += Bouton_actions_add ( "danger", "Supprimer la connexion", "PHIDGET_Del", item.phidget_id, "trash", null );
                boutons += Bouton_actions_end ();
                return(boutons);
              },
          }
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });
  }
