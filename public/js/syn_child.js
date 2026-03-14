var SYN_Response = null;
/************************************ Demande de refresh **********************************************************************/
 function SYN_Refresh ( )
  { $('#idTableSYN').DataTable().ajax.reload(null, false);
  }
/********************************************* Déplace un synoptique fils (haut/bas) ******************************************/
 function SYN_Move ( syn_page, direction )
  { Send_to_API ( "POST", "/syn/move", { page: syn_page, direction: direction }, function(Response)
     { SYN_Refresh();
     }, null );
  }
 function SYN_Move_up   ( syn_page ) { SYN_Move ( syn_page, "up"   ); }
 function SYN_Move_down ( syn_page ) { SYN_Move ( syn_page, "down" ); }
/************************************ Controle de saisie avant envoi **********************************************************/
 function Synoptique_set_controle_page ( page_initiale )
  { FormatPage = RegExp(/^[a-zA-Z0-9_\- ]+$/);
    table = $('#idTableSYN').DataTable();
    input = $('#idModalSynEditPage');
    if ( FormatPage.test(input.val())==false )
     { input.addClass("bg-danger");    $('#idModalSynEditValider').attr("disabled", true);  }
    else
     { input.removeClass("bg-danger"); $('#idModalSynEditValider').attr("disabled", false); }
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function SYN_Add_Valider ( )
  { var json_request =
       { parent_id   : SYN_Response.syn_id,
         page        : $('#idModalSynEditPage').val(),
         libelle     : $('#idModalSynEditLibelle').val(),
         access_level: parseInt($('#idModalSynEditAccessLevel').val()),
         mode_affichage: (parseInt($('#idModalSynEditAffichage').val()) == 1 ? true : false),
         image       : "syn_maison.png",
       };

    Send_to_API ( "POST", "/syn/set", json_request, function(Response)
     { Show_toast_ok ( "Synoptique "+json_request.page+" ajouté.");
       SYN_Refresh();
     }, null );
  }
/********************************************* Afichage du modal d'ajout synoptique *******************************************/
 function SYN_Add ( )
  { $('#idModalSynEditTitre').text ( "Ajouter un synoptique fils sur " + $('#idSynChildParentPage').text() );
    $('#idModalSynEditPage').val("");
    $('#idModalSynEditPage').attr("oninput", "Synoptique_set_controle_page(null)");
    Synoptique_set_controle_page (null);
    $('#idModalSynEditAffichage').val("0");
    $('#idModalSynEditLibelle').val("");
    $('#idModalSynEditAccessLevel').attr("max", localStorage.getItem("access_level") ).val(0);
    $('#idModalSynEditValider').attr( "onclick", "SYN_Add_Valider()" );
    $('#idModalSynEdit').modal("show");
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { var path_parts = window.location.pathname.split('/');
    var syn_page   = decodeURIComponent(path_parts[path_parts.length - 1]);
    $('#idSynChildParentPage').text(syn_page);
    console.log ("in load syn_child, page = " + syn_page);

    $('#idTableSYN').DataTable(
       { pageLength : 25, fixedHeader: true, ordering: false, order: [],
         ajax: { url : $ABLS_API+"/syn/child", type : "GET", dataSrc: "children",
                 contentType: "application/json",
                 data: { page: syn_page },
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request)
                              { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                                request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                              }
               },
         initComplete: function ( settings, json ) { SYN_Response = json;
                                                     $('#idBtnRemonter').attr('href', '/synoptique/'+json.parent_page);
                                                   },
         rowId: "syn_id",
         columns:
          [ { "data": "syn_id", "title": "#", "className": "align-middle text-center" },
            { "data": null, "title":"Aperçu", "className": "align-middle text-center",
              "render": function (item)
                { target = localStorage.getItem("static_data_url")+"/img/"+item.image;
                  return( "<img src='"+target+"' class='wtd-synoptique-preview' loading=lazy alt='No Image !' onclick='SYN_Edit_image("+item.syn_id+")' />" ); }
            },
            { "data": null, "title": "Page", "className": "align-middle text-center",
              "render": function (item)
                { return( Lien ( "/synoptique/"+item.page, "Aller voir les fils de "+item.libelle, item.page ) ); },
            },
            { "data": null, "title": "Description", "className": "align-middle",
              "render": function (item)
                { return( Lien ( "/synoptique/"+item.page, "Aller voir les fils de "+item.libelle, item.libelle ) ); },
            },
            { "data": null, "title": "Ordre", "orderable": false, "className": "align-middle text-center",
              "render": function (item, type, row, meta)
                { var boutons = Bouton_actions_start();
                  boutons += Bouton_actions_add ( "outline-primary", "Monter",    "SYN_Move_up"  , item.page, "arrow-up",   "Up"   );
                  boutons += Bouton_actions_add ( "outline-primary", "Descendre", "SYN_Move_down", item.page, "arrow-down", "Down" );
                  boutons += Bouton_actions_end();
                  return(boutons);
                }
            },
          ],
       });
  }
