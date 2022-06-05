 function MODBUS_Refresh ( )
  { $('#idTableMODBUS').DataTable().ajax.reload(null, false);
    $('#idTableMODBUS_DI').DataTable().ajax.reload(null, false);
    $('#idTableMODBUS_DO').DataTable().ajax.reload(null, false);
    $('#idTableMODBUS_AI').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function MODBUS_Disable (modbus_id)
  { $("#idButtonSpinner_"+modbus_id).show();
    Thread_enable ( selection.thread_tech_id, false, function(Response) { MODBUS_Refresh(); }, function(Response) { MODBUS_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function MODBUS_Enable (modbus_id)
  { $("#idButtonSpinner_"+modbus_id).show();
    Thread_enable ( selection.thread_tech_id, true, function(Response) { MODBUS_Refresh(); }, function(Response) { MODBUS_Refresh(); } );
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
       thread_tech_id: $('#idMODBUSTechID').val(),
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
 function MODBUS_Map_DI (modbus_id)
  { selection = $('#idTableMODBUS_DI').DataTable().row("#"+modbus_id).data();
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
 function MODBUS_Map_DO (modbus_id)
  { selection = $('#idTableMODBUS_DO').DataTable().row("#"+modbus_id).data();
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
 function MODBUS_Map_AI (modbus_id)
  { selection = $('#idTableMODBUS_AI').DataTable().row("#"+modbus_id).data();
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
 function MODBUS_Edit_AI (modbus_id)
  { selection = $('#idTableMODBUS_AI').DataTable().row("#"+modbus_id).data();
    $('#idMODBUSEditAI').text( "Configurer "+selection.thread_tech_id+":"+selection.thread_acronyme );
    $('#idMODBUSEditAITypeBorne').val ( selection.type_borne );
    $('#idMODBUSEditAIMin').val ( selection.min );
    $('#idMODBUSEditAIMax').val ( selection.max );
    $('#idMODBUSEditAIValider').off("click").on( "click", function ()
     { $('#idMODBUSEditAI').modal("hide");
       /*Send_to_API().then ( () => { MODBUS_Refresh(); } );*/
     });
    $('#idMODBUSEditAI').modal("show");
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableMODBUS').DataTable(
     { pageLength : 50,
       fixedHeader: true,
       rowId: "modbus_id",
       ajax: {	url : $ABLS_API+"/modbus/list", type : "POST", dataSrc: "modbus", contentType: "application/json",
               data: function() { return ( JSON.stringify({"domain_uuid": localStorage.getItem('domain_uuid'), "classe": "modbus"} ) ); },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               headers: { 'Authorization': 'Bearer ' + Token }
             },
       columns:
        [ { "data": "agent_hostname",   "title":"Agent", "className": "align-middle text-center" },
          { "data": null, "title":"Enable", "className": "align-middle text-center",
             "render": function (item)
              { if (item.enable==true)
                { return( Bouton ( "success", "Désactiver le module", "MODBUS_Disable", item.modbus_id, "Actif" ) ); }
               else
                { return( Bouton ( "outline-secondary", "Activer le module", "MODBUS_Enable", item.modbus_id, "Désactivé" ) ); }
              },
          },
          { "data": null, "title":"Tech_id", "className": "align-middle text-center",
            "render": function (item)
              { return( Lien ( "/tech/dls_source/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
          },
          { "data": "description", "title":"Description", "className": "align-middle text-center " },
          { "data": "watchdog", "title":"Watchdog (s)", "className": "align-middle text-center " },
          { "data": "hostname", "title":"Hostname", "className": "align-middle text-center " },
          { "data": "max_request_par_sec", "title":"Max Requete/s", "className": "align-middle text-center " },
          { "data": null, "title":"IO_COMM", "className": "align-middle text-center",
            "render": function (item)
              { if (item.comm==true) { return( Bouton ( "success", "Comm OK", null, null, "1" ) );        }
                                else { return( Bouton ( "outline-secondary", "Comm Failed", null, null, "0" ) ); }
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
       responsive: true,
     });

    $('#idTableMODBUS_DI').DataTable(
       { pageLength : 50,
         fixedHeader: true,
         rowId: "modbus_di_id", paging: false,
         ajax: {	url : $ABLS_API+"/modbus/list", type : "POST", dataSrc: "DI",
               contentType: "application/json",
               data: function() { return ( JSON.stringify({"domain_uuid": localStorage.getItem('domain_uuid'), "classe": "DI"} ) ); },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               headers: { 'Authorization': 'Bearer ' + Token }
             },
         columns:
          [ { "data": null, "title":"WAGO TechID", "className": "align-middle text-center",
              "render": function (item)
                { return( Lien ( "/tech/dls_source/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
            },
            { "data": null, "title":"WAGO I/O", "className": "align-middle text-center",
              "render": function (item)
                { return( item.thread_acronyme ); }
            },
            { "data": null, "title":"Mapped on", "className": "align-middle text-center",
              "render": function (item)                { if(item.tech_id)
                   { return ( Lien ( "/tech/dls_source/"+item.tech_id, "Voir la source", item.tech_id ) +":" + item.acronyme );
                   } else return( "--" );
                }
            },
            { "data": null, "title":"Description", "className": "align-middle text-center",
              "render": function (item)
                { if(item.tech_id) { return ( item.libelle ); } else return( "--" ); }
            },
            { "data": null, "title":"Actions", "orderable": false, "render": function (item)
                { boutons = Bouton_actions_start ();
                  boutons += Bouton_actions_add ( "primary", "Mapper cet objet", "MODBUS_Map_DI", item.modbus_id, "directions", null );
                  boutons += Bouton_actions_end ();
                  return(boutons);
                },
            },
          ],
         /*order: [ [0, "desc"] ],*/
         responsive: true,
       }
     );

    $('#idTableMODBUS_DO').DataTable(
       { pageLength : 50,
         fixedHeader: true,
         rowId: "modbus_do_id", paging: false,
         ajax: {	url : $ABLS_API+"/modbus/list", type : "POST", dataSrc: "DO",
               contentType: "application/json",
               data: function() { return ( JSON.stringify({"domain_uuid": localStorage.getItem('domain_uuid'), "classe": "DO"} ) ); },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               headers: { 'Authorization': 'Bearer ' + Token }
             },
         columns:
          [ { "data": null, "title":"WAGO TechID", "className": "align-middle text-center",
              "render": function (item)
                { return( Lien ( "/tech/dls_source/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
            },
            { "data": null, "title":"WAGO I/O", "className": "align-middle text-center",
              "render": function (item)
                { return( item.thread_acronyme ); }
            },
            { "data": null, "title":"Mapped on", "className": "align-middle text-center",
              "render": function (item)
                { if(item.tech_id)
                   { return ( Lien ( "/tech/dls_source/"+item.tech_id, "Voir la source", item.tech_id ) +":" + item.acronyme );
                   } else return( "--" );
                }
            },
            { "data": null, "title":"Description", "className": "align-middle text-center",
              "render": function (item)
                { if(item.tech_id) { return ( item.libelle ); } else return( "--" ); }
            },
            { "data": null, "title":"Actions", "orderable": false, "render": function (item)
                { boutons = Bouton_actions_start ();
                  boutons += Bouton_actions_add ( "primary", "Mapper cet objet", "MODBUS_Map_DO", item.modbus_id, "directions", null );
                  boutons += Bouton_actions_end ();
                  return(boutons);
                },
            },
          ],
         /*order: [ [0, "desc"] ],*/
         responsive: true,
       }
     );

    $('#idTableMODBUS_AI').DataTable(
       { pageLength : 50,
         fixedHeader: true,
         rowId: "modbus_ai_id", paging: false,
         ajax: {	url : $ABLS_API+"/modbus/list", type : "POST", dataSrc: "AI",
               contentType: "application/json",
               data: function() { return ( JSON.stringify({"domain_uuid": localStorage.getItem('domain_uuid'), "classe": "AI"} ) ); },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               headers: { 'Authorization': 'Bearer ' + Token }
             },
         columns:
          [ { "data": null, "title":"WAGO TechID", "className": "align-middle text-center",
              "render": function (item)
                { return( Lien ( "/tech/dls_source/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
            },
            { "data": null, "title":"WAGO I/O", "className": "align-middle text-center",
              "render": function (item)
                { return( item.thread_acronyme ); }
            },
            { "data": null, "title":"Mapped on", "className": "align-middle text-center",
              "render": function (item)                { if(item.tech_id)
                   { return ( Lien ( "/tech/dls_source/"+item.tech_id, "Voir la source", item.tech_id ) +":" + item.acronyme );
                   } else return( "--" );
                }
            },
            { "data": null, "title":"Description", "className": "align-middle text-center",
              "render": function (item)
                { if(item.tech_id) { return ( item.libelle ); } else return( "--" ); }
            },
            { "data": null, "title":"Type Borne", "className": "align-middle text-center",
              "render": function (item)
                { return( "type_borne = " + item.type_borne ); }
            },
            { "data": "min", "title":"min", "className": "align-middle text-center" },
            { "data": "max", "title":"max", "className": "align-middle text-center" },
            { "data": null, "title":"Unité", "className": "align-middle text-center",
              "render": function (item)
                { return( htmlEncode ( item.unite ) ); }
            },
            { "data": null, "title":"Actions", "orderable": false, "render": function (item)
                { boutons = Bouton_actions_start ();
                  boutons += Bouton_actions_add ( "primary", "Editer cet objet", "MODBUS_Edit_AI", item.modbus_id, "pen", null );
                  boutons += Bouton_actions_add ( "primary", "Mapper cet objet", "MODBUS_Map_AI", item.modbus_id, "directions", null );
                  boutons += Bouton_actions_end ();
                  return(boutons);
                },
            },
          ],
         /*order: [ [0, "desc"] ],*/
         responsive: true,
       }
     );

    $('#idTabEntreeTor').tab('show');
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
