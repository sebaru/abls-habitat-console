
/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  { console.log ("in load dashboard !");

    Send_to_API ( "POST", "/domain/status", null, function (Response)
     { console.debug(Response);
       $("#idNbrSyns").text(Response.nbr_syns);
       $("#idNbrSynsMotifs").text(Response.nbr_syns_motifs);
       $("#idNbrSynsLiens").text(Response.nbr_syns_liens);
       $("#idNbrDls").text(Response.nbr_dls);
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
  }
