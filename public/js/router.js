/* router.js — Routeur SPA pour ABLS Habitat Console
 * Gère la navigation côté client sans rechargement de page.
 * Écoute l'événement 'keycloak-ready' émis par common.js après l'authentification. */

var Router = (function () {

  var BASE_TITLE = 'ABLS Console';
  var currentPageScript = null;
  var currentPath = window.location.pathname || '/';
  var currentRoute = null;
  var currentPageContext = {};

  var DOCS_URL = 'https://docs.abls-habitat.fr/';
  var DOCS_AGENT_CLASSES = [ 'server', 'dls', 'modbus', 'gpiod', 'phidget', 'audio', 'sms', 'imsg',
                             'teleinfoedf', 'shelly', 'ups', 'meteo' ];

  /* Page d'aide d'une instance d'agent : 'connecteurs' (technicien) ou 'catalogue' (admin) */
  function agentHelp(section) {
    return function (path) {
      var classe = decodeURIComponent(path.split('/')[2] || '').toLowerCase();
      if (DOCS_AGENT_CLASSES.indexOf(classe) === -1) return 'technicien/console/agents/';
      /* Pas de page connecteur pour server et dls */
      if (section === 'catalogue' || classe === 'server' || classe === 'dls') return 'admin/agents/catalogue/' + classe + '/';
      return 'technicien/connecteurs/' + classe + '/';
    };
  }

  /* Fil d'Ariane des pages d'instance : Agents > {classe} > {tech_id} > {onglet} */
  function agentBreadcrumb(tabLabel) {
    return function (path) {
      var parts  = path.split('/');
      var classe = decodeURIComponent(parts[2] || '');
      var techId = decodeURIComponent(parts[3] || '').toUpperCase();
      var label  = (typeof AGENT_class === 'function') ? AGENT_class(classe).label : classe;
      return [ { label: 'Agents', href: '/agents' },
               { label: label,    href: '/agents?classe=' + encodeURIComponent(classe) },
               { label: techId,   href: '/agents/' + encodeURIComponent(classe) + '/' + encodeURIComponent(techId) },
               { label: tabLabel, href: null } ];
    };
  }

  /* Table des routes : ordre identique à app/Config/Routes.php (premier match gagne).
   * view      : nom du fichier dans /views/ (sans extension .html)
   * script    : nom du fichier dans /js/   (sans extension .js), null si pas de script de page
   * breadcrumb: segments affiches dans le fil d'Ariane
   * help      : chemin de la page d'aide sur DOCS_URL (ou fonction(path)), absent si pas de bouton Aide */
  var ROUTES = [
    {
      pattern:    /^\/dashboard$/,
      help:       'technicien/console/',
      view:       'dashboard',
      script:     'dashboard',
      breadcrumb: []
    },
    {
      pattern:    /^\/agents$/,
      help:       'technicien/console/agents/',
      view:       'agents',
      script:     'agents',
      breadcrumb: [ { label: 'Agents', href: null } ]
    },
    {
      pattern:    /^\/domain_maintenance$/,
      help:       'technicien/console/domaine/',
      view:       'domain_maintenance',
      script:     'domain_maintenance',
      breadcrumb: [ { label: 'Maintenances du domaine', href: null } ]
    },
    {
      pattern:    /^\/domain\/[^/]+$/,
      help:       'technicien/console/domaine/',
      view:       'domain_edit',
      script:     'domain_edit',
      breadcrumb: [ { label: 'Liste de mes domaines', href: '/domains' }, { label: 'Editer le domaine', href: null } ]
    },
    {
      pattern:    /^\/domains$/,
      help:       'technicien/console/domaine/',
      view:       'domains',
      script:     'domains',
      breadcrumb: [ { label: 'Liste de mes domaines', href: null } ]
    },
    {
      pattern:    /^\/server\/add$/,
      help:       'technicien/parcours/01-agent/',
      view:       'server_add',
      script:     'server_add',
      breadcrumb: [ { label: 'Liste des Serveurs', href: '/agents/server' }, { label: 'Ajouter un serveur au domaine', href: null } ]
    },
    {
      pattern:    /^\/agent\/add$/,
      help:       'technicien/console/agents/',
      view:       'agent_add',
      script:     null,
      breadcrumb: [ { label: 'Ajouter un agent', href: null } ]
    },
    /* Serveurs : déclarés avant les routes génériques /agents/{classe}/... */
    {
      pattern:    /^\/agents\/server$/,
      help:       'admin/agents/catalogue/server/',
      view:       'servers',
      script:     'servers',
      breadcrumb: [ { label: 'Liste des Serveurs', href: null } ]
    },
    {
      pattern:    /^\/agents\/server\/[^/]+$/,
      help:       'admin/agents/catalogue/server/',
      view:       'agent_server_conf',
      script:     'agent_server_conf',
      breadcrumb: [ { label: 'Liste des Serveurs', href: '/agents/server' }, { label: 'Détail du serveur', href: null } ]
    },
    {
      pattern:    /^\/agents\/modbus\/[^/]+\/io$/,
      help:       'technicien/connecteurs/modbus/',
      view:       'agent_modbus_io',
      script:     'agent_modbus_io',
      breadcrumb: agentBreadcrumb('Configuration I/O')
    },
    {
      pattern:    /^\/agents\/phidget\/[^/]+\/io$/,
      help:       'technicien/connecteurs/phidget/',
      view:       'agent_phidget_io',
      script:     'agent_phidget_io',
      breadcrumb: agentBreadcrumb('Configuration I/O')
    },
    {
      pattern:    /^\/agents\/gpiod\/[^/]+\/io$/,
      help:       'technicien/connecteurs/gpiod/',
      view:       'agent_gpiod_io',
      script:     'agent_gpiod_io',
      breadcrumb: agentBreadcrumb('Configuration I/O')
    },
    {
      pattern:    /^\/agents\/audio\/[^/]+\/zones$/,
      help:       'technicien/connecteurs/audio/',
      view:       'agent_audio_zones',
      script:     'agent_audio_zones',
      breadcrumb: agentBreadcrumb('Zones de diffusion')
    },
    {
      pattern:    /^\/agents\/[^/]+\/[^/]+\/facilities$/,
      help:       'admin/exploitation/journaux/',
      view:       'agent_facilities',
      script:     'agent_facilities',
      breadcrumb: agentBreadcrumb('Facilities')
    },
    {
      pattern:    /^\/agents\/[^/]+\/[^/]+\/parametres$/,
      help:       agentHelp('catalogue'),
      view:       'agent_params',
      script:     'agent_params',
      breadcrumb: agentBreadcrumb('Paramètres')
    },
    {
      pattern:    /^\/agents\/[^/]+\/[^/]+$/,
      help:       agentHelp('connecteurs'),
      view:       'agent_monitor',
      script:     'agent_monitor',
      breadcrumb: agentBreadcrumb('Supervision')
    },
    /* Ancienne page de classe : agents.js la convertit en /agents?classe=... */
    {
      pattern:    /^\/agents\/[^/]+$/,
      help:       'technicien/console/agents/',
      view:       'agents',
      script:     'agents',
      breadcrumb: [ { label: 'Agents', href: null } ]
    },
    {
      pattern:    /^\/search$/,
      help:       'technicien/dls/acronymes/',
      view:       'search',
      script:     'search',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Dictionnaire', href: null } ]
    },
    {
      pattern:    /^\/audio\/zones$/,
      help:       'technicien/connecteurs/audio/',
      view:       'audio_zones',
      script:     'audio_zones',
      breadcrumb: [ { label: 'Liste des Agents', href: '/agents' }, { label: 'Zones audio', href: null } ]
    },
    {
      pattern:    /^\/audio\/zone\/[^/]+$/,
      help:       'technicien/connecteurs/audio/',
      view:       'audio_zone',
      script:     'audio_zone',
      breadcrumb: [ { label: 'Liste des Agents', href: '/agents' }, { label: 'Zones audio', href: '/audio/zones' }, { label: 'Édition de la zone audio', href: null } ]
    },
    {
      pattern:    /^\/cameras$/,
      help:       'utilisateur/cameras/',
      view:       'cameras',
      script:     'cameras',
      breadcrumb: [ { label: 'Liste des Agents', href: '/agents' }, { label: 'Gestion des caméras', href: null } ]
    },
    {
      pattern:    /^\/dls\/packages$/,
      help:       'technicien/console/dls/',
      view:       'dls_packages',
      script:     'dls_packages',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Liste des Packages D.L.S', href: null } ]
    },
    {
      pattern:    /^\/dls\/package\/[^/]+$/,
      help:       'technicien/console/dls/',
      view:       'dls_package',
      script:     'dls_package',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Liste des Packages D.L.S', href: '/dls/packages' }, { label: 'Edition du package D.L.S', href: null } ]
    },
    {
      pattern:    /^\/dls\/monitor\/[^/]+$/,
      help:       'technicien/dls/objets/',
      view:       'dls_monitor',
      script:     'dls_monitor',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Etat du module', href: null } ]
    },
    {
      pattern:    /^\/dls_status$/,
      help:       'technicien/console/dls/',
      view:       'dls_status',
      script:     'dls_status',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Etat des modules D.L.S', href: null } ]
    },
    {
      pattern:    /^\/dls\/params\/[^/]+$/,
      help:       'technicien/dls/parametres/',
      view:       'dls_params',
      script:     'dls_params',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Paramètres du D.L.S', href: null } ]
    },
    {
      pattern:    /^\/dls\/[^/]+$/,
      help:       'technicien/dls/grammaire/',
      view:       'dls_source',
      script:     'dls_source',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Edition D.L.S', href: null } ]
    },
    {
      pattern:    /^\/dls$/,
      help:       'technicien/console/dls/',
      view:       'dls',
      script:     'dls',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: null } ]
    },
    {
      pattern:    /^\/atelier\/[^/]+$/,
      help:       'technicien/parcours/06-atelier/',
      view:       'atelier',
      script:     'atelier',
      breadcrumb: [ { label: 'Liste des Synoptiques', href: '/synoptiques' }, { label: 'Edition graphique du synoptique', href: null } ]
    },
    {
      pattern:    /^\/synoptique\/[^/]+$/,
      help:       'technicien/console/synoptiques/',
      view:       'syn_child',
      script:     'syn_child',
      breadcrumb: [ { label: 'Liste des Synoptiques', href: '/synoptiques' }, { label: 'Réorganiser', href: '/synoptique/HOME' }, { label: 'Synoptiques fils de', href: null } ]
    },
    {
      pattern:    /^\/synoptiques$/,
      help:       'technicien/console/synoptiques/',
      view:       'synoptiques',
      script:     'synoptiques',
      breadcrumb: [ { label: 'Liste des Synoptiques', href: null } ]
    },
    {
      pattern:    /^\/mnemos\/[^/]+$/,
      help:       'technicien/parcours/07-mnemos/',
      view:       'mnemos',
      script:     'mnemos',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Configuration des Mnémoniques', href: null } ]
    },
    {
      pattern:    /^\/mnemos$/,
      help:       'technicien/parcours/07-mnemos/',
      view:       'mnemos',
      script:     'mnemos',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Configuration des Mnémoniques', href: null } ]
    },
    {
      pattern:    /^\/tableau\/[^/]+$/,
      help:       'technicien/parcours/08-tableaux/',
      view:       'tableau_map',
      script:     'tableau_map',
      breadcrumb: [ { label: 'Liste des Synoptiques', href: '/synoptiques' }, { label: 'Liste des Tableaux', href: '/tableau' }, { label: 'Courbes du Tableau', href: null } ]
    },
    {
      pattern:    /^\/tableau$/,
      help:       'technicien/parcours/08-tableaux/',
      view:       'tableau',
      script:     'tableau',
      breadcrumb: [ { label: 'Liste des Synoptiques', href: '/synoptiques' }, { label: 'Liste des Tableaux', href: null } ]
    },
    {
      pattern:    /^\/syn_cameras$/,
      help:       'utilisateur/cameras/',
      view:       'syn_cameras',
      script:     'syn_cameras',
      breadcrumb: [ { label: 'Liste des Synoptiques', href: '/synoptiques' }, { label: 'Cameras par synoptique', href: null } ]
    },
    {
      pattern:    /^\/messages\/[^/]+$/,
      help:       'technicien/dls/objets/messages/',
      view:       'messages',
      script:     'messages',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Liste des Messages', href: null } ]
    },
    {
      pattern:    /^\/messages$/,
      help:       'technicien/dls/objets/messages/',
      view:       'messages',
      script:     'messages',
      breadcrumb: [ { label: 'Liste des Modules D.L.S', href: '/dls' }, { label: 'Liste des Messages', href: null } ]
    },
    {
      pattern:    /^\/archive$/,
      help:       'technicien/parcours/09-archives/',
      view:       'archive',
      script:     'archive',
      breadcrumb: [ { label: 'Paramétrage des Archives', href: null } ]
    },
    {
      pattern:    /^\/log$/,
      help:       'technicien/console/utilisateurs/',
      view:       'log',
      script:     'log',
      breadcrumb: [ { label: 'Utilisateurs du domaine', href: '/users' }, { label: 'Rechercher dans les logs', href: null } ]
    },
    {
      pattern:    /^\/user\/invite$/,
      help:       'technicien/console/utilisateurs/',
      view:       'user_invite',
      script:     'user_invite',
      breadcrumb: [ { label: 'Utilisateurs du domaine', href: '/users' }, { label: 'Inviter une personne sur le domaine', href: null } ]
    },
    {
      pattern:    /^\/user\/[^/]+$/,
      help:       'technicien/console/utilisateurs/',
      view:       'user_edit',
      script:     'user_edit',
      breadcrumb: [ { label: 'Utilisateurs du domaine', href: '/users' }, { label: 'Editer l\'utilisateur', href: null } ]
    },
    {
      pattern:    /^\/users$/,
      help:       'technicien/console/utilisateurs/',
      view:       'users',
      script:     'users',
      breadcrumb: [ { label: 'Utilisateurs du domaine', href: null } ]
    },
    {
      pattern:    /^\/courbe\/[^/]+\/[^/]+(?:\/[^/]+)?$/,
      help:       'utilisateur/tableaux-courbes/',
      view:       'courbe',
      script:     'courbe',
      breadcrumb: [ { label: 'Voir la courbe', href: null } ]
    },
    {
      pattern:    /^\/command_text$/,
      help:       'utilisateur/commandes-sms/',
      view:       'command_text',
      script:     'command_text',
      breadcrumb: [ { label: 'Mapping des Commandes Textuelles', href: null } ]
    },
    {
      pattern:    /^\/$/,
      help:       'technicien/console/',
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
    path = path.split(/[?#]/)[0] || '/';
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

  function resolveBreadcrumb(path, route) {
    var routeSegments = [];

    if (route && route.breadcrumb) {
      var breadcrumb = (typeof route.breadcrumb === 'function') ? route.breadcrumb(path) : route.breadcrumb;
      routeSegments = breadcrumb.map(function (segment, index, array) {
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
    var segments = resolveBreadcrumb(path, route);

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

    var helpBox = document.getElementById('idBreadcrumbHelp');
    if (helpBox) helpBox.innerHTML = renderHelpButton(path, route);

    shell.classList.remove('d-none');
  }

  /* Bouton Aide à droite du fil d'Ariane, vers la page DOCS de la route */
  function renderHelpButton(path, route) {
    var help = route ? ((typeof route.help === 'function') ? route.help(path) : route.help) : null;
    if (!help) return '';
    return "<a class='btn btn-outline-info' href='" + escapeHtml(DOCS_URL + help) + "' " +
           "target='_blank' rel='noopener noreferrer' title='Aide' aria-label='Aide' data-bs-toggle='tooltip'>" +
           "<i class='fas fa-question-circle'></i></a>";
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

    /* La page quittée doit pouvoir libérer ses souscriptions MQTT et ses timers */
    if (typeof Unload_page === 'function') { try { Unload_page(); } catch (e) {} }
    window.Unload_page = undefined;

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
      var initialPath = window.location.pathname + window.location.search;
      history.replaceState({ path: initialPath }, '', initialPath);
      navigate(initialPath);
    });
  }

  return { init: init, push: push, navigate: navigate, setPageContext: setPageContext };

})();

document.addEventListener('DOMContentLoaded', function () { Router.init(); });
