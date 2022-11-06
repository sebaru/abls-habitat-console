/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idTableSearchResults').DataTable(
       { pageLength : 50,
         fixedHeader: true, paging: false, ordering: true, searching: true,
         rowId: "id",
         ajax: { url : $ABLS_API+"/search", type : "POST", dataSrc: "results", contentType: "application/json",
                 data: function() { return ( JSON.stringify( { "domain_uuid": localStorage.getItem('domain_uuid') } ) ); },
                 error: function ( xhr, status, error ) { Show_toast_ko(xhr.statusText); },
                 beforeSend: function (request) { request.setRequestHeader('Authorization', 'Bearer ' + Token); }
               },
         columns:
          [ { "data": "classe", "title":"Classe", "className": "align-middle  text-center" },
            { "data": null, "title":"TechID/Page", "className": "align-middle ",
              "render": function (item)
                { if (item.classe=="SYNOPTIQUE")
                   { return( Lien ( "https://home.abls-habitat.fr/syn/"+item.tech_id, "Voir le synoptique", item.tech_id ) ); }
                  else return( Lien ( "/dls/"+item.tech_id, "Voir la source", item.tech_id ) );
                }
            },
            { "data": null, "title":"Acronyme", "className": "align-middle ",
              "render": function (item)
                { if (item.classe=="MESSAGE")
                   { return( Lien ( "/dls/"+item.tech_id, "Voir la source", item.acronyme ) ); }
                  else if (item.classe=="CI")
                   { return( Lien ( "/courbe/"+item.tech_id+"/"+item.acronyme, "Voir le graphe", item.acronyme ) ); }
                  else if (item.classe=="AI")
                   { return( Lien ( "/courbe/"+item.tech_id+"/"+item.acronyme, "Voir le graphe", item.acronyme ) ); }
                  else if (item.classe=="HORLOGE")
                   { return( Lien ( "/horloge/"+item.id, "Editer les ticks", item.acronyme ) ); }
                  else return(item.acronyme);
                }
            },
            { "data": null, "title":"Libelle", "className": "align-middle  text-center",
              "render": function (item) { return ( htmlEncode ( item.libelle ) ); }
            },
            { "data": null, "title":"Unité", "className": "align-middle  text-center",
              "render": function (item) { return ( htmlEncode ( item.unite ) ); }
            }
          ]
       }
    );
  }
