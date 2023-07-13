/************************************ Créé un nouveau tableau *****************************************************************/
 function Tableau_Map_Add ( )
  { vars = window.location.pathname.split('/');
    var json_request =
       { tableau_id: parseInt(vars[2]),
         tech_id : "New_tech_id",
         acronyme: "New_acronyme",
         color   : "#00F",
       };
    Send_to_API ( "POST", "/tableau/map/set", json_request, function (Response)
     { $('#idTableTableauMap').DataTable().ajax.reload(null, false);
     }, null );
  }
/************************************ Créé un nouveau tableau *****************************************************************/
 function Tableau_Map_Set ( tableau_map_id )
  { selection = $('#idTableTableauMap').DataTable().row("#"+tableau_map_id).data();
    var json_request =
       { tableau_map_id: tableau_map_id,
         tech_id : $('#idTableauMapTechId_'+tableau_map_id).val(),
         acronyme: $('#idTableauMapAcronyme_'+tableau_map_id).val(),
         color   : $('#idTableauMapColor_'+tableau_map_id).val(),
       };
    Send_to_API ( "POST", "/tableau/map/set", json_request, function (Response)
     { $('#idTableTableauMap').DataTable().ajax.reload(null, false);
     }, null );
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Tableau_Map_Valide_delete ( selection )
  { var json_request = { tableau_map_id: selection.tableau_map_id };
    Send_to_API ( "DELETE", "/tableau/map/delete", json_request, function (Response)
     { $('#idTableTableauMap').DataTable().ajax.reload(null, false);
     }, null );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function Tableau_Map_Delete ( tableau_map_id )
  { selection = $('#idTableTableauMap').DataTable().row("#"+tableau_map_id).data();
    Show_modal_del ( "Supprimer la courbe du tableau ?",
                     "Etes-vous sur de vouloir supprimer la courbe suivante ?",
                     selection.tech_id+":"+selection.acronyme,
                     function () { Tableau_Map_Valide_delete(selection); } );
  }

/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    var Tableau_id = vars[2];
    if (Tableau_id == null) Redirect ("/tableau");

    Send_to_API ( "GET", "/tableau/list", null, function(Response)
     { tableau = Response.tableaux.filter( function(item) { return item.tableau_id==Tableau_id } )[0];
       if (tableau) $('#idTableauTitle').text(tableau.titre);
     }, null );

    $('#idTableTableauMap').DataTable(
       { pageLength : 25,
         fixedHeader: true,
         ajax: { url : $ABLS_API+"/tableau/map/list", type : "GET", dataSrc: "tableau_map", contentType: "application/json",
                 data: { tableau_id: Tableau_id },
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request)
                              { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                                request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                              }
               },
         rowId: "tableau_map_id",
         columns:
          [ { "data": null, "title":"TechID", "className": "align-middle ",
              "render": function (item)
                { return( Input ( "text", "idTableauMapTechId_"+item.tableau_map_id,
                                  "Tableau_Map_Set('"+item.tableau_map_id+"')",
                                  "Quel est le tech_id du bit cible ?",
                                  item.tech_id )
                        );
                }
            },
            { "data": null, "title":"Acronyme", "className": "align-middle ",
              "render": function (item)
                { return( Input ( "text", "idTableauMapAcronyme_"+item.tableau_map_id,
                                  "Tableau_Map_Set('"+item.tableau_map_id+"')",
                                  "Quel est l'acronyme du bit cible ?",
                                  item.acronyme )
                        );
                }
            },
            { "data": null, "title":"Couleur", "className": "align-middle ",
              "render": function (item)
                { return( Input ( "text", "idTableauMapColor_"+item.id,
                                  "Tableau_Map_Set('"+item.id+"')",
                                  "Quelle est la couleur de la courbe ?",
                                  item.color )
                        );
                }
            },
            { "data": "libelle", "title":"Libellé", "className": "align-middle text-center " },
            { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
              "render": function (item)
                { boutons = Bouton_actions_start ();
                  boutons += Bouton_actions_add ( "primary", "Voir la courbe", "Redirect", "/courbe/"+item.tech_id+"/"+item.acronyme+"/HOUR", "chart-line", null );
                  boutons += Bouton_actions_add ( "danger", "Supprimer cette courbe", "Tableau_Map_Delete", item.tableau_map_id, "trash", null );
                  boutons += Bouton_actions_end ();
                  return(boutons);
                },
            }
          ],
         /*order: [ [0, "desc"] ],*/
         responsive: true,
       }
     );
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
