var METEO_AGENT_TECH_ID = null;

/************************************ Demande de refresh **********************************************************************/
 function METEOCONF_Refresh ( )
  { $('#idTableMETEO_IO').DataTable().ajax.reload(null, false);
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    if (vars[3] == null) { Redirect ("/agents/meteo"); return; }

    METEO_AGENT_TECH_ID = decodeURIComponent(vars[3]).toUpperCase();
    $('#idMETEOCONFTitle').text( METEO_AGENT_TECH_ID );
    Set_page_context ( "Mnémoniques de l'agent météo " + METEO_AGENT_TECH_ID );

    $('#idTableMETEO_IO').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/meteo/get", type : "GET", dataSrc: "IO", contentType: "application/json",
               data: function() { return ( "agent_tech_id=" + encodeURIComponent(METEO_AGENT_TECH_ID) ) },
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "mnemo_ai_id",
       columns:
         [ { "data": null, "title":"Acronyme", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.acronyme) ); }
           },
           { "data": null, "title":"Description", "className": "align-middle text-center d-none d-md-table-cell",
             "render": function (item)
               { return( htmlEncode(item.libelle || "") ); }
           },
           { "data": null, "title":"Valeur", "className": "align-middle text-center",
             "render": function (item)
               { return( item.valeur + " " + htmlEncode(item.unite || "") ); }
           },
           { "data": null, "title":"Archivage", "className": "align-middle text-center d-none d-xl-table-cell",
             "render": function (item)
               { return( item.archivage + " s" ); }
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons  = Bouton_deroulant_start();
                 boutons += Bouton_deroulant_add ( "primary", "Voir la source DLS", "Redirect", "/dls/"+encodeURIComponent(item.tech_id), "code" );
                 boutons += Bouton_deroulant_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
     });
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
