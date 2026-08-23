/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  {
    Send_to_API ( 'GET', "/domain/get", "domain_uuid="+localStorage.getItem("domain_uuid"), function (Response)
     {
       $("#idAGENTLinkDebian").text(
         "# Debian / Raspbian\n"+
         "source /etc/os-release\n"+
         "sudo wget -O /etc/apt/sources.list.d/abls-pkgs.sources https://pkgs.abls-habitat.fr/abls-pkgs-${VERSION_CODENAME}.sources\n"+
         "sudo apt update\n"+
         "sudo apt install -y abls-agent-server"
       );

       $("#idAGENTLinkFedora").text(
         "# Fedora / RHEL\n"+
         "sudo wget -O /etc/yum.repos.d/abls-rpms.repo https://pkgs.abls-habitat.fr/abls-rpms.repo\n"+
         "sudo rpm --import https://pkgs.abls-habitat.fr/rpms/keys/RPM-GPG-KEY-ABLS\n"+
         "sudo dnf makecache\n"+
         "sudo dnf install -y abls-agent-server"
       );

       $("#idAGENTLinkDomain").text(
         "# Lier l'agent au domaine\n"+
         "sudo abls-agent-server --save"+
         " --api-url " + Response.api_url +
         " --domain-uuid " + localStorage.getItem("domain_uuid") +
         " --domain-secret '" + Response.domain_secret + "'\n"+
         "sudo systemctl enable --now abls-agent-server.service"
       );
     }, null );
  }
/******************************************************************************************************************************/
