var AUDIO_AGENT_TECH_ID = null;
var AUDIO_CONFIG = null;

/************************************ Demande de refresh **********************************************************************/
 function AUDIOCONF_Refresh ( )
  { AUDIOCONF_Load_config();
    $('#idTableAUDIOZones').DataTable().ajax.reload(null, false);
  }
/************************************ Charge la configuration du thread audio *************************************************/
 function AUDIOCONF_Load_config ( )
  { Send_to_API ( "GET", "/audio/get", "agent_tech_id="+encodeURIComponent(AUDIO_AGENT_TECH_ID), function (audio)
     { AUDIO_CONFIG = audio;
       $('#idAUDIOCONFServerHostname').text( audio.server_hostname || "-" );
       $('#idAUDIOCONFInfoDescription').text( audio.description || "-" );
       $('#idAUDIOCONFInfoLanguage').text( audio.language || "-" );
       $('#idAUDIOCONFInfoDevice').text( audio.device || "-" );
       $('#idAUDIOCONFInfoVolume').text( audio.volume + " %" );
     }, function (Response)
     { AUDIO_CONFIG = null;
       Show_shell_error ( "Aucune configuration audio pour '"+AUDIO_AGENT_TECH_ID+"'." );
     } );
  }
/************************************ Edition de la configuration du thread audio *********************************************/
 function AUDIOCONF_Edit ( )
  { if (!AUDIO_CONFIG) { Show_shell_error ( "Configuration audio non chargée." ); return; }
    $('#idAUDIOCONFEditTitre').text( "Editer la configuration audio " + AUDIO_AGENT_TECH_ID );
    $('#idAUDIOCONFDescription').val( AUDIO_CONFIG.description );
    $('#idAUDIOCONFLanguage').val( AUDIO_CONFIG.language );
    $('#idAUDIOCONFDevice').val( AUDIO_CONFIG.device );
    $('#idAUDIOCONFVolume').val( AUDIO_CONFIG.volume );
    $('#idAUDIOCONFValider').off("click").on( "click", function ()
     { $('#idAUDIOCONFEdit').modal("hide");
       var json_request =
        { server_uuid   : AUDIO_CONFIG.server_uuid,
          agent_tech_id : AUDIO_AGENT_TECH_ID,
          language      : $('#idAUDIOCONFLanguage').val(),
          device        : $('#idAUDIOCONFDevice').val(),
          volume        : parseInt($('#idAUDIOCONFVolume').val()),
          description   : $('#idAUDIOCONFDescription').val(),
        };
       if (json_request.language.length==0) json_request.language = "fr";
       if (json_request.device.length==0)   json_request.device   = "default";

       Send_to_API ( "POST", "/audio/set", json_request,
                     function(Response) { Show_toast_ok ( "Modifications sauvegardées." );
                                          AUDIOCONF_Refresh();
                                        },
                     function(Response) { Show_shell_error ( "Erreur à la sauvegarde de la configuration audio." ); }
                   );
     });
    $('#idAUDIOCONFEdit').modal("show");
  }
/************************************ Ajout du thread dans une zone de diffusion **********************************************/
 function AUDIOCONF_Map ( )
  { $('#idAUDIOCONFMapTitre').text( "Ajouter " + AUDIO_AGENT_TECH_ID + " à une zone de diffusion" );
    Select_from_api ( "idTargetZone", "/audio/zones/list", null, "audio_zones", "audio_zone_name", function (Response)
                        { return ( Response.audio_zone_name + " - " + Response.description ); }, null );
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
    if (vars[3] == null) { Redirect ("/io/audio"); return; }

    AUDIO_AGENT_TECH_ID = decodeURIComponent(vars[3]).toUpperCase();
    $('#idAUDIOCONFTitle').text( AUDIO_AGENT_TECH_ID );
    Set_page_context ( "Configuration Audio " + AUDIO_AGENT_TECH_ID );

    AUDIOCONF_Load_config();

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
