 function COMMAND_TEXT_Refresh ( )
  { $('#idTableTXT').DataTable().ajax.reload(null, false);
  }
/**************************************** Supprime une connexion modbus *******************************************************/
 function COMMAND_TEXT_Del (mapping_id)
  { selection = $('#idTableTXT').DataTable().row("#"+mapping_id).data();
    Show_modal_del ( "Supprimer le mapping "+selection.thread_acronyme,
                     "Etes-vous sûr de vouloir supprimer ce mapping ?",
                     selection.thread_acronyme + " - "+selection.tech_id +":"+ selection.acronyme,
                     function () { Send_to_API ( 'DELETE', "/mapping/delete", { mapping_id: parseInt(mapping_id) },
                                                 function () { COMMAND_TEXT_Refresh (); } )
                                 });
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function COMMAND_TEXT_Add ( )
  { var json_request = { thread_tech_id: "_COMMAND_TEXT", thread_acronyme: $('#idModalCommandTextAdd').val().toUpperCase(),
                         tech_id: "SYS", acronyme: "DEFAULT_MAP" };
    Send_to_API ( 'POST', "/mapping/set", json_request, function () { COMMAND_TEXT_Refresh (); });
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function COMMAND_TEXT_Map_DI ( mapping_id )
  { selection = $('#idTableTXT').DataTable().row("#"+mapping_id).data();
    $('#idMODALMapTitre').text( "Mapper la commande textuelle '"+selection.thread_acronyme+"'" );
    $('#idMODALMapRechercherTechID').off("input").on("input", function () { Common_Updater_Choix_TechID ( "idMODALMap", "DI" ); } );
    Common_Updater_Choix_TechID ( "idMODALMap", "DI", selection.tech_id, selection.acronyme );
    $('#idMODALMapValider').off("click").on( "click", function ()
     { $('#idMODALMap').modal("hide");
       COMMON_Map ( "_COMMAND_TEXT", selection.thread_acronyme,
                    $('#idMODALMapSelectTechID').val(),  $('#idMODALMapSelectAcronyme').val()
                  );
       COMMAND_TEXT_Refresh();
     });
    $('#idMODALMap').modal("show");
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableTXT').DataTable(
       { pageLength : 50,
         fixedHeader: true,
         rowId: "mapping_id", paging: false,
         ajax: {	url : $ABLS_API+"/mapping/list",	type : "GET", dataSrc: "mappings", data: { "thread_tech_id": "_COMMAND_TEXT" },
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request)
                              { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                                request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                              },
               },

         columns:
          [ { "data": "thread_acronyme", "title":"Texte Source", "className": "align-middle text-center" },
            { "data": null, "title":"Mapped on", "className": "align-middle text-center",
              "render": function (item)                { if(item.tech_id)
                   { return ( Lien ( "/dls_source/"+item.tech_id, "Voir la source", item.tech_id ) +":" + item.acronyme );
                   } else return( "--" );
                }
            },
            { "data": null, "title":"Actions", "orderable": false, "render": function (item)
                { boutons = Bouton_actions_start ();
                  boutons += Bouton_actions_add ( "primary", "Mapper cette commande", "COMMAND_TEXT_Map_DI", item.mapping_id, "directions", null );
                  boutons += Bouton_actions_add ( "danger", "Supprimer le mapping", "COMMAND_TEXT_Del", item.mapping_id, "trash", null );
                  boutons += Bouton_actions_end ();
                  return(boutons);
                },
            },
          ],
         /*order: [ [0, "desc"] ],*/
         responsive: true,
       }
     );

  }
/*----------------------------------------------------------------------------------------------------------------------------*/
