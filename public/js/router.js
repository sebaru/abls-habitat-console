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
      pattern:    /^\/dashboard\/courbes$/,
      view:       'dashboard',
      script:     'dashboard',
      breadcrumb: [ { label: 'Dashboard', href: '/dashboard' }, { label: 'Courbes', href: '/dashboard/courbes' } ]
    },
    {
      pattern:    /^\/dashboard$/,
      view:       'dashboard',
      script:     'dashboard',
      breadcrumb: [ { label: 'Dashboard', href: '/dashboard' } ]
    },
    {
      pattern:    /^\/io_config$/,
      view:       'io_config',
      script:     null,
      breadcrumb: [ { label: 'Configuration', href: '/io_config' }, { label: 'Connecteurs', href: null } ]
    },
    {
      pattern:    /^\/domain_maintenance$/,
      view:       'domain_maintenance',
      script:     'domain_maintenance',
      breadcrumb: [ { label: 'Domaine', href: '/dashboard' }, { label: 'Maintenance', href: null } ]
    },
    {
      pattern:    /^\/domain\/[^/]+$/,
      view:       'domain_edit',
      script:     'domain_edit',
      breadcrumb: [ { label: 'Domaine', href: '/dashboard' }, { label: 'Configurer', href: null } ]
    },
    {
      pattern:    /^\/domains$/,
      view:       'domains',
      script:     'domains',
      breadcrumb: [ { label: 'Domaine', href: '/dashboard' }, { label: 'Changer', href: '/domains' } ]
    },
    {
      pattern:    /^\/agent\/add$/,
      view:       'agent_add',
      script:     'agent_add',
      breadcrumb: [ { label: 'Domaine', href: '/dashboard' }, { label: 'Agents', href: '/agents' }, { label: 'Ajouter', href: '/agent/add' } ]
    },
    {
      pattern:    /^\/agent\/[^/]+$/,
      view:       'agent_edit',
      script:     'agent_edit',
      breadcrumb: [ { label: 'Domaine', href: '/dashboard' }, { label: 'Agents', href: '/agents' }, { label: 'Agent', href: null } ]
    },
    {
      pattern:    /^\/agents$/,
      view:       'agents',
      script:     'agents',
      breadcrumb: [ { label: 'Domaine', href: '/dashboard' }, { label: 'Agents', href: '/agents' } ]
    },
    {
      pattern:    /^\/modbus$/,
      view:       'modbus',
      script:     'modbus',
      breadcrumb: [ { label: 'Configuration', href: '/io_config' }, { label: 'Modbus', href: null } ]
    },
    {
      pattern:    /^\/imsgs$/,
      view:       'imsgs',
      script:     'imsgs',
      breadcrumb: [ { label: 'Configuration', href: '/io_config' }, { label: 'Instant Messages', href: null } ]
    },
    {
      pattern:    /^\/smsg$/,
      view:       'smsg',
      script:     'smsg',
      breadcrumb: [ { label: 'Configuration', href: '/io_config' }, { label: 'SMS', href: null } ]
    },
    {
      pattern:    /^\/gpiod$/,
      view:       'gpiod',
      script:     'gpiod',
      breadcrumb: [ { label: 'Configuration', href: '/io_config' }, { label: 'GPIO', href: null } ]
    },
    {
      pattern:    /^\/search$/,
      view:       'search',
      script:     'search',
      breadcrumb: [ { label: 'D.L.S', href: '/dls' }, { label: 'Dictionnaire', href: null } ]
    },
    {
      pattern:    /^\/audio\/zones$/,
      view:       'audio_zones',
      script:     'audio_zones',
      breadcrumb: [ { label: 'Configuration', href: '/io_config' }, { label: 'Zones de diffusion', href: null } ]
    },
    {
      pattern:    /^\/audio\/zone\/[^/]+$/,
      view:       'audio_zone',
      script:     'audio_zone',
      breadcrumb: [ { label: 'Configuration', href: '/io_config' }, { label: 'Zones de diffusion', href: '/audio/zones' }, { label: 'Zone', href: null } ]
    },
    {
      pattern:    /^\/audio$/,
      view:       'audio',
      script:     'audio',
      breadcrumb: [ { label: 'Configuration', href: '/io_config' }, { label: 'Audio', href: null } ]
    },
    {
      pattern:    /^\/cameras$/,
      view:       'cameras',
      script:     'cameras',
      breadcrumb: [ { label: 'Configuration', href: '/io_config' }, { label: 'Caméras', href: null } ]
    },
    {
      pattern:    /^\/ups$/,
      view:       'ups',
      script:     'ups',
      breadcrumb: [ { label: 'Configuration', href: '/io_config' }, { label: 'UPS', href: null } ]
    },
    {
      pattern:    /^\/phidget$/,
      view:       'phidget',
      script:     'phidget',
      breadcrumb: [ { label: 'Configuration', href: '/io_config' }, { label: 'Phidget', href: null } ]
    },
    {
      pattern:    /^\/threads$/,
      view:       'threads',
      script:     'threads',
      breadcrumb: [ { label: 'Domaine', href: '/dashboard' }, { label: 'Threads', href: null } ]
    },
    {
      pattern:    /^\/teleinfoedf$/,
      view:       'teleinfoedf',
      script:     'teleinfoedf',
      breadcrumb: [ { label: 'Configuration', href: '/io_config' }, { label: 'Téléinfo EDF', href: null } ]
    },
    {
      pattern:    /^\/shelly$/,
      view:       'shelly',
      script:     'shelly',
      breadcrumb: [ { label: 'Configuration', href: '/io_config' }, { label: 'Shelly', href: null } ]
    },
    {
      pattern:    /^\/meteo$/,
      view:       'meteo',
      script:     'meteo',
      breadcrumb: [ { label: 'Configuration', href: '/io_config' }, { label: 'Météo', href: null } ]
    },
    {
      pattern:    /^\/dls\/packages$/,
      view:       'dls_packages',
      script:     'dls_packages',
      breadcrumb: [ { label: 'D.L.S', href: '/dls' }, { label: 'Packages', href: null } ]
    },
    {
      pattern:    /^\/dls\/package\/[^/]+$/,
      view:       'dls_package',
      script:     'dls_package',
      breadcrumb: [ { label: 'D.L.S', href: '/dls' }, { label: 'Packages', href: '/dls/packages' }, { label: 'Package', href: null } ]
    },
    {
      pattern:    /^\/dls\/run\/[^/]+$/,
      view:       'dls_run',
      script:     'dls_run',
      breadcrumb: [ { label: 'D.L.S', href: '/dls' }, { label: 'Exécution', href: null } ]
    },
    {
      pattern:    /^\/dls_status$/,
      view:       'dls_status',
      script:     'dls_status',
      breadcrumb: [ { label: 'D.L.S', href: '/dls' }, { label: 'Etat', href: null } ]
    },
    {
      pattern:    /^\/dls\/params\/[^/]+$/,
      view:       'dls_params',
      script:     'dls_params',
      breadcrumb: [ { label: 'D.L.S', href: '/dls' }, { label: 'Paramètres', href: null } ]
    },
    {
      pattern:    /^\/dls\/[^/]+$/,
      view:       'dls_source',
      script:     'dls_source',
      breadcrumb: [ { label: 'D.L.S', href: '/dls' }, { label: 'Source', href: null } ]
    },
    {
      pattern:    /^\/dls$/,
      view:       'dls',
      script:     'dls',
      breadcrumb: [ { label: 'D.L.S', href: '/dls' }, { label: 'Modules', href: null } ]
    },
    {
      pattern:    /^\/atelier\/[^/]+$/,
      view:       'atelier',
      script:     'atelier',
      breadcrumb: [ { label: 'Synoptiques', href: '/synoptiques' }, { label: 'Atelier', href: null } ]
    },
    {
      pattern:    /^\/synoptique\/[^/]+$/,
      view:       'syn_child',
      script:     'syn_child',
      breadcrumb: [ { label: 'Synoptiques', href: '/synoptiques' }, { label: 'Synoptique', href: null } ]
    },
    {
      pattern:    /^\/synoptiques$/,
      view:       'synoptiques',
      script:     'synoptiques',
      breadcrumb: [ { label: 'Synoptiques', href: '/synoptiques' }, { label: 'Liste', href: null } ]
    },
    {
      pattern:    /^\/mnemos\/[^/]+$/,
      view:       'mnemos',
      script:     'mnemos',
      breadcrumb: [ { label: 'D.L.S', href: '/dls' }, { label: 'Bits internes', href: '/mnemos' }, { label: 'Détail', href: null } ]
    },
    {
      pattern:    /^\/mnemos$/,
      view:       'mnemos',
      script:     'mnemos',
      breadcrumb: [ { label: 'D.L.S', href: '/dls' }, { label: 'Bits internes', href: null } ]
    },
    {
      pattern:    /^\/tableau\/[^/]+$/,
      view:       'tableau_map',
      script:     'tableau_map',
      breadcrumb: [ { label: 'Synoptiques', href: '/synoptiques' }, { label: 'Tableaux', href: '/tableau' }, { label: 'Map', href: null } ]
    },
    {
      pattern:    /^\/tableau$/,
      view:       'tableau',
      script:     'tableau',
      breadcrumb: [ { label: 'Synoptiques', href: '/synoptiques' }, { label: 'Tableaux', href: null } ]
    },
    {
      pattern:    /^\/syn_cameras$/,
      view:       'syn_cameras',
      script:     'syn_cameras',
      breadcrumb: [ { label: 'Synoptiques', href: '/synoptiques' }, { label: 'Caméras', href: null } ]
    },
    {
      pattern:    /^\/messages\/[^/]+$/,
      view:       'messages',
      script:     'messages',
      breadcrumb: [ { label: 'D.L.S', href: '/dls' }, { label: 'Messages', href: '/messages' }, { label: 'Message', href: null } ]
    },
    {
      pattern:    /^\/messages$/,
      view:       'messages',
      script:     'messages',
      breadcrumb: [ { label: 'D.L.S', href: '/dls' }, { label: 'Messages', href: null } ]
    },
    {
      pattern:    /^\/archive$/,
      view:       'archive',
      script:     'archive',
      breadcrumb: [ { label: 'Domaine', href: '/dashboard' }, { label: 'Archivage', href: null } ]
    },
    {
      pattern:    /^\/log$/,
      view:       'log',
      script:     'log',
      breadcrumb: [ { label: 'Utilisateur', href: '/users' }, { label: 'Audit log', href: null } ]
    },
    {
      pattern:    /^\/user\/invite$/,
      view:       'user_invite',
      script:     'user_invite',
      breadcrumb: [ { label: 'Utilisateur', href: '/users' }, { label: 'Invitation', href: null } ]
    },
    {
      pattern:    /^\/user\/[^/]+$/,
      view:       'user_edit',
      script:     'user_edit',
      breadcrumb: [ { label: 'Utilisateur', href: '/users' }, { label: 'Profil', href: null } ]
    },
    {
      pattern:    /^\/users$/,
      view:       'users',
      script:     'users',
      breadcrumb: [ { label: 'Utilisateur', href: '/users' }, { label: 'Utilisateurs', href: null } ]
    },
    {
      pattern:    /^\/courbe\/[^/]+$/,
      view:       'courbe',
      script:     'courbe',
      breadcrumb: [ { label: 'D.L.S', href: '/dls' }, { label: 'Courbe', href: null } ]
    },
    {
      pattern:    /^\/command_text$/,
      view:       'command_text',
      script:     'command_text',
      breadcrumb: [ { label: 'Domaine', href: '/dashboard' }, { label: 'Commande texte', href: null } ]
    },
    {
      pattern:    /^\/$/,
      view:       'dashboard',
      script:     'dashboard',
      breadcrumb: [ { label: 'Dashboard', href: '/dashboard' } ]
    },
    {
      pattern:    /^\/.*$/,
      view:       'dashboard',
      script:     'dashboard',
      breadcrumb: [ { label: 'Dashboard', href: '/dashboard' } ]
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

  function resolveBreadcrumb(route) {
    if (route && route.breadcrumb) {
      var segments = route.breadcrumb.map(function (segment, index, array) {
        return {
          label: segment.label,
          href: index === array.length - 1 ? null : segment.href,
          active: index === array.length - 1
        };
      });

      if (segments.length && currentPageContext.lastLabel) {
        segments[segments.length - 1].label = currentPageContext.lastLabel;
      }
      return segments;
    }

    if (route && route.view) {
      return [ { label: route.view.replace(/_/g, ' '), href: null, active: true } ];
    }

    return [ { label: 'Dashboard', href: null, active: true } ];
  }

  function updateDocumentTitle(segments) {
    var title = currentPageContext.title;

    if (!title && segments.length) {
      title = segments.map(function (segment) { return segment.label; }).join(' - ');
    }

    if (!title || title === 'Dashboard') {
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

    if (segments.length === 1 && segments[0].label === 'Dashboard') {
      list.innerHTML = '';
      shell.classList.add('d-none');
      return;
    }

    list.innerHTML = segments.map(function (segment) {
      if (!segment.active && segment.href) {
        return "<li class='breadcrumb-item'><a href='" + escapeHtml(segment.href) + "'>" +
               escapeHtml(segment.label) + "</a></li>";
      }

      return "<li class='breadcrumb-item active' aria-current='page'>" +
             escapeHtml(segment.label) + "</li>";
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

  function setPageContext(context) {
    currentPageContext = context || {};
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
