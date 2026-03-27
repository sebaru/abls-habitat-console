/************************************ Demande de refresh **********************************************************************/
 function AUDIOZONE_Refresh ( )
  { $('#idTableAUDIOZONE').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function AUDIOZONE_Map ( )
  { $('#idAUDIOZONETitre').text("Ajouter un thread à la zone de diffusion");
    Select_from_api ( "idTargetThread", "/thread/list?classe=audio", null, "threads", "thread_tech_id", function (Response)
                        { return ( Response.thread_tech_id + " - " + Response.description + " on " + Response.agent_hostname ); }, null );
    $('#idAUDIOZONEValider').off("click").on( "click", function ()
     { vars = window.location.pathname.split('/');
       var json_request = { audio_zone_name: vars[3].toUpperCase(), thread_tech_id : $('#idTargetThread').val() };
       Send_to_API ( "POST", "/audio/zone/map", json_request, function(Response)
        { Show_toast_ok ( "Thread ajouté.");
          AUDIOZONE_Refresh();
        }, function(Response) { AUDIOZONE_Refresh(); } );
      } );
    $('#idAUDIOZONEEdit').modal("show");
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function AUDIOZONE_Unmap_Valider ( selection )
  { var json_request = { audio_zone_map_id : selection.audio_zone_map_id };
    Send_to_API ( 'DELETE', "/audio/zone/unmap", json_request, function(Response)
     { Show_toast_ok ( "Mapping de "+selection.thread_tech_id+" supprimé.");
       AUDIOZONE_Refresh();
     }, function(Response) { AUDIOZONE_Refresh(); } );
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function AUDIOZONE_Unmap ( audio_zone_map_id )
  { vars = window.location.pathname.split('/');
    selection = $('#idTableAUDIOZONE').DataTable().row("#"+audio_zone_map_id).data();
    Show_modal_del ( "Supprimer un thread d'une zone",
                     "Etes-vous sûr de vouloir supprimer ce thread de la zone de diffusion "+vars[3]+" ?",
                     selection.thread_tech_id + " - " + selection.thread_description,
                     function () { AUDIOZONE_Unmap_Valider( selection ) } ) ;
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    if (vars[3] == null) Redirect ("/audio/zones");
    $("#idAudioZoneTitle").text( vars[3] );
    $('#idTableAUDIOZONE').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/audio/zone/get", type : "GET", dataSrc: "audio_zone_map", contentType: "application/json",
               data: function() { return ( "audio_zone_name="+vars[3] ); },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "audio_zone_map_id",
       columns:
         [ { "data": null, "title":"Agent", "className": "align-middle text-center",
             "render": function (item)
               { return( item.agent_hostname ); }
           },
           { "data": null, "title":"Thread", "className": "align-middle text-center d-none d-md-table-cell",
             "render": function (item)
               { return( Lien ( "/dls/"+item.thread_tech_id, "Voir le D.L.S", item.thread_tech_id ) ); }
           },
           { "data": null, "title":"Description", "className": "align-middle text-center d-none d-lg-table-cell",
             "render": function (item)
               { return( item.thread_description ); }
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons  = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "danger", "Supprimer le thread de la zone "+item.audio_zone_name, "AUDIOZONE_Unmap", item.audio_zone_map_id, "trash", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
     });

  }
/*----------------------------------------------------------------------------------------------------------------------------*/
