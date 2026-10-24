/******************************************************************************************************************************/
/* CONSOLE/js/common_mqtt.js  Connexion MQTT websocket du navigateur technicien                                               */
/* Projet Abls-Habitat                   Gestion d'habitat                                                01.10.2026 12:00:00 */
/* Auteur: LEFEVRE Sebastien                                                                                                  */
/******************************************************************************************************************************/
 var MQTT_Client = null;
 var MQTT_handlers = {};                                                      /* tag du topic -> fonction (target, Response) */

 function Mqtt_set_status ( label, style )
  { var indicator = document.getElementById("idMqttStatus");
    if (!indicator) return;
    indicator.textContent = label;
    indicator.className = "badge "+style+" ms-2";
  }

/******************************************************************************************************************************/
/* Mqtt_subscribe: Souscrit à un topic, relatif au préfixe 'browsers' du domaine                                              */
/******************************************************************************************************************************/
 function Mqtt_subscribe ( topic )
  { if (!MQTT_Client) return;
    var full_topic = localStorage.getItem("domain_uuid") + "/browsers/" + topic;
    MQTT_Client.subscribe( full_topic, function (err)
     { if (err) console.log ( "MQTT Subscribe to " + full_topic + " error: " + err );
       else     console.log ( "MQTT Subscribed to " + full_topic );
     });
  }
/******************************************************************************************************************************/
/* Mqtt_unsubscribe: Résilie la souscription à un topic                                                                       */
/******************************************************************************************************************************/
 function Mqtt_unsubscribe ( topic )
  { if (!MQTT_Client) return;
    var full_topic = localStorage.getItem("domain_uuid") + "/browsers/" + topic;
    MQTT_Client.unsubscribe( full_topic, function (err)
     { if (err) console.log ( "MQTT Unsubscribe to " + full_topic + " error: " + err );
       else     console.log ( "MQTT UnSubscribed to " + full_topic );
     });
  }
/******************************************************************************************************************************/
/* Mqtt_set_handler: Déclare la fonction de traitement des messages d'un tag                                                  */
/******************************************************************************************************************************/
 function Mqtt_set_handler ( tag, callback )
  { MQTT_handlers[tag] = callback; }
/******************************************************************************************************************************/
/* Mqtt_unset_handler: Retire la fonction de traitement des messages d'un tag                                                 */
/******************************************************************************************************************************/
 function Mqtt_unset_handler ( tag )
  { delete MQTT_handlers[tag]; }
/******************************************************************************************************************************/
/* Load_mqtt: Ouvre la websocket MQTT si elle ne l'est pas déjà                                                               */
/******************************************************************************************************************************/
 function Load_mqtt ()
  { if (MQTT_Client) return;
    Mqtt_set_status ( "Connexion MQTT...", "text-bg-warning" );

    var domain_uuid = localStorage.getItem("domain_uuid");
    var methode = (localStorage.getItem("mqtt_over_ssl") == 1 ? "wss" : "ws");
    var url = methode + "://" + localStorage.getItem("mqtt_hostname") + ":" + localStorage.getItem("mqtt_port");
    console.log( "MQTT connecting " + domain_uuid + "-browser to " + url );

    MQTT_Client = mqtt.connect( url, { protocolId: 'MQTT', clean: true, keepalive: 30,
                                       connectTimeout: 4000, reconnectPeriod: 10000,
                                       username: domain_uuid + "-browser",
                                       password: sessionStorage.getItem("browser_password"),
                                     });

    MQTT_Client.on('connect',    function ()      { console.log('MQTT Connected'); Mqtt_set_status ( "MQTT en ligne", "text-bg-success" ); });
    MQTT_Client.on('reconnect',  function ()      { Mqtt_set_status ( "MQTT reconnexion", "text-bg-warning" ); });
    MQTT_Client.on('offline',    function ()      { Mqtt_set_status ( "MQTT hors ligne", "text-bg-danger" ); });
    MQTT_Client.on('close',      function ()      { Mqtt_set_status ( "MQTT hors ligne", "text-bg-danger" ); });
    MQTT_Client.on('disconnect', function ()      { console.log('MQTT Disconnected'); Mqtt_set_status ( "MQTT déconnecté", "text-bg-danger" ); });
    MQTT_Client.on('error',      function (error) { console.log('MQTT Error: ' + error); Mqtt_set_status ( "Erreur MQTT", "text-bg-danger" ); });

    MQTT_Client.on('message', function (topic, message)
     { var topics = topic.split("/");
       if (topics[0] != localStorage.getItem("domain_uuid")) return;
       if (topics[1] != "browsers") return;
       var handler = MQTT_handlers[ topics[2] ];
       if (!handler) return;
       try { handler ( topics[3], JSON.parse(message) ); }
       catch (e) { console.log("MQTT message error on " + topic + ": " + e); }
     });
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
