 var SMS_NOTIF = [ "None", "Yes", "GSM_Only", "OVH_Only" ];

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
               {       if (item.typologie==0) { img = "info.svg";           title = "etat";        }
                 else if (item.typologie==1) { img = "bouclier_orange.svg"; title = "alerte";      }
                 else if (item.typologie==2) { img = "pignon_orange.svg";   title = "defaut";      }
                 else if (item.typologie==3) { img = "pignon_red.svg";      title = "alarme";      }
                 else if (item.typologie==4) { img = "bouclier_green.svg";  title = "veille";      }
                 else if (item.typologie==5) { img = "info.svg";            title = "attente";     }
                 else if (item.typologie==6) { img = "croix_red.svg";       title = "danger";      }
                 else if (item.typologie==7) { img = "croix_orange.svg";    title = "derangement"; }
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
           { "data": null, "title":"Profil Audio", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.audio_profil) ); }
           },
           { "data": null, "title":"Libelle Audio", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.audio_libelle) ); }
           },
           { "data": null, "title":"SMS Notification", "className": "align-middle text-center",
             "render": function (item)
               { return( SMS_NOTIF[item.sms_notification] ); }
           },
           { "data": null, "title":"Libelle SMS", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.sms_libelle) ); }
           },
           { "data": null, "title":"Rate_Limit", "className": "align-middle text-center",
             "render": function (item)
               { return( item.rate_limit ); }
           },
           { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
             "render": function (item)
               { boutons = Bouton_actions_start ();
                 boutons += Bouton_actions_add ( "primary", "Editer la connexion", "IMSGS_Edit", item.imsgs_id, "pen", null );
                 boutons += Bouton_actions_end ();
                 return(boutons);
               },
           }
         ],
       /*order: [ [0, "desc"] ],*/
       responsive: true,
     });
/*    Send_to_API ( "GET", "/message/list", (vars[2] ? "tech_id="+vars[2] : null), function(Response)
     { /*$("#idSourceTitle").text( "(#"+Response.dls_id+") - " + Response.tech_id + " - " + Response.shortname);
       $("#idSourceSynoptique").text(Response.page);
       SourceCode.getDoc().setValue(Response.sourcecode);
       $("#idErrorLog").html(Response.errorlog.replace(/(?:\r\n|\r|\n)/g, '<br>'));
            if (Response.error_count)   { $("#idErrorLog").addClass("alert-danger"); }                        /* Error */
      /* else if (Response.warning_count) { $("#idErrorLog").addClass("alert-warning"); }                          /* OK */
      /* else $("#idErrorLog").addClass("alert-success").html("No error");*/
  /*   }, null);*/
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
