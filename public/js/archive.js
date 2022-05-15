/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Valider_Archive_Del ( table_name )
  { var json_request = JSON.stringify( { table_name : table_name } );
    Send_to_API ( 'DELETE', "/api/archive/del", json_request, function ()
     { $('#idTableArchive').DataTable().ajax.reload(null, false);
     });
  }

/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function Show_Modal_Archive_Del ( table_name )
  { table = $('#idTableArchive').DataTable();
    selection = table.ajax.json().tables.filter( function(item) { return item.table_name==table_name } )[0];
    $('#idModalDelTitre').text ( "Détruire la table ?" );
    $('#idModalDelMessage').html("Etes-vous sur de vouloir supprimer cette table et ses enregistrements ?"+
                                 "<hr>"+
                                 "<strong>"+table_name + "<br>"+selection.table_rows+" enregistrements</strong>"
                                );
    $('#idModalDelValider').attr( "onclick", "Valider_Archive_Del('"+table_name+"')" );
    $('#idModalDel').modal("show");
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Archive_sauver_parametre ( )
  { var json_request =
     { archive_retention : parseInt($("#idDomainArchRetention").val()),
     };
    Send_to_API ( 'POST', "/archive/set", json_request, function(Response)
     { Load_page();
       Show_toast_ok ( "Modifications sauvegardées." );
     }, null );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { Send_to_API ( "POST", "/archive/status", null, function ( Response )
     { $('#idArchiveDBRetention').val(Response.archive_retention);
       $('#idArchiveNumber').val(Response.nbr_all_archives);
       $('#idArchiveTableNumber').val(Response.nbr_tables);
       $('#idTableArchive').DataTable(
          { pageLength : 50,
            fixedHeader: true,
            rowId: "id",
            data:Response.tables,
            columns:
             [ { "data": "table_name", "title":"Nom de la table", "className": "align-middle text-center" },
               { "data": "table_rows", "title":"Nombre d'enregistrements", "className": "align-middle text-center" },
               { "data": "update_time", "title":"Last Update", "className": "align-middle text-center" },
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
