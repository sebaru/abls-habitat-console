/************************************ Demande de refresh **********************************************************************/
 function AUDIOZONE_Refresh ( )
  { $('#idTableAUDIOZONES').DataTable().ajax.reload(null, false);
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function AUDIOZONE_Set ( selection )
  { var json_request =
     { audio_zone_name : $('#idAUDIOZONENom').val().toUpperCase(),
       description     : $('#idAUDIOZONEDescription').val(),
     };

    if (selection) json_request.audio_zone_id = selection.audio_zone_id;                                /* Ajout ou édition ? */

    Send_to_API ( "POST", "/audio/zones/set", json_request, function(Response)
     { Show_toast_ok ( "Modification sauvegardée.");
       AUDIOZONE_Refresh();
     }, function(Response) { AUDIOZONE_Refresh(); } );
  }
/************************************ Demande l'envoi d'un test sur la zone audio *********************************************/
 function AUDIOZONE_Test ( audio_zone_id )
  { selection = $('#idTableAUDIOZONES').DataTable().row("#"+audio_zone_id).data();
    var json_request = { audio_zone_id : selection.audio_zone_id };
    Send_to_API ( 'POST', "/audio/zone/test", json_request, null );
  }
/********************************************* Affichage du modal d'edition synoptique ****************************************/
 function AUDIOZONE_Edit ( audio_zone_id )
  { selection = $('#idTableAUDIOZONES').DataTable().row("#"+audio_zone_id).data();
    $('#idAUDIOZONETitre').text("Editer la zone audio " + selection.audio_zone_name);
    $('#idAUDIOZONENom').val( selection.audio_zone_name );
    $('#idAUDIOZONEDescription').val( selection.description );
    $('#idAUDIOZONEValider').off("click").on( "click", function () { AUDIOZONE_Set(selection); } );
    $('#idAUDIOZONEEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function AUDIOZONE_Add ( )
  { $('#idAUDIOZONETitre').text("Ajouter une zone audio");
    $('#idAUDIOZONENom').val( "" );
    $('#idAUDIOZONEDescription').val( "" );
    $('#idAUDIOZONEValider').off("click").on( "click", function () { AUDIOZONE_Set(null); } );
    $('#idAUDIOZONEEdit').modal("show");
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function AUDIOZONE_Del_Valider ( selection )
  { if (selection.audio_zone_id==1)
     { Show_toast_ko ( "La suppression de la zone par défaut est interdite !" ); return; }

    var json_request = { audio_zone_name : selection.audio_zone_name };
    Send_to_API ( 'DELETE', "/audio/zones/delete", json_request, function(Response)
     { Show_toast_ok ( "Zone de diffusion supprimée.");
       AUDIOZONE_Refresh();
     }, function(Response) { AUDIOZONE_Refresh(); } );
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function AUDIOZONE_Del ( audio_zone_id )
  { selection = $('#idTableAUDIOZONES').DataTable().row("#"+audio_zone_id).data();
    Show_modal_del ( "Supprimer la zone de diffusion "+selection.audio_zone_name,
                     "Etes-vous sûr de vouloir supprimer cette zone de diffusion ?",
                     selection.audio_zone_name + " - " + selection.description,
                     function () { AUDIOZONE_Del_Valider( selection ) } ) ;
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableAUDIOZONES').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/audio/zones/list", type : "GET", dataSrc: "audio_zones", contentType: "application/json",
               /*data: function() { return ( "classe=audio" ); },*/
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "audio_zone_id",
       columns:
         [ { "data": null, "title":"Nom", "className": "align-middle text-center",
             "render": function (item)
               { if (item.audio_zone_id==1) return( item.audio_zone_name );
                 return( Lien ( "/audio/zone/"+item.audio_zone_name, "Voir la zone "+item.audio_zone_name, item.audio_zone_name ) );
               }
           },
           { "data": null, "title":"Description", "className": "align-middle text-center d-none d-lg-table-cell",
             "render": function (item)
               { return( htmlEncode(item.description) ); }
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 if (item.audio_zone_id!=1) boutons += Bouton_actions_add ( "primary", "Editer la zone de diffusion", "AUDIOZONE_Edit", item.audio_zone_id, "pen", null );
                 boutons += Bouton_actions_add ( "outline-primary", "Tester la diffusion", "AUDIOZONE_Test", item.audio_zone_id, "question", null );
                 if (item.audio_zone_id!=1) boutons += Bouton_actions_add ( "danger", "Supprimer la zone", "AUDIOZONE_Del", item.audio_zone_id, "trash", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });

  }
/*----------------------------------------------------------------------------------------------------------------------------*/
