<?php

namespace App\Controllers;

class Console extends BaseController
{

 public function send_page ( $page )
  { echo view('header');
	   echo view($page);
	   echo view('footer');
  }

 public function default()
  { return redirect()->to(base_url("/dashboard")); }

 public function dashboard()   { $this->send_page ("dashboard"); }
 public function io_config()   { $this->send_page ("io_config"); }
 public function agent()       { $this->send_page ("agent"); }
 public function domain_edit() { $this->send_page ("domain_edit"); }
 public function domains()     { $this->send_page ("domains"); }
 public function modbus()      { $this->send_page ("modbus"); }
 public function smsg()        { $this->send_page ("smsg"); }
 public function search()      { $this->send_page ("search"); }
 public function synoptiques() { $this->send_page ("synoptiques"); }
 public function audio()       { $this->send_page ("audio"); }
 public function imsgs()       { $this->send_page ("imsgs"); }
 public function ups()         { $this->send_page ("ups"); }
 public function teleinfoedf() { $this->send_page ("teleinfoedf"); }
 public function dls()         { $this->send_page ("dls"); }
 public function dls_source()  { $this->send_page ("dls_source"); }
 public function archive()     { $this->send_page ("archive"); }
 public function user_invite() { $this->send_page ("user_invite"); }
 public function user_edit()   { $this->send_page ("user_edit"); }
 public function users()       { $this->send_page ("users"); }
}
