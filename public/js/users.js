/******************************************************************************************************************************/
 function User_disable_user ( uuid )
  { selection = $('#idTableUsers').DataTable().row("#"+uuid).data();
    var json_request =  { user_uuid   : selection.user_uuid, enable      : false };

    Send_to_API ( 'POST', "/users/set", json_request, function ()
     { Show_toast_ok ( "Utilisateur désactivé" );
       $('#idTableUsers').DataTable().ajax.reload(null, false);
     }, null);
  }
/******************************************************************************************************************************/
 function User_enable_user ( uuid )
  { selection = $('#idTableUsers').DataTable().row("#"+uuid).data();
    var json_request =  { user_uuid   : selection.user_uuid, enable      : true };

    Send_to_API ( 'POST', "/users/set", json_request, function ()
     { Show_toast_ok ( "Utilisateur activé" );
       $('#idTableUsers').DataTable().ajax.reload(null, false);
     }, null);
  }
/******************************************************************************************************************************/
 function User_enable_send_txt ( uuid )
  { selection = $('#idTableUsers').DataTable().row("#"+uuid).data();
    var json_request =  { user_uuid   : selection.user_uuid, can_send_txt  : true };

    Send_to_API ( 'POST', "/users/set", json_request, function ()
     { Show_toast_ok ( "Commande GSM/XMPP autorisée" );
       $('#idTableUsers').DataTable().ajax.reload(null, false);
     }, null);
  }
/******************************************************************************************************************************/
 function User_disable_send_txt ( uuid )
  { selection = $('#idTableUsers').DataTable().row("#"+uuid).data();
    var json_request =  { user_uuid   : selection.user_uuid, can_send_txt  : false };

    Send_to_API ( 'POST', "/users/set", json_request, function ()
     { Show_toast_ok ( "Commande GSM/XMPP interdite" );
       $('#idTableUsers').DataTable().ajax.reload(null, false);
     }, null);
  }
/******************************************************************************************************************************/
 function User_enable_recv_sms ( uuid )
  { selection = $('#idTableUsers').DataTable().row("#"+uuid).data();
    var json_request =  { user_uuid   : selection.user_uuid, can_recv_sms: true };

    Send_to_API ( 'POST', "/users/set", json_request, function ()
     { Show_toast_ok ( "Notification GSM/XMPP activée" );
       $('#idTableUsers').DataTable().ajax.reload(null, false);
     }, null);
  }
/******************************************************************************************************************************/
 function User_disable_recv_sms ( uuid )
  { selection = $('#idTableUsers').DataTable().row("#"+uuid).data();
    var json_request =  { user_uuid   : selection.user_uuid, can_recv_sms: false };

    Send_to_API ( 'POST', "/users/set", json_request, function ()
     { Show_toast_ok ( "Notification GSM/XMPP désactivée" );
       $('#idTableUsers').DataTable().ajax.reload(null, false);
     }, null);
  }
/******************************************************************************************************************************/
 function User_set ( uuid )
  { selection = $('#idTableUsers').DataTable().row("#"+uuid).data();
    var json_request =
       { user_uuid   : selection.user_uuid,
         access_level: parseInt($('#idUserLevel_'+uuid).val()),
         xmpp        : $('#idUserXmpp_'+uuid).val(),
         phone       : $('#idUserPhone_'+uuid).val(),
       };

    Send_to_API ( 'POST', "/users/set", json_request, function ()
     { Show_toast_ok ( "Utilisateur modifié" );
       $('#idTableUsers').DataTable().ajax.reload(null, false);
     }, null);
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function Show_Modal_user_del ( uuid )
  { selection = $('#idTableUsers').DataTable().row("#"+uuid).data();
    Show_modal_del ( "Interdire l'accès à cet utilisateur ?",
                     "Etes-vous sûr de vouloir interdire l'accès au domaine "+localStorage.getItem("domain_name")+
                     " pour l'utilisateur "+selection.username+ "?",
                      selection.username + " - " + selection.email,
                     function () { User_Valider_user_del(uuid); } );
  }
/******************************************************************************************************************************/
 function User_Valider_user_del ( uuid )
  { selection = $('#idTableUsers').DataTable().row("#"+uuid).data();
    var json_request = { user_uuid   : selection.user_uuid };

    Send_to_API ( 'DELETE', "/users/grant", json_request, function ()
     { Show_toast_ok ( "Le domaine "+localStorage.getItem("domain_name")+" est interdit pour l'utilisateur "+selection.email+"." );
       $('#idTableUsers').DataTable().ajax.reload(null, false);
     }, null);
  }
/******************************************************************************************************************************/
 function Users_Valider_Inviter ()
  { Send_to_API ( 'POST', "/users/invite", json_request, function ()
     { Show_toast_ok ( "L'utilisateur "+email+" a été invité." );
     }, null);
  }
/******************************************************************************************************************************/
 function Users_Show_add_user ()
  { $('#idModalUserAdd').modal("show"); }
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
          [ { "data": "username",   "title":"Username", "className": "align-middle text-center" },
            { "data": "email", "title":"Adresse Mail", "className": "align-middle " },
            { "data": null, "title":"Enable", "className": "align-middle  text-center",
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
            { "data": null, "title":"Level", "className": "align-middle  text-center",
              "render": function (item)
                { return( Select_Access_level ( "idUserLevel_"+item.user_uuid,
                                                "User_set('"+item.user_uuid+"')",
                                                item.access_level )
                        );
                }
            },
            { "data": null, "title":"Notification/Cde", "className": "align-middle  text-center",
              "render": function (item)
                { boutons = Bouton_actions_start ();
                  if (item.can_recv_sms==true)
                   { boutons += Bouton_actions_add ( "success", "Désactiver les can_recv_smss",
                                                     "User_disable_recv_sms", item.user_uuid, "bell", null );
                   }
                  else
                   { boutons += Bouton_actions_add ( "outline-secondary", "Activer les can_recv_smss",
                                                     "User_enable_recv_sms", item.user_uuid, "bell-slash", null );
                   }
                  if (item.allow_cde==true)
                   { boutons += Bouton_actions_add ( "success", "Interdire les commandes",
                                                     "User_disable_send_txt", item.user_uuid, "phone", null );
                   }
                  else
                   { boutons += Bouton_actions_add ( "outline-secondary", "Autoriser les commandes",
                                                     "User_enable_send_txt", item.user_uuid, "phone-slash", null );
                   }
                  boutons += Bouton_actions_end ();
                  return(boutons);
                }
            },
            { "data": null, "title":"Messagerie Instantanée", "className": "align-middle ",
              "render": function (item)
                { return( Input ( "email", "idUserXmpp_"+item.username,
                                  "User_set('"+item.username+"')",
                                  "Adresse de messagerie instantanée",
                                  item.xmpp )
                        );
                }
            },
            { "data": null, "title":"Téléphone", "className": "align-middle ",
              "render": function (item)
                { return( Input ( "tel", "idUserPhone_"+item.user_uuid,
                                  "User_set('"+item.user_uuid+"')",
                                  "Téléphone de cet utilisateur",
                                  item.phone )
                        );
                }
            },
            { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
              "render": function (item)
                { boutons = Bouton_actions_start ();
                  boutons += Bouton_actions_add ( "danger", "Retirer les droits d'accès", "Show_Modal_user_del", item.user_uuid, "trash", null );
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
