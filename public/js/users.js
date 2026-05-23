/************************************ Demande de refresh **********************************************************************/
 function USER_Refresh ( )
  { $('#idTableUsers').DataTable().ajax.reload(null, false);
  }
/******************************************************************************************************************************/
 function User_disable_user ( uuid )
  { $("#idButtonSpinner_User_disable_user_"+uuid).show();
    selection = $('#idTableUsers').DataTable().row("#"+uuid).data();
    var json_request =  { user_uuid   : selection.user_uuid, enable : false };

    Send_to_API ( 'POST', "/user/set", json_request, function ()
     { Show_toast_ok ( "Utilisateur désactivé" );
       USER_Refresh();
     }, null);
  }
/******************************************************************************************************************************/
 function User_enable_user ( uuid )
  { $("#idButtonSpinner_User_enable_user_"+uuid).show();
    selection = $('#idTableUsers').DataTable().row("#"+uuid).data();
    var json_request =  { user_uuid   : selection.user_uuid, enable : true };

    Send_to_API ( 'POST', "/user/set", json_request, function ()
     { Show_toast_ok ( "Utilisateur activé" );
       USER_Refresh();
     }, null);
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { console.log ("in load page !");
    $('#idTableUsers').DataTable(
       { pageLength : 50,
         fixedHeader: true,
         ajax: {	url : "/api/user/list",	type : "GET", dataSrc: "users", contentType: "application/json",
                 error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
               },
         rowId: "user_uuid",
         columns:
          [ { "data": null, "title":"Enable", "className": "align-middle  text-center",
              "render": function (item)
                { if (item.enable==true)
                   { return( Bouton ( "success", "Désactiver cet utilisateur",
                                      "User_disable_user", item.user_uuid, "Oui" ) );
                   }
                  else
                   { return( Bouton ( "outline-warning", "Activer cet utilisateur",
                                      "User_enable_user", item.user_uuid, "Désactivé" ) );
                   }
                }
            },
            { "data": null,   "title":"Username", "className": "align-middle text-center",
              "render": function (item)
                { return( htmlEncode(item.username) ); }
            },
            { "data": null, "title": "Adresse Mail", "className": "align-middle d-none d-md-table-cell ",
              "render": function (item)
                { return( htmlEncode(item.email) ); }
            },
            { "data": null, "title":"Level", "className": "align-middle text-start d-none d-md-table-cell",
              "render": function (item)
                { return( Badge_Access_level ( item.access_level ) + " - " + Access_level_description[item.access_level].name ); }
            },
            { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
              "render": function (item)
                { var can_edit = item.access_level<localStorage.getItem("access_level");
                  boutons = Bouton_deroulant_start();
                  boutons += Bouton_deroulant_add ( "primary", "Editer l'utilisateur",
                                                    (can_edit ? "Redirect" : null),
                                                    (can_edit ? "/user/"+item.user_uuid : null),
                                                    "pen" );
                  boutons += Bouton_deroulant_end ();
                  return(boutons);
                },
            }
          ],
         /*order: [ [0, "desc"] ],*/
       }
     );
  }
