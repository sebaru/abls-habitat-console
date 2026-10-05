/* agent_ups_mnemos.js
 * Onglet Mnémoniques (lecture seule) d'un agent onduleur.
 */

 var UPS_AGENT_TECH_ID = null;
 var UPS_CLASSES = [ 'DI', 'DO', 'AI', 'AO' ];

/************************************ Demande de refresh **********************************************************************/
 function UPSCONF_Refresh ( )
  { UPS_CLASSES.forEach ( function ( classe ) { $('#idTableUPS_'+classe).DataTable().ajax.reload(null, false); } );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { var agent = AGENT_from_path();
    if (!agent) { Redirect ("/agents?classe=ups"); return; }
    UPS_AGENT_TECH_ID = agent.agent_tech_id;
    AGENT_Header ( "ups", UPS_AGENT_TECH_ID, "mnemos" );

    UPS_CLASSES.forEach ( UPSCONF_Load_IO );
  }

 function UPSCONF_Load_IO ( classe )
  { $('#idTableUPS_'+classe).DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/ups/get", type : "GET", dataSrc: classe, contentType: "application/json",
               data: function() { return ( "agent_tech_id=" + encodeURIComponent(UPS_AGENT_TECH_ID) ) },
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       columns:
         [ { "data": null, "title":"Acronyme", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.acronyme) ); }
           },
           { "data": null, "title":"Description", "className": "align-middle text-center d-none d-md-table-cell",
             "render": function (item)
               { return( htmlEncode(item.agent_description || "") ); }
           },
           { "data": null, "title":"Valeur", "className": "align-middle text-center",
             "render": function (item)
               { if (classe == "DI" || classe == "DO")
                  { if (item.valeur) return( Badge("success", "Etat actif", "Actif") );
                    return( Badge("secondary", "Etat inactif", "Inactif") );
                  }
                 return( item.valeur + " " + htmlEncode(item.unite || "") );
               }
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
