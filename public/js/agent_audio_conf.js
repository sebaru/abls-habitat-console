var AUDIO_AGENT_TECH_ID = null;

/************************************ Demande de refresh **********************************************************************/
 function AUDIOCONF_Refresh ( )
  { $('#idTableAUDIOZones').DataTable().ajax.reload(null, false);
  }
/************************************ Ajout du thread dans une zone de diffusion **********************************************/
 function AUDIOCONF_Map ( )
  { $('#idAUDIOCONFMapTitre').text( "Ajouter " + AUDIO_AGENT_TECH_ID + " à une zone de diffusion" );
    $('#idTargetZone').empty().append($('<option>', { text: "Chargement..." }));
    $('#idAUDIOCONFMapValider').prop('disabled', true);
   Send_to_API ( "GET", "/audio/zone/get", "agent_tech_id="+encodeURIComponent(AUDIO_AGENT_TECH_ID), function (Mappings)
    { var mapped_zones = {};
     $.each ( Mappings.audio_zone_map || [], function ( i, item ) { mapped_zones[item.audio_zone_name] = true; } );
     Send_to_API ( "GET", "/audio/zones/list", null, function (Response)
      { $('#idTargetZone').empty();
       $.each ( Response.audio_zones || [], function ( i, item )
        { if (item.audio_zone_id!=1 && !mapped_zones[item.audio_zone_name])
          { $('#idTargetZone').append($('<option>',
            { value: item.audio_zone_name, text: item.audio_zone_name + " - " + item.description }));
          }
        });
       if ($('#idTargetZone option').length==0)
        { $('#idTargetZone').append($('<option>', { text: "Aucune zone disponible" })); }
       else
        { $('#idAUDIOCONFMapValider').prop('disabled', false); }
      }, function (Response) { Show_shell_error ( "Erreur lors du chargement des zones de diffusion." ); } );
    }, function (Response) { Show_shell_error ( "Erreur lors du chargement des associations audio." ); } );
    $('#idAUDIOCONFMapValider').off("click").on( "click", function ()
     { $('#idAUDIOCONFMap').modal("hide");
       var json_request = { audio_zone_name: $('#idTargetZone').val(), agent_tech_id: AUDIO_AGENT_TECH_ID };
       Send_to_API ( "POST", "/audio/zone/map", json_request,
                     function(Response) { Show_toast_ok ( "Zone ajoutée." );
                                          AUDIOCONF_Refresh();
                                        },
                     function(Response) { AUDIOCONF_Refresh(); }
                   );
     });
    $('#idAUDIOCONFMap').modal("show");
  }
/************************************ Retire le thread d'une zone de diffusion ************************************************/
 function AUDIOCONF_Unmap ( audio_zone_map_id )
  { selection = $('#idTableAUDIOZones').DataTable().row("#"+audio_zone_map_id).data();
    Show_modal_del ( "Retirer le thread d'une zone",
                     "Etes-vous sûr de vouloir retirer "+AUDIO_AGENT_TECH_ID+" de cette zone de diffusion ?",
                     selection.audio_zone_name + " - " + selection.audio_zone_description,
                     function ()
                      { Send_to_API ( 'DELETE', "/audio/zone/unmap", { audio_zone_map_id: selection.audio_zone_map_id },
                                      function(Response) { Show_toast_ok ( "Zone "+selection.audio_zone_name+" retirée." );
                                                           AUDIOCONF_Refresh();
                                                         },
                                      function(Response) { AUDIOCONF_Refresh(); }
                                    );
                      } );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    if (vars[3] == null) { Redirect ("/agents/audio"); return; }

    AUDIO_AGENT_TECH_ID = decodeURIComponent(vars[3]).toUpperCase();
    $('#idAUDIOCONFTitle').text( AUDIO_AGENT_TECH_ID );
    Set_page_context ( "Zones de diffusion de l'agent Audio " + AUDIO_AGENT_TECH_ID );

    $('#idTableAUDIOZones').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/audio/zone/get", type : "GET", dataSrc: "audio_zone_map", contentType: "application/json",
               data: function() { return ( "agent_tech_id=" + encodeURIComponent(AUDIO_AGENT_TECH_ID) ) },
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "audio_zone_map_id",
       columns:
         [ { "data": null, "title":"Zone de diffusion", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/audio/zone/"+encodeURIComponent(item.audio_zone_name),
                                "Voir la zone "+item.audio_zone_name, item.audio_zone_name ) ); }
           },
           { "data": null, "title":"Description", "className": "align-middle text-center d-none d-md-table-cell",
             "render": function (item)
               { return( htmlEncode(item.audio_zone_description || "") ); }
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons  = Bouton_deroulant_start();
                 boutons += Bouton_deroulant_add ( "danger", "Retirer de la zone "+item.audio_zone_name,
                                                   "AUDIOCONF_Unmap", item.audio_zone_map_id, "trash" );
                 boutons += Bouton_deroulant_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
     });
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
