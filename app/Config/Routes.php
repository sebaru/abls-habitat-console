<?php

namespace Config;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (file_exists(SYSTEMPATH . 'Config/Routes.php')) {
    require SYSTEMPATH . 'Config/Routes.php';
}

/*
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(true);

/*
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

// We get a performance increase by specifying the default
// route since we don't have to scan directories.
$routes->get('/dashboard',    'Console::dashboard');
$routes->get('/io_config',    'Console::io_config');
$routes->get('/domain/(:any)', 'Console::domain_edit');
$routes->get('/domains',       'Console::domains');
$routes->get('/agent',        'Console::agent');
$routes->get('/modbus',       'Console::modbus');
$routes->get('/imsgs',        'Console::imsgs');
$routes->get('/smsg',         'Console::smsg');
$routes->get('/audio',        'Console::audio');
$routes->get('/ups',          'Console::ups');
$routes->get('/teleinfoedf',  'Console::teleinfoedf');
$routes->get('/dls',          'Console::dls');
$routes->get('/synoptiques',  'Console::synoptiques');
$routes->get('/archive',      'Console::archive');
$routes->get('/user/invite',  'Console::user_invite');
$routes->get('/users',        'Console::users');
$routes->get('(:any)',        'Console::default');

/*
 * --------------------------------------------------------------------
 * Additional Routing
 * --------------------------------------------------------------------
 *
 * There will often be times that you need additional routing and you
 * need it to be able to override any defaults in this file. Environment
 * based routes is one such time. require() additional route files here
 * to make that happen.
 *
 * You will have access to the $routes object within that file without
 * needing to reload it.
 */
if (file_exists(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php')) {
    require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}
