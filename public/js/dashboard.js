/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  { console.log ("in load dashboard !");

    Send_to_API ( "GET", "/domain/status", null, function (Response)
     { console.debug(Response);
       $("#idNbrSyns").text(Response.nbr_syns);
       $("#idNbrSynsMotifs").text(Response.nbr_syns_motifs);
       $("#idNbrSynsLiens").text(Response.nbr_syns_liens);
       $("#idNbrDls").text(Response.nbr_dls);
       $("#idNbrDlsError").text(Response.nbr_dls_error);
       $("#idNbrDlsLignes").text(Response.nbr_dls_lignes);
       $("#idNbrDlsDI").text(Response.nbr_dls_di);
       $("#idNbrDlsDO").text(Response.nbr_dls_do);
       $("#idNbrDlsAI").text(Response.nbr_dls_ai);
       $("#idNbrDlsAO").text(Response.nbr_dls_ao);
       $("#idNbrDlsBI").text(Response.nbr_dls_bi);
       $("#idNbrDlsMONO").text(Response.nbr_dls_mono);
       $("#idNbrDlsMsgs").text(Response.nbr_dls_msgs);
       $("#idDlsCompilTime").text(Response.dls_compil_time/10.0);
       $("#idNbrUsers").text(Response.nbr_users);
       $("#idNbrAuditLog").text(Response.nbr_audit_log);
       $("#idNbrSessions").text(Response.nbr_sessions);
       $("#idNbrHistoMsgs").text(Response.nbr_histo_msgs);

       $("#idArchDBHostname").text(Response.db_arch_hostname);
       $("#idArchDBPort").text(Response.db_arch_port);
       $("#idArchRetention").text(Response.archive_retention);

       $("#idDBHostname").text(Response.db_hostname);
       $("#idDBPort").text(Response.db_port);

       $("#idNbrAgents").text(Response.nbr_agents);
       $("#idNbrServers").text(Response.nbr_servers);

       $("#idCacheHits").text(Response.cache_hits);
       $("#idCacheMisses").text(Response.cache_misses);
       $("#idCacheErrors").text(Response.cache_errors);
       $("#idCacheHitRatio").text(Response.cache_hit_ratio.toFixed(1));
       $("#idCacheGeneration").text(Response.cache_generation);
       $("#idMasterCacheHits").text(Response.master_cache_hits);
       $("#idMasterCacheMisses").text(Response.master_cache_misses);
       $("#idMasterCacheErrors").text(Response.master_cache_errors);
       $("#idMasterCacheHitRatio").text(Response.master_cache_hit_ratio.toFixed(1));
     });

    Charger_une_courbe ( "idCourbeDlsTourParSec", "SYS", "TOUR_PAR_SEC", "BY_10_MINUTE_ON_3_DAYS", "AVG" );
    Charger_une_courbe ( "idCourbeDlsBitParMin",  "SYS", "BIT_PAR_MIN", "BY_10_MINUTE_ON_3_DAYS", "AVG" );
    Charger_une_courbe ( "idCourbeDlsAttente",    "SYS", "DLS_WAIT", "BY_10_MINUTE_ON_3_DAYS", "MAX" );
    Charger_une_courbe ( "idCourbeDlsNbMotifs",   "SYS", "NBR_MOTIFS", "BY_HOUR_ON_2_WEEKS", "MAX" );
    Charger_une_courbe ( "idCourbeDlsNbPlugins",  "SYS", "NBR_DLS", "BY_HOUR_ON_2_WEEKS", "MAX" );
    Charger_une_courbe ( "idCourbeDlsNbErrors",   "SYS", "NBR_DLS_ERROR", "BY_HOUR_ON_2_WEEKS", "MAX" );
    Charger_une_courbe ( "idCourbeDlsNbLigne",    "SYS", "NBR_LIGNE_DLS", "BY_HOUR_ON_2_WEEKS", "MAX" );
    Charger_une_courbe ( "idCourbeNbCleanup",     "SYS", "NBR_CLEANUP", "BY_10_MINUTE_ON_3_DAYS", "MAX" );
    Charger_une_courbe ( "idCourbeDlsVirtMem",    "SYS", "MEMORY_VIRTUAL", "BY_HOUR_ON_2_WEEKS", "MAX" );
    Charger_une_courbe ( "idCourbeDlsRssMem",     "SYS", "MEMORY_RSS", "BY_HOUR_ON_2_WEEKS", "MAX" );
    Charger_une_courbe ( "idCourbeDlsLogParMin",  "SYS", "LOG_PER_MIN", "BY_10_MINUTE_ON_3_DAYS", "MAX" );
  }
