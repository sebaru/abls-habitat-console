/************************************ Créé un nouveau tableau *****************************************************************/
 function Dls_Param_Set ( dls_param_id )
  { selection = $('#idTableDlsParams').DataTable().row("#"+dls_param_id).data();
    var json_request =
       { dls_param_id: parseInt(dls_param_id),
         libelle : $('#idDlsParamLibelle_'+dls_param_id).val(),
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

    $('#idTableDlsParams').DataTable(
       { pageLength : 25,
         fixedHeader: true,
         ajax: { url : $ABLS_API+"/dls/params", type : "GET", dataSrc: "params", contentType: "application/json",
                 data: { tech_id: Tech_id },
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request)
                              { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                                request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                              }
               },
         rowId: "dls_param_id",
         columns:
          [ { "data": "acronyme", "title":"Acronyme", "className": "align-middle text-center " },
            { "data": null, "title":"Libellé", "className": "align-middle ",
              "render": function (item)
                { return( Input ( "text", "idDlsParamLibelle_"+item.dls_param_id,
                                  "Dls_Param_Set('"+item.dls_param_id+"')",
                                  "Quelle est le libellé associé ?",
                                  item.libelle )
                        );
                }
            },
          ],
         /*order: [ [0, "desc"] ],*/
         responsive: true,
       }
     );
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
