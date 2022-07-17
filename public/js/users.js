/************************************ Demande de refresh **********************************************************************/
 function USER_Refresh ( )
  { $('#idTableUsers').DataTable().ajax.reload(null, false);
  }
/******************************************************************************************************************************/
 function User_disable_user ( uuid )
  { /*$("#idButtonSpinner_"+ups_id).show();*/
    selection = $('#idTableUsers').DataTable().row("#"+uuid).data();
    var json_request =  { user_uuid   : selection.user_uuid, enable : false };

    Send_to_API ( 'POST', "/user/set", json_request, function ()
     { Show_toast_ok ( "Utilisateur désactivé" );
       USER_Refresh();
     }, null);
  }
/******************************************************************************************************************************/
 function User_enable_user ( uuid )
  { selection = $('#idTableUsers').DataTable().row("#"+uuid).data();
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
         ajax: {	url : $ABLS_API+"/user/list",	type : "POST", dataSrc: "users", contentType: "application/json",
                 data: function() { return ( JSON.stringify({"domain_uuid": localStorage.getItem('domain_uuid')} ) ); },
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request) { request.setRequestHeader('Authorization', 'Bearer ' + Token); }
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
            { "data": null, "title":"Level", "className": "align-middle  text-center",
              "render": function (item)
                { return( Badge_Access_level ( item.access_level ) + " - " + Access_level_description[item.access_level].name ); }
            },
            { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
              "render": function (item)
                { boutons = Bouton_actions_start ();
                  boutons += Bouton_actions_add ( "primary", "Editer l'utilisateur",
                                                  (item.access_level<TokenParsed.access_level || item.user_uuid==TokenParsed.sub ? "Redirect('/user/"+item.user_uuid+"')" : null),
                                                  item.user_uuid, "pen", null );
                  boutons += Bouton_actions_end ();
                  return(boutons);
                },
            }
          ],
         /*order: [ [0, "desc"] ],*/
         responsive: true,
       }
     );
  }
