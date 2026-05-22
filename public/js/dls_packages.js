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
         dls_package_id: dls_package_id,
       };

    Send_to_API ( "POST", "/dls/package/set", json_request, function(Response)
     { Show_toast_ok("D.L.S Package "+json_request.name+" mis à jour");
       DLS_Pkg_Refresh();
     });
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function DLS_Pkg_Add ( )
  { var json_request =
       { name        : $('#idModalDlsPkgEditName').val(),
         description : $('#idModalDlsPkgEditDescription').val(),
       };

    Send_to_API ( "POST", "/dls/package/add", json_request, function(Response)
     { Show_toast_ok("D.L.S Package "+json_request.name+" ajouté");
       DLS_Pkg_Refresh();
     });
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function Show_Modal_DLS_Pkg_Add ( )
  { $('#idModalDlsPkgEditTitre').text("Ajouter un Package D.L.S");
    $('#idModalDlsPkgEditName').val("");
    $('#idModalDlsPkgEditDescription').val("");
    $('#idModalDlsPkgEditValider').off("click").on("click", function () { DLS_Pkg_Add(); } );
    $('#idModalDlsPkgEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function Show_Modal_DLS_Pkg_Edit ( dls_package_id )
  { selection = $('#idTableDLSPkg').DataTable().row("#"+dls_package_id).data();
    $('#idModalDlsPkgEditTitre').text("Modifier le Package " + selection.name );
    $('#idModalDlsPkgEditName').val(selection.name);
    $('#idModalDlsPkgEditDescription').val(selection.description);
    $('#idModalDlsPkgEditValider').off("click").on("click", function () { DLS_Pkg_Set(selection.dls_package_id); } );
    $('#idModalDlsPkgEdit').modal("show");
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableDLSPkg').DataTable(
       { pageLength : 50,
         fixedHeader: true,
         rowId: "dls_package_id",
         ajax: { url : "/api/dls/package/list", type : "GET", dataSrc: "dls_packages", contentType: "application/json",
                 error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); },
                 beforeSend: function (request)
                              { request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                              },
               },
         columns:
          [ { "data": "dls_package_id", "title":"#ID", "className": "align-middle  text-center d-none d-xl-table-cell" },
            { "data": null, "title":"Nom", "className": "align-middle",
              "render": function (item)
                { return( Lien ( "/dls/package/"+item.name, "Voir la source", item.name ) );
                }
            },
            { "data": null, "title":"Description", "className": "align-middle d-none d-lg-table-cell ",
              "render": function (item)
                { return( Lien ( "/dls/package/"+item.name, "Voir la source", item.description ) );
                }
            },
            { "data": null, "title":"Actions", "orderable": false, "className": "align-middle  text-center",
              "render": function (item)
                { boutons = Bouton_deroulant_start();
                  boutons += Bouton_deroulant_add ( "primary", "Voir le code", "Redirect", "/dls/package/"+item.name, "code" );
                  boutons += Bouton_deroulant_add ( "primary", "Editer", "Show_Modal_DLS_Pkg_Edit", item.dls_package_id, "pen" );
                  boutons += Bouton_deroulant_add_spacer ();
                  boutons += Bouton_deroulant_add ( "danger", "Supprimer le package", "Show_Modal_DLS_Pkg_Del", item.dls_package_id, "trash" );
                  boutons += Bouton_deroulant_end ();
                  return(boutons);
                }
            }
          ],
         /*order: [ [0, "desc"] ],*/
       }
     );

  }
/*----------------------------------------------------------------------------------------------------------------------------*/
