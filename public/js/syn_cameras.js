/************************************ Demande de refresh **********************************************************************/
 function SYN_CAMERA_Refresh ( )
  { $('#idTableSYNCameras').DataTable().ajax.reload(null, false);
  }
/************************************ Ajoute une camera à un synoptique *******************************************************/
 function SYN_CAMERA_New ( )
  { $('#idSYNCameraEditTitre').text ( "Associer une caméra à un synoptique" );
    Select_from_api ( "idSYNCameraEditPage", "/syn/list", null, "synoptiques", "syn_id", function (item)
     { return ( item.page+" - "+htmlEncode(item.libelle) ); }, Get_url_parameter("syn_id") );
    Select_from_api ( "idSYNCameraEditCamera", "/camera/list", null, "cameras", "camera_id", function (item)
     { return ( htmlEncode(item.name) ); }, null );
    $('#idSYNCameraEditValider').off("click").on( "click", function () { SYN_CAMERA_Add(); } );
    $('#idSYNCameraEdit').modal("show");
  }
/************************************ Envoie l'ajout d'une camera sur un synoptique *******************************************/
 function SYN_CAMERA_Add ( )
  { var json_request =
       { syn_id:    parseInt($('#idSYNCameraEditPage').val()),
         camera_id: parseInt($('#idSYNCameraEditCamera').val()),
       };

    Send_to_API ( "POST", "/syn/camera/add", json_request, function (Response)
     { SYN_CAMERA_Refresh();
     }, null );
  }
/************************************ Valide la suppression d'une association camera/syn *************************************/
 function SYN_CAMERA_Valide_delete ( syn_camera_id )
  { var json_request = { syn_camera_id: syn_camera_id };

    Send_to_API ( "DELETE", "/syn/camera/delete", json_request, function (Response)
     { SYN_CAMERA_Refresh();
     }, null );
  }
/********************************************* Affichage du modal de suppression **********************************************/
 function SYN_CAMERA_Delete ( syn_camera_id )
  { selection = $('#idTableSYNCameras').DataTable().row("#"+syn_camera_id).data();
    Show_modal_del ( "Retirer la caméra du synoptique ?",
                     "Etes-vous sûr de vouloir retirer la caméra suivante du synoptique ?",
                     selection.page+" - "+selection.camera_name,
                     function () { SYN_CAMERA_Valide_delete(selection.syn_camera_id); } );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { syn_id = Get_url_parameter("syn_id");
    if (syn_id != null)
     { parametres = { "syn_id": syn_id }; }
    else parametres = {};
    $('#idTableSYNCameras').DataTable(
       { pageLength : 25,
         fixedHeader: true,
         ajax: { url : $ABLS_API+"/syn/camera/list", type : "GET", dataSrc: "cameras", contentType: "application/json",
                 data: function() { if (syn_id != null) return ( "syn_id="+syn_id ); else return (""); },
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request)
                              { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                                request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                              }
               },
         rowId: "syn_camera_id",
         columns:
          [ { "data": "page", "title":"Synoptique", "className": "text-center" },
            { "data": "camera_name", "title":"Caméra", "className": "" },
            { "data": "url", "title":"URL", "className": "d-none d-md-table-cell" },
            { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
              "render": function (item)
                { boutons = Bouton_actions_start ();
                  boutons += Bouton_actions_add ( "danger", "Retirer cette caméra", "SYN_CAMERA_Delete", item.syn_camera_id, "trash", null );
                  boutons += Bouton_actions_end ();
                  return(boutons);
                },
            }
          ],
       }
     );
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
