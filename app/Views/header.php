<!doctype html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <title>ABLS Console</title>

        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="google" content="notranslate">
        <meta name="robots" content="noindex, nofollow">
        <link rel="icon" href="https://static.abls-habitat.fr/img/abls.svg">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.21/fh-3.1.7/r-2.2.5/datatables.min.css"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.59.2/codemirror.min.css">
        <style>
        input:focus { outline: 0 0 0 0  !important;
                      box-shadow: 0 0 0 0 !important;
                    }


        .navbar { background-color: rgba(30,28,56,0.8);
                }
        .toast { transform: translateX(-50%); }
        .nav-link {
                  }
        .nav-link:hover { /*color: white !important; attention, cible aussi les nav-tabs */
                          background-color: #48BBC0;
                        }
        .courbe-dashboard { height: 300px; }

        .wtd-synoptique-preview { height: 80px; }
        .wtd-img-bit-interne { width: 40px; }
        .wtd-img-card { object-fit: contain; height: 196px; max-width: 196px; padding: 10px; }
      </style>

      <script>
        var $ABLS_API      = "<?php echo getenv("ABLS_API"); ?>";
        var $IDP_REALM     = "<?php echo getenv("IDP_REALM"); ?>";
        var $IDP_URL       = "<?php echo getenv("IDP_URL"); ?>";
        var $IDP_CLIENT_ID = "<?php echo getenv("IDP_CLIENT_ID"); ?>";
      </script>
    </head>

    <body class="d-none">

<div class="position-fixed" style="top: 3rem; left: 50%; z-index:9999">
  <div id="idToastStatusOK" data-delay="3000" class="toast hide bg-primary" role="status">
   <div class="toast-header">
     <strong class="mr-auto"> R??sultat de la commande</strong>
     <!--<small>11 mins ago</small>-->
     <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
       <span aria-hidden="true">&times;</span>
     </button>
   </div>
   <div class="toast-body text-light">
     <i class="fas fa-check-circle"></i> <span id="idToastStatusOKLabel">Succ??s !</span>
   </div>
  </div>
</div>

<div class="position-fixed" style="top: 3rem; left: 50%; z-index:9999">
  <div id="idToastStatusKO" data-delay="3000" class="toast hide bg-danger" role="status">
   <div class="toast-header">
     <strong class="mr-auto"> R??sultat de la commande</strong>
     <!--<small>11 mins ago</small>-->
     <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
       <span aria-hidden="true">&times;</span>
     </button>
   </div>
   <div class="toast-body text-dark">
     <i class="fas fa-check-circle"></i> <span id="idToastStatusKOLabel">Erreur !</span>
   </div>
  </div>
</div>

<div id="idModalError" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header bg-warning">
        <h5 class="modal-title text-justify"><i class="fas fa-exclamation-circle"></i>Erreur</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p id="idModalDetail">Une erreur est survenue !</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<div id="idModalInfo" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header bg-info">
        <h5 class="modal-title text-justify"><i class="fas fa-info-circle"></i>Information</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p id="idModalInfoDetail">Une information est disponible</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<div id="idModalDel" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content ">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title text-justify"><i class="fas fa-trash"></i> <span id="idModalDelTitre"></span></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p id="idModalDelMessage"></p>
       <hr>
        <strong id="idModalDelDetails"></strong>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fas fa-times"></i> Annuler</button>
        <button id="idModalDelValider" type="button" class="btn btn-danger" data-dismiss="modal"><i class="fas fa-trash"></i> Valider</button>
      </div>
    </div>
  </div>
</div>

<!------------------------------------------------- Modal Map ----------------------------------------------------------------->
<div id="idMODALMap" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content ">
      <div class="modal-header bg-info text-white">
        <h5 class="modal-title text-justify"><i class="fas fa-pen"></i> <span id="idMODALMapTitre"></span></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

       <div class="col form-group">
          <div class="input-group">
           <label class="col-5 col-sm-4 col-form-label text-right">Rechercher une Target</label>
           <input id="idMODALMapRechercherTechID" type="text" class="col-7 form-control" placeholder="Rechercher un Tech_id">
          </div>
       </div>

       <div class="col form-group">
          <div class="input-group">
           <label class="col-5 col-sm-4 col-form-label text-right">Target TechID</label>
           <select id="idMODALMapSelectTechID" required class="col-7 custom-select border-info"></select>
          </div>
       </div>

       <div class="col form-group">
          <div class="input-group">
           <label class="col-5 col-sm-4 col-form-label text-right">Target Acronyme</label>
           <select id="idMODALMapSelectAcronyme" required class="col-7 custom-select border-info"></select>
          </div>
       </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fas fa-times"></i> Annuler</button>
        <button id="idMODALMapValider" type="button" class="btn btn-primary"><i class="fas fa-save"></i> Valider</button>
      </div>
    </div>
  </div>
</div>

<?php if ( getenv("CI_ENVIRONMENT") == "development" ) { echo "<div class='alert alert-warning'>Instance de DEV</div>"; } ?>
<!----------------------------------------------------------------------------------------------------------------------------->
<header>
 <nav class="navbar navbar-dark  navbar-expand-lg sticky-top shadow mb-2"> <!-- fixed-top -->
  <a class="navbar-brand" href="/"><img src="https://static.abls-habitat.fr/img/abls.svg" alt="ABLS Logo" width=50></a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-toggled" aria-controls="navbar-toggled" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbar-toggled">
    <ul class="navbar-nav mr-auto">

      <li class="nav-item dropdown">
        <a class="nav-link rounded dropdown-toggle" href="#" id="navbarDOMAINE" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-fort-awesome text-primary"></i> <span id="idNavDomainName">Domaine</span>
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDOMAINE">
          <a class="dropdown-item" href="/agent"><i class="fas fa-crown text-danger"></i> <span>Agents</span></a>
          <a class="dropdown-item" href="/process"><i class="fas fa-microchip text-primary"></i> <span>Processus</span></a>
          <a class="dropdown-item" href="/archive"><i class="fas fa-database text-secondary"></i> <span>Archivage</span></a>
          <a class="dropdown-item" href="/dashboard_courbes"> <i class="fas fa-chart-line text-secondary"></i> <span>Courbes</span> </a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="/domains"> <i class="fas fa-fort-awesome text-primary"></i> <span>Mes domaines</span> </a>
      </li>

      <a class="nav-link rounded" href="/dashboard"> <i class="fas fa-tachometer-alt text-primary"></i> Dashboard</a>

      <li class="nav-item dropdown">
        <a class="nav-link rounded dropdown-toggle" href="#" id="navbarCONFIG" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-wrench text-primary"></i> Configuration
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarCONFIG">
          <a class="dropdown-item" href="/synoptiques"> <i class="fas fa-image text-danger"></i> <span>Synoptiques</span> </a>
          <a class="dropdown-item" href="/dls"> <i class="fas fa-code text-primary"></i> <span>Modules D.L.S</span> </a>
          <a class="dropdown-item" href="/tableau"> <i class="fas fa-chart-line text-secondary"></i> <span>Tableaux</span> </a>
        </div>
      </li>

      <a class="nav-link rounded" href="/io_config"><i class="fas fa-link text-primary"></i> <span>Connecteurs</span></a>

    </ul>

    <ul class="navbar-nav">

      <div class="mt-1 spinner-border text-primary ClassLoadingSpinner" style="display:none" role="status">
        <span class="sr-only">Loading...</span>
      </div>

      <a class="nav-link rounded" href="/search"><i class="fas fa-search text-primary"></i> <span> Dictionnaire</span></a>

      <li class="nav-item dropdown">
        <a class="nav-link rounded dropdown-toggle ml-2" href="#" id="navbarDOCS" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-book text-primary"></i> Documentation</span>
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarUSER">
          <a class="dropdown-item" href="https://docs.abls-habitat.fr"><i class="fas fa-book"></i> <span> Portail de documentation</span></a>
          <a class="dropdown-item" href="https://docs.abls-habitat.fr/guide_demarrage/#installation-dun-agent" target="_blank">
            <i class="fas fa-crown text-primary"></i> <span>Installer un agent</span>
          </a>
        </div>

      </li>


      <li class="nav-item dropdown">
        <a class="nav-link rounded dropdown-toggle ml-2" href="#" id="navbarUSER" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-user  text-warning"></i> <span id="idUsername">-</span>
        </a>

        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarUSER">
          <a class="dropdown-item" href="/user/me" id="idHrefUsername"><i class="fas fa-user text-info"></i> Mon Profil</a>
          <a class="dropdown-item" href="/user/invite"><i class="fas fa-user-friends text-info"></i> Inviter</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="/user/list"><i class="fas fa-users-cog text-info"></i> <span>Utilisateurs</span></a>
          <a class="dropdown-item" href="/log"><i class="fas fa-binoculars text-warning"></i> <span>Audit Log</span></a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#" onclick="Logout()"><i class="fas fa-sign-out-alt text-danger"></i> <span>Sortir</span> </a>
        </div>
      </li>
    </ul>

  </div>
</nav>
</header>
