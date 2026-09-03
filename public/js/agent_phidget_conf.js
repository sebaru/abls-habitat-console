var Capteurs =
  [ { valeur: "DIGITAL-INPUT",        texte: "DI - DIGITAL-INPUT" },
    { valeur: "ADP1000-PH",           texte: "AI - ADP1000-PH" },
    { valeur: "ADP1000-ORP",          texte: "AI - ADP1000-ORP" },
    { valeur: "TMP1200_0-PT100-3850", texte: "AI - TMP1200_0-PT100-3850" },
    { valeur: "TMP1200_0-PT100-3920", texte: "AI - TMP1200_0-PT100-3920" },
    { valeur: "AC-CURRENT-10A",       texte: "AI - AC-CURRENT-10A" },
    { valeur: "AC-CURRENT-25A",       texte: "AI - AC-CURRENT-25A" },
    { valeur: "AC-CURRENT-50A",       texte: "AI - AC-CURRENT-50A" },
    { valeur: "AC-CURRENT-100A",      texte: "AI - AC-CURRENT-100A" },
    { valeur: "1130-PH",              texte: "AI - 1130-PH" },
    { valeur: "1130-ORP",             texte: "AI - 1130-ORP" },
    { valeur: "TEMP_1124_0",          texte: "AI - TEMP_1124_0" },
    { valeur: "REL2001_0",            texte: "DO - REL2001_0" },
  ];

var PHIDGET_AGENT_TECH_ID = null;

/************************************ Demande de refresh **********************************************************************/
 function PHIDGET_Refresh ( )
  { $('#idTablePHIDGET_IO').DataTable().ajax.reload(null, false);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function PHIDGET_Edit_IO (phidget_io_id)
  { selection = $('#idTablePHIDGET_IO').DataTable().row("#"+phidget_io_id).data();
    $('#idPHIDGETEditIOTitre').text( "Configurer "+selection.agent_tech_id+", port "+selection.port );
    $('#idPHIDGETEditIOLibelle').val ( selection.libelle );
    $('#idPHIDGETEditIOUnite').val ( selection.unite );
    $('#idPHIDGETEditIOCapteur')
     .replaceWith ( Select ( "idPHIDGETEditIOCapteur", null, Capteurs, selection.capteur ) );
    $('#idPHIDGETEditIOArchivage').replaceWith ( Select ( "idPHIDGETEditIOArchivage", null, ModeArchivage, selection.archivage ) );
    $('#idPHIDGETEditIOIntervalle').val ( selection.intervalle );
    $('#idPHIDGETEditIOValider').off("click").on( "click", function ()
     { $('#idPHIDGETEditIO').modal("hide");
       var json_request =
        { phidget_io_id: parseInt(phidget_io_id),
          intervalle: parseInt($('#idPHIDGETEditIOIntervalle').val()),
          archivage: parseInt($('#idPHIDGETEditIOArchivage').val()),
          capteur: $('#idPHIDGETEditIOCapteur').val(),
          libelle: $('#idPHIDGETEditIOLibelle').val(),
          unite: $('#idPHIDGETEditIOUnite').val(),
        };

       Send_to_API ( "POST", "/phidget/set/io", json_request,
                     (Response) => { Show_toast_ok ("Modifications sauvegardées.");
                                     PHIDGET_Refresh();
                                   }, null );
     });
    $('#idPHIDGETEditIO').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function PHIDGET_Map (phidget_io_id)
  { selection = $('#idTablePHIDGET_IO').DataTable().row("#"+phidget_io_id).data();
    $('#idMODALMapTitre').text( "Mapper "+selection.agent_tech_id+":"+selection.agent_acronyme );
    $('#idMODALMapRechercherTechID').off("input").on("input", function () { Common_Updater_Choix_TechID ( "idMODALMap", selection.classe ); } );
    Common_Updater_Choix_TechID ( "idMODALMap", selection.classe, selection.tech_id, selection.acronyme );
    $('#idMODALMapValider').off("click").on( "click", function ()
     { $('#idMODALMap').modal("hide");
       COMMON_Map ( selection.agent_tech_id, selection.agent_acronyme,
                    $('#idMODALMapSelectTechID').val(),  $('#idMODALMapSelectAcronyme').val()
                  );
       PHIDGET_Refresh();
     });
    $('#idMODALMap').modal("show");
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    if (vars[3] == null) Redirect ("/agents/phidget");

    PHIDGET_AGENT_TECH_ID = decodeURIComponent(vars[3]).toUpperCase();
    Set_page_context ( "Configuration I/O Phidget " + PHIDGET_AGENT_TECH_ID );

    $('#idTablePHIDGET_IO').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/phidget/get", type : "GET", dataSrc: "IO", contentType: "application/json",
               data: function() { return ( "agent_tech_id=" + encodeURIComponent(PHIDGET_AGENT_TECH_ID) ) },
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       rowId: "phidget_io_id",
       columns:
          [ { "data": null, "title":"Phidget TechID", "className": "align-middle text-center",
              "render": function (item)
                { return( Lien ( "/dls/"+item.agent_tech_id, "Voir la source", item.agent_tech_id ) ); }
            },
            { "data": null, "title":"Phidget I/O", "className": "align-middle text-center",
              "render": function (item)
                { return( item.agent_acronyme ); }
            },
            { "data": null, "title":"Mapped on", "className": "align-middle text-center d-none d-md-table-cell",
              "render": function (item)
                { if(item.tech_id)
                   { return ( Lien ( "/dls/"+item.tech_id, "Voir la source", item.tech_id ) +":" + item.acronyme );
                   } else return( "--" );
                }
            },
            { "data": "port", "title":"Port", "className": "align-middle text-center d-none d-xl-table-cell" },
            { "data": null, "title":"Capteur/Classe", "className": "align-middle text-center d-none d-lg-table-cell",
              "render": function (item)
                { return( item.classe + " - " + item.capteur ); }
            },
            { "data": "intervalle", "title":"Interval", "className": "align-middle text-center d-none d-xl-table-cell" },
            { "data": null, "title":"Description", "className": "align-middle text-center d-none d-lg-table-cell",
              "render": function (item)
                { return ( htmlEncode(item.libelle) ); }
            },
            { "data": null, "title":"Unité", "className": "align-middle text-center d-none d-xl-table-cell",
              "render": function (item)
                { return ( htmlEncode(item.unite || "") ); }
            },
            { "data": null, "title":"Actions", "orderable": false, "className": "align-middle text-center",
              "render": function (item)
                { boutons = Bouton_deroulant_start ( );
                  boutons += Bouton_deroulant_add ( "primary", "Editer cet objet", "PHIDGET_Edit_IO", item.phidget_io_id, "pen" );
                  boutons += Bouton_deroulant_add ( "primary", "Mapper cet objet", "PHIDGET_Map", item.phidget_io_id, "directions" );
                  if (item.mapping_id)
                   { boutons += Bouton_deroulant_add_spacer ();
                     boutons += Bouton_deroulant_add ( "danger", "Supprimer le mapping", "MAPPING_Unmap", item.mapping_id, "trash", "'PHIDGET_Refresh'" );
                   }
                  boutons += Bouton_deroulant_end ();
                  return(boutons);
                },
            },
          ],
         /*order: [ [0, "desc"] ],*/
     });
  }