 var compil_status = [ [ "Never compiled yet", "info" ],
                       [ "Database Export failed", "outline-danger" ],
                       [ "Error loading source file", "outline-danger" ],
                       [ "Error loading log file", "outline-danger" ],
                       [ "Syntax error", "outline-danger" ],
                       [ "Error Fork GCC", "outline-danger" ],
                       [ "OK", "success" ],
                       [ "Warnings", "outline-warning" ],
                     ];

 function Go_to_dls_status ()
  { Redirect ( "/dls_status" );
  }

/************************************ Demande de refresh **********************************************************************/
 function DLS_Refresh ( )
  { $('#idTableDLS').DataTable().ajax.reload(null, false); }
/******************************************************************************************************************************/
 function Dls_start_plugin ( dls_id )
  { selection = $('#idTableDLS').DataTable().row("#"+dls_id).data();
    var json_request = { tech_id : selection.tech_id };
    Send_to_API ( 'POST', "/dls/start", json_request, function () { Show_toast_ok("Module "+selection.tech_id+" activé"); DLS_Refresh(); });
  }
 function Dls_stop_plugin ( dls_id )
  { selection = $('#idTableDLS').DataTable().row("#"+dls_id).data();
    var json_request = { tech_id : selection.tech_id };
    Send_to_API ( 'POST', "/dls/stop", json_request, function () { Show_toast_ok("Module "+selection.tech_id+" désactivé"); DLS_Refresh(); });
  }
 function Dls_debug_plugin ( dls_id )
  { selection = $('#idTableDLS').DataTable().row("#"+dls_id).data();
    var json_request = { tech_id : selection.tech_id };
    Send_to_API ( 'POST', "/dls/debug", json_request, function () { Show_toast_ok("Module "+selection.tech_id+" en debug"); DLS_Refresh(); });
  }

 function Dls_undebug_plugin ( dls_id )
  { selection = $('#idTableDLS').DataTable().row("#"+dls_id).data();
    var json_request = { tech_id : selection.tech_id };
    Send_to_API ( 'POST', "/dls/debug", json_request, function () { Show_toast_ok("Module "+selection.tech_id+" hors debug"); DLS_Refresh(); });
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Valider_Dls_Del ( selection )
  { selection = $('#idTableDLS').DataTable().row("#"+dls_id).data();
    var json_request = { tech_id : selection.tech_id };
    Send_to_API ( 'DELETE', "/dls/delete", json_request, function () { Show_toast_ok("Module "+selection.tech_id+" supprimé"); DLS_Refresh(); });
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function Show_Modal_Dls_Del ( dls_id )
  { selection = $('#idTableDLS').DataTable().row("#"+dls_id).data();

    if (selection.dls_id==1)
     { Show_toast_ko ( "La suppression du DLS originel est interdite !" ); return; }

    Show_modal_del ( "Détruire le module ?",
                     "Etes-vous sur de vouloir supprimer le module DLS et toutes ses dépendances (Mnémoniques, ...) ?",
                     selection.tech_id + " - " + selection.shortname + " - " + selection.name,
                     function () { Valider_Dls_Del(selection); } );
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function Dls_compiler ( dls_id )
  { selection = $('#idTableDLS').DataTable().row("#"+dls_id).data();
    var json_request = { tech_id : selection.tech_id };
    Send_to_API ( "POST", "/dls/compil", json_request, function () { Show_toast_ok("Module "+selection.tech_id+" compilé"); DLS_Refresh(); });
  }

/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Dls_Set ( dls_id )
  { var json_request =
       { syn_id    : parseInt($('#idModalDlsEditPage').val()),
         shortname : $('#idModalDlsEditShortname').val(),
         name      : $('#idModalDlsEditDescription').val(),
         tech_id   : $('#idModalDlsEditTechID').val().toUpperCase(),
       };
    if (dls_id>0) json_request.dls_id = dls_id;                                                         /* Ajout ou édition ? */

    Send_to_API ( "POST", "/dls/set", json_request, function(Response)
     { Show_toast_ok("Module "+selection.tech_id+" mis à jour"); DLS_Refresh(); });
  }
/************************************ Controle de saisie avant envoi **********************************************************/
 function Dls_Set_controle_techid ( tech_id_initial )
  { FormatPage = RegExp(/^[a-zA-Z0-9_\.]+$/);
    table = $('#idTableDLS').DataTable();
    input = $('#idModalDlsEditTechID');

    if ( FormatPage.test(input.val())==false )
     { input.addClass("bg-danger");    $('#idModalDlsEditValider').attr("disabled", true);
       Popover_show ( input, 'Caractères autorisés', 'lettres, chiffres, _ et .' );
     }
    else if ( (table.ajax.json().plugins.filter( function(item)                                   /* Si tech_id deja existant */
                                               { return item.tech_id.toUpperCase()==input.val().toUpperCase() } )[0] !== undefined &&
              (tech_id_initial == null || input.val().toUpperCase() != tech_id_initial.toUpperCase()) )
       )
     { input.addClass("bg-danger");    $('#idModalDlsEditValider').attr("disabled", true);
       Popover_show ( input, 'Erreur !', 'Ce nom est déjà pris' );
     }
    else
     { if (tech_id_initial !== null && input.val().toUpperCase() != tech_id_initial.toUpperCase())
        { $('#idModalDlsEditValider').addClass("btn-danger").removeClass("btn-primary").text("Tout Recompiler"); }
       else
        { $('#idModalDlsEditValider').addClass("btn-primary").removeClass("btn-danger").text("Valider"); }
       input.removeClass("bg-danger"); $('#idModalDlsEditValider').attr("disabled", false);
       Popover_hide(input);
     }
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function Show_Modal_Dls_Add ( )
  { $('#idModalDlsEditTitre').text("Ajouter un D.L.S");
    $('#idModalDlsEditTechID').off("input").on("input", function () { Dls_Set_controle_techid(null); } );
    $('#idModalDlsEditTechID').val("");
    Dls_Set_controle_techid ( null );
    $('#idModalDlsEditShortname').val("");
    $('#idModalDlsEditDescription').val("");
    $('#idModalDlsEditValider').off("click").on("click", function () { Dls_Set(0); } );
    Send_to_API ( "POST", "/syn/list", null, function (Response)
     { $('#idModalDlsEditPage').empty();
       $.each ( Response.synoptiques, function ( i, item )
        { $('#idModalDlsEditPage').append("<option value='"+item.syn_id+"'>"+item.page+" - "+htmlEncode(item.libelle)+"</option>"); } );
     }, null );
    $('#idModalDlsEdit').modal("show");
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function Show_Modal_Dls_Edit ( dls_id )
  { selection = $('#idTableDLS').DataTable().row("#"+dls_id).data();
    $('#idModalDlsEditTitre').text("Modifier le D.L.S " + selection.tech_id );
    $('#idModalDlsEditTechID').val(selection.tech_id);
    $('#idModalDlsEditTechID').attr("oninput", "Dls_Set_controle_techid('"+tech_id+"')" );
    Dls_Set_controle_techid ( tech_id );
    $('#idModalDlsEditShortname').val(selection.shortname);
    $('#idModalDlsEditDescription').val(selection.name);
    $('#idModalDlsEditValider').attr( "onclick", "Dls_Set("+selection.dls_id+")" );
    Send_to_API ( "POST", "/syn/list", null, function (Response)
     { $('#idModalDlsEditPage').empty();
       $.each ( Response.synoptiques, function ( i, item )
        { $('#idModalDlsEditPage').append("<option value='"+item.syn_id+"'>"+item.page+" - "+htmlEncode(item.libelle)+"</option>"); } );
       $('#idModalDlsEditPage').val(selection.syn_id);
     }, null );
    $('#idModalDlsEdit').modal("show");
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableDLS').DataTable(
       { pageLength : 50,
         fixedHeader: true,
         rowId: "dls_id",
         ajax: { url : $ABLS_API+"/dls/list", type : "POST", dataSrc: "dls", contentType: "application/json",
                 data: function() { return ( JSON.stringify( { "domain_uuid": localStorage.getItem('domain_uuid') } ) ); },
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request) { request.setRequestHeader('Authorization', 'Bearer ' + Token); }
               },
         columns:
          [ { "data": "dls_id", "title":"#ID", "className": "align-middle  text-center" },
            { "data": "page", "title":"Page", "className": "align-middle  text-center" },
            { "data": null, "title":"Started", "className": "align-middle  text-center",
              "render": function (item)
                { if (item.actif==true)
                   { return( Bouton ( "success", "Désactiver le plugin", "Dls_stop_plugin", item.dls_id, "Actif" ) ); }
                  if (item.compil_status>=6) /* Si compil OK ou warning */
                   { return( Bouton ( "outline-secondary", "Activer le plugin", "Dls_start_plugin", item.dls_id, "Désactivé" ) ); }
                  return( Bouton ( "outline-secondary", "Compilation nécéssaire", null, null, "Désactivé" ) );
                }
            },
            { "data": null, title:"Debug",  "className": "text-center align-middle", "render": function (item)
              { if (item.debug==true)
                 { return( Bouton ( "warning", "Désactiver le debug", "Dls_undebug_plugin", item.dls_id, "Actif" ) ); }
                else
                 { return( Bouton ( "outline-secondary", "Activer le débug", "Dls_debug_plugin", item.dls_id, "Désactivé" ) ); }
              }
            },
            { "data": null, "title":"TechID", "className": "align-middle text-center",
              "render": function (item)
                { return( Lien ( "/dls_source/"+item.tech_id, "Voir la source", item.tech_id ) );
                }
            },
            { "data": null, "title":"Nom court", "className": "align-middle",
              "render": function (item)
                { return( Lien ( "/dls_source/"+item.tech_id, "Voir la source", item.shortname ) );
                }
            },
            { "data": null, "title":"Libellé", "className": "align-middle ",
              "render": function (item)
                { return( Lien ( "/dls_source/"+item.tech_id, "Voir la source", item.name ) );
                }
            },
            { "data": null, "title":"Compil", "className": "align-middle ",
              "render": function (item)
                { return( Bouton ( compil_status[item.compil_status][1],
                                  "Statut de la compilation", null, null,
                                   compil_status[item.compil_status][0]
                                )
                        );
                }
            },
            { "data": null, "title":"Stats", "className": "align-middle text-center",
              "render": function (item)
                { return( Badge ( "primary", "Nombre de compilation", item.nbr_compil ) + "<br>" +
                          Badge ( "secondary", "Nombre de ligne", item.nbr_ligne ) );
                }
            },
            { "data": "compil_date", "title":"Date Compil", "className": "align-middle text-center " },
            { "data": null, "title":"Actions", "orderable": false, "className": "align-middle",
              "render": function (item)
                { boutons = Bouton_actions_start ();
                  boutons += Bouton_actions_add ( "outline-primary", "Voir le code", "Redirect", "/dls_source/"+item.dls_id, "code", null );
                  boutons += Bouton_actions_add ( "outline-primary", "Voir les mnemos", "Redirect", "/mnemos/"+item.dls_id, "book", null );
                  boutons += Bouton_actions_add ( "outline-primary", "Editer", "Show_Modal_Dls_Edit", item.dls_id, "pen", null );
                  boutons += Bouton_actions_add ( "outline-success", "Compiler le module", "Dls_compiler", item.dls_id, "coffee", null );
                  boutons += Bouton_actions_add ( "outline-primary", "Voir les RUN", "Redirect", "/dls_run/"+item.dls_id, "eye", null );
                  boutons += Bouton_actions_add ( "danger", "Supprimer le plugin", "Show_Modal_Dls_Del", item.dls_id, "trash", null );
                  boutons += Bouton_actions_end ();
                  return(boutons);
                }
            }
          ],
         /*order: [ [0, "desc"] ],*/
         responsive: true,
       }
     );

  }
/*----------------------------------------------------------------------------------------------------------------------------*/
