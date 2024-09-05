/************************************ Demande de refresh **********************************************************************/
 function THREAD_Refresh ( )
  { $('#idTableTHREAD').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function THREAD_set_disable (thread_tech_id)
  { $("#idButtonSpinner_THREAD_set_disable_"+thread_tech_id).show();
    Thread_enable ( thread_tech_id, false, function(Response) { THREAD_Refresh(); }, function(Response) { THREAD_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function THREAD_set_enable (thread_tech_id)
  { $("#idButtonSpinner_THREAD_set_enable_"+thread_tech_id).show();
    Thread_enable ( thread_tech_id, true, function(Response) { THREAD_Refresh(); }, function(Response) { THREAD_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function THREAD_set_debug (thread_tech_id)
  { $("#idButtonSpinner_THREAD_set_debug_"+thread_tech_id).show();
    Thread_debug ( thread_tech_id, true, function(Response) { THREAD_Refresh(); }, function(Response) { THREAD_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function THREAD_set_undebug (thread_tech_id)
  { $("#idButtonSpinner_THREAD_set_undebug_"+thread_tech_id).show();
    Thread_debug ( thread_tech_id, false, function(Response) { THREAD_Refresh(); }, function(Response) { THREAD_Refresh(); } );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableTHREAD').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/thread/list", type : "GET", dataSrc: "threads", contentType: "application/json",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       /*rowId: "thread_id",*/
       columns:
        [ { "data": null, "title":"Tech_id", "className": "align-middle text-center",
            "render": function (item)
              { return( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
          },
          { "data": null, "title":"Agent", "className": "align-middle text-center",
            "render": function (item)
              { return( htmlEncode(item.agent_hostname) ); }
          },
          { "data": null, "title":"Classe", "className": "align-middle text-center",
            "render": function (item)
              { return( Lien ( "/"+item.thread_classe, "Voir la configuration du connecteur", htmlEncode(item.thread_classe) ) ); }
          },
          { "data": null, "title":"Enable", "className": "align-middle text-center",
             "render": function (item)
              { if (item.enable==true)
                { return( Bouton ( "success", "Désactiver le thread", "THREAD_set_disable", item.thread_tech_id, "Actif" ) ); }
               else
                { return( Bouton ( "outline-secondary", "Activer le thread", "THREAD_set_enable", item.thread_tech_id, "Désactivé" ) ); }
              },
          },
           { "data": null, "title":"Connexion", "className": "align-middle text-center",
             "render": function (item)
               { if (item.is_alive) return( Badge( "success", "Connecté", "Connecté" ) );
                 return( Badge( "info", "Déconnecté", "Déconnecté" ) );
               },
           },
          { "data": null, "title":"Debug", "className": "align-middle text-center",
            "render": function (item)
             { if (item.debug==true)
                 { return( Bouton ( "warning", "Désactiver le debug", "THREAD_set_undebug", item.thread_tech_id, "Actif" ) ); }
               else
                { return( Bouton ( "outline-secondary", "Activer le debug", "THREAD_set_debug", item.thread_tech_id, "Désactivé" ) ); }
             },
          },
          { "data": "description", "title":"Description", "className": "align-middle " },
        ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

  }
