/************************************ Demande de refresh **********************************************************************/
 function TABLEAU_Refresh ( )
  { $('#idTableTableau').DataTable().ajax.reload(null, false);
  }
/************************************ Créé un nouveau tableau *****************************************************************/
 function TABLEAU_New ( )
  { $('#idTableauEditTitre').text ( "Ajouter un tableau" );
    Select_from_api ( "idTableauEditPage", "/syn/list", null, "synoptiques", "syn_id", function (item)
     { return ( item.page+" - "+htmlEncode(item.libelle) ); }, Get_url_parameter("syn_id") );

    $('#idTableauEditLibelle').val( "" );
    $('#idTableauEditValider').attr( "onclick", "TABLEAU_Set(null)" );
    $('#idTableauEdit').modal("show");
  }
/************************************ Créé un nouveau tableau *****************************************************************/
 function TABLEAU_Set ( tableau_id )
  { selection = $('#idTableTableau').DataTable().row("#"+tableau_id).data();
    var json_request =
       { titre:  $('#idTableauEditLibelle').val(),
         syn_id: parseInt($('#idTableauEditPage').val()),
       }
    if (tableau_id!=null) json_request.tableau_id = selection.tableau_id;

    Send_to_API ( "POST", "/tableau/set", json_request, function (Response)
     { TABLEAU_Refresh();
     }, null );
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function TABLEAU_Valide_delete ( tableau_id )
  { var json_request = { tableau_id: tableau_id };

    Send_to_API ( "DELETE", "/tableau/delete", json_request, function (Response)
     { TABLEAU_Refresh();
     }, null );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function TABLEAU_Delete ( tableau_id )
  { selection = $('#idTableTableau').DataTable().row("#"+tableau_id).data();
    Show_modal_del ( "Détruire le tableau ?",
                     "Etes-vous sur de vouloir supprimer le tableau suivant ?",
                     selection.titre,
                     function () { TABLEAU_Valide_delete(selection.tableau_id); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function TABLEAU_Edit ( tableau_id )
  { table = $('#idTableTableau').DataTable();
    selection = table.ajax.json().tableaux.filter( function(item) { return item.tableau_id==tableau_id } )[0];
    $('#idTableauEditTitre').text ( "Modifier le tableau " + selection.titre + "?" );
    Select_from_api ( "idTableauEditPage", "/syn/list", null, "synoptiques", "syn_id", function(item)
                        { return(item.page+" - "+htmlEncode(item.libelle)); }, selection.syn_id );

    $('#idTableauEditLibelle').val( selection.titre );
    $('#idTableauEditValider').attr( "onclick", "TABLEAU_Set('"+selection.tableau_id+"')" );
    $('#idTableauEdit').modal("show");
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { syn_id = Get_url_parameter("syn_id");
    if (syn_id != null)
     {  parametres = { "syn_id": syn_id }; }
    else parametres = {};
    $('#idTableTableau').DataTable(
       { pageLength : 25,
         fixedHeader: true,
         ajax: {	url : $ABLS_API+"/tableau/list", type : "GET", dataSrc: "tableaux", contentType: "application/json",
                 data: function() { if (syn_id != null) return ( "syn_id="+syn_id ); else return (""); },
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request)
                              { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                                request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                              }
               },
         rowId: "tableau_id",
         columns:
          [ { "data": "page", "title":"Page", "className": "align-middle text-center" },
            { "data": "titre", "title":"Titre", "className": "align-middle" },
            { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
              "render": function (item)
                { boutons = Bouton_actions_start ();
                  /*boutons += Bouton_actions_add ( "secondary", "Voir le tableau", "Redirect", "/"+item.page, "chart-line", null );*/
                  boutons += Bouton_actions_add ( "outline-primary", "Configurer", "TABLEAU_Edit", item.tableau_id, "pen", null );
                  boutons += Bouton_actions_add ( "outline-secondary", "Editer les courbes", "Redirect", "/tableau_map?tableau_id="+item.tableau_id, "pen", null );
                  boutons += Bouton_actions_add ( "danger", "Supprimer ce tableau", "TABLEAU_Delete", item.tableau_id, "trash", null );
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
