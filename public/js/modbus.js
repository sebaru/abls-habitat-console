

 var Borne_Type = [ "none0", "none1", "750550 - 0/10 V", "750455 - 4/20 mA", "750461 - Pt-100" ];

 function MODBUS_Refresh ( )
  { $('#idTableMODBUS').DataTable().ajax.reload(null, false);
    $('#idTableMODBUS_DI').DataTable().ajax.reload(null, false);
    $('#idTableMODBUS_DO').DataTable().ajax.reload(null, false);
    $('#idTableMODBUS_AI').DataTable().ajax.reload(null, false);
    $('#idTableMODBUS_AO').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function MODBUS_Disable (modbus_id)
  { $("#idButtonSpinner_MODBUS_Disable_"+modbus_id).show();
    selection = $('#idTableMODBUS').DataTable().row("#"+modbus_id).data();
    Thread_enable ( selection.thread_tech_id, false, function(Response) { MODBUS_Refresh(); }, function(Response) { MODBUS_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function MODBUS_Enable (modbus_id)
  { $("#idButtonSpinner_MODBUS_Enable_"+modbus_id).show();
    selection = $('#idTableMODBUS').DataTable().row("#"+modbus_id).data();
    Thread_enable ( selection.thread_tech_id, true, function(Response) { MODBUS_Refresh(); }, function(Response) { MODBUS_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function MODBUS_Debug (modbus_id)
  { $("#idButtonSpinner_MODBUS_Debug_"+modbus_id).show();
    selection = $('#idTableMODBUS').DataTable().row("#"+modbus_id).data();
    Thread_debug ( selection.thread_tech_id, true, function(Response) { MODBUS_Refresh(); }, function(Response) { MODBUS_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function MODBUS_Undebug (modbus_id)
  { $("#idButtonSpinner_MODBUS_Undebug_"+modbus_id).show();
    selection = $('#idTableMODBUS').DataTable().row("#"+modbus_id).data();
    Thread_debug ( selection.thread_tech_id, false, function(Response) { MODBUS_Refresh(); }, function(Response) { MODBUS_Refresh(); } );
  }
/**************************************** Supprime une connexion modbus *******************************************************/
 function MODBUS_Del (modbus_id)
  { selection = $('#idTableMODBUS').DataTable().row("#"+modbus_id).data();
    Show_modal_del ( "Supprimer la connexion "+selection.thread_tech_id,
                     "Etes-vous sûr de vouloir supprimer cette connexion ?",
                     selection.thread_tech_id + " - "+selection.hostname +" - "+ selection.description,
                     function () { Thread_delete ( selection.thread_tech_id, function(Response) { MODBUS_Refresh(); }, null ); } ) ;
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function MODBUS_Set ( selection )
  { var json_request =
     { agent_uuid:     $('#idTargetAgent').val(),
       thread_classe : "modbus",
       thread_tech_id: $('#idMODBUSTechID').val().toUpperCase(),
       hostname:       $('#idMODBUSHostname').val(),
       description:    $('#idMODBUSDescription').val(),
       watchdog:       parseInt($('#idMODBUSWatchdog').val()),
       max_request_par_sec: parseInt($('#idMODBUSMaxRequestParSec').val()),
     };

    Send_to_API ( "POST", "/modbus/set", json_request,
                  (Response) => { Show_toast_ok ("Modifications sauvegardées.");
                                  MODBUS_Refresh();
                                }, null );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function MODBUS_Edit ( modbus_id )
  { selection = $('#idTableMODBUS').DataTable().row("#"+modbus_id).data();
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, selection.agent_uuid );
    $('#idMODBUSTitre').text("Editer la connexion MODBUS " + selection.thread_tech_id);
    $('#idMODBUSTechID').prop ("disabled", true).val( selection.thread_tech_id );
    $('#idMODBUSHostname').val ( selection.hostname );
    $('#idMODBUSDescription').val( selection.description );
    $('#idMODBUSWatchdog').val( selection.watchdog )
      .off("input").on("input", () => Controle_num( "idMODBUS", "Watchdog" ) ).trigger("input");
    $('#idMODBUSMaxRequestParSec').val( selection.max_request_par_sec )
      .off("input").on("input", () => Controle_num( "idMODBUS", "MaxRequestParSec" ) ).trigger("input");
    $('#idMODBUSValider').off("click").on( "click", function () { MODBUS_Set(selection); } );
    $('#idMODBUSEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function MODBUS_Add ( )
  { $('#idMODBUSTitre').text("Ajouter un MODBUS");
    Select_from_api ( "idTargetAgent", "/agent/list", null, "agents", "agent_uuid", function (Response)
                        { return ( Response.agent_hostname ); }, null );
    $('#idMODBUSTechID').prop ("disabled", false).val("")
      .off("input").on("input", function () { Controle_tech_id( "idMODBUS", null ); } ).trigger("input");
    $('#idMODBUSHostname').val ( "" );
    $('#idMODBUSDescription').val( "" );
    $('#idMODBUSWatchdog').val( "600" )
      .off("input").on("input", () => Controle_num( "idMODBUS", "Watchdog" ) ).trigger("input");
    $('#idMODBUSMaxRequestParSec').val( "50" )
      .off("input").on("input", () => Controle_num( "idMODBUS", "MaxRequestParSec" ) ).trigger("input");
    $('#idMODBUSValider').off("click").on( "click", function () { MODBUS_Set(null); } );
    $('#idMODBUSEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function MODBUS_Map_DI (modbus_di_id)
  { selection = $('#idTableMODBUS_DI').DataTable().row("#"+modbus_di_id).data();
    $('#idMODALMapTitre').text( "Mapper "+selection.thread_tech_id+":"+selection.thread_acronyme );
    $('#idMODALMapRechercherTechID').off("input").on("input", function () { Common_Updater_Choix_TechID ( "idMODALMap", "DI" ); } );
    Common_Updater_Choix_TechID ( "idMODALMap", "DI", selection.tech_id, selection.acronyme );
    $('#idMODALMapValider').off("click").on( "click", function ()
     { $('#idMODALMap').modal("hide");
       COMMON_Map ( selection.thread_tech_id, selection.thread_acronyme,
                    $('#idMODALMapSelectTechID').val(),  $('#idMODALMapSelectAcronyme').val()
                  );
       MODBUS_Refresh();;
     });
    $('#idMODALMap').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function MODBUS_Map_DO (modbus_do_id)
  { selection = $('#idTableMODBUS_DO').DataTable().row("#"+modbus_do_id).data();
    $('#idMODALMapTitre').text( "Mapper "+selection.thread_tech_id+":"+selection.thread_acronyme );
    $('#idMODALMapRechercherTechID').off("input").on("input", function () { Common_Updater_Choix_TechID ( "idMODALMap", "DO" ); } );
    Common_Updater_Choix_TechID ( "idMODALMap", "DO", selection.tech_id, selection.acronyme );
    $('#idMODALMapValider').off("click").on( "click", function ()
     { $('#idMODALMap').modal("hide");
       COMMON_Map ( selection.thread_tech_id, selection.thread_acronyme,
                    $('#idMODALMapSelectTechID').val(),  $('#idMODALMapSelectAcronyme').val()
                  );
       MODBUS_Refresh();
     });
    $('#idMODALMap').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function MODBUS_Map_AI (modbus_ai_id)
  { selection = $('#idTableMODBUS_AI').DataTable().row("#"+modbus_ai_id).data();
    $('#idMODALMapTitre').text( "Mapper "+selection.thread_tech_id+":"+selection.thread_acronyme );
    $('#idMODALMapRechercherTechID').off("input").on("input", function () { Common_Updater_Choix_TechID ( "idMODALMap", "AI" ); } );
    Common_Updater_Choix_TechID ( "idMODALMap", "AI", selection.tech_id, selection.acronyme );
    $('#idMODALMapValider').off("click").on( "click", function ()
     { $('#idMODALMap').modal("hide");
       COMMON_Map ( selection.thread_tech_id, selection.thread_acronyme,
                    $('#idMODALMapSelectTechID').val(),  $('#idMODALMapSelectAcronyme').val()
                  );
       MODBUS_Refresh();
     });
    $('#idMODALMap').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function MODBUS_Map_AO (modbus_ao_id)
  { selection = $('#idTableMODBUS_AO').DataTable().row("#"+modbus_ao_id).data();
    $('#idMODALMapTitre').text( "Mapper "+selection.thread_tech_id+":"+selection.thread_acronyme );
    $('#idMODALMapRechercherTechID').off("input").on("input", function () { Common_Updater_Choix_TechID ( "idMODALMap", "AO" ); } );
    Common_Updater_Choix_TechID ( "idMODALMap", "AO", selection.tech_id, selection.acronyme );
    $('#idMODALMapValider').off("click").on( "click", function ()
     { $('#idMODALMap').modal("hide");
       COMMON_Map ( selection.thread_tech_id, selection.thread_acronyme,
                    $('#idMODALMapSelectTechID').val(),  $('#idMODALMapSelectAcronyme').val()
                  );
       MODBUS_Refresh();
     });
    $('#idMODALMap').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function MODBUS_Edit_DI (modbus_di_id)
  { selection = $('#idTableMODBUS_DI').DataTable().row("#"+modbus_di_id).data();
    $('#idMODBUSEditDITitre').text( "Configurer "+selection.thread_tech_id+":"+selection.thread_acronyme );
    $('#idMODBUSEditDILibelle').val ( selection.libelle );
    $('#idMODBUSEditDIValider').off("click").on( "click", function ()
     { $('#idMODBUSEditDI').modal("hide");
       var json_request =
        { modbus_di_id: parseInt(modbus_di_id),
          flip: (parseInt($('#idMODBUSEditDIFlip').val()) == 1 ? true : false),
          libelle: $('#idMODBUSEditDILibelle').val(),
        };

       Send_to_API ( "POST", "/modbus/set/di", json_request,
                     (Response) => { Show_toast_ok ("Modifications sauvegardées.");
                                     MODBUS_Refresh();
                                   }, null );
     });
    $('#idMODBUSEditDI').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function MODBUS_Edit_DO (modbus_do_id)
  { selection = $('#idTableMODBUS_DO').DataTable().row("#"+modbus_do_id).data();
    $('#idMODBUSEditDOTitre').text( "Configurer "+selection.thread_tech_id+":"+selection.thread_acronyme );
    $('#idMODBUSEditDOLibelle').val ( selection.libelle );
    $('#idMODBUSEditDOValider').off("click").on( "click", function ()
     { $('#idMODBUSEditDO').modal("hide");
       var json_request =
        { modbus_do_id: parseInt(modbus_do_id),
          libelle: $('#idMODBUSEditDOLibelle').val(),
        };

       Send_to_API ( "POST", "/modbus/set/do", json_request,
                     (Response) => { Show_toast_ok ("Modifications sauvegardées.");
                                     MODBUS_Refresh();
                                   }, null );
     });
    $('#idMODBUSEditDO').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function MODBUS_Edit_AI (modbus_ai_id)
  { selection = $('#idTableMODBUS_AI').DataTable().row("#"+modbus_ai_id).data();
    $('#idMODBUSEditAITitre').text( "Configurer "+selection.thread_tech_id+":"+selection.thread_acronyme );
    $('#idMODBUSEditAITypeBorne').replaceWith ( Select ( "idMODBUSEditAITypeBorne", null,
                                                         [ { valeur: 3, texte: Borne_Type[3] },
                                                           { valeur: 4, texte: Borne_Type[4] } ],
                                                         selection.type_borne ) );

    $('#idMODBUSEditAIArchivage').replaceWith ( Select ( "idMODBUSEditAIArchivage", null, ModeArchivage, selection.archivage ) );
    $('#idMODBUSEditAIMin').val ( selection.min );
    $('#idMODBUSEditAIMax').val ( selection.max );
    $('#idMODBUSEditAIUnite').val ( selection.unite );
    $('#idMODBUSEditAILibelle').val ( selection.libelle );
    $('#idMODBUSEditAIValider').off("click").on( "click", function ()
     { $('#idMODBUSEditAI').modal("hide");
       var json_request =
        { modbus_ai_id: parseInt(modbus_ai_id),
          type_borne: parseInt($('#idMODBUSEditAITypeBorne').val()),
          min: parseInt($('#idMODBUSEditAIMin').val()),
          max: parseInt($('#idMODBUSEditAIMax').val()),
          archivage: parseInt($('#idMODBUSEditAIArchivage').val()),
          unite: $('#idMODBUSEditAIUnite').val(),
          libelle: $('#idMODBUSEditAILibelle').val(),
        };

       Send_to_API ( "POST", "/modbus/set/ai", json_request,
                     (Response) => { Show_toast_ok ("Modifications sauvegardées.");
                                     MODBUS_Refresh();
                                   }, null );
     });
    $('#idMODBUSEditAI').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function MODBUS_Edit_AO (modbus_ao_id)
  { selection = $('#idTableMODBUS_AO').DataTable().row("#"+modbus_ao_id).data();
    $('#idMODBUSEditAOTitre').text( "Configurer "+selection.thread_tech_id+":"+selection.thread_acronyme );
    $('#idMODBUSEditAOTypeBorne').replaceWith ( Select ( "idMODBUSEditAOTypeBorne", null,
                                                         [ { valeur: 2, texte: Borne_Type[2] } ],
                                                         selection.type_borne ) );

    $('#idMODBUSEditAOArchivage').replaceWith ( Select ( "idMODBUSEditAOArchivage", null, ModeArchivage, selection.archivage ) );
    $('#idMODBUSEditAOMin').val ( selection.min );
    $('#idMODBUSEditAOMax').val ( selection.max );
    $('#idMODBUSEditAOUnite').val ( selection.unite );
    $('#idMODBUSEditAOLibelle').val ( selection.libelle );
    $('#idMODBUSEditAOValider').off("click").on( "click", function ()
     { $('#idMODBUSEditAO').modal("hide");
       var json_request =
        { modbus_ao_id: parseInt(modbus_ao_id),
          type_borne: parseInt($('#idMODBUSEditAOTypeBorne').val()),
          min: parseInt($('#idMODBUSEditAOMin').val()),
          max: parseInt($('#idMODBUSEditAOMax').val()),
          archivage: parseInt($('#idMODBUSEditAOArchivage').val()),
          unite: $('#idMODBUSEditAOUnite').val(),
          libelle: $('#idMODBUSEditAOLibelle').val(),
        };

       Send_to_API ( "POST", "/modbus/set/ao", json_request,
                     (Response) => { Show_toast_ok ("Modifications sauvegardées.");
                                     MODBUS_Refresh();
                                   }, null );
     });
    $('#idMODBUSEditAO').modal("show");
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableMODBUS').DataTable(
     { pageLength : 50,
       fixedHeader: true,
       rowId: "modbus_id",
       ajax: { url : $ABLS_API+"/modbus/list", type : "GET", dataSrc: "modbus", contentType: "application/json",
               data: function() { return ( "classe=modbus" ) },
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
                { return( Bouton ( "success", "Désactiver le module", "MODBUS_Disable", item.modbus_id, "Actif" ) ); }
               else
                { return( Bouton ( "outline-secondary", "Activer le module", "MODBUS_Enable", item.modbus_id, "Désactivé" ) ); }
              },
          },
           { "data": null, "title":"Debug", "className": "align-middle text-center",
             "render": function (item)
              { if (item.debug==true)
                 { return( Bouton ( "warning", "Désactiver le debug", "MODBUS_Undebug", item.modbus_id, "Actif" ) ); }
                else
                 { return( Bouton ( "outline-secondary", "Activer le debug", "MODBUS_Debug", item.modbus_id, "Désactivé" ) ); }
              },
           },
          { "data": null, "title":"Tech_id", "className": "align-middle text-center",
            "render": function (item)
              { return( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
          },
          { "data": "description", "title":"Description", "className": "align-middle text-center " },
          { "data": "watchdog", "title":"Watchdog (s)", "className": "align-middle text-center " },
          { "data": "hostname", "title":"Hostname", "className": "align-middle text-center " },
          { "data": "max_request_par_sec", "title":"Max Requete/s", "className": "align-middle text-center " },
          { "data": null, "title":"Last Comm", "className": "align-middle text-center",
            "render": function (item)
              { if (item.last_comm==null) return( Badge( "info", "Thread à l'arret", "Stopped" ) );
                return( htmlEncode ( item.last_comm ) );
              },
          },
          { "data": null, "title":"Actions", "orderable": false, "className": "align-middle text-center", "render": function (item)
              { boutons = Bouton_actions_start ();
                boutons += Bouton_actions_add ( "outline-primary", "Editer le module", "MODBUS_Edit", item.modbus_id, "pen", null );
                boutons += Bouton_actions_add ( "danger", "Supprimer le module", "MODBUS_Del", item.modbus_id, "trash", null );
                boutons += Bouton_actions_end ();
                return(boutons);
              },
          }
        ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

    $('#idTableMODBUS_DI').DataTable(
       { pageLength : 50,
         fixedHeader: true,
         rowId: "modbus_di_id", paging: false,
         ajax: { url : $ABLS_API+"/modbus/list", type : "GET", dataSrc: "DI",
                 contentType: "application/json",
                 data: function() { return ( "classe=DI" ) },
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request)
                              { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                                request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                              }
               },
         columns:
          [ { "data": null, "title":"WAGO TechID", "className": "align-middle text-center",
              "render": function (item)
                { return( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
            },
            { "data": null, "title":"WAGO I/O", "className": "align-middle text-center",
              "render": function (item)
                { return( item.thread_acronyme ); }
            },
            { "data": "flip", "title":"Flip", "className": "align-middle text-center" },
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
                  boutons += Bouton_actions_add ( "outline-primary", "Editer cet objet", "MODBUS_Edit_DI", item.modbus_di_id, "pen", null );
                  boutons += Bouton_actions_add ( "primary", "Mapper cet objet", "MODBUS_Map_DI", item.modbus_di_id, "directions", null );
                  boutons += Bouton_actions_end ();
                  return(boutons);
                },
            },
          ],
         /*order: [ [0, "desc"] ],*/
         /*responsive: true,*/
       }
     );

    $('#idTableMODBUS_DO').DataTable(
       { pageLength : 50,
         fixedHeader: true,
         rowId: "modbus_do_id", paging: false,
         ajax: { url : $ABLS_API+"/modbus/list", type : "GET", dataSrc: "DO",
                 contentType: "application/json",
                 data: function() { return ( "classe=DO" ) },
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request)
                              { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                                request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                              }
               },
         columns:
          [ { "data": null, "title":"WAGO TechID", "className": "align-middle text-center",
              "render": function (item)
                { return( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
            },
            { "data": null, "title":"WAGO I/O", "className": "align-middle text-center",
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
                  boutons += Bouton_actions_add ( "outline-primary", "Editer cet objet", "MODBUS_Edit_DO", item.modbus_do_id, "pen", null );
                  boutons += Bouton_actions_add ( "primary", "Mapper cet objet", "MODBUS_Map_DO", item.modbus_do_id, "directions", null );
                  boutons += Bouton_actions_end ();
                  return(boutons);
                },
            },
          ],
         /*order: [ [0, "desc"] ],*/
         /*responsive: true,*/
       }
     );

    $('#idTableMODBUS_AI').DataTable(
       { pageLength : 50,
         fixedHeader: true,
         rowId: "modbus_ai_id", paging: false,
         ajax: { url : $ABLS_API+"/modbus/list", type : "GET", dataSrc: "AI",
                 contentType: "application/json",
                 data: function() { return ( "classe=AI" ) },
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request)
                              { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                                request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                              }
               },
         columns:
          [ { "data": null, "title":"WAGO TechID", "className": "align-middle text-center",
              "render": function (item)
                { return( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
            },
            { "data": null, "title":"WAGO I/O", "className": "align-middle text-center",
              "render": function (item)
                { return( item.thread_acronyme ); }
            },
            { "data": null, "title":"Mapped on", "className": "align-middle text-center",
              "render": function (item)
                { if(item.tech_id)
                   { return ( Lien ( "/dls/"+item.tech_id, "Voir la source", item.tech_id ) +":" +
                              Lien ( "/courbe/"+item.tech_id+"/"+item.acronyme, "Voir le graphe", item.acronyme ) );
                   } else return( "--" );
                }
            },
            { "data": null, "title":"Description", "className": "align-middle text-center",
              "render": function (item)
                { return ( htmlEncode(item.libelle) ); }
            },
            { "data": null, "title":"Type Borne", "className": "align-middle text-center",
              "render": function (item)
                { return( Borne_Type[item.type_borne] ); }
            },
            { "data": "min", "title":"min", "className": "align-middle text-center" },
            { "data": "max", "title":"max", "className": "align-middle text-center" },
            { "data": null, "title":"Unité", "className": "align-middle text-center",
              "render": function (item)
                { return( htmlEncode ( item.unite ) ); }
            },
            { "data": null, "title":"Actions", "orderable": false, "render": function (item)
                { boutons = Bouton_actions_start ();
                  boutons += Bouton_actions_add ( "outline-primary", "Editer cet objet", "MODBUS_Edit_AI", item.modbus_ai_id, "pen", null );
                  boutons += Bouton_actions_add ( "primary", "Mapper cet objet", "MODBUS_Map_AI", item.modbus_ai_id, "directions", null );
                  boutons += Bouton_actions_end ();
                  return(boutons);
                },
            },
          ],
         /*order: [ [0, "desc"] ],*/
         /*responsive: true,*/
       }
     );

    $('#idTableMODBUS_AO').DataTable(
       { pageLength : 50,
         fixedHeader: true,
         rowId: "modbus_ao_id", paging: false,
         ajax: {	url : $ABLS_API+"/modbus/list", type : "GET", dataSrc: "AO",
                 contentType: "application/json",
                 data: function() { return ( "classe=AO" ) },
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request)
                              { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                                request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                              }
               },
         columns:
          [ { "data": null, "title":"WAGO TechID", "className": "align-middle text-center",
              "render": function (item)
                { return( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
            },
            { "data": null, "title":"WAGO I/O", "className": "align-middle text-center",
              "render": function (item)
                { return( item.thread_acronyme ); }
            },
            { "data": null, "title":"Mapped on", "className": "align-middle text-center",
              "render": function (item)
                { if(item.tech_id)
                   { return ( Lien ( "/dls/"+item.tech_id, "Voir la source", item.tech_id ) + ":" +
                              Lien ( "/courbe/"+item.tech_id+"/"+item.acronyme, "Voir le graphe", item.acronyme ) );
                   } else return( "--" );
                }
            },
            { "data": null, "title":"Description", "className": "align-middle text-center",
              "render": function (item)
                { return ( htmlEncode(item.libelle) ); }
            },
            { "data": null, "title":"Type Borne", "className": "align-middle text-center",
              "render": function (item)
                { return( Borne_Type[item.type_borne] ); }
            },
            { "data": "min", "title":"min", "className": "align-middle text-center" },
            { "data": "max", "title":"max", "className": "align-middle text-center" },
            { "data": null, "title":"Unité", "className": "align-middle text-center",
              "render": function (item)
                { return( htmlEncode ( item.unite ) ); }
            },
            { "data": null, "title":"Actions", "orderable": false, "render": function (item)
                { boutons = Bouton_actions_start ();
                  boutons += Bouton_actions_add ( "outline-primary", "Editer cet objet", "MODBUS_Edit_AO", item.modbus_ao_id, "pen", null );
                  boutons += Bouton_actions_add ( "primary", "Mapper cet objet", "MODBUS_Map_AO", item.modbus_ao_id, "directions", null );
                  boutons += Bouton_actions_end ();
                  return(boutons);
                },
            },
          ],
         /*order: [ [0, "desc"] ],*/
         /*responsive: true,*/
       }
     );

    $('#idTabEntreeTor').tab('show');
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
