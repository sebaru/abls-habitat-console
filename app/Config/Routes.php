<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Console::index');
// We get a performance increase by specifying the default
// route since we don't have to scan directories.
$routes->get('/dashboard/courbes', 'Console::dashboard_courbes');
$routes->get('/dashboard',    'Console::dashboard');
$routes->get('/io_config',    'Console::io_config');
$routes->get('/domain_maintenance', 'Console::domain_maintenance');
$routes->get('/domain/(:any)', 'Console::domain_edit');
$routes->get('/domains',       'Console::domains');
$routes->get('/agent/add',    'Console::agent_add');
$routes->get('/agent/(:any)', 'Console::agent_edit');
$routes->get('/agents',       'Console::agents');
$routes->get('/modbus',       'Console::modbus');
$routes->get('/imsgs',        'Console::imsgs');
$routes->get('/smsg',         'Console::smsg');
$routes->get('/search',       'Console::search');
$routes->get('/audio',        'Console::audio');
$routes->get('/ups',          'Console::ups');
$routes->get('/phidget',      'Console::phidget');
$routes->get('/threads',      'Console::threads');
$routes->get('/teleinfoedf',  'Console::teleinfoedf');
$routes->get('/shelly',       'Console::shelly');
$routes->get('/meteo',        'Console::meteo');
$routes->get('/dls',          'Console::dls');
$routes->get('/dls/packages', 'Console::dls_packages');
$routes->get('/dls/package/(:any)', 'Console::dls_package');
$routes->get('/dls/run/(:any)',     'Console::dls_run');
$routes->get('/dls/params/(:any)', 'Console::dls_params');
$routes->get('/dls/(:any)',   'Console::dls_source');
$routes->get('/atelier/(:any)', 'Console::atelier');
$routes->get('/synoptiques',  'Console::synoptiques');
$routes->get('/mnemos/(:any)', 'Console::mnemos');
$routes->get('/mnemos',        'Console::mnemos');
$routes->get('/tableau/(:any)', 'Console::tableau_map');
$routes->get('/tableau',       'Console::tableau');
$routes->get('/messages/(:any)', 'Console::messages');
$routes->get('/messages',     'Console::messages');
$routes->get('/archive',      'Console::archive');
$routes->get('/user/invite',  'Console::user_invite');
$routes->get('/user/(:any)',  'Console::user_edit');
$routes->get('/users',        'Console::users');
$routes->get('/courbe/(:any)','Console::courbe');
$routes->get('/command_text', 'Console::command_text');
$routes->get('/(:any)',       'Console::index');
