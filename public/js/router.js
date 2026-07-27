/* router.js — Routeur SPA pour ABLS Habitat Console
 * Gère la navigation côté client sans rechargement de page.
 * Écoute l'événement 'keycloak-ready' émis par common.js après l'authentification. */

var Router = (function () {

  var BASE_TITLE = 'ABLS Console';
  var currentPageScript = null;
  var currentPath = window.location.pathname || '/';
  var currentRoute = null;
  var currentPageContext = {};

  /* Table des routes : ordre identique à app/Config/Routes.php (premier match gagne).
   * view      : nom du fichier dans /views/ (sans extension .html)
   * script    : nom du fichier dans /js/   (sans extension .js), null si pas de script de page
   * breadcrumb: segments affiches dans le fil d'Ariane */
  var ROUTES = [
    {
      pattern:    /^\/dashboard$/,
      view:       'dashboard',
      script:     'dashboard',
      breadcrumb: []
    },
    {
      pattern:    /^\/io$/,
      view:       'io',
      script:     null,
      breadcrumb: [ { label: 'Connecteurs et Mappings', href: null } ]
    },
    {
      pattern:    /^\/domain_maintenance$/,
      view:       'domain_maintenance',
      script:     'domain_maintenance',
      breadcrumb: [ { label: 'Maintenances du domaine', href: null } ]
    },
    {
      pattern:    /^\/domain\/[^/]+$/,
      view:       'domain_edit',
      script:     'domain_edit',
      breadcrumb: [ { label: 'Liste de mes domaines', href: '/domains' }, { label: 'Editer le domaine', href: null } ]
    },
    {
      pattern:    /^\/domains$/,
      view:       'domains',
      script:     'domains',
      breadcrumb: [ { label: 'Liste de mes domaines', href: null } ]
    },
    {
      pattern:    /^\/server\/add$/,
      view:       'agent_add',
      script:     'agent_add',
      breadcrumb: [ { label: 'Liste des Serveurs', href: '/servers' }, { label: 'Ajouter un serveur au domaine', href: null } ]
    },
    {
      pattern:    /^\/agent\/[^/]+$/,
      view:       'agent_monitor',
      script:     'agent_monitor',
      breadcrumb: [ { label: 'Liste des Agents', href: '/agents' }, { label: 'Monitoring agent', href: null } ]
    },
    {
      pattern:    /^\/io\/phidget$/,
      view:       'io_phidget_class',
      script:     'io_phidget_class',
      breadcrumb: [ { label: 'Connecteurs et Mappings', href: '/io' }, { label: 'Liste des HUB5000 Phidgets', href: null } ]
    },
    {
      pattern:    /^\/io\/phidget\/[^/]+$/,
      view:       'io_phidget_conf',
      script:     'io_phidget_conf',
      breadcrumb: [ { label: 'Connecteurs et Mappings', href: '/io' }, { label: 'Liste des HUB5000 Phidgets', href: '/io/phidget' }, { label: 'Configuration I/O Phidget', href: null } ]
    },
    {
      pattern:    /^\/modbus$/,
      view:       'modbus',
      script:     'modbus',
      breadcrumb: [ { label: 'Connecteurs et Mappings', href: '/io' }, { label: 'Liste des Modules WAGO sur Modbus', href: null } ]
    },
    {
      pattern:    /^\/imsgs$/,
      view:       'imsgs',
      script:     'imsgs',
      breadcrumb: [ { label: 'Connecteurs et Mappings', href: '/io' }, { label: 'Configuration Messagerie Instantanée', href: null } ]
    },
    {
      pattern:    /^\/smsg$/,
      view:       'smsg',
      script:     'smsg',
      breadcrumb: [ { label: 'Connecteurs et Mappings', href: '/io' }, { label: 'Configuration des SMSG', href: null } ]
    },
    {
      pattern:    /^\/gpiod$/,
      view:       'gpiod',
      script:     'gpiod',
      breadcrumb: [ { label: 'Connecteurs et Mappings', href: '/io' }, { label: 'Liste des Threads GPIO', href: null } ]
    },
    {
      pattern:    /^\/search$/,
      view:       'search',
      script:     'search',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Dictionnaire', href: null } ]
    },
    {
      pattern:    /^\/audio\/zones$/,
      view:       'audio_zones',
      script:     'audio_zones',
      breadcrumb: [ { label: 'Connecteurs et Mappings', href: '/io' }, { label: 'Zones audio', href: null } ]
    },
    {
      pattern:    /^\/audio\/zone\/[^/]+$/,
      view:       'audio_zone',
      script:     'audio_zone',
      breadcrumb: [ { label: 'Connecteurs et Mappings', href: '/io' }, { label: 'Zones audio', href: '/audio/zones' }, { label: 'Édition de la zone audio', href: null } ]
    },
    {
      pattern:    /^\/audio$/,
      view:       'audio',
      script:     'audio',
      breadcrumb: [ { label: 'Connecteurs et Mappings', href: '/io' }, { label: 'Connecteurs AUDIO', href: null } ]
    },
    {
      pattern:    /^\/cameras$/,
      view:       'cameras',
      script:     'cameras',
      breadcrumb: [ { label: 'Connecteurs et Mappings', href: '/io' }, { label: 'Gestion des caméras', href: null } ]
    },
    {
      pattern:    /^\/ups$/,
      view:       'ups',
      script:     'ups',
      breadcrumb: [ { label: 'Connecteurs et Mappings', href: '/io' }, { label: 'Liste des Onduleurs', href: null } ]
    },
    {
      pattern:    /^\/agents$/,
      view:       'agents',
      script:     'agents',
      breadcrumb: [ { label: 'Liste des Agents', href: null } ]
    },
    {
      pattern:    /^\/servers$/,
      view:       'servers',
      script:     'servers',
      breadcrumb: [ { label: 'Liste des Serveurs', href: null } ]
    },
    {
      pattern:    /^\/teleinfoedf$/,
      view:       'teleinfoedf',
      script:     'teleinfoedf',
      breadcrumb: [ { label: 'Connecteurs et Mappings', href: '/io' }, { label: 'Configuration des modules Téléinfo EDF', href: null } ]
    },
    {
      pattern:    /^\/io\/shelly$/,
      view:       'io_shelly_class',
      script:     'io_shelly_class',
      breadcrumb: [ { label: 'Connecteurs et Mappings', href: '/io' }, { label: 'Liste des Modules Shelly', href: null } ]
    },
    {
      pattern:    /^\/meteo$/,
      view:       'meteo',
      script:     'meteo',
      breadcrumb: [ { label: 'Connecteurs et Mappings', href: '/io' }, { label: 'Configuration de la météo', href: null } ]
    },
    {
      pattern:    /^\/dls\/packages$/,
      view:       'dls_packages',
      script:     'dls_packages',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Liste des Packages D.L.S', href: null } ]
    },
    {
      pattern:    /^\/dls\/package\/[^/]+$/,
      view:       'dls_package',
      script:     'dls_package',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Liste des Packages D.L.S', href: '/dls/packages' }, { label: 'Edition du package D.L.S', href: null } ]
    },
    {
      pattern:    /^\/dls\/run\/[^/]+$/,
      view:       'dls_run',
      script:     'dls_run',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Etat du module', href: null } ]
    },
    {
      pattern:    /^\/dls_status$/,
      view:       'dls_status',
      script:     'dls_status',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Etat des modules D.L.S', href: null } ]
    },
    {
      pattern:    /^\/dls\/params\/[^/]+$/,
      view:       'dls_params',
      script:     'dls_params',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Paramètres du D.L.S', href: null } ]
    },
    {
      pattern:    /^\/dls\/[^/]+$/,
      view:       'dls_source',
      script:     'dls_source',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Edition D.L.S', href: null } ]
    },
    {
      pattern:    /^\/dls$/,
      view:       'dls',
      script:     'dls',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: null } ]
    },
    {
      pattern:    /^\/atelier\/[^/]+$/,
      view:       'atelier',
      script:     'atelier',
      breadcrumb: [ { label: 'Liste des Synoptiques', href: '/synoptiques' }, { label: 'Edition graphique du synoptique', href: null } ]
    },
    {
      pattern:    /^\/synoptique\/[^/]+$/,
      view:       'syn_child',
      script:     'syn_child',
      breadcrumb: [ { label: 'Liste des Synoptiques', href: '/synoptiques' }, { label: 'Réorganiser', href: '/synoptique/HOME' }, { label: 'Synoptiques fils de', href: null } ]
    },
    {
      pattern:    /^\/synoptiques$/,
      view:       'synoptiques',
      script:     'synoptiques',
      breadcrumb: [ { label: 'Liste des Synoptiques', href: null } ]
    },
    {
      pattern:    /^\/mnemos\/[^/]+$/,
      view:       'mnemos',
      script:     'mnemos',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Configuration des Mnémoniques', href: null } ]
    },
    {
      pattern:    /^\/mnemos$/,
      view:       'mnemos',
      script:     'mnemos',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Configuration des Mnémoniques', href: null } ]
    },
    {
      pattern:    /^\/tableau\/[^/]+$/,
      view:       'tableau_map',
      script:     'tableau_map',
      breadcrumb: [ { label: 'Liste des Synoptiques', href: '/synoptiques' }, { label: 'Liste des Tableaux', href: '/tableau' }, { label: 'Courbes du Tableau', href: null } ]
    },
    {
      pattern:    /^\/tableau$/,
      view:       'tableau',
      script:     'tableau',
      breadcrumb: [ { label: 'Liste des Synoptiques', href: '/synoptiques' }, { label: 'Liste des Tableaux', href: null } ]
    },
    {
      pattern:    /^\/syn_cameras$/,
      view:       'syn_cameras',
      script:     'syn_cameras',
      breadcrumb: [ { label: 'Liste des Synoptiques', href: '/synoptiques' }, { label: 'Cameras par synoptique', href: null } ]
    },
    {
      pattern:    /^\/messages\/[^/]+$/,
      view:       'messages',
      script:     'messages',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Liste des Messages', href: null } ]
    },
    {
      pattern:    /^\/messages$/,
      view:       'messages',
      script:     'messages',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Liste des Messages', href: null } ]
    },
    {
      pattern:    /^\/archive$/,
      view:       'archive',
      script:     'archive',
      breadcrumb: [ { label: 'Paramétrage des Archives', href: null } ]
    },
    {
      pattern:    /^\/log$/,
      view:       'log',
      script:     'log',
      breadcrumb: [ { label: 'Utilisateurs du domaine', href: '/users' }, { label: 'Rechercher dans les logs', href: null } ]
    },
    {
      pattern:    /^\/user\/invite$/,
      view:       'user_invite',
      script:     'user_invite',
      breadcrumb: [ { label: 'Utilisateurs du domaine', href: '/users' }, { label: 'Inviter une personne sur le domaine', href: null } ]
    },
    {
      pattern:    /^\/user\/[^/]+$/,
      view:       'user_edit',
      script:     'user_edit',
      breadcrumb: [ { label: 'Utilisateurs du domaine', href: '/users' }, { label: 'Editer l\'utilisateur', href: null } ]
    },
    {
      pattern:    /^\/users$/,
      view:       'users',
      script:     'users',
      breadcrumb: [ { label: 'Utilisateurs du domaine', href: null } ]
    },
    {
      pattern:    /^\/courbe\/[^/]+\/[^/]+(?:\/[^/]+)?$/,
      view:       'courbe',
      script:     'courbe',
      breadcrumb: [ { label: 'Voir la courbe', href: null } ]
    },
    {
      pattern:    /^\/command_text$/,
      view:       'command_text',
      script:     'command_text',
      breadcrumb: [ { label: 'Mapping des Commandes Textuelles', href: null } ]
    },
    {
      pattern:    /^\/$/,
      view:       'dashboard',
      script:     'dashboard',
      breadcrumb: []
    },
    {
      pattern:    /^\/.*$/,
      view:       'dashboard',
      script:     'dashboard',
      breadcrumb: []
    },  /* fallback */
  ];

  function normalizePath(path) {
    if (!path) return '/';
    return (path.length > 1) ? path.replace(/\/$/, '') : path;
  }

  function matchRoute(path) {
    var cleanPath = normalizePath(path);
    for (var i = 0; i < ROUTES.length; i++) {
      if (ROUTES[i].pattern.test(cleanPath)) return ROUTES[i];
    }
    return null;
  }

  function escapeHtml(value) {
    if (value === undefined || value === null) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getCurrentDomainLabel() {
    return localStorage.getItem('domain_name') || 'Domaine';
  }

  function buildRootBreadcrumbSegment(active) {
    return {
      label: getCurrentDomainLabel(),
      href: active ? null : '/dashboard',
      active: active
    };
  }

  function resolveBreadcrumb(route) {
    var routeSegments = [];

    if (route && route.breadcrumb) {
      routeSegments = route.breadcrumb.map(function (segment, index, array) {
        return {
          label: segment.label,
          href: index === array.length - 1 ? null : segment.href,
          active: index === array.length - 1
        };
      });

      if (routeSegments.length && currentPageContext.lastLabel) {
        routeSegments[routeSegments.length - 1].label = currentPageContext.lastLabel;
      }
    }

    if (!routeSegments.length && route && route.view && route.view !== 'dashboard') {
      routeSegments = [ { label: route.view.replace(/_/g, ' '), href: null, active: true } ];
    }

    if (!routeSegments.length) {
      return [ buildRootBreadcrumbSegment(true) ];
    }

    return [ buildRootBreadcrumbSegment(false) ].concat(routeSegments);
  }

  function updateDocumentTitle(segments) {
    var title = currentPageContext.title;

    if (!title && segments.length) {
      title = segments.map(function (segment) { return segment.label; }).join(' - ');
    }

    if (!title || title === getCurrentDomainLabel()) {
      document.title = BASE_TITLE;
      return;
    }

    document.title = title + ' - ' + BASE_TITLE;
  }

  function renderBreadcrumb(path, route) {
    var shell = document.getElementById('idBreadcrumbShell');
    var list = document.getElementById('idBreadcrumbList');
    var segments = resolveBreadcrumb(route);

    updateDocumentTitle(segments);

    if (!shell || !list) return;

    list.innerHTML = segments.map(function (segment) {
      if (!segment.active && segment.href) {
        return "<li class='breadcrumb-item'><a href='" + escapeHtml(segment.href) + "'>" +
               escapeHtml(segment.label) + "</a></li>";
      }

      return "<li class='breadcrumb-item active' aria-current='page'><span class='breadcrumb-last'>" +
             escapeHtml(segment.label) + "</span></li>";
    }).join('');

    shell.classList.remove('d-none');
  }

  /* Détruit les instances DataTable existantes avant de changer de vue */
  function destroyDataTables() {
    if (typeof $ !== 'undefined' && $.fn && $.fn.DataTable) {
      try { $.fn.dataTable.tables({ api: true }).destroy(); } catch (e) {}
    }
  }

  function navigate(path) {
    var route = matchRoute(path);
    if (!route) { console.warn('Router: aucune route pour', path); return; }

    currentPath = normalizePath(path);
    currentRoute = route;
    currentPageContext = {};

    destroyDataTables();
    if (typeof Hide_shell_error === 'function') Hide_shell_error();
    renderBreadcrumb(currentPath, currentRoute);

    fetch('/views/' + route.view + '.html')
      .then(function (resp) {
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        return resp.text();
      })
      .then(function (html) {
        if (html === undefined) return;
        document.getElementById('app').innerHTML = html;

        /* Retire le script de la page précédente */
        if (currentPageScript) {
          currentPageScript.parentNode && currentPageScript.parentNode.removeChild(currentPageScript);
          currentPageScript = null;
        }

        if (!route.script) return;

        /* Crée un nouveau <script> à chaque navigation pour que Load_page() soit toujours ré-exécuté */
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '/js/' + route.script + '.js';
        script.onload = function () {
          if (typeof Load_page === 'function') Load_page();
        };
        script.onerror = function () {
          console.warn('Router: script introuvable —', route.script + '.js');
        };
        document.body.appendChild(script);
        currentPageScript = script;
      })
      .catch(function (err) {
        console.error('Router: impossible de charger la vue', route.view, err);
      });
  }

  /* Navigue vers un chemin interne et met à jour l'historique du navigateur */
  function push(path) {
    history.pushState({ path: path }, '', path);
    navigate(path);
  }

  function setPageContext(lastLabel) {
    currentPageContext = {};
    if (lastLabel) currentPageContext.lastLabel = lastLabel;
    renderBreadcrumb(currentPath, currentRoute);
  }

  function init() {
    /* Intercepte les clics sur les liens internes */
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href) return;
      /* Laisser passer : liens externes, ancres, mailto, target="_blank" */
      if (href.indexOf('http') === 0 || href.indexOf('//') === 0 ||
          href.charAt(0) === '#' || href.indexOf('mailto:') === 0 ||
          link.target === '_blank') return;
      e.preventDefault();
      push(href);
    });

    /* Gère les boutons précédent/suivant du navigateur */
    window.addEventListener('popstate', function (e) {
      navigate(e.state ? e.state.path : window.location.pathname);
    });

    /* Première navigation : déclenché par common.js après la connexion Keycloak */
    window.addEventListener('keycloak-ready', function () {
      history.replaceState({ path: window.location.pathname }, '', window.location.pathname);
      navigate(window.location.pathname);
    });
  }

  return { init: init, push: push, navigate: navigate, setPageContext: setPageContext };

})();

document.addEventListener('DOMContentLoaded', function () { Router.init(); });
