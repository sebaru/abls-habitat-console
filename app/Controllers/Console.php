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

 public function login()
 { echo view('login'); }

 public function dashboard() { $this->send_page ("dashboard"); }
 public function io_config() { $this->send_page ("io_config"); }
 public function agent()     { $this->send_page ("agent"); }
 public function domain()    { $this->send_page ("domain"); }


}
