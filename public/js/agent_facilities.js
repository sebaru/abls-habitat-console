/* agent_facilities.js
 * Onglet Facilities d'un agent : forçage du debug par facility de log.
 */

 var AGENTFAC_agent = null;

/********************************************* Filtre les lignes par nom de facility *******************************************/
 function AGENTFAC_Filter ()
  { var filtre = ($('#idAgentFacilitiesFilter').val() || "").trim().toLowerCase();
    $('#idAgentFacilitiesBody tr').each ( function ()
     { $(this).toggle ( String($(this).data('name')).toLowerCase().indexOf(filtre) !== -1 ); } );
  }
/********************************************* Envoi d'un changement d'état ***************************************************/
 function AGENTFAC_Set ( input )
  { var enable = $(input).is(':checked');
    var name   = $(input).data('name');
    Send_to_API ( "POST", "/log/facility/set",
                  { agent_tech_id: AGENTFAC_agent.agent_tech_id, log_facility_id: parseInt($(input).data('id')), enable: enable },
                  function () { Show_toast_ok ( "Facility "+name+(enable ? " activée." : " désactivée.") ); },
                  function () { $(input).prop ( 'checked', !enable ); } );
  }
/********************************************* Recharge le catalogue et l'état de l'agent *************************************/
 function AGENTFAC_Refresh ()
  { if (!AGENTFAC_agent) return;
    Send_to_API ( "GET", "/log/facility/list", null, function (Catalogue)
     { Send_to_API ( "GET", "/log/facility/get", "agent_tech_id="+encodeURIComponent(AGENTFAC_agent.agent_tech_id), function (Agent)
        { var enabled = {};
          (Agent.log_facilities || []).forEach ( function (f) { enabled[f.log_facility_id] = true; } );
          var html = "";
          (Catalogue.log_facilities || []).forEach ( function (f)
           { html += "<tr data-name='"+htmlEncode(f.log_facility)+"'><td>"+htmlEncode(f.log_facility)+"</td><td>"+
                     Switch ( "idAgentFacility"+f.log_facility_id, "Forcer le debug de "+f.log_facility,
                              enabled[f.log_facility_id] === true, "agent-facility-switch",
                              "data-id='"+parseInt(f.log_facility_id)+"' data-name='"+htmlEncode(f.log_facility)+"'" )+
                     "</td></tr>";
           });
          $('#idAgentFacilitiesBody').html ( html );
          $('#idAgentFacilitiesBody .agent-facility-switch').on ( 'change', function () { AGENTFAC_Set ( this ); } );
          AGENTFAC_Filter();
        }, null );
     }, null );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { AGENTFAC_agent = AGENT_from_path();
    if (!AGENTFAC_agent) { Redirect("/agents"); return; }
    AGENT_Header ( AGENTFAC_agent.classe, AGENTFAC_agent.agent_tech_id, "facilities" );
    AGENTFAC_Refresh();
  }
