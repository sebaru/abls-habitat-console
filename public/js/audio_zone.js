/************************************ Demande de refresh **********************************************************************/
 function AUDIOZONE_Refresh ( )
  { $('#idTableAUDIOZONE').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function AUDIOZONE_Map ( )
  { $('#idAUDIOZONETitre').text("Ajouter un thread à la zone de diffusion");
    $('#idTargetThread').empty();
    Send_to_API ( "GET", "/agent/list", null, function(Response)                /* L'API ne filtre pas encore sur la classe */
     { $.each ( Response.agents, function ( i, item )
        { if (item.agent_classe !== "audio") return;
          $('#idTargetThread').append ( "<option value='"+item.agent_tech_id+"'>"
                                        + item.agent_tech_id + " - " + item.description + " on " + item.server_hostname
                                        + "</option>" );
        } );
     }, null );
    $('#idAUDIOZONEValider').off("click").on( "click", function ()
     { vars = window.location.pathname.split('/');
       var json_request = { audio_zone_name: decodeURIComponent(vars[3]).toUpperCase(), agent_tech_id : $('#idTargetThread').val() };
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
     { Show_toast_ok ( "Mapping de "+selection.agent_tech_id+" supprimé.");
       AUDIOZONE_Refresh();
     }, function(Response) { AUDIOZONE_Refresh(); } );
  }
/**************************************** Supprime une connexion meteo ********************************************************/
 function AUDIOZONE_Unmap ( audio_zone_map_id )
  { vars = window.location.pathname.split('/');
    selection = $('#idTableAUDIOZONE').DataTable().row("#"+audio_zone_map_id).data();
    Show_modal_del ( "Supprimer un thread d'une zone",
                     "Etes-vous sûr de vouloir supprimer ce thread de la zone de diffusion "+decodeURIComponent(vars[3])+" ?",
                     selection.agent_tech_id + " - " + selection.agent_description,
                     function () { AUDIOZONE_Unmap_Valider( selection ) } ) ;
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    if (vars[3] == null) Redirect ("/audio/zones");
    var zoneName = decodeURIComponent(vars[3]);
    $("#idAudioZoneTitle").text( zoneName );
    Set_page_context ( "Édition de la zone audio " + zoneName );
    $('#idTableAUDIOZONE').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/audio/zone/get", type : "GET", dataSrc: "audio_zone_map", contentType: "application/json",
               data: function() { return ( "audio_zone_name="+encodeURIComponent(zoneName) ); },
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "audio_zone_map_id",
       columns:
         [ { "data": null, "title":"Agent", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.server_hostname) ); }
           },
           { "data": null, "title":"Thread", "className": "align-middle text-center d-none d-md-table-cell",
             "render": function (item)
               { return( Lien ( "/agents/audio/"+encodeURIComponent(item.agent_tech_id), "Configurer la diffusion audio", item.agent_tech_id ) ); }
           },
           { "data": null, "title":"Description", "className": "align-middle text-center d-none d-lg-table-cell",
             "render": function (item)
               { return( htmlEncode(item.agent_description) ); }
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons  = Bouton_deroulant_start();
                 boutons += Bouton_deroulant_add ( "danger", "Supprimer le thread de la zone "+item.audio_zone_name, "AUDIOZONE_Unmap", item.audio_zone_map_id, "trash" );
                 boutons += Bouton_deroulant_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
     });

  }
/*----------------------------------------------------------------------------------------------------------------------------*/
