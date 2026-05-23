/************************************ Créé un nouveau tableau *****************************************************************/
 function Dls_Param_Set ( dls_param_id )
  { selection = $('#idTableDlsParams').DataTable().row("#"+dls_param_id).data();
    var json_request =
       { dls_param_id: parseInt(dls_param_id),
         valeur : $('#idDlsParamValeur_'+dls_param_id).val(),
       };
    Send_to_API ( "POST", "/dls/params/set", json_request, function (Response)
     { $('#idTableDlsParams').DataTable().ajax.reload(null, false);
     }, null );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    var Tech_id = vars[3];
    if (Tech_id == null) Redirect ("/dls");

    $('#idDlsParamTitle').text(Tech_id);
    Set_page_context ( { lastLabel: "Paramètres du D.L.S " + Tech_id,
                         title    : "Paramètres du D.L.S " + Tech_id } );

    $('#idTableDlsParams').DataTable(
       { pageLength : 25,
         fixedHeader: true,
         ajax: { url : "/api/dls/params", type : "GET", dataSrc: "params", contentType: "application/json",
                 data: { tech_id: Tech_id },
                 error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
               },
         rowId: "dls_param_id",
         columns:
          [ { "data": "acronyme", "title":"Acronyme", "className": "align-middle text-center " },
            { "data": "libelle", "title":"Libellé", "className": "align-middle text-center d-none d-md-table-cell " },
            { "data": null, "title":"Valeur", "className": "align-middle ",
              "render": function (item)
                { return( Input ( "text", "idDlsParamValeur_"+item.dls_param_id,
                                  "Dls_Param_Set('"+item.dls_param_id+"')",
                                  "Quelle est le libellé associé ?",
                                  item.valeur )
                        );
                }
            },
          ],
         /*order: [ [0, "desc"] ],*/
       }
     );
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
