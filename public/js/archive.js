/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Valider_Archive_Del ( table_name )
  { var json_request = { table_name : table_name };
    Send_to_API ( 'DELETE', "/archive/delete", json_request, function ()
     { Show_toast_ok ( "Table "+table_name+" supprimée." );
       $('#idTableArchive').DataTable().row("#"+table_name).remove().draw();
     });
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function Show_Modal_Archive_Del ( table_name )
  { selection = $('#idTableArchive').DataTable().row("#"+table_name).data();
    $('#idModalDelTitre').text ( "Détruire la table ?" );
    $('#idModalDelMessage').html("Etes-vous sur de vouloir supprimer cette table et ses enregistrements ?"+
                                 "<hr>"+
                                 "<strong>"+selection.table_name + "<br>"+selection.table_rows+" enregistrements</strong>"
                                );
    $('#idModalDelValider').off("click").on("click", function () { Valider_Archive_Del(table_name); } );
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
  { Send_to_API ( "POST", "/archive/status", null, function ( Response )
     { $('#idArchiveDBRetention').val(Response.archive_retention);
       $('#idArchiveNumber').val(Response.nbr_all_archives);
       $('#idArchiveTableNumber').val(Response.nbr_tables);
       $('#idArchiveDatabaseSize').val(Response.database_size);
       $('#idTableArchive').DataTable(
          { pageLength : 50,
            fixedHeader: true,
            rowId: "table_name",
            data:Response.tables,
            columns:
             [ { "data": "table_name", "title":"Nom de la table", "className": "align-middle text-center" },
               { "data": "table_rows", "title":"Nombre d'enregistrements", "className": "align-middle text-center" },
               { "data": "update_time", "title":"Last Update", "className": "align-middle text-center" },
               { "data": "table_size", "title":"Taille stockage (MB)", "className": "align-middle text-center" },
               { "data": null, "title":"Actions", "orderable": false, "render": function (item)
                   { boutons = Bouton_actions_start ();
                     boutons += Bouton_actions_add ( "danger", "Supprimer la table", "Show_Modal_Archive_Del", item.table_name, "trash", null );
                     boutons += Bouton_actions_end ();
                     return(boutons);
                   },
               }
             ],
            /*order: [ [0, "desc"] ],*/
            responsive: true,
          }
        );
     });
  }
