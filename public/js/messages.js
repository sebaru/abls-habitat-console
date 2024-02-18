 var TXT_NOTIF = [ { valeur: 0, texte: "None" },
                   { valeur: 1, texte: "Yes" },
                   { valeur: 2, texte: "GSM_Only" },
                   { valeur: 3, texte: "OVH_Only" },
                   { valeur: 4, texte: "CHAT_Only" }
                 ];

/************************************ Demande de refresh **********************************************************************/
 function MESSAGE_Refresh ( )
  { $('#idTableMESSAGES').DataTable().ajax.reload(null, false);
  }

/************************************ Envoi les infos de modifications synoptique *********************************************/
 function MESSAGE_Set ( selection )
  { var json_request =
       { tech_id         : selection.tech_id,
         acronyme        : selection.acronyme,
         txt_notification: parseInt($('#idMSGEditTxtNotification').val()),
         audio_zone      : $('#idMSGEditAudioZone').val(),
         audio_libelle   : $('#idMSGEditAudioLibelle').val(),
         rate_limit      : parseInt($('#idMSGEditRateLimit').val()),
       };

    Send_to_API ( "POST", "/message/set", json_request, function(Response)
     { Show_toast_ok ( "Modification sauvegardée.");
       MESSAGE_Refresh();
     }, function(Response) { MESSAGE_Refresh(); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function MSG_Edit ( msg_id )
  { selection = $('#idTableMESSAGES').DataTable().row("#"+msg_id).data();
    $('#idMSGEditTitre').text("Editer les paramètres du message " + selection.tech_id+":"+selection.acronyme);
    $('#idMSGEditLibelle').prop ("disabled", true).val( selection.libelle );
    $('#idMSGEditTxtNotification').replaceWith ( Select ( "idMSGEditTxtNotification", null, TXT_NOTIF, selection.txt_notification ) );
    $('#idMSGEditAudioZone').val( selection.audio_profil );
    $('#idMSGEditAudioLibelle').val( selection.audio_libelle );
    $('#idMSGEditRateLimit').val( selection.rate_limit );
    $('#idMSGEditValider').off("click").on( "click", function () { MESSAGE_Set(selection); } );
    $('#idMSGEdit').modal("show");
  }

/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');

    $('#idTableMESSAGES').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/message/list", type : "GET", dataSrc: "messages", contentType: "application/json",
               data: function() { return ( (vars[2] ? "tech_id="+vars[2] : null) ); },
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       rowId: "msg_id",
       columns:
         [ { "data": null, "title":"Type", "className": "align-middle text-center",
             "render": function (item)
               {      if (item.typologie==0) { img = "info.svg";            title = "etat";         }
                 else if (item.typologie==1) { img = "bouclier_orange.svg"; title = "alerte";       }
                 else if (item.typologie==2) { img = "pignon_orange.svg";   title = "defaut";       }
                 else if (item.typologie==3) { img = "pignon_red.svg";      title = "alarme";       }
                 else if (item.typologie==4) { img = "bouclier_green.svg";  title = "veille";       }
                 else if (item.typologie==5) { img = "panneau_danger.svg";  title = "notification"; }
                 else if (item.typologie==6) { img = "croix_red.svg";       title = "danger";       }
                 else if (item.typologie==7) { img = "croix_orange.svg";    title = "derangement";  }
                 return("<img width='30px' src='https://static.abls-habitat.fr/img/"+img+"' title='"+title+"'>");
               }
           },

           { "data": null, "title":"Tech_id", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/dls/"+item.tech_id, "Voir la source", item.tech_id ) ); }
           },
           { "data": null, "title":"Acronyme", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode ( item.acronyme ) ); }
           },
           { "data": null, "title":"Libelle", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.libelle) ); }
           },
           { "data": null, "title":"Zone Audio", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.audio_profil) ); }
           },
           { "data": null, "title":"Notification", "className": "align-middle text-center",
             "render": function (item)
               { return( TXT_NOTIF.map ( function(item) { return(item.texte); } )[item.txt_notification] ); }
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "primary", "Configurer le message", "MSG_Edit", item.msg_id, "pen", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
       /*responsive: true,*/
     });
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
