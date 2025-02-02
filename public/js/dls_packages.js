/************************************ Demande de refresh **********************************************************************/
 function DLS_Pkg_Refresh ( )
  { $('#idTableDLSPkg').DataTable().ajax.reload(null, false); }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Valider_DLS_Pkg_Del ( selection )
  { var json_request = { dls_package_id : selection.dls_package_id };
    Send_to_API ( 'DELETE', "/dls/package/delete", json_request, function () { Show_toast_ok("D.L.S  package "+selection.tech_id+" supprimé"); DLS_Pkg_Refresh(); });
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function Show_Modal_DLS_Pkg_Del ( dls_package_id )
  { selection = $('#idTableDLSPkg').DataTable().row("#"+dls_package_id).data();

    Show_modal_del ( "Détruire le module ?",
                     "Etes-vous sur de vouloir supprimer ce package ?",
                     selection.name + " - " + selection.description,
                     function () { Valider_DLS_Pkg_Del(selection); } );
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function DLS_Pkg_Set ( dls_package_id )
  { var json_request =
       { name        : $('#idModalDlsPkgEditName').val(),
         description : $('#idModalDlsPkgEditDescription').val(),
       };
    if (dls_package_id>0) json_request.dls_package_id = dls_package_id;                                 /* Ajout ou édition ? */

    Send_to_API ( "POST", "/dls/package/set", json_request, function(Response)
     {      if (dls_package_id>0) Show_toast_ok("D.L.S Package "+json_request.name+" mis à jour");
       else if (dls_package_id>0) Show_toast_ok("D.L.S Package "+json_request.name+" ajouté");
       DLS_Pkg_Refresh();
     });
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function Show_Modal_DLS_Pkg_Add ( )
  { $('#idModalDlsPkgEditTitre').text("Ajouter un Package D.L.S");
    $('#idModalDlsPkgEditName').val("");
    $('#idModalDlsPkgEditDescription').val("");
    $('#idModalDlsPkgEditValider').off("click").on("click", function () { DLS_Pkg_Set(0); } );
    $('#idModalDlsPkgEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function Show_Modal_DLS_Pkg_Edit ( dls_package_id )
  { selection = $('#idTableDLSPkg').DataTable().row("#"+dls_package_id).data();
    $('#idModalDlsPkgEditTitre').text("Modifier le Package " + selection.name );
    $('#idModalDlsPkgEditName').val(selection.name);
    $('#idModalDlsPkgEditDescription').val(selection.name);
    $('#idModalDlsPkgEditValider').off("click").on("click", function () { DLS_Pkg_Set(selection.dls_package_id); } );
    $('#idModalDlsPkgEdit').modal("show");
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableDLSPkg').DataTable(
       { pageLength : 50,
         fixedHeader: true,
         rowId: "dls_package_id",
         ajax: { url : $ABLS_API+"/dls/package/list", type : "GET", dataSrc: "dls", contentType: "application/json",
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request)
                              { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                                request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                              },
               },
         columns:
          [ { "data": "dls_package_id", "title":"#ID", "className": "align-middle  text-center" },
            { "data": null, "title":"Nom", "className": "align-middle",
              "render": function (item)
                { return( Lien ( "/dls/package/"+item.name, "Voir la source", item.name ) );
                }
            },
            { "data": null, "title":"Description", "className": "align-middle ",
              "render": function (item)
                { return( Lien ( "/dls/package/"+item.name, "Voir la source", item.description ) );
                }
            },
            { "data": null, "title":"Actions", "orderable": false, "className": "align-middle",
              "render": function (item)
                { boutons = Bouton_actions_start ();
                  boutons += Bouton_actions_add ( "outline-secondary", "Voir le code", "Redirect", "/dls/package/"+item.name, "code", null ); }
                  boutons += Bouton_actions_add ( "outline-primary", "Editer", "Show_Modal_DLS_Pkg_Edit", item.dls_package_id, "pen", null );
                  boutons += Bouton_actions_add ( "danger", "Supprimer le package", "Show_Modal_DLS_Pkg_Del", item.dls_package_id, "trash", null );
                  boutons += Bouton_actions_end ();
                  return(boutons);
                }
            }
          ],
         /*order: [ [0, "desc"] ],*/
         /*responsive: true,*/
       }
     );

  }
/*----------------------------------------------------------------------------------------------------------------------------*/
