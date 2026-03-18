 var ModeTableau = [ { valeur: 0, color: "info",    tooltip: "Affichage en tant que courbes", texte: "Courbe" },
                     { valeur: 1, color: "warning", tooltip: "Affichage en tant que valeurs", texte: "Valeur" },
                   ];
 var TABLEAU_LOCK = [ { valeur: 0, texte: "No" },
                      { valeur: 1, texte: "Yes" },
                    ];
/************************************ Demande de refresh **********************************************************************/
 function TABLEAU_Refresh ( )
  { $('#idTableTableau').DataTable().ajax.reload(null, false);
  }
/************************************ Créé un nouveau tableau *****************************************************************/
 function TABLEAU_New ( )
  { $('#idTableauEditTitre').text ( "Ajouter un tableau" );
    Select_from_api ( "idTableauEditPage", "/syn/list", null, "synoptiques", "syn_id", function (item)
     { return ( item.page+" - "+htmlEncode(item.libelle) ); }, Get_url_parameter("syn_id") );
    $("#idTableauEditPeriodLock").replaceWith ( Select ( "idTableauEditPeriodLock", null, TABLEAU_LOCK, 0 ) );

    $('#idTableauEditMode').replaceWith ( Select ( "idTableauEditMode", null, ModeTableau, 0 ) );
    $('#idTableauEditPeriode').replaceWith ( Select ( "idTableauEditPeriode", null, PeriodeTableau, 0 ) );
    $('#idTableauEditLibelle').val( "" );
    $('#idTableauEditValider').attr( "onclick", "TABLEAU_Set(null)" );
    $('#idTableauEdit').modal("show");
  }
/************************************ Créé un nouveau tableau *****************************************************************/
 function TABLEAU_Set ( tableau_id )
  { selection = $('#idTableTableau').DataTable().row("#"+tableau_id).data();
    var json_request =
       { titre:   $('#idTableauEditLibelle').val(),
         mode:    parseInt($('#idTableauEditMode').val()),
         periode: $('#idTableauEditPeriode').val(),
         period_lock: ($('#idTableauEditPeriodLock').val() == 1 ? true : false),
         syn_id:  parseInt($('#idTableauEditPage').val()),
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
  { selection = $('#idTableTableau').DataTable().row("#"+tableau_id).data();
    $('#idTableauEditTitre').text ( "Modifier le tableau " + selection.titre + "?" );
    Select_from_api ( "idTableauEditPage", "/syn/list", null, "synoptiques", "syn_id", function(item)
                        { return(item.page+" - "+htmlEncode(item.libelle)); }, selection.syn_id );
    $("#idTableauEditPeriodLock").replaceWith ( Select ( "idTableauEditPeriodLock", null, TABLEAU_LOCK, selection.period_lock ) );

    $('#idTableauEditMode').replaceWith ( Select ( "idTableauEditMode", null, ModeTableau, selection.mode ) );
    $('#idTableauEditPeriode').replaceWith ( Select ( "idTableauEditPeriode", null, PeriodeTableau, selection.periode ) );
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
         ajax: { url : $ABLS_API+"/tableau/list", type : "GET", dataSrc: "tableaux", contentType: "application/json",
                 data: function() { if (syn_id != null) return ( "syn_id="+syn_id ); else return (""); },
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request)
                              { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                                request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                              }
               },
         rowId: "tableau_id",
         columns:
          [ { "data": "page", "title":"Page", "className": "text-center" },
            { "data": "titre", "title":"Titre", "className": "" },
            { "data": null, "title":"Mode", "className": "text-center d-none d-md-table-cell",
              "render": function (item)
                { mode = ModeTableau.find ( (element) => element.valeur == item.mode );
                  return( Badge ( mode.color, mode.tooltip, mode.texte ) );
                }
            },
            { "data": null, "title":"Période", "className": "text-center d-none d-md-table-cell",
              "render": function (item)
                { return ( PeriodeTableau.find ( (element) => element.valeur == item.periode ).texte );
                }
            },
            { "data": null, "title":"Period Lock", "className": "text-center d-none d-xl-table-cell",
              "render": function (item)
                { if (item.period_lock) return( Badge ( "primary", "Période verrouillée", "Oui" ) );
                                   else return( Badge ( "secondary", "Période déverrouillée", "Non" ) );
                }
            },
            { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
              "render": function (item)
                { boutons = Bouton_actions_start ();
                  /*boutons += Bouton_actions_add ( "secondary", "Voir le tableau", "Redirect", "/"+item.page, "chart-line", null );*/
                  boutons += Bouton_actions_add ( "outline-primary", "Configurer", "TABLEAU_Edit", item.tableau_id, "pen", null );
                  boutons += Bouton_actions_add ( "outline-secondary", "Editer les courbes", "Redirect", "/tableau/"+item.tableau_id, "pen", null );
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
