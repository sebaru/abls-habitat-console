/********************************************* Appelé au chargement de la page ************************************************/
 function SEARCH_Rechercher ( )
  { Send_to_API ( 'GET', "/search", "search="+$("#idSearchQuery").val(), function (Response)
     { $('#idTableSearchResults').DataTable(
        { pageLength : 200, destroy: true,
          fixedHeader: true, paging: false, ordering: true, searching: false,
          rowId: "id",
          data: Response.results,
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
                   else if (item.classe=="REGISTRE")
                    { return( Lien ( "/courbe/"+item.tech_id+"/"+item.acronyme, "Voir le graphe", item.acronyme ) ); }
                   else if (item.classe=="AI")
                    { return( Lien ( "/courbe/"+item.tech_id+"/"+item.acronyme, "Voir le graphe", item.acronyme ) ); }
                   else if (item.classe=="AO")
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
        });
     });
  }

/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { $('#idSearchQuery').off("enter").on( "enter", () => { SEARCH_Rechercher(); });
    $('#idSearchQuery').off("input").on( "input", () => { SEARCH_Rechercher(); });
    var target = Get_url_parameter( "search" );
    if (target!==null) { $("#idSearchQuery").val(target); SEARCH_Rechercher(); }
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
