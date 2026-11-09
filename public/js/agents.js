/* agents.js
 * Liste globale des agents, filtrable par classe, serveur et état (synchronisés avec l'URL).
 */
 var AGENT_filters = { classe: "", serveur: "", etat: "" };
 var AGENT_latest_versions = {};
 var AGENT_live_states = {};
 var AGENT_version_collator = new Intl.Collator ( undefined, { numeric: true, sensitivity: "base" } );

 function AGENT_version_compare ( a, b )
  { var normalize = function (version)
     { var parts = String(version || "").replace(/^\d+:/, "").replace(/^v/i, "")
                           .replace(/-\d+(?:\.\d+)*$/, "").split(".");
       while (parts.length > 1 && /^0+$/.test(parts[parts.length - 1])) parts.pop();
       return( parts.join(".") );
     };
    return( AGENT_version_collator.compare ( normalize(a), normalize(b) ) );
  }

 function AGENT_upgrade_available ( item )
  { var latest = AGENT_latest_versions["abls-agent-"+item.agent_classe];
    return( !!latest && !!item.version && AGENT_version_compare ( latest, item.version ) > 0 );
  }

 function AGENT_load_inventory ()
  { /* fetch plutôt que $.ajax : $.ajaxSetup ajoute le jeton Authorization, refusé en CORS et à ne pas envoyer à pkgs */
    fetch ( "https://pkgs.abls-habitat.fr/inventory.json", { credentials: "omit" } )
     .then ( function (r) { if (!r.ok) throw new Error("HTTP "+r.status); return( r.json() ); } )
     .then ( function (json)
      { var latest = {};
        (json.packages || []).forEach ( function (pkg)
         { if (!pkg.name || !pkg.version) return;
           if (!latest[pkg.name] || AGENT_version_compare ( pkg.version, latest[pkg.name] ) > 0)
            latest[pkg.name] = pkg.version;
         });
        AGENT_latest_versions = latest;
        if ($.fn.dataTable.isDataTable('#idTableAGENT'))
         $('#idTableAGENT').DataTable().rows().invalidate().draw(false);
      })
     .catch ( function (error)
      { console.error ( "Impossible de charger l'inventaire des paquets ABLS", error ); });
  }

/********************************************* Etat synthétique d'un agent ***************************************************/
 function AGENT_etat ( item )
  { if (!item.enable) return("DISABLED");
    return ( AGENT_is_alive(item) ? "UP" : "DOWN" );
  }
/********************************************* Filtres <-> URL ****************************************************************/
 function AGENT_filters_to_url ()
  { var params = new URLSearchParams();
    if (AGENT_filters.classe)  params.set ( "classe",  AGENT_filters.classe );
    if (AGENT_filters.serveur) params.set ( "serveur", AGENT_filters.serveur );
    if (AGENT_filters.etat)    params.set ( "etat",    AGENT_filters.etat );
    var url = "/agents" + (params.toString() ? "?"+params.toString() : "");
    history.replaceState ( { path: url }, '', url );
  }

 function AGENT_filters_apply ()
  { var table = $('#idTableAGENT').DataTable();
    var regex = function (value) { return ( value ? "^"+$.fn.dataTable.util.escapeRegex(value)+"$" : "" ); };
    table.column(0).search ( regex(AGENT_filters.serveur), true, false );
    table.column(2).search ( regex(AGENT_filters.classe),  true, false );
    table.column(4).search ( regex(AGENT_filters.etat),    true, false );
    table.draw();
  }

 function AGENT_filters_changed ()
  { AGENT_filters.classe  = $('#idAgentsFilterClasse').val();
    AGENT_filters.serveur = $('#idAgentsFilterServeur').val();
    AGENT_filters.etat    = $('#idAgentsFilterEtat').val();
    AGENT_filters_to_url();
    AGENT_filters_apply();
  }

/* Remplit les filtres classe/serveur avec compteurs, à partir des données reçues */
 function AGENT_filters_populate ( agents )
  { var classes = {}, serveurs = {};
    agents.forEach ( function (item)
     { classes[item.agent_classe]     = (classes[item.agent_classe] || 0) + 1;
       serveurs[item.server_hostname] = (serveurs[item.server_hostname] || 0) + 1;
     });
    if (AGENT_filters.classe && !classes[AGENT_filters.classe])     classes[AGENT_filters.classe] = 0;
    if (AGENT_filters.serveur && !serveurs[AGENT_filters.serveur]) serveurs[AGENT_filters.serveur] = 0;

    var html = "<option value=''>Toutes ("+agents.length+")</option>";
    Object.keys(classes).sort().forEach ( function (classe)
     { var label = (classe === "server" ? "Serveurs" : AGENT_class(classe).label);
       html += "<option value='"+htmlEncode(classe)+"'>"+htmlEncode(label)+" ("+classes[classe]+")</option>";
     });
    $('#idAgentsFilterClasse').html(html).val(AGENT_filters.classe);

    html = "<option value=''>Tous</option>";
    Object.keys(serveurs).sort().forEach ( function (serveur)
     { html += "<option value='"+htmlEncode(serveur)+"'>"+htmlEncode(serveur)+" ("+serveurs[serveur]+")</option>"; });
    $('#idAgentsFilterServeur').html(html).val(AGENT_filters.serveur);
  }
/********************************************* Refresh de la table agents *****************************************************/
 function AGENT_refresh ()
  { if (typeof $ === "undefined" || !$.fn || !$.fn.dataTable) return;
    if (!$.fn.dataTable.isDataTable('#idTableAGENT')) return;
    $('#idTableAGENT').DataTable().ajax.reload(null, false);
  }

 function AGENT_list_on_live ( type, msg )
  { if (type === "RECONNECT") { AGENT_refresh(); return; }
    if (typeof $ === "undefined" || !$.fn.dataTable ||
        !$.fn.dataTable.isDataTable('#idTableAGENT')) return;
    var table = $('#idTableAGENT').DataTable();
    if (type === "STATUS")
     { if (!msg || !msg.agent_tech_id) return;
       var rows = table.rows ( function (index, data) { return(data.agent_tech_id === msg.agent_tech_id); } );
       if (!rows.count()) return;
       rows.every ( function ()
        { var item = this.data();
          AGENT_live_apply(item);
          this.data(item);
          AGENT_live_states[item.agent_tech_id] = AGENT_etat(item);
        });
       table.draw(false);
       return;
     }
    if (type !== "TICK") return;
    var changed = false;
    table.rows().every ( function ()
     { var item = this.data();
       AGENT_live_apply(item);
       var state = AGENT_etat(item);
       if (AGENT_live_states[item.agent_tech_id] !== state)
        { AGENT_live_states[item.agent_tech_id] = state;
          this.invalidate();
          changed = true;
        }
     });
    if (changed) table.draw(false);
  }
/********************************************* Lien vers la page d'un agent ***************************************************/
 function AGENT_link ( item, texte, tooltip )
  { if (item.agent_classe === "server")
     { return( Lien ( "/agents/server/"+encodeURIComponent(item.server_uuid || ""), "Voir le détail du serveur", texte ) ); }
    return( Lien ( AGENT_url ( item.agent_classe, item.agent_tech_id ), tooltip, texte ) );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { var legacy = window.location.pathname.match(/^\/agents\/([^/]+)$/);         /* Ancienne URL /agents/{classe} */
    var params = new URLSearchParams(window.location.search);
    AGENT_filters.classe  = (legacy ? decodeURIComponent(legacy[1]) : (params.get("classe") || ""));
    AGENT_filters.serveur = params.get("serveur") || "";
    AGENT_filters.etat    = params.get("etat") || "";
    if (legacy) AGENT_filters_to_url();
    $('#idAgentsFilterEtat').val(AGENT_filters.etat);
    $('#idAgentsFilterClasse, #idAgentsFilterServeur, #idAgentsFilterEtat').off('change').on('change', AGENT_filters_changed);

    AGENT_live_subscribe ( AGENT_list_on_live );

    var menu = "";
    Object.keys(AGENT_CLASSES).forEach ( function (classe)
     { var def = AGENT_CLASSES[classe];
       if (!def.set) return;
       menu += "<li><a class='dropdown-item' href='#' onclick=\"AGENT_Create('"+classe+"'); return(false);\">"+
               "<i class='fas fa-"+def.icon+" text-primary'></i> "+htmlEncode(def.label)+"</a></li>";
     });
    $('#idAgentsAddMenu').html(menu);

    AGENT_on_change = AGENT_refresh;

    $('#idTableAGENT').DataTable(
     { pageLength : 50,
       fixedHeader: true, paging: false, ordering: true, searching: true,
       ajax: { url : $ABLS_API+"/agent/list", type : "GET", contentType: "application/json",
               dataSrc: function (json)
                { var agents = json.agents || [];
                  AGENT_live_states = {};
                  agents.forEach ( function (item)
                   { AGENT_heartbeat_load(item); AGENT_live_states[item.agent_tech_id] = AGENT_etat(item); });
                  AGENT_filters_populate ( agents );
                  return(agents);
                },
               error: function ( xhr, status, error ) { Show_shell_error(xhr.statusText); }
             },
       initComplete: AGENT_filters_apply,
       columns:
        [ { "data": null, "title":"Server", "className": "align-middle text-center",
            "render": function (item, type)
              { if (type === "filter") return( item.server_hostname );
                return( htmlEncode(item.server_hostname) ); }
          },
          { "data": null, "title":"Tech_id", "className": "align-middle text-center",
            "render": function (item, type)
              { if (type === "filter" || type === "sort") return( item.agent_tech_id );
                return( AGENT_link ( item, item.agent_tech_id, "Ouvrir l'agent" ) ); }
          },
          { "data": null, "title":"Classe", "className": "align-middle text-center d-none d-lg-table-cell",
            "render": function (item, type)
              { if (type === "filter" || type === "sort") return( item.agent_classe );
                var label = (item.agent_classe === "server" ? "Serveur" : AGENT_class(item.agent_classe).label) +
                            " - " + (item.version || "none");
                var html = Lien ( "/agents?classe="+encodeURIComponent(item.agent_classe || ""), "Filtrer sur cette classe", label );
                if (AGENT_upgrade_available(item))
                 { var latest = AGENT_latest_versions["abls-agent-"+item.agent_classe];
                   html += " <button type='button' class='btn btn-link text-warning p-0 ms-1 agent-upgrade-button'"+
                           " title='Upgrader vers la version "+htmlEncode(latest)+"'"+
                           " aria-label='Upgrader vers la version "+htmlEncode(latest)+"'><i class='fas fa-upload'></i></button>";
                 }
                return( html );
              }
          },
          { "data": null, "title":"Enable", "className": "align-middle text-center d-none d-md-table-cell",
             "render": function (item)
              { return( Switch ( "idSwitchEnable_" + item.agent_tech_id,
                                 "Activer/Désactiver l'agent",
                                 item.enable,
                                 "agent-enable-switch",
                                 "data-agent-tech-id='" + item.agent_tech_id + "'" ) ); }
          },
          { "data": null, "title":"Etat", "className": "align-middle text-center d-none d-md-table-cell",
            "render": function (item, type)
              { if (type === "filter" || type === "sort") return( AGENT_etat(item) );
                var alive = AGENT_is_alive(item);
                var ioBadge = Badge( (alive ? "success" : (item.enable ? "danger" : "secondary")),
                                     AGENT_state_tooltip(item), (alive ? "UP" : "DOWN") );
                var mqttLocalBadge = Badge( (alive && item.mqtt_local_connected) ? "success" : "secondary", "MQTT Local", "MQTT Local" );
                return( ioBadge + " " + mqttLocalBadge );
              },
          },
          { "data": "description", "title":"Description", "className": "align-middle d-none d-lg-table-cell " },
          { "data": null, "title":"Status", "className": "align-middle text-center d-none d-xl-table-cell",
            "render": function (item)
             { return( '<span class="d-inline-flex align-items-center gap-1"><i class="fas fa-heartbeat text-danger"></i> ' + AGENT_link ( item, item.agent_status || "-", "Voir la supervision de l'agent" ) + '</span>' ); }
          },
          { "data": null, "title":"Log_level", "className": "align-middle text-center d-none d-xl-table-cell",
            "render": function (item)
             { return( AGENT_log_level_selector ( item.agent_tech_id, item.log_level ) ); },
          },
          { "data": null, "title":"Actions", "orderable": false, "className":"align-middle text-center",
            "render": function (item)
             { var boutons = Bouton_deroulant_start();
               if (item.agent_classe !== "server" && item.agent_classe !== "dls")
                { var def = AGENT_class(item.agent_classe);
                  if (def.set) boutons += Bouton_deroulant_add ( "primary", "Paramètres", "Redirect", AGENT_url ( item.agent_classe, item.agent_tech_id, "parametres" ), "cog" );
                  if (def.tab) boutons += Bouton_deroulant_add ( "primary", AGENT_TABS[def.tab].label, "Redirect",
                                                                 AGENT_url ( item.agent_classe, item.agent_tech_id, def.tab ), AGENT_TABS[def.tab].icon );
                  boutons += Bouton_deroulant_add_spacer();
                }
               boutons += Bouton_deroulant_add ( "warning", "Tester", "AGENT_test", item.agent_tech_id, "vial" );
               boutons += Bouton_deroulant_add ( "warning", "Redémarrer", "AGENT_restart", item.agent_tech_id, "sync-alt" );
               if (item.agent_classe !== "server")
                { if (AGENT_is_alive(item))
                   { boutons += Bouton_deroulant_add ( "danger", "Arrêter",   "AGENT_stop", item.agent_tech_id, "stop" ); }
                  else
                   { boutons += Bouton_deroulant_add ( "success", "Démarrer", "AGENT_start", item.agent_tech_id, "play" ); }
                  boutons += Bouton_deroulant_add_spacer();
                  boutons += Bouton_deroulant_add ( "danger", "Supprimer", "AGENT_delete", item.agent_tech_id, "trash", "'"+htmlEncode(item.agent_classe)+"'" );
                }
               boutons += Bouton_deroulant_end();
               return ( boutons );
             }
          },
        ],
     });

    AGENT_load_inventory();

    $(document).off('change.agentsEnable', '.agent-enable-switch').on('change.agentsEnable', '.agent-enable-switch', function()
      { var agent_tech_id = $(this).data('agent-tech-id');
        var newState = $(this).is(':checked');
        if (newState) AGENT_set_enable(agent_tech_id);
        else AGENT_set_disable(agent_tech_id);
      });

    $(document).off('click.agentsUpgrade', '.agent-upgrade-button').on('click.agentsUpgrade', '.agent-upgrade-button', function()
      { var item = $('#idTableAGENT').DataTable().row($(this).closest('tr')).data();
        if (item) AGENT_upgrade(item.agent_tech_id);
      });

    window.Unload_page = function ()
     { AGENT_live_unsubscribe ( AGENT_list_on_live );
       AGENT_on_change = null;
     };
  }
