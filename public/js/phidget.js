
 var Capteurs =
  [ { valeur: "DIGITAL-INPUT",        texte: "DI - DIGITAL-INPUT" },
    { valeur: "ADP1000-PH",           texte: "AI - ADP1000-PH" },
    { valeur: "TMP1200_0-PT100-3850", texte: "AI - TMP1200_0-PT100-3850" },
    { valeur: "TMP1200_0-PT100-3920", texte: "AI - TMP1200_0-PT100-3920<" },
    { valeur: "AC-CURRENT-10A",       texte: "AI - AC-CURRENT-10A" },
    { valeur: "AC-CURRENT-25A",       texte: "AI - AC-CURRENT-25A" },
    { valeur: "AC-CURRENT-50A",       texte: "AI - AC-CURRENT-50A" },
    { valeur: "AC-CURRENT-100A",      texte: "AI - AC-CURRENT-100A" },
    { valeur: "TEMP_1124_0",          texte: "AI - TEMP_1124_0" },
    { valeur: "REL2001_0",            texte: "DO - REL2001_0" },
  ];


/************************************ Demande de refresh **********************************************************************/
 function PHIDGET_Refresh ( )
  { $('#idTablePHIDGET').DataTable().ajax.reload(null, false);
    $('#idTablePHIDGET_IO').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function PHIDGET_Disable (phidget_id)
  { $("#idButtonSpinner_PHIDGET_Disable_"+phidget_id).show();
    selection = $('#idTablePHIDGET').DataTable().row("#"+phidget_id).data();
    Thread_enable ( selection.thread_tech_id, false, function(Response) { PHIDGET_Refresh(); }, function(Response) { PHIDGET_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function PHIDGET_Enable (phidget_id)
  { $("#idButtonSpinner_PHIDGET_Enable_"+phidget_id).show();
    selection = $('#idTablePHIDGET').DataTable().row("#"+phidget_id).data();
    Thread_enable ( selection.thread_tech_id, true, function(Response) { PHIDGET_Refresh(); }, function(Response) { PHIDGET_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function PHIDGET_Debug (phidget_id)
  { $("#idButtonSpinner_PHIDGET_Debug_"+phidget_id).show();
    selection = $('#idTablePHIDGET').DataTable().row("#"+phidget_id).data();
    Thread_debug ( selection.thread_tech_id, true, function(Response) { PHIDGET_Refresh(); }, function(Response) { PHIDGET_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function PHIDGET_Undebug (phidget_id)
  { $("#idButtonSpinner_PHIDGET_Undebug_"+phidget_id).show();
    selection = $('#idTablePHIDGET').DataTable().row("#"+phidget_id).data();
    Thread_debug ( selection.thread_tech_id, false, function(Response) { PHIDGET_Refresh(); }, function(Response) { PHIDGET_Refresh(); } );
  }
/**************************************** Supprime une connexion PHIDGET *******************************************************/
 function PHIDGET_Del (phidget_id)
  { selection = $('#idTablePHIDGET').DataTable().row("#"+phidget_id).data();
    Show_modal_del ( "Supprimer la connexion "+selection.thread_tech_id,
                     "Etes-vous sûr de vouloir supprimer cette connexion ?",
                     selection.thread_tech_id + " - " + selection.hostname + " - " + selection.description,
                     function () { Thread_delete ( selection.thread_tech_id, function(Response) { PHIDGET_Refresh(); }, null ); } ) ;
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function PHIDGET_Set ( selection )
  { var json_request =
     { agent_uuid:     $('#idTargetAgent').val(),
       thread_tech_id: $('#idPHIDGETTechID').val().toUpperCase(),
       description: $('#idPHIDGETDescription').val(),
       hostname   : $('#idPHIDGETHostname').val(),
       password   : $('#idPHIDGETPassword').val(),
       serial     : parseInt($('#idPHIDGETSerial').val()),
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
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function PHIDGET_Edit_IO (phidget_io_id)
  { selection = $('#idTablePHIDGET_IO').DataTable().row("#"+phidget_io_id).data();
    $('#idPHIDGETEditIOTitre').text( "Configurer "+selection.thread_tech_id+", port "+selection.port );
    $('#idPHIDGETEditIOLibelle').val ( selection.libelle );
    $('#idPHIDGETEditIOCapteur')
     .replaceWith ( Select ( "idPHIDGETEditIOCapteur", null, Capteurs, selection.capteur ) );
    $('#idPHIDGETEditIOIntervalle').val ( selection.intervalle );
    $('#idPHIDGETEditIOValider').off("click").on( "click", function ()
     { $('#idPHIDGETEditIO').modal("hide");
       var json_request =
        { phidget_io_id: parseInt(phidget_io_id),
          intervalle: parseInt($('#idPHIDGETEditIOIntervalle').val()),
          capteur: $('#idPHIDGETEditIOCapteur').val(),
          libelle: $('#idPHIDGETEditIOLibelle').val(),
        };

       Send_to_API ( "POST", "/phidget/set/io", json_request,
                     (Response) => { Show_toast_ok ("Modifications sauvegardées.");
                                     PHIDGET_Refresh();
                                   }, null );
     });
    $('#idPHIDGETEditIO').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function PHIDGET_Map (phidget_io_id)
  { selection = $('#idTablePHIDGET_IO').DataTable().row("#"+phidget_io_id).data();
    $('#idMODALMapTitre').text( "Mapper "+selection.thread_tech_id+":"+selection.thread_acronyme );
    $('#idMODALMapRechercherTechID').off("input").on("input", function () { Common_Updater_Choix_TechID ( "idMODALMap", selection.classe ); } );
    Common_Updater_Choix_TechID ( "idMODALMap", selection.classe, selection.tech_id, selection.acronyme );
    $('#idMODALMapValider').off("click").on( "click", function ()
     { $('#idMODALMap').modal("hide");
       COMMON_Map ( selection.thread_tech_id, selection.thread_acronyme,
                    $('#idMODALMapSelectTechID').val(),  $('#idMODALMapSelectAcronyme').val()
                  );
       PHIDGET_Refresh();
     });
    $('#idMODALMap').modal("show");
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
           { "data": null, "title":"Debug", "className": "align-middle text-center",
             "render": function (item)
              { if (item.debug==true)
                 { return( Bouton ( "warning", "Désactiver le debug", "PHIDGET_Undebug", item.phidget_id, "Actif" ) ); }
                else
                 { return( Bouton ( "outline-secondary", "Activer le debug", "PHIDGET_Debug", item.phidget_id, "Désactivé" ) ); }
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

    $('#idTablePHIDGET_IO').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/phidget/list", type : "GET", dataSrc: "IO", contentType: "application/json",
               data: function() { return ( "classe=io" ) },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "phidget_io_id",
       columns:
          [ { "data": null, "title":"Phidget TechID", "className": "align-middle text-center",
              "render": function (item)
                { return( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
            },
            { "data": null, "title":"Phidget I/O", "className": "align-middle text-center",
              "render": function (item)
                { return( item.thread_acronyme ); }
            },
            { "data": null, "title":"Mapped on", "className": "align-middle text-center",
              "render": function (item)
                { if(item.tech_id)
                   { return ( Lien ( "/dls/"+item.tech_id, "Voir la source", item.tech_id ) +":" + item.acronyme );
                   } else return( "--" );
                }
            },
            { "data": "port", "title":"Port", "className": "align-middle text-center" },
            { "data": null, "title":"Capteur/Classe", "className": "align-middle text-center",
              "render": function (item)
                { return( item.classe + " - " + item.capteur ); }
            },
            { "data": "intervalle", "title":"Interval", "className": "align-middle text-center" },
            { "data": null, "title":"Description", "className": "align-middle text-center",
              "render": function (item)
                { return ( htmlEncode(item.libelle) ); }
            },
            { "data": null, "title":"Actions", "orderable": false, "render": function (item)
                { boutons = Bouton_actions_start ();
                  boutons += Bouton_actions_add ( "outline-primary", "Editer cet objet", "PHIDGET_Edit_IO", item.phidget_io_id, "pen", null );
                  boutons += Bouton_actions_add ( "primary", "Mapper cet objet", "PHIDGET_Map", item.phidget_io_id, "directions", null );
                  boutons += Bouton_actions_end ();
                  return(boutons);
                },
            },
          ],
         /*order: [ [0, "desc"] ],*/
         /*responsive: true,*/
     });
  }
