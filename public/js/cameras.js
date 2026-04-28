/************************************ Demande de refresh **********************************************************************/
 function CAMERA_Refresh ( )
  { $('#idTableCAMERAS').DataTable().ajax.reload(null, false);
  }
/************************************ Envoi les infos de modifications caméra *************************************************/
 function CAMERA_Set ( selection )
  { var json_request =
     { name         : $('#idCAMERANom').val(),
       url          : $('#idCAMERAUrl').val(),
       access_level : parseInt($('#idCAMERAAccessLevel').val()),
       enable       : $('#idCAMERAEnable').is(':checked'),
     };

    if (selection) json_request.camera_id = selection.camera_id;                                       /* Ajout ou édition ? */

    Send_to_API ( "POST", selection ? "/camera/set" : "/camera/add", json_request, function(Response)
     { Show_toast_ok ( "Modification sauvegardée.");
       CAMERA_Refresh();
     }, function(Response) { CAMERA_Refresh(); } );
  }
/********************************************* Affichage du modal d'édition caméra ********************************************/
 function CAMERA_Edit ( camera_id )
  { selection = $('#idTableCAMERAS').DataTable().row("#"+camera_id).data();
    $('#idCAMERATitre').text("Editer la caméra " + selection.name);
    $('#idCAMERANom').val( selection.name );
    $('#idCAMERAUrl').val( selection.url );
    $('#idCAMERAAccessLevel').replaceWith( Select_Access_level( "idCAMERAAccessLevel", null, selection.access_level ) );
    $('#idCAMERAAccessLevel').addClass('flex-grow-1');
    $('#idCAMERAEnable').prop('checked', selection.enable);
    $('#idCAMERAValider').off("click").on( "click", function () { CAMERA_Set(selection); } );
    $('#idCAMERAEdit').modal("show");
  }
/********************************************* Affichage du modal d'ajout caméra **********************************************/
 function CAMERA_Add ( )
  { $('#idCAMERATitre').text("Ajouter une caméra");
    $('#idCAMERANom').val( "" );
    $('#idCAMERAUrl').val( "" );
    $('#idCAMERAAccessLevel').replaceWith( Select_Access_level( "idCAMERAAccessLevel", null, 0 ) );
    $('#idCAMERAAccessLevel').addClass('flex-grow-1');
    $('#idCAMERAEnable').prop('checked', true);
    $('#idCAMERAValider').off("click").on( "click", function () { CAMERA_Set(null); } );
    $('#idCAMERAEdit').modal("show");
  }
/**************************************** Valide la suppression d'une caméra **************************************************/
 function CAMERA_Del_Valider ( selection )
  { var json_request = { camera_id : selection.camera_id };
    Send_to_API ( 'DELETE', "/camera/delete", json_request, function(Response)
     { Show_toast_ok ( "Caméra supprimée.");
       CAMERA_Refresh();
     }, function(Response) { CAMERA_Refresh(); } );
  }
/**************************************** Demande de suppression d'une caméra *************************************************/
 function CAMERA_Del ( camera_id )
  { selection = $('#idTableCAMERAS').DataTable().row("#"+camera_id).data();
    Show_modal_del ( "Supprimer la caméra " + selection.name,
                     "Etes-vous sûr de vouloir supprimer cette caméra ?",
                     selection.name + " - " + selection.url,
                     function () { CAMERA_Del_Valider( selection ) } ) ;
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableCAMERAS').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/camera/list", type : "GET", dataSrc: "cameras", contentType: "application/json",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                              { request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "camera_id",
       columns:
         [ { "data": null, "title":"Activée", "className": "align-middle text-center",
             "render": function (item)
               { if (item.enable) return('<i class="fas fa-check text-success"></i>');
                 return('<i class="fas fa-times text-danger"></i>');
               }
           },
           { "data": null, "title":"Accès", "className": "align-middle text-center d-none d-md-table-cell",
             "render": function (item)
               { return( Badge_Access_level(item.access_level) ); }
           },
           { "data": null, "title":"Nom", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.name) ); }
           },
           { "data": null, "title":"URL", "className": "align-middle text-center d-none d-md-table-cell",
             "render": function (item)
               { return( htmlEncode(item.url) ); }
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "primary", "Editer la caméra", "CAMERA_Edit", item.camera_id, "pen", null );
                 boutons += Bouton_actions_add ( "danger", "Supprimer la caméra", "CAMERA_Del", item.camera_id, "trash", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
     });
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
