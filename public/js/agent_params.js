/* agent_params.js
 * Onglet Paramètres d'un agent : formulaire construit depuis AGENT_CLASSES.
 */

 var AGENTPARAMS_agent = null;

/********************************************* Recharge les valeurs enregistrées **********************************************/
 function AGENTPARAMS_Refresh ()
  { if (!AGENTPARAMS_agent) return;
    AGENT_Load_config ( AGENTPARAMS_agent.classe, AGENTPARAMS_agent.agent_tech_id, function (data)
     { AGENT_Form_fill ( "idAgentParams", AGENTPARAMS_agent.classe, data );
       $('#idAgentParamsTechID').val ( AGENTPARAMS_agent.agent_tech_id );
     });
  }
/********************************************* Enregistre les paramètres ******************************************************/
 function AGENTPARAMS_Set ()
  { var request = AGENT_Form_payload ( "idAgentParams", AGENTPARAMS_agent.classe );
    Send_to_API ( "POST", AGENT_class(AGENTPARAMS_agent.classe).set, request,
                  function () { Show_toast_ok ( "Modifications sauvegardées." ); AGENT_changed(); },
                  function () { Show_shell_error ( "Erreur à la sauvegarde des paramètres de "+request.agent_tech_id+"." ); } );
  }
/********************************************* Appelé au chargement de la page ************************************************/
 function Load_page ()
  { AGENTPARAMS_agent = AGENT_from_path();
    if (!AGENTPARAMS_agent) { Redirect("/agents"); return; }
    var classe = AGENTPARAMS_agent.classe;
    if (!AGENT_class(classe).set) { Redirect ( AGENT_url ( classe, AGENTPARAMS_agent.agent_tech_id ) ); return; }

    AGENT_Header ( classe, AGENTPARAMS_agent.agent_tech_id, "parametres" );
    $('#idAgentParamsForm').html ( AGENT_Form_html ( "idAgentParams", classe ) );
    $('#idAgentParamsTechID').prop ( "disabled", true );
    AGENTPARAMS_Refresh();
  }
