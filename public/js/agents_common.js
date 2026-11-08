/* agents_common.js
 * Registre des classes d'agents, en-tête commun des pages d'instance, actions et formulaires partagés.
 */

 var AGENT_TABS =
  { io:     { label: "Configuration I/O",  icon: "sliders-h" },
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
     { label: "Onduleur (UPS)", icon: "car-battery", tab: null,
       load: { url: "/ups/list", dataSrc: "ups" }, set: "/ups/set",
       fields: [ { name: "name",           label: "Nom de l'onduleur", placeholder: "Nom de l'onduleur dans NUT" },
                 { name: "host",           label: "Host", placeholder: "Adresse du serveur NUT" },
                 { name: "admin_username", label: "Admin Username" },
                 { name: "admin_password", label: "Admin Password", type: "password" } ]
     },
    sms:
     { label: "SMS", icon: "sms", tab: null,
       load: { url: "/sms/list", dataSrc: "sms" }, set: "/sms/set",
       fields: [ { name: "ovh_service_name",       label: "Service OVH" },
                 { name: "ovh_application_key",    label: "Application Key",    type: "password" },
                 { name: "ovh_application_secret", label: "Application Secret", type: "password" },
                 { name: "ovh_consumer_key",       label: "Consumer Key",       type: "password" } ]
     },
    meteo:
     { label: "Météo", icon: "cloud-sun", tab: null,
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
      fields: [ { name: "jabber_id", label: "JabberID", type: "email" },
           { name: "jabber_password", label: "Mot de passe XMPP", type: "password" } ]
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
 var AGENT_HEARTBEAT_TIMEOUT_MS = 75000;
 var AGENT_live_subscribers = [];
 var AGENT_live_agents = {};
 var AGENT_live_timer = null;
 var AGENT_live_online = false;
 var AGENT_live_was_connected = false;
 var AGENT_header_agent = null;
 var AGENT_header_alive = null;
 var AGENT_header_callback = null;
 var AGENT_header_tech_id = null;

/******************************************************************************************************************************/
 function AGENT_class ( classe )
  { return ( AGENT_CLASSES[classe] || { label: classe, icon: "robot", tab: null, load: null, set: null, fields: [] } ); }

 function AGENT_url ( classe, agent_tech_id, tab )
  { var url = "/agents/"+encodeURIComponent(classe)+"/"+encodeURIComponent(agent_tech_id);
    return ( tab ? url+"/"+tab : url );
  }

 function AGENT_changed ()
  { if (typeof AGENT_on_change === "function") AGENT_on_change(); }

 function AGENT_parse_datetime ( value )
  { if (typeof value !== "string" || !value || value === "0000-00-00 00:00:00") return(null);
    var match = value.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/);
    if (!match) return(null);
    var date = new Date ( Number(match[1]), Number(match[2])-1, Number(match[3]),
                          Number(match[4]), Number(match[5]), Number(match[6]),
                          Number((match[7] || "0").padEnd(3, "0")) );
    if (date.getFullYear() !== Number(match[1]) || date.getMonth() !== Number(match[2])-1 ||
        date.getDate() !== Number(match[3]) || date.getHours() !== Number(match[4]) ||
        date.getMinutes() !== Number(match[5]) || date.getSeconds() !== Number(match[6])) return(null);
    return(date);
  }

 function AGENT_heartbeat_load ( agent )
  { if (!agent || !agent.agent_tech_id) return(agent);
    var id = agent.agent_tech_id;
    var live = AGENT_live_agents[id] || {};
    var date = AGENT_parse_datetime ( agent.heartbeat_time );
    if (date && (!live.heartbeat_ms || date.getTime() > live.heartbeat_ms))
     { live.heartbeat_ms = date.getTime();
       live.heartbeat_time = agent.heartbeat_time;
     }
    if (live.mqtt_local_connected === undefined || live.mqtt_received_ms === undefined)
     live.mqtt_local_connected = !!agent.mqtt_local_connected;
    AGENT_live_agents[id] = live;
    AGENT_live_apply ( agent );
    return(agent);
  }

 function AGENT_live_apply ( agent )
  { if (!agent || !agent.agent_tech_id) return;
    var live = AGENT_live_agents[agent.agent_tech_id];
    if (!live) return;
    if (live.heartbeat_ms !== undefined) agent.heartbeat_ms = live.heartbeat_ms;
    if (live.heartbeat_time !== undefined) agent.heartbeat_time = live.heartbeat_time;
    if (live.mqtt_local_connected !== undefined) agent.mqtt_local_connected = live.mqtt_local_connected;
  }

 function AGENT_is_alive ( agent )
  { if (!agent) return(false);
    AGENT_live_apply(agent);
    var heartbeat_ms = (typeof agent.heartbeat_ms === "number") ? agent.heartbeat_ms :
                       (AGENT_parse_datetime(agent.heartbeat_time) || {}).getTime();
    return (typeof heartbeat_ms === "number" && Date.now() - heartbeat_ms < AGENT_HEARTBEAT_TIMEOUT_MS);
  }

 function AGENT_datetime_display ( value )
  { var date = AGENT_parse_datetime(value);
    return (date ? date.toLocaleString() : "-");
  }

 function AGENT_heartbeat_display ( value )
  { var date = AGENT_parse_datetime(value);
    return (date ? date.toLocaleString() : "Aucun heartbeat reçu");
  }

 function AGENT_live_dispatch ( type, msg )
  { AGENT_live_subscribers.slice().forEach ( function (callback) { callback(type, msg); } ); }

 function AGENT_live_on_message ( type, msg )
  { if (!msg || !msg.agent_tech_id) return;
    var live = AGENT_live_agents[msg.agent_tech_id] || {};
    if (type === "HEARTBEAT")
     { live.heartbeat_ms = Date.now();
       live.heartbeat_time = msg.heartbeat_time;
       live.mqtt_local_connected = !!msg.mqtt_local_connected;
       live.mqtt_received_ms = live.heartbeat_ms;
     }
    AGENT_live_agents[msg.agent_tech_id] = live;
    AGENT_live_dispatch ( type, msg );
  }

 function AGENT_live_on_connect ()
  { var reconnect = AGENT_live_was_connected;
    AGENT_live_online = true;
    AGENT_live_was_connected = true;
    Mqtt_subscribe ( "AGENT/STATUS" );
    Mqtt_subscribe ( "AGENT/HEARTBEAT" );
    if (reconnect) AGENT_live_dispatch ( "RECONNECT", null );
  }

 function AGENT_live_on_offline ()
  { AGENT_live_online = false; }

 function AGENT_live_tick ()
  { if (!AGENT_live_online || !MQTT_Client || !MQTT_Client.connected) return;
    AGENT_live_dispatch ( "TICK", null );
  }

 function AGENT_live_start ()
  { if (AGENT_live_timer) return;
    Load_mqtt();
    Mqtt_set_handler ( "AGENT", AGENT_live_on_message );
    MQTT_Client.on ( "connect", AGENT_live_on_connect );
    MQTT_Client.on ( "offline", AGENT_live_on_offline );
    MQTT_Client.on ( "close", AGENT_live_on_offline );
    AGENT_live_online = !!MQTT_Client.connected;
    if (AGENT_live_online)
     { AGENT_live_was_connected = true;
       Mqtt_subscribe ( "AGENT/STATUS" );
       Mqtt_subscribe ( "AGENT/HEARTBEAT" );
     }
    AGENT_live_timer = setInterval ( AGENT_live_tick, 1000 );
  }

 function AGENT_live_stop ()
  { if (AGENT_live_timer) { clearInterval(AGENT_live_timer); AGENT_live_timer = null; }
    if (MQTT_Client)
     { MQTT_Client.removeListener ( "connect", AGENT_live_on_connect );
       MQTT_Client.removeListener ( "offline", AGENT_live_on_offline );
       MQTT_Client.removeListener ( "close", AGENT_live_on_offline );
     }
    Mqtt_unsubscribe ( "AGENT/STATUS" );
    Mqtt_unsubscribe ( "AGENT/HEARTBEAT" );
    Mqtt_unset_handler ( "AGENT" );
    AGENT_live_online = false;
    AGENT_live_was_connected = false;
    AGENT_live_agents = {};
  }

 function AGENT_live_subscribe ( callback )
  { if (AGENT_live_subscribers.indexOf(callback) >= 0) return;
    AGENT_live_subscribers.push(callback);
    AGENT_live_start();
  }

 function AGENT_live_unsubscribe ( callback )
  { AGENT_live_subscribers = AGENT_live_subscribers.filter ( function (item) { return(item !== callback); } );
    if (!AGENT_live_subscribers.length) AGENT_live_stop();
  }

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
    tabs.push ( { path: "facilities", label: "Facilities", icon: "bug" } );

    var html = "<div class='row m-2 align-items-center'>"+
               " <div class='col-12 col-md'>"+
               "  <h3 class='mb-0 text-break'><i class='fas fa-"+def.icon+" text-primary'></i> "+htmlEncode(agent_tech_id)+
               "   <small class='text-muted fs-6'>"+htmlEncode(def.label)+"</small> <span id='idAgentHeaderBadges'></span></h3>"+
               "  <div class='text-muted small text-break' id='idAgentHeaderInfo'></div>"+
               " </div>"+
               " <div class='col-12 col-md-auto ms-md-auto d-flex flex-wrap align-items-center gap-2 justify-content-end' id='idAgentHeaderActions'></div>"+
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
    if (AGENT_header_callback) AGENT_live_unsubscribe ( AGENT_header_callback );
    AGENT_header_agent = null;
    AGENT_header_alive = null;
    AGENT_header_tech_id = agent_tech_id;
    AGENT_header_callback = function ( type, msg )
     { if (type === "RECONNECT")
        { AGENT_Header_refresh ( classe, agent_tech_id ); return; }
       if (!AGENT_header_agent) return;
       if (type === "HEARTBEAT" || type === "STATUS")
        { if (!msg || msg.agent_tech_id !== agent_tech_id) return;
          AGENT_live_apply ( AGENT_header_agent );
          if (type === "STATUS") AGENT_header_agent.agent_status = msg.status || "-";
          AGENT_Header_render ( classe );
          AGENT_header_alive = AGENT_is_alive ( AGENT_header_agent );
        }
       else if (type === "TICK")
        { var alive = AGENT_is_alive ( AGENT_header_agent );
          if (alive !== AGENT_header_alive)
           { AGENT_header_alive = alive; AGENT_Header_render ( classe ); }
        }
     };
    AGENT_live_subscribe ( AGENT_header_callback );
    AGENT_Header_refresh ( classe, agent_tech_id );
    window.Unload_page = AGENT_Header_unload;
  }

 function AGENT_Header_refresh ( classe, agent_tech_id )
  { Send_to_API ( "GET", "/agent/get", "agent_tech_id="+encodeURIComponent(agent_tech_id), function (agent)
    { if (AGENT_header_tech_id !== agent_tech_id) return;
      AGENT_header_agent = AGENT_heartbeat_load ( agent );
       AGENT_header_alive = AGENT_is_alive ( agent );
       AGENT_Header_render ( classe );
     }, null );
  }

 function AGENT_Header_render ( classe )
  { var agent = AGENT_header_agent;
    if (!agent) return;
    var alive = AGENT_is_alive(agent);
    var heartbeat = AGENT_heartbeat_display(agent.heartbeat_time);
    var badges = Badge ( alive ? "success" : (agent.enable ? "danger" : "secondary"), "Dernier heartbeat : "+heartbeat, alive ? "UP" : "DOWN" );
    if (!agent.enable) badges += " " + Badge ( "secondary", "Agent désactivé", "Désactivé" );
    $('#idAgentHeaderBadges').html(badges);
    $('#idAgentHeaderInfo').text ( (agent.description || "-") + " · serveur " + (agent.server_hostname || "-") +
                                   " · version " + (agent.version || "-") );

    var id = htmlEncode(agent.agent_tech_id);
    var actions = Switch ( "idAgentHeaderEnable", "Activer/Désactiver l'agent", agent.enable, "agent-header-enable", "" ) +
                  "<div class='flex-shrink-0 mw-100' style='width: 9rem;'>"+AGENT_log_level_selector ( agent.agent_tech_id, agent.log_level )+"</div>" +
                  "<div class='flex-shrink-0'>" +
                  Bouton_deroulant_start() +
                  Bouton_deroulant_add ( "warning", "Tester",     "AGENT_test",    id, "vial" ) +
                  Bouton_deroulant_add ( "warning", "Upgrader",   "AGENT_upgrade", id, "upload" ) +
                  Bouton_deroulant_add ( "warning", "Redémarrer", "AGENT_restart", id, "sync-alt" ) +
                  (alive ? Bouton_deroulant_add ( "danger",  "Arrêter",  "AGENT_stop",  id, "stop" )
                         : Bouton_deroulant_add ( "success", "Démarrer", "AGENT_start", id, "play" )) +
                  Bouton_deroulant_add_spacer() +
                  Bouton_deroulant_add ( "danger", "Supprimer l'agent", "AGENT_delete", id, "trash", "'"+htmlEncode(classe)+"'" ) +
                  Bouton_deroulant_end() + "</div>";
    $('#idAgentHeaderActions').html(actions);
    $('#idAgentHeaderEnable').off('change').on('change', function ()
     { if ($(this).is(':checked')) AGENT_set_enable(agent.agent_tech_id);
                              else AGENT_set_disable(agent.agent_tech_id);
     });
  }

 function AGENT_Header_unload ()
  { if (AGENT_header_callback) AGENT_live_unsubscribe ( AGENT_header_callback );
    AGENT_header_callback = null;
    AGENT_header_agent = null;
    AGENT_header_alive = null;
    AGENT_header_tech_id = null;
    AGENT_on_change = null;
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
