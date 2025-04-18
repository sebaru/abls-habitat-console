<?php

namespace App\Controllers;

class Console extends BaseController
{
 public function send_page ( $page )
  { echo view('header');
    echo view($page);
    echo view('footer');
  }

 public function index()
  { return redirect()->to(base_url("/dashboard")); }

 public function dashboard()          { $this->send_page ("dashboard"); }
 public function dashboard_courbes()  { $this->send_page ("dashboard_courbes"); }
 public function io_config()          { $this->send_page ("io_config"); }
 public function atelier()            { $this->send_page ("atelier"); }
 public function agents()             { $this->send_page ("agents"); }
 public function agent_edit()         { $this->send_page ("agent_edit"); }
 public function agent_add()          { $this->send_page ("agent_add"); }
 public function domain_maintenance() { $this->send_page ("domain_maintenance"); }
 public function domain_edit()        { $this->send_page ("domain_edit"); }
 public function domains()            { $this->send_page ("domains"); }
 public function modbus()             { $this->send_page ("modbus"); }
 public function shelly()             { $this->send_page ("shelly"); }
 public function phidget()            { $this->send_page ("phidget"); }
 public function gpiod()              { $this->send_page ("gpiod"); }
 public function smsg()               { $this->send_page ("smsg"); }
 public function threads()            { $this->send_page ("threads"); }
 public function search()             { $this->send_page ("search"); }
 public function synoptiques()        { $this->send_page ("synoptiques"); }
 public function messages()           { $this->send_page ("messages"); }
 public function audio()              { $this->send_page ("audio"); }
 public function imsgs()              { $this->send_page ("imsgs"); }
 public function ups()                { $this->send_page ("ups"); }
 public function teleinfoedf()        { $this->send_page ("teleinfoedf"); }
 public function tableau()            { $this->send_page ("tableau"); }
 public function tableau_map()        { $this->send_page ("tableau_map"); }
 public function dls()                { $this->send_page ("dls"); }
 public function dls_packages()       { $this->send_page ("dls_packages"); }
 public function dls_package()        { $this->send_page ("dls_package"); }
 public function dls_params()         { $this->send_page ("dls_params"); }
 public function dls_run()            { $this->send_page ("dls_run"); }
 public function dls_source()         { $this->send_page ("dls_source"); }
 public function mnemos()             { $this->send_page ("mnemos"); }
 public function archive()            { $this->send_page ("archive"); }
 public function user_invite()        { $this->send_page ("user_invite"); }
 public function user_edit()          { $this->send_page ("user_edit"); }
 public function users()              { $this->send_page ("users"); }
 public function command_text()       { $this->send_page ("command_text"); }
 public function courbe()             { $this->send_page ("courbe"); }
 public function meteo()              { $this->send_page ("meteo"); }
}
