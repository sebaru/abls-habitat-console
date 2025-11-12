/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Valider_Archive_Del ( rowId )
  { selection = $('#idTableArchive').DataTable().row("#"+rowId).data();
    var json_request = { tech_id : selection.tech_id, acronyme: selection.acronyme };
    Send_to_API ( 'DELETE', "/archive/delete", json_request, function ()
     { Show_toast_ok ( "Archives de "+selection.tech_id+":"+selection.acronyme+" supprimées." );
       $('#idTableArchive').DataTable().row("#"+rowId).remove().draw();
     });
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function Show_Modal_Archive_Del ( rowId )
  { selection = $('#idTableArchive').DataTable().row("#"+rowId).data();
    $('#idModalDelTitre').text ( "Détruire la table ?" );
    $('#idModalDelMessage').html("Etes-vous sur de vouloir supprimer ces archives ?"+
                                 "<hr>"+
                                 "<strong>"+selection.tech_id+":"+selection.acronyme + "<br>"+selection.rows+" enregistrements</strong>"
                                );
    $('#idModalDelValider').off("click").on("click", function () { Valider_Archive_Del(rowId); } );
    $('#idModalDel').modal("show");
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
  { var rowid=0;
    Send_to_API ( "GET", "/archive/status/hot", null, function ( Response )
     { $('#idArchiveDBHotRetention').val(Response.archive_hot_retention);
       $('#idArchiveDBHotNumber').val(Response.nbr_hot_archives);
       $('#idArchiveDBHotSize').val(Response.size_hot_archives);
       $('#idTableArchiveHOT').DataTable(
          { pageLength : 50,
            fixedHeader: true,
            rowId: function(row) { return ( "rowId-"+rowid ); },
            createdRow: function( row, item, dataIndex ) { rowid++; },
            data:Response.partitions,
            columns:
             [ { "data": "partname", "title":"Partition", "className": "align-middle text-center" },
               { "data": "nbr_archives", "title":"Nbr archives", "className": "align-middle text-center" },
               { "data": "size", "title":"Taille", "className": "align-middle text-center" },
               { "data": "free", "title":"Free", "className": "align-middle text-center" },
               { "data": "fragmentation", "title":"Fragmentation", "className": "align-middle text-center" },
               { "data": null, "title":"Actions", "orderable": false, "className": "align-middle text-center",
                 "render": function (item)
                   { boutons = Bouton_actions_start ();
                     /*boutons += Bouton_actions_add ( "warning", "Refroidir", "ARCHIVE_Move_to_cold", "rowId-"+rowid, "freeze", null );*/
                     boutons += Bouton_actions_add ( "danger", "Supprimer", "Show_Modal_Archive_Del_Hot", "rowId-"+rowid, "trash", null );
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
            rowId: function(row) { return ( "rowId-"+rowid ); },
            createdRow: function( row, item, dataIndex ) { rowid++; },
            data:Response.tables,
            columns:
             [ { "data": "tablename", "title":"Table", "className": "align-middle text-center" },
               { "data": "nbr_archives", "title":"Nbr archives", "className": "align-middle text-center" },
               { "data": "size", "title":"Taille", "className": "align-middle text-center" },
               { "data": "free", "title":"Free", "className": "align-middle text-center" },
               { "data": "fragmentation", "title":"Fragmentation", "className": "align-middle text-center" },
               { "data": null, "title":"Actions", "orderable": false, "className": "align-middle text-center",
                 "render": function (item)
                   { boutons = Bouton_actions_start ();
                     boutons += Bouton_actions_add ( "danger", "Supprimer les archives", "Show_Modal_Archive_Del_Cold", "rowId-"+rowid, "trash", null );
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
    Charger_une_courbe ( "idCourbeArchMaxFrag",  "SYS", "ARCH_MAX_FRAG", "MONTH", "MAX" );
    Charger_une_courbe ( "idCourbeArchNbHotArchives", "SYS", "NBR_HOT_ARCHIVES", "MONTH", "MAX" );
    Charger_une_courbe ( "idCourbeArchNbColdArchives", "SYS", "NBR_COLD_ARCHIVES", "MONTH", "MAX" );
  }
