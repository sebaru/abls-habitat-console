/* agents_common.js
 * Registre des classes d'agents, en-tête commun des pages d'instance, actions et formulaires partagés.
 */

 var AGENT_TABS =
  { io:     { label: "Configuration I/O",  icon: "sliders-h" },
    mnemos: { label: "Mnémoniques",        icon: "list" },
    zones:  { label: "Zones de diffusion", icon: "directions" }
  };

 var AGENT_CLASSES =
  { modbus:
     { label: "Modbus (Wago)", icon: "network-wired", tab: "io",
       load: { url: "/modbus/list", dataSrc: "modbus" }, set: "/modbus/set",
       fields: [ { name: "hostname", label: "Hostname", placeholder: "IP ou hostname" },
                 { name: "watchdog", label: "Watchdog", type: "number", parse: "int", min: 10, max: 1200, unit: "1/10 secondes", default: 600 } ]
     },
    phidget:
     { label: "Phidget", icon: "microchip", tab: "io",
       load: { url: "/phidget/list", dataSrc: "phidgets" }, set: "/phidget/set",
       fields: [ { name: "hostname", label: "Hostname", placeholder: "@IP ou hostname" },
                 { name: "password", label: "Mot de passe", type: "password" },
                 { name: "serial",   label: "Serial Number", type: "number", parse: "number", min: 0, max: 999999 } ]
     },
    gpiod:
     { label: "GPIO (Raspberry Pi)", icon: "microchip", tab: "io",
       load: { url: "/agent/get" }, set: "/gpiod/set",
       fields: []
     },
    ups:
     { label: "Onduleur (UPS)", icon: "car-battery", tab: "mnemos",
       load: { url: "/ups/list", dataSrc: "ups" }, set: "/ups/set",
       fields: [ { name: "name",           label: "Nom de l'onduleur", placeholder: "Nom de l'onduleur dans NUT" },
                 { name: "host",           label: "Host", placeholder: "Adresse du serveur NUT" },
                 { name: "admin_username", label: "Admin Username" },
                 { name: "admin_password", label: "Admin Password", type: "password" } ]
     },
    sms:
     { label: "SMS", icon: "sms", tab: "mnemos",
       load: { url: "/sms/list", dataSrc: "sms" }, set: "/sms/set",
       fields: [ { name: "ovh_service_name",       label: "Service OVH" },
                 { name: "ovh_application_key",    label: "Application Key",    type: "password" },
                 { name: "ovh_application_secret", label: "Application Secret", type: "password" },
                 { name: "ovh_consumer_key",       label: "Consumer Key",       type: "password" } ]
     },
    meteo:
     { label: "Météo", icon: "cloud-sun", tab: "mnemos",
       load: { url: "/meteo/list", dataSrc: "meteo" }, set: "/meteo/set",
       fields: [ { name: "token",      label: "Token API", placeholder: "Token API METEO Concept" },
                 { name: "code_insee", label: "Code Insee Commune", placeholder: "Code Insee de la commune" } ]
     },
    audio:
     { label: "Audio", icon: "volume-up", tab: "zones",
       load: { url: "/audio/list", dataSrc: "audio" }, set: "/audio/set",
       fields: [ { name: "language", label: "Langue", placeholder: "fr", fallback: "fr" },
                 { name: "device",   label: "Périphérique", placeholder: "default", fallback: "default" },
                 { name: "volume",   label: "Volume", type: "number", parse: "int", min: 0, max: 100, unit: "%", default: 100 } ]
     },
    imsg:
     { label: "Messagerie XMPP", icon: "comments", tab: null,
       load: { url: "/imsg/list", dataSrc: "imsg" }, set: "/imsg/set",
       fields: [ { name: "jabberid", label: "JabberID", type: "email" },
                 { name: "password", label: "Mot de passe XMPP", type: "password" } ]
     },
    teleinfoedf:
     { label: "Téléinfo EDF", icon: "bolt", tab: null,
       load: { url: "/teleinfoedf/list", dataSrc: "teleinfoedf" }, set: "/teleinfoedf/set",
       fields: [ { name: "port",     label: "Port Device", placeholder: "FileSystem device /dev/xxx" },
                 { name: "standard", label: "Mode", type: "select", parse: "bool", default: false,
                   options: [ { valeur: false, texte: "Historique" }, { valeur: true, texte: "Standard" } ] } ]
     },
    shelly:
     { label: "Shelly", icon: "plug", tab: null,
       load: { url: "/shelly/get" }, set: "/shelly/set",
       fields: [ { name: "hostname",  label: "Hostname", placeholder: "@IP ou hostname" },
                 { name: "string_id", label: "ID", placeholder: "ID du module" } ]
     },
    dls:
     { label: "D.L.S", icon: "code", tab: null, load: null, set: null, fields: [] }
  };

 var AGENT_on_change = null;                                    /* Positionné par la page courante pour se rafraichir */

/******************************************************************************************************************************/
 function AGENT_class ( classe )
  { return ( AGENT_CLASSES[classe] || { label: classe, icon: "robot", tab: null, load: null, set: null, fields: [] } ); }

 function AGENT_url ( classe, agent_tech_id, tab )
  { var url = "/agents/"+encodeURIComponent(classe)+"/"+encodeURIComponent(agent_tech_id);
    return ( tab ? url+"/"+tab : url );
  }

 function AGENT_changed ()
  { if (typeof AGENT_on_change === "function") AGENT_on_change(); }
/********************************************* Actions sur un agent ***********************************************************/
 function AGENT_post ( url, json_request, ok_message, nok_message, refresh )
  { Send_to_API ( "POST", url, json_request,
                  function(Response) { Show_toast_ok ( ok_message ); if (refresh) AGENT_changed(); },
                  function(Response) { Show_shell_error ( nok_message ); } );
  }

 function AGENT_set_enable ( agent_tech_id )
  { AGENT_post ( "/agent/enable", { agent_tech_id: agent_tech_id, enable: true },
                 "Agent "+agent_tech_id+" activé.", "Erreur à l'activation de l'agent "+agent_tech_id, true ); }

 function AGENT_set_disable ( agent_tech_id )
  { AGENT_post ( "/agent/enable", { agent_tech_id: agent_tech_id, enable: false },
                 "Agent "+agent_tech_id+" désactivé.", "Erreur à la désactivation de l'agent "+agent_tech_id, true ); }

 function AGENT_start ( agent_tech_id )
  { AGENT_post ( "/agent/start", { agent_tech_id: agent_tech_id },
                 "Démarrage demandé pour l'agent "+agent_tech_id, "Erreur au demarrage de l'agent "+agent_tech_id, true ); }

 function AGENT_stop ( agent_tech_id )
  { AGENT_post ( "/agent/stop", { agent_tech_id: agent_tech_id },
                 "Arrêt demandé pour l'agent "+agent_tech_id, "Erreur à l'arrêt de l'agent "+agent_tech_id, true ); }

 function AGENT_restart ( agent_tech_id )
  { AGENT_post ( "/agent/restart", { agent_tech_id: agent_tech_id },
                 "Redémarrage demandé pour l'agent "+agent_tech_id, "Erreur au redémarrage de l'agent "+agent_tech_id, true ); }

 function AGENT_upgrade ( agent_tech_id )
  { AGENT_post ( "/agent/upgrade", { agent_tech_id: agent_tech_id },
                 "Upgrade demandé pour l'agent "+agent_tech_id, "Erreur à l'upgrade de l'agent "+agent_tech_id, true ); }

 function AGENT_test ( agent_tech_id )
  { AGENT_post ( "/agent/test", { agent_tech_id: agent_tech_id },
                 "Test demandé pour l'agent "+agent_tech_id, "Erreur lors du test de l'agent "+agent_tech_id, false ); }

 function AGENT_set_log_level ( agent_tech_id, log_level )
  { AGENT_post ( "/agent/log_level", { agent_tech_id: agent_tech_id, log_level: parseInt(log_level) },
                 "Agent "+agent_tech_id+" niveau de log = "+log_level+".",
                 "Erreur lors de la modification du niveau de log de l'agent "+agent_tech_id+".", true ); }

 function AGENT_delete ( agent_tech_id, classe )
  { Show_modal_del ( "Supprimer l'agent "+agent_tech_id, "Etes-vous sûr de vouloir supprimer cet agent ?",
                     agent_tech_id + " - " + AGENT_class(classe).label,
                     function ()
                      { Send_to_API ( "DELETE", "/agent/delete", { agent_tech_id: agent_tech_id },
                                      function(Response)
                                       { Show_toast_ok ( "Agent "+agent_tech_id+" supprimé." );
                                         if (window.location.pathname === "/agents") AGENT_changed();
                                         else Redirect ( "/agents?classe="+encodeURIComponent(classe) );
                                       }, null );
                      } );
  }

 function AGENT_log_level_selector ( agent_tech_id, current_level )
  { var current = parseInt(current_level);
    if (isNaN(current) || current < 0 || current > 7) current = 6;
    var labels = [ "LOG_EMERG", "LOG_ALERT", "LOG_CRIT", "LOG_ERR", "LOG_WARNING", "LOG_NOTICE", "LOG_INFO", "LOG_DEBUG" ];
    var html = "<select class='form-select form-select-sm' onchange=\"AGENT_set_log_level('"+htmlEncode(agent_tech_id)+"', this.value )\">";
    for (var level = 7; level >= 0; level--)
     { html += "<option value='"+level+"'"+(level === current ? " selected" : "")+">"+labels[level]+"</option>"; }
    return ( html + "</select>" );
  }
/********************************************* En-tête commun des pages d'instance ********************************************/
 function AGENT_Header ( classe, agent_tech_id, active_tab )
  { var def  = AGENT_class(classe);
    var tabs = [ { path: null, label: "Supervision", icon: "heartbeat" } ];
    if (def.set) tabs.push ( { path: "parametres", label: "Paramètres", icon: "cog" } );
    if (def.tab) tabs.push ( { path: def.tab, label: AGENT_TABS[def.tab].label, icon: AGENT_TABS[def.tab].icon } );

    var html = "<div class='row m-2 align-items-center'>"+
               " <div class='col-auto'>"+
               "  <h3 class='mb-0'><i class='fas fa-"+def.icon+" text-primary'></i> "+htmlEncode(agent_tech_id)+
               "   <small class='text-muted fs-6'>"+htmlEncode(def.label)+"</small> <span id='idAgentHeaderBadges'></span></h3>"+
               "  <div class='text-muted small' id='idAgentHeaderInfo'></div>"+
               " </div>"+
               " <div class='col-auto ms-auto d-flex align-items-center gap-2' id='idAgentHeaderActions'></div>"+
               "</div>"+
               "<ul class='nav nav-tabs mx-2'>";
    tabs.forEach ( function (tab)
     { var active = (tab.path === active_tab);
       html += "<li class='nav-item'><a class='nav-link"+(active ? " active" : "")+"'"+(active ? " aria-current='page'" : "")+
               " href='"+AGENT_url(classe, agent_tech_id, tab.path)+"'><i class='fas fa-"+tab.icon+"'></i> "+htmlEncode(tab.label)+"</a></li>";
     });
    html += "</ul>";
    $('#idAgentHeader').html(html);

    AGENT_on_change = function () { AGENT_Header_refresh ( classe, agent_tech_id ); };
    AGENT_Header_refresh ( classe, agent_tech_id );
  }

 function AGENT_Header_refresh ( classe, agent_tech_id )
  { Send_to_API ( "GET", "/agent/get", "agent_tech_id="+encodeURIComponent(agent_tech_id), function (agent)
     { var badges = Badge ( agent.is_alive ? "success" : (agent.enable ? "danger" : "secondary"), "Etat", agent.is_alive ? "UP" : "DOWN" );
       if (!agent.enable) badges += " " + Badge ( "secondary", "Agent désactivé", "Désactivé" );
       $('#idAgentHeaderBadges').html(badges);
       $('#idAgentHeaderInfo').text ( (agent.description || "-") + " · serveur " + (agent.server_hostname || "-") +
                                      " · version " + (agent.version || "-") );

       var id = htmlEncode(agent.agent_tech_id);
       var actions = Switch ( "idAgentHeaderEnable", "Activer/Désactiver l'agent", agent.enable, "agent-header-enable", "" ) +
                     "<div style='width: 9rem;'>"+AGENT_log_level_selector ( agent.agent_tech_id, agent.log_level )+"</div>" +
                     Bouton_deroulant_start() +
                     Bouton_deroulant_add ( "warning", "Tester",     "AGENT_test",    id, "vial" ) +
                     Bouton_deroulant_add ( "warning", "Upgrader",   "AGENT_upgrade", id, "upload" ) +
                     Bouton_deroulant_add ( "warning", "Redémarrer", "AGENT_restart", id, "sync-alt" ) +
                     (agent.is_alive ? Bouton_deroulant_add ( "danger",  "Arrêter",  "AGENT_stop",  id, "stop" )
                                     : Bouton_deroulant_add ( "success", "Démarrer", "AGENT_start", id, "play" )) +
                     Bouton_deroulant_add_spacer() +
                     Bouton_deroulant_add ( "danger", "Supprimer l'agent", "AGENT_delete", id, "trash", "'"+htmlEncode(classe)+"'" ) +
                     Bouton_deroulant_end();
       $('#idAgentHeaderActions').html(actions);
       $('#idAgentHeaderEnable').off('change').on('change', function ()
        { if ($(this).is(':checked')) AGENT_set_enable(agent.agent_tech_id);
                                 else AGENT_set_disable(agent.agent_tech_id);
        });
     }, null );
  }

/* Extrait classe et tech_id d'une URL /agents/{classe}/{tech_id}[/onglet] */
 function AGENT_from_path ()
  { var parts = window.location.pathname.split('/');
    if (!parts[2] || !parts[3]) return(null);
    return ( { classe: decodeURIComponent(parts[2]), agent_tech_id: decodeURIComponent(parts[3]).toUpperCase() } );
  }
/********************************************* Formulaire de paramètres *******************************************************/
 function AGENT_Form_row ( label, input )
  { return ( "<div class='row mb-2 align-items-center'><label class='col-5 col-sm-4 col-form-label text-end'>"+htmlEncode(label)+"</label>"+
             "<div class='col-7 col-sm-8'>"+input+"</div></div>" );
  }

 function AGENT_Form_html ( prefix, classe )
  { var html = AGENT_Form_row ( "Serveur de l'agent", "<select id='"+prefix+"Server' class='form-select border-info'></select>" ) +
               AGENT_Form_row ( "Tech_ID", "<input id='"+prefix+"TechID' type='text' class='form-control' maxlength='32' placeholder='Tech ID de l&apos;agent'>" ) +
               AGENT_Form_row ( "Description", "<input id='"+prefix+"Description' type='text' class='form-control' placeholder='Description'>" );
    AGENT_class(classe).fields.forEach ( function (field)
     { var id = prefix+"_"+field.name;
       var input;
       if (field.type === "select")
        { input = "<select id='"+id+"' class='form-select'>";
          field.options.forEach ( function (opt) { input += "<option value='"+opt.valeur+"'>"+htmlEncode(opt.texte)+"</option>"; } );
          input += "</select>";
        }
       else
        { input = "<input id='"+id+"' type='"+(field.type || "text")+"' class='form-control'"+
                  (field.placeholder ? " placeholder='"+htmlEncode(field.placeholder)+"'" : "")+
                  (field.min !== undefined ? " min='"+field.min+"'" : "")+
                  (field.max !== undefined ? " max='"+field.max+"'" : "")+">";
        }
       if (field.unit) input = "<div class='input-group'>"+input+"<span class='input-group-text'>"+htmlEncode(field.unit)+"</span></div>";
       html += AGENT_Form_row ( field.label, input );
     });
    return(html);
  }

 function AGENT_Form_fill ( prefix, classe, data )
  { Select_from_api ( prefix+"Server", "/servers/list", null, "servers", "server_uuid",
                      function (item) { return ( item.agent_tech_id ); }, data ? data.server_uuid : null );
    $('#'+prefix+'Description').val( data ? data.description : "" );
    AGENT_class(classe).fields.forEach ( function (field)
     { var value = (data ? data[field.name] : field.default);
       if (value === undefined || value === null) value = (field.default !== undefined ? field.default : "");
       if (field.parse === "bool") value = (value === true || value === 1 || value === "1" || value === "true") ? "true" : "false";
       $('#'+prefix+'_'+field.name).val( value );
     });
  }

 function AGENT_Form_payload ( prefix, classe )
  { var request =
     { server_uuid:   $('#'+prefix+'Server').val(),
       agent_tech_id: $('#'+prefix+'TechID').val().toUpperCase(),
       description:   $('#'+prefix+'Description').val()
     };
    AGENT_class(classe).fields.forEach ( function (field)
     { var value = $('#'+prefix+'_'+field.name).val();
            if (field.parse === "int")    value = parseInt(value);
       else if (field.parse === "number") value = Number(value);
       else if (field.parse === "bool")   value = (value === "true");
       else if (field.fallback && !value.length) value = field.fallback;
       request[field.name] = value;
     });
    return(request);
  }

/* Charge la configuration propre à la classe (les endpoints /list ne filtrent pas sur le tech_id) */
 function AGENT_Load_config ( classe, agent_tech_id, fonction_ok )
  { var load = AGENT_class(classe).load;
    if (!load) return;
    var param = (load.dataSrc ? null : "agent_tech_id="+encodeURIComponent(agent_tech_id));
    Send_to_API ( "GET", load.url, param, function (Response)
     { var data = Response;
       if (load.dataSrc)
        { data = (Response[load.dataSrc] || []).find ( function (item) { return ( item.agent_tech_id === agent_tech_id ); } ); }
       if (!data) { Show_shell_error ( "Aucune configuration "+AGENT_class(classe).label+" pour '"+agent_tech_id+"'." ); return; }
       fonction_ok(data);
     }, null );
  }
/********************************************* Création d'un agent ************************************************************/
 function AGENT_Create ( classe )
  { var def = AGENT_class(classe);
    if (!def.set) return;
    if (!$('#idAGENTCREATE').length)
     { $('body').append (
        "<div id='idAGENTCREATE' class='modal fade' tabindex='-1' role='dialog'>"+
        " <div class='modal-dialog modal-dialog-centered modal-lg' role='document'><div class='modal-content'>"+
        "  <div class='modal-header bg-info text-white'><h5 class='modal-title'><i class='fas fa-plus'></i> <span id='idAGENTCREATETitre'></span></h5>"+
        "   <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button></div>"+
        "  <div class='modal-body' id='idAGENTCREATEBody'></div>"+
        "  <div class='modal-footer'><button type='button' class='btn btn-secondary' data-bs-dismiss='modal'><i class='fas fa-times'></i> Annuler</button>"+
        "   <button id='idAGENTCREATEValider' type='button' class='btn btn-primary'><i class='fas fa-save'></i> Créer</button></div>"+
        " </div></div>"+
        "</div>" );
     }
    $('#idAGENTCREATETitre').text ( "Ajouter un agent " + def.label );
    $('#idAGENTCREATEBody').html ( AGENT_Form_html ( "idAGENTCREATE", classe ) );
    AGENT_Form_fill ( "idAGENTCREATE", classe, null );
    $('#idAGENTCREATETechID').val("").off("input").on("input", function () { Controle_tech_id ( "idAGENTCREATE", null ); } ).trigger("input");
    $('#idAGENTCREATEValider').off("click").on("click", function ()
     { var request = AGENT_Form_payload ( "idAGENTCREATE", classe );
       $('#idAGENTCREATE').modal("hide");
       Send_to_API ( "POST", def.set, request, function ()
        { Show_toast_ok ( "Agent "+request.agent_tech_id+" créé." );
          Redirect ( AGENT_url ( classe, request.agent_tech_id, "parametres" ) );
        }, null );
     });
    $('#idAGENTCREATE').modal("show");
  }
