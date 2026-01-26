/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Archive_Delete_Cold ( selection )
  { var json_request = { tablename : selection.tablename };
    Send_to_API ( 'DELETE', "/archive/delete", json_request, function ()
     { Show_toast_ok ( "Archives de "+selection.tablename+" en cours de suppression." );
     });
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function Show_Modal_Archive_Del_Cold ( rowId )
  { selection = $('#idTableArchiveCOLD').DataTable().row("#"+rowId).data();
    $('#idModalDelTitre').text ( "Détruire la table ?" );
    $('#idModalDelMessage').html("Etes-vous sur de vouloir supprimer ces archives ?"+
                                 "<hr>"+
                                 "<strong>"+selection.tablename + "<br>"+selection.nbr_archives+" enregistrements</strong>"
                                );
    $('#idModalDelValider').off("click").on("click", function () { Archive_Delete_Cold(selection); } );
    $('#idModalDel').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function Archive_Rebuild_Hot ( rowId )
  { selection = $('#idTableArchiveHOT').DataTable().row("#"+rowId).data();
    var json_request = { partname : selection.partname };
    Send_to_API ( 'POST', "/archive/rebuild", json_request, function ()
     { Show_toast_ok ( "Partition "+selection.partname+" en cours de rebuild." );
     });
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function ARCHIVE_Hot_to_Cold ( )
  { Send_to_API ( 'POST', "/archive/move_hot_to_cold", null, function ()
     { Show_toast_ok ( "Deplacement en cours." );
     });
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function ARCHIVE_Delete_old_Cold ( )
  { Send_to_API ( 'DELETE', "/archive/delete_old_cold", null, function ()
     { Show_toast_ok ( "Suppression en cours." );
     });
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Archive_sauver_parametre ( )
  { var json_request =
     { archive_hot_retention :  parseInt($("#idArchiveDBHotRetention").val()),
       archive_cold_retention : parseInt($("#idArchiveDBColdRetention").val()),
     };
    Send_to_API ( 'POST', "/archive/set", json_request, function(Response)
     { Show_toast_ok ( "Modifications sauvegardées." );
     }, null );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { Send_to_API ( "GET", "/archive/status/hot", null, function ( Response )
     { $('#idArchiveDBHotRetention').val(Response.archive_hot_retention);
       $('#idArchiveDBHotNumber').val(Response.nbr_hot_archives);
       $('#idArchiveDBHotSize').val(Response.size_hot_archives);
       $('#idTableArchiveHOT').DataTable(
          { pageLength : 50,
            fixedHeader: true,
            rowId: function(row) { return ( "rowId-"+row.partname ); },
            data:Response.partitions,
            columns:
             [ { "data": "partname", "title":"Partition", "className": "align-middle text-center" },
               { "data": "nbr_archives", "title":"Nbr archives", "className": "align-middle text-center" },
               { "data": "size", "title":"Taille (Mb)", "className": "align-middle text-center" },
               { "data": "fragmentation", "title":"Fragmentation", "className": "align-middle text-center" },
               { "data": null, "title":"Actions", "orderable": false, "className": "align-middle text-center",
                 "render": function (item)
                   { boutons = Bouton_actions_start ();
                     /*boutons += Bouton_actions_add ( "warning", "Refroidir", "ARCHIVE_Move_to_cold", "rowId-"+rowid, "freeze", null );*/
                     if (item.size>100 && item.fragmentation>=5) boutons += Bouton_actions_add ( "primary", "Rebuild", "Archive_Rebuild_Hot", "rowId-"+item.partname, "database", null );
                     boutons += Bouton_actions_end ();
                     return(boutons);
                   },
               }
             ],
            /*order: [ [0, "desc"] ],*/
            /*responsive: true,*/
          }
        );
     });
    Send_to_API ( "GET", "/archive/status/cold", null, function ( Response )
     { $('#idArchiveDBColdRetention').val(Response.archive_cold_retention);
       $('#idArchiveDBColdNumber').val(Response.nbr_cold_archives);
       $('#idArchiveDBColdSize').val(Response.size_cold_archives);
       $('#idTableArchiveCOLD').DataTable(
          { pageLength : 50,
            fixedHeader: true,
            rowId: function(row) { return ( "rowId-"+row.tablename ); },
            data:Response.tables,
            columns:
             [ { "data": "tablename", "title":"Table", "className": "align-middle text-center" },
               { "data": "nbr_archives", "title":"Nbr archives", "className": "align-middle text-center" },
               { "data": "size", "title":"Taille (Mb)", "className": "align-middle text-center" },
               { "data": null, "title":"Actions", "orderable": false, "className": "align-middle text-center",
                 "render": function (item)
                   { boutons = Bouton_actions_start ();
                     boutons += Bouton_actions_add ( "danger", "Supprimer les archives", "Show_Modal_Archive_Del_Cold", "rowId-"+item.tablename, "trash", null );
                     boutons += Bouton_actions_end ();
                     return(boutons);
                   },
               }
             ],
            /*order: [ [0, "desc"] ],*/
            /*responsive: true,*/
          }
        );
     });
    Charger_une_courbe ( "idCourbeArchMaxFrag",  "SYS", "ARCH_MAX_FRAG", "BY_MONTH", "MAX" );
    Charger_une_courbe ( "idCourbeArchNbHotArchives", "SYS", "NBR_HOT_ARCHIVES", "BY_MONTH", "MAX" );
    Charger_une_courbe ( "idCourbeArchNbColdArchives", "SYS", "NBR_COLD_ARCHIVES", "BY_MONTH", "MAX" );
  }
