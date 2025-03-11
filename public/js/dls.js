 function Go_to_dls_status ()
  { Redirect ( "/dls_status" );
  }

/************************************ Demande de refresh **********************************************************************/
 function DLS_Refresh ( )
  { $('#idTableDLS').DataTable().ajax.reload(null, false); }
/******************************************************************************************************************************/
 function Dls_start_plugin ( dls_id )
  { selection = $('#idTableDLS').DataTable().row("#"+dls_id).data();
    var json_request = { tech_id : selection.tech_id, enable: true };
    Send_to_API ( 'POST', "/dls/enable", json_request, function () { Show_toast_ok("D.L.S "+selection.tech_id+" activé"); DLS_Refresh(); });
  }
/******************************************************************************************************************************/
 function Dls_stop_plugin ( dls_id )
  { selection = $('#idTableDLS').DataTable().row("#"+dls_id).data();
    var json_request = { tech_id : selection.tech_id, enable: false };
    Send_to_API ( 'POST', "/dls/enable", json_request, function () { Show_toast_ok("D.L.S "+selection.tech_id+" désactivé"); DLS_Refresh(); });
  }
/************************************ Envoi les infos de modifications synoptique *********************************************/
 function Valider_Dls_Del ( selection )
  { var json_request = { tech_id : selection.tech_id };
    Send_to_API ( 'DELETE', "/dls/delete", json_request, function () { Show_toast_ok("D.L.S "+selection.tech_id+" supprimé"); DLS_Refresh(); });
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
         package   : $('#idModalDlsEditPackage').val(),
         name      : $('#idModalDlsEditDescription').val(),
         tech_id   : $('#idModalDlsEditTechID').val().toUpperCase(),
       };
    if (dls_id>0) json_request.dls_id = dls_id;                                                         /* Ajout ou édition ? */

    Send_to_API ( "POST", "/dls/set", json_request, function(Response)
     {      if (dls_id>0) Show_toast_ok("D.L.S "+json_request.tech_id+" mis à jour");
       else if (dls_id>0) Show_toast_ok("D.L.S "+json_request.tech_id+" ajouté");
       DLS_Refresh();
     });
  }
/************************************ Controle de saisie avant envoi **********************************************************/
 function Dls_Set_controle_techid ( inputid )
  { FormatPage = RegExp(/^[a-zA-Z0-9_\.]+$/);
    table  = $('#idTableDLS').DataTable();
    input  = $('#'+inputid+'TechID');
    bouton = $('#'+inputid+'Valider');

    if ( FormatPage.test(input.val())==false )
     { input.addClass("bg-danger");
       bouton.attr("disabled", true);
     }
    else if ( table.ajax.json().dls.filter( function(item)                                        /* Si tech_id deja existant */
                                              { return item.tech_id.toUpperCase()==input.val().toUpperCase() } )[0] !== undefined )
     { input.addClass("bg-danger");
       bouton.attr("disabled", true);
     }
    else
     { input.removeClass("bg-danger");
       bouton.attr("disabled", false);
     }
  }
/********************************************* Afichage du modal d'edition synoptique *****************************************/
 function Show_Modal_Dls_Add ( )
  { $('#idModalDlsEditTitre').text("Ajouter un D.L.S");
    $('#idModalDlsEditTechID').off("input").on("input", function () { Dls_Set_controle_techid('idModalDlsEdit'); } )
                              .attr("disabled", false );
    Dls_Set_controle_techid('idModalDlsEdit');
    $('#idModalDlsEditTechID').val("");
    $('#idModalDlsEditShortname').val("");
    $('#idModalDlsEditPackage').val("custom");
    $('#idModalDlsEditDescription').val("");
    $('#idModalDlsEditValider').off("click").on("click", function () { Dls_Set(0); } );
    Send_to_API ( "GET", "/syn/list", null, function (Response)
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
    $('#idModalDlsEditTechID').val(selection.tech_id)
                              .attr("disabled", false );
    $('#idModalDlsEditShortname').val(selection.shortname);
    $('#idModalDlsEditPackage').val(selection.package);
    $('#idModalDlsEditDescription').val(selection.name);
    $('#idModalDlsEditValider').off("click").on("click", function () { Dls_Set(selection.dls_id); } );
    Send_to_API ( "GET", "/syn/list", null, function (Response)
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
         ajax: { url : $ABLS_API+"/dls/list", type : "GET", dataSrc: "dls", contentType: "application/json",
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request)
                              { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                                request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                              },
               },
         columns:
          [ { "data": "dls_id", "title":"#ID", "className": "align-middle  text-center" },
            { "data": null, "title": "Page", "className": "align-middle text-center",
              "render": function (item)
                { return( Lien ( "/atelier/"+item.page, "Voir le synoptique "+item.page, item.page ) + "<br>#" + item.syn_id ); },
            },
            { "data": null, "title":"Enabled", "className": "align-middle  text-center",
              "render": function (item)
                { if (item.enable==true)
                   { return( Bouton ( "success", "Désactiver le plugin", "Dls_stop_plugin", item.dls_id, "Actif" ) ); }
                  else
                   { return( Bouton ( "outline-secondary", "Activer le plugin", "Dls_start_plugin", item.dls_id, "Désactivé" ) ); }
                }
            },
            { "data": null, "title":"TechID", "className": "align-middle text-center",
              "render": function (item)
                { if (item.package == "" || item.package == "custom")
                   { return( Lien ( "/dls/"+item.tech_id, "Voir la source", item.tech_id ) ); }
                  else
                   { return( Lien ( "/dls/params/"+item.tech_id, "Voir les paramètres", item.tech_id ) ); }
                }
            },
            { "data": null, "title":"Nom court", "className": "align-middle",
              "render": function (item)
                { if (item.package == "" || item.package == "custom")
                   { return( Lien ( "/dls/"+item.tech_id, "Voir la source", item.shortname ) ); }
                  else
                   { return( Lien ( "/dls/params/"+item.tech_id, "Voir les paramètres", item.shortname ) ); }
                }
            },
            { "data": null, "title":"Libellé", "className": "align-middle ",
              "render": function (item)
                { if (item.package == "" || item.package == "custom")
                   { return( Lien ( "/dls/"+item.tech_id, "Voir la source", item.name ) ); }
                  else
                   { return( Lien ( "/dls/params/"+item.tech_id, "Voir les paramètres", item.name ) ); }
                }
            },
            { "data": null, "title":"Statut", "className": "align-middle text-center",
              "render": function (item)
                { if (item.compil_status==false)
                   { return( Bouton ( "secondary", "Not compiled", null, null, "Not compiled" ) ); }
                  if (item.error_count>0)
                   { return( Bouton ( "outline-danger", "Erreur rencontrée", null, null, "Error" ) ); }
                  if (item.warning_count>0)
                   { return( Bouton ( "outline-warning", "Warning rencontré", null, null, "Warning" ) ); }
                  return( Bouton ( "success", "Aucune erreur", null, null, "OK" ) );
                }
            },
            { "data": null, "title":"Stats", "className": "align-middle text-center",
              "render": function (item)
                { return( Badge ( "primary", "Nombre de compilation", item.nbr_compil.toString() ) + "<br>" +
                          Badge ( "secondary", "Nombre de ligne", item.nbr_ligne.toString() ) + "<br>" +
                          Badge ( "success", "Temps de compilation", item.compil_time.toString() )
                        );
                }
            },
            { "data": null, "title":"Date Compil", "className": "align-middle text-center ",
              "render": function (item)
                { return( item.compil_date + "<br>" + item.compil_user ); }
            },
            { "data": null, "title":"Actions", "orderable": false, "className": "align-middle",
              "render": function (item)
                { boutons = Bouton_actions_start ();
                  if (item.package == "" || item.package == "custom")
                   { boutons += Bouton_actions_add ( "outline-primary", "Voir le code", "Redirect", "/dls/"+item.tech_id, "code", null ); }
                  else
                   { boutons += Bouton_actions_add ( "outline-primary", "Paramétrer", "Redirect", "/dls/params/"+item.tech_id, "wrench", null ); }

                  boutons += Bouton_actions_add ( "outline-primary", "Voir les messages", "Redirect", "/messages/"+item.tech_id, "book", null );
                  boutons += Bouton_actions_add ( "outline-primary", "Editer", "Show_Modal_Dls_Edit", item.dls_id, "pen", null );
                  boutons += Bouton_actions_add ( "outline-success", "Compiler le module", "Dls_compiler", item.dls_id, "coffee", null );
                  boutons += Bouton_actions_add ( "outline-primary", "Voir les RUN", "Redirect", "/dls/run/"+item.tech_id, "eye", null );
                  boutons += Bouton_actions_add ( "danger", "Supprimer le plugin", "Show_Modal_Dls_Del", item.dls_id, "trash", null );
                  boutons += Bouton_actions_end ();
                  return(boutons);
                }
            }
          ],
         /*order: [ [0, "desc"] ],*/
         /*responsive: true,*/
       }
     );

  }
/*----------------------------------------------------------------------------------------------------------------------------*/
