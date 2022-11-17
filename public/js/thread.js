/************************************ Demande de refresh **********************************************************************/
 function THREAD_Refresh ( )
  { $('#idTableTHREAD').DataTable().ajax.reload(null, false);
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableTHREAD').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/thread/list", type : "GET", dataSrc: "threads", contentType: "application/json",
               error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
               beforeSend: function (request)
                            { request.setRequestHeader('Authorization', 'Bearer ' + Token);
                              request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                            }
             },
       /*rowId: "thread_id",*/
       columns:
         [ { "data": null, "title":"Agent", "className": "align-middle text-center",
             "render": function (item)
               { return( htmlEncode(item.agent_hostname) ); }
           },
           { "data": null, "title":"Classe", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/"+item.thread_classe, "Voir le connecteur", htmlEncode(item.thread_classe) ) ); }
           },
           { "data": null, "title":"Tech_id", "className": "align-middle text-center",
             "render": function (item)
               { return( Lien ( "/dls/"+item.thread_tech_id, "Voir la source", item.thread_tech_id ) ); }
           },
           { "data": "description", "title":"Description", "className": "align-middle " },
           { "data": null, "title":"IO_COMM", "className": "align-middle text-center",
             "render": function (item)
               { if (item.comm==true) { return( Bouton ( "success", "Comm OK", null, null, "1" ) );        }
                                 else { return( Bouton ( "outline-secondary", "Comm Failed", null, null, "0" ) ); }
               },
           },
         ],
       /*order: [ [0, "desc"] ],*/
       responsive: true,
     });

  }
