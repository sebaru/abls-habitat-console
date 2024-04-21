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
     { archive_retention : parseInt($("#idArchiveDBRetention").val()),
     };
    Send_to_API ( 'POST', "/archive/set", json_request, function(Response)
     { Show_toast_ok ( "Modifications sauvegardées." );
     }, null );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { var rowid=0;
    Send_to_API ( "GET", "/archive/status", null, function ( Response )
     { $('#idArchiveDBRetention').val(Response.archive_retention);
       $('#idArchiveNumber').val(Response.nbr_all_archives);
       $('#idArchiveTableNumber').val(Response.nbr_tables);
       $('#idArchiveDatabaseSize').val(Response.database_size);
       $('#idTableArchive').DataTable(
          { pageLength : 50,
            fixedHeader: true,
            rowId: function(row) { return ( "rowId-"+rowid ); },
            createdRow: function( row, item, dataIndex ) { rowid++; },
            data:Response.tables,
            columns:
             [ { "data": "tech_id", "title":"Tech_id", "className": "align-middle text-center" },
               { "data": "acronyme", "title":"Acronyme", "className": "align-middle text-center" },
               { "data": "rows", "title":"Nombre d'enregistrements", "className": "align-middle text-center" },
               { "data": "last_update", "title":"Dernier enregistrement", "className": "align-middle text-center" },
               { "data": null, "title":"Actions", "orderable": false, "className": "align-middle text-center",
                 "render": function (item)
                   { boutons = Bouton_actions_start ();
                     boutons += Bouton_actions_add ( "danger", "Supprimer les archives", "Show_Modal_Archive_Del", "rowId-"+rowid, "trash", null );
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
  }
