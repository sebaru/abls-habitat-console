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
         ajax: {	url : $ABLS_API+"/user/list",	type : "GET", dataSrc: "users", contentType: "application/json",
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request)
                              { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                                request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                              }
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
            { "data": null, "title": "Adresse Mail", "className": "align-middle ",
              "render": function (item)
                { return( htmlEncode(item.email) ); }
            },
            { "data": null, "title":"Level", "className": "align-middle text-left",
              "render": function (item)
                { return( Badge_Access_level ( item.access_level ) + " - " + Access_level_description[item.access_level].name ); }
            },
            { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
              "render": function (item)
                { boutons = Bouton_actions_start ();
                  if (item.access_level<localStorage.getItem("access_level") || item.user_uuid==TokenParsed.sub)
                        { boutons += Bouton_actions_add ( "primary", "Editer l'utilisateur", "Redirect", "/user/"+item.user_uuid, "pen", null ); }
                   else { boutons += Bouton_actions_add ( "primary", "Editer l'utilisateur", null, null, "pen", null ); }
                  boutons += Bouton_actions_end ();
                  return(boutons);
                },
            }
          ],
         /*order: [ [0, "desc"] ],*/
         /*responsive: true,*/
       }
     );
  }
