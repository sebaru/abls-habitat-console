 var API_Status_timer = null;
/********************************************* Formate une durée en secondes **************************************************/
 function API_Status_Format_uptime ( secondes )
  { var jours    = Math.floor ( secondes / 86400 );
    var heures   = Math.floor ( (secondes % 86400) / 3600 );
    var minutes  = Math.floor ( (secondes % 3600) / 60 );
    var result = "";
    if (jours)  result += jours + "j ";
    if (jours || heures) result += heures + "h ";
    result += minutes + "min " + (secondes % 60) + "s";
    return(result);
  }
/********************************************* Positionne un badge Oui/Non ****************************************************/
 function API_Status_Set_badge ( id, etat, label_ok, label_nok, classe_nok )
  { $('#'+id).removeClass ( "text-bg-secondary text-bg-success text-bg-danger text-bg-warning" )
             .addClass ( etat ? "text-bg-success" : classe_nok )
             .text ( etat ? label_ok : label_nok );
  }
/********************************************* Positionne une barre de charge *************************************************/
 function API_Status_Set_bar ( id, valeur, max )
  { var pourcent = (max > 0 ? Math.min ( 100, Math.round ( 100 * valeur / max ) ) : 0);
    var classe = "bg-success";
    if (pourcent >= 90) classe = "bg-danger";
    else if (pourcent >= 70) classe = "bg-warning";
    $('#'+id).removeClass ( "bg-success bg-warning bg-danger" ).addClass ( classe )
             .css ( "width", pourcent + "%" ).text ( pourcent + "%" );
  }
/********************************************* Affiche le status de l'API *****************************************************/
 function API_Status_Display ( Response )
  { $('#idApiStatusProduct').val ( Response.product );
    $('#idApiStatusVersion').val ( Response.version );
    $('#idApiStatusVendor').val  ( Response.vendor );
    $('#idApiStatusDocs').attr ( "href", Response.docs ).text ( Response.docs );

    $('#idApiStatusStartTime').val ( new Date ( Response.start_time * 1000 ).toLocaleString() );
    $('#idApiStatusUptime').val ( API_Status_Format_uptime ( Response.uptime ) );
    API_Status_Set_badge ( "idApiStatusMqtt",    Response.mqtt_connected,   "Connecté", "Déconnecté", "text-bg-danger" );
    API_Status_Set_badge ( "idApiStatusDbCache", Response.db_cache_enabled, "Actif",    "Désactivé",  "text-bg-warning" );

    $('#idApiStatusMasterCacheHits').val     ( Response.master_cache_hits );
    $('#idApiStatusMasterCacheMisses').val   ( Response.master_cache_misses );
    $('#idApiStatusMasterCacheErrors').val   ( Response.master_cache_errors );
    $('#idApiStatusMasterCacheHitRatio').val ( Response.master_cache_hit_ratio.toFixed(1) );

    $('#idApiStatusIdpUrl').val   ( Response.idp_url );
    $('#idApiStatusIdpRealm').val ( Response.idp_realm );
    $('#idApiStatusWhisperUrl').val ( Response.whisper_url );

    $('#idApiStatusNbrDomains').val ( Response.nbr_domains );
    $('#idApiStatusNbrIcons').val   ( Response.nbr_icons );

    $('#idApiStatusHttpBusyText').text ( Response.http_pool_busy + " / " + Response.http_pool_thread_nbr );
    API_Status_Set_bar ( "idApiStatusHttpBusyBar", Response.http_pool_busy, Response.http_pool_thread_nbr );
    $('#idApiStatusHttpQueueText').text ( Response.http_pool_queued + " / " + Response.http_pool_queue_max );
    API_Status_Set_bar ( "idApiStatusHttpQueueBar", Response.http_pool_queued, Response.http_pool_queue_max );

    $('#idApiStatusDlsBusyText').text ( Response.dls_compil_pool_busy + " / " + Response.dls_compil_pool_thread_nbr );
    API_Status_Set_bar ( "idApiStatusDlsBusyBar", Response.dls_compil_pool_busy, Response.dls_compil_pool_thread_nbr );
    $('#idApiStatusDlsQueueText').text ( Response.dls_compil_pool_queued );
  }
/********************************************* Interroge l'API ****************************************************************/
 function API_Status_Load ()
  { Send_to_API ( "GET", "/status", null, API_Status_Display, null ); }
/********************************************* Active ou non le rafraichissement **********************************************/
 function API_Status_Set_auto_refresh ( enable )
  { if (API_Status_timer) { clearInterval ( API_Status_timer ); API_Status_timer = null; }
    if (enable) API_Status_timer = setInterval ( API_Status_Load, 5000 );
  }
/******************************************************************************************************************************/
/* Unload_page: Appelé par le routeur quand on quitte la page                                                                 */
/******************************************************************************************************************************/
 function Unload_page ()
  { API_Status_Set_auto_refresh ( false ); }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { if (localStorage.getItem("access_level") < 6)
     { Show_shell_error ( "Accès réservé aux utilisateurs de niveau 6 minimum." ); return; }
    $('#idApiStatusAutoRefresh').off("change").on("change", function () { API_Status_Set_auto_refresh ( this.checked ); } );
    API_Status_Load();
    API_Status_Set_auto_refresh ( $('#idApiStatusAutoRefresh').is(":checked") );
  }
