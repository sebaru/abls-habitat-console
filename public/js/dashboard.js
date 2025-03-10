
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
       $("#idNbrThreads").text(Response.nbr_threads);
     });

    Charger_une_courbe ( "idCourbeDlsTourParSec", "SYS", "DLS_TOUR_PER_SEC", "HOUR" );
    Charger_une_courbe ( "idCourbeDlsBitParSec",  "SYS", "DLS_BIT_PER_SEC", "HOUR" );
    Charger_une_courbe ( "idCourbeDlsAttente",    "SYS", "DLS_WAIT", "HOUR" );
    Charger_une_courbe ( "idCourbeDlsNbMotifs",   "SYS", "NBR_MOTIFS", "MONTH" );
    Charger_une_courbe ( "idCourbeDlsNbPlugins",  "SYS", "NBR_DLS", "MONTH" );
    Charger_une_courbe ( "idCourbeDlsNbErrors",   "SYS", "NBR_DLS_ERROR", "MONTH" );
    Charger_une_courbe ( "idCourbeDlsNbLigne",    "SYS", "NBR_LIGNE_DLS", "MONTH" );
    Charger_une_courbe ( "idCourbeDlsMaxRss",     "SYS", "MAXRSS", "WEEK" );
  }
