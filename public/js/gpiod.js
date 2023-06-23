
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
 function GPIOD_Refresh ( )
  { $('#idTableGPIOD').DataTable().ajax.reload(null, false);
    $('#idTableGPIOD_IO').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function GPIOD_Disable (gpiod_id)
  { $("#idButtonSpinner_"+gpiod_id).show();
    selection = $('#idTableGPIOD').DataTable().row("#"+gpiod_id).data();
    Thread_enable ( selection.thread_tech_id, false, function(Response) { GPIOD_Refresh(); }, function(Response) { GPIOD_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function GPIOD_Enable (gpiod_id)
  { $("#idButtonSpinner_"+gpiod_id).show();
    selection = $('#idTableGPIOD').DataTable().row("#"+gpiod_id).data();
    Thread_enable ( selection.thread_tech_id, true, function(Response) { GPIOD_Refresh(); }, function(Response) { GPIOD_Refresh(); } );
  }
/**************************************** Supprime une connexion GPIOD *******************************************************/
 function GPIOD_Del (gpiod_id)
  { selection = $('#idTableGPIOD').DataTable().row("#"+gpiod_id).data();
    Show_modal_del ( "Supprimer la connexion "+selection.thread_tech_id,
                     "Etes-vous sûr de vouloir supprimer cette connexion ?",
                     selection.thread_tech_id + " - " + selection.description,
                     function () { Thread_delete ( selection.thread_tech_id, function(Response) { GPIOD_Refresh(); }, null ); } ) ;
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function GPIOD_Set ( selection )
  { var json_request =
     { agent_uuid:     $('#idTargetAgent').val(),
       thread_classe : "gpiod",
       thread_tech_id: $('#idGPIODTechID').val().toUpperCase(),
       description: $('#idGPIODDescription').val(),
     };
    Send_to_API ( "POST", "/gpiod/set", json_request,
                  (Response) => { Show_toast_ok ("Modifications sauvegardées.");
                                  GPIOD_Refresh();
                                }, null );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function GPIOD_Edit ( gpiod_id )
  { selection = $('#idTableGPIOD').DataTable().row("#"+gpiod_id).data();
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, selection.agent_uuid );
    $('#idGPIODTitre').text("Editer la connexion " + selection.thread_tech_id);
    $('#idGPIODTechID').prop ("disabled", true).val( selection.thread_tech_id );
    $('#idGPIODDescription').val( selection.description );
    $('#idGPIODValider').off("click").on( "click", function () { GPIOD_Set(selection); } );
    $('#idGPIODEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function GPIOD_Add ( )
  { $('#idGPIODTitre').text("Ajouter un équipement Gpiod");
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, null );
    $('#idGPIODTechID').prop ("disabled", false).val("")
      .off("input").on("input", function () { Controle_tech_id( "idGPIOD", null ); } ).trigger("input");
    $('#idGPIODDescription').val("");
    $('#idGPIODValider').off("click").on( "click", function () { GPIOD_Set(null); } );
    $('#idGPIODEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function GPIOD_Edit_IO (gpiod_io_id)
  { selection = $('#idTableGPIOD_IO').DataTable().row("#"+gpiod_io_id).data();
    $('#idGPIODEditIOTitre').text( "Configurer "+selection.thread_tech_id+", port "+selection.port );
    $('#idGPIODEditIOLibelle').val ( selection.libelle );
    $('#idGPIODEditIOCapteur')
     .replaceWith ( Select ( "idGPIODEditIOCapteur", null, Capteurs, selection.capteur ) );
    $('#idGPIODEditIOValider').off("click").on( "click", function ()
     { $('#idGPIODEditIO').modal("hide");
       var json_request =
        { gpiod_io_id: parseInt(gpiod_io_id),
          capteur: $('#idGPIODEditIOCapteur').val(),
          libelle: $('#idGPIODEditIOLibelle').val(),
        };

       Send_to_API ( "POST", "/gpiod/set/io", json_request,
                     (Response) => { Show_toast_ok ("Modifications sauvegardées.");
                                     GPIOD_Refresh();
                                   }, null );
     });
    $('#idGPIODEditIO').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function GPIOD_Map (gpiod_io_id)
  { selection = $('#idTableGPIOD_IO').DataTable().row("#"+gpiod_io_id).data();
    $('#idMODALMapTitre').text( "Mapper "+selection.thread_tech_id+":"+selection.thread_acronyme );
    $('#idMODALMapRechercherTechID').off("input").on("input", function () { Common_Updater_Choix_TechID ( "idMODALMap", selection.classe ); } );
    Common_Updater_Choix_TechID ( "idMODALMap", selection.classe, selection.tech_id, selection.acronyme );
    $('#idMODALMapValider').off("click").on( "click", function ()
     { $('#idMODALMap').modal("hide");
       COMMON_Map ( selection.thread_tech_id, selection.thread_acronyme,
                    $('#idMODALMapSelectTechID').val(),  $('#idMODALMapSelectAcronyme').val()
                  );
       GPIOD_Refresh();
     });
    $('#idMODALMap').modal("show");
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableGPIOD').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/gpiod/list", type : "GET", dataSrc: "gpiod", contentType: "application/json",
               data: function() { return ( "classe=gpiod" ) },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "gpiod_id",
       columns:
        [ { "data": null, "title":"Agent", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.agent_hostname) ); }
          },
          { "data": null, "title":"Enable", "className": "align-middle text-center",
             "render": function (item)
              { if (item.enable==true)
                { return( Bouton ( "success", "Désactiver le module", "GPIOD_Disable", item.gpiod_id, "Actif" ) ); }
               else
                { return( Bouton ( "outline-secondary", "Activer le module", "GPIOD_Enable", item.gpiod_id, "Désactivé" ) ); }
              },
          },
          { "data": null, "title":"Tech_id", "className": "align-middle text-center",
            "render": function (item)
              { return( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
          },
          { "data": "description", "title":"Description", "className": "align-middle text-center " },
          { "data": null, "title":"Last Comm", "className": "align-middle text-center",
            "render": function (item)
              { if (item.last_comm==null) return( Badge( "info", "Thread à l'arret", "Stopped" ) );
                return( htmlEncode ( item.last_comm ) );
              },
          },
          { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
            "render": function (item)
              { boutons = Bouton_actions_start ();
                boutons += Bouton_actions_add ( "outline-primary", "Editer la connexion", "GPIOD_Edit", item.gpiod_id, "pen", null );
                boutons += Bouton_actions_add ( "danger", "Supprimer la connexion", "GPIOD_Del", item.gpiod_id, "trash", null );
                boutons += Bouton_actions_end ();
                return(boutons);
              },
          }
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

    $('#idTableGPIOD_IO').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/gpiod/list/io", type : "GET", dataSrc: "IO", contentType: "application/json",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "gpiod_io_id",
       columns:
          [ { "data": null, "title":"Gpiod TechID", "className": "align-middle text-center",
              "render": function (item)
                { return( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
            },
            { "data": null, "title":"Gpiod I/O", "className": "align-middle text-center",
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
            { "data": null, "title":"Description", "className": "align-middle text-center",
              "render": function (item)
                { return ( htmlEncode(item.libelle) ); }
            },
            { "data": null, "title":"Actions", "orderable": false, "render": function (item)
                { boutons = Bouton_actions_start ();
                  boutons += Bouton_actions_add ( "outline-primary", "Editer cet objet", "GPIOD_Edit_IO", item.gpiod_io_id, "pen", null );
                  boutons += Bouton_actions_add ( "primary", "Mapper cet objet", "GPIOD_Map", item.gpiod_io_id, "directions", null );
                  boutons += Bouton_actions_end ();
                  return(boutons);
                },
            },
          ],
         /*order: [ [0, "desc"] ],*/
         /*responsive: true,*/
     });
  }
