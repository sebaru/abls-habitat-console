/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  { $('#idTableLog').DataTable(
       { pageLength : 25,
         fixedHeader: true,
         ajax: {	url : $ABLS_API+"/audit_log/list",	type : "GET", dataSrc: "audit_logs",
                 error: function ( xhr, status, error ) { Show_Error(xhr.statusText); },
                 beforeSend: function (request)
                                request.setRequestHeader('X-ABLS-DOMAIN', localStorage.getItem("domain_uuid") );
                              }
               },
         columns: [ { "data": "date", "title":"Date" },
                    { "data": "classe", "title": "Classe" },
                    { "data": "username", "title": "Username", "className": "d-none d-md-table-cell" },
                    { "data": "message", "title":"Message" }
                  ],
         order: [ [0, "desc"] ],
       }
     );
  }
