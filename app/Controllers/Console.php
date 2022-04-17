<?php

namespace App\Controllers;

class Console extends BaseController
{

/*
	public function __construct($config = 'rest')
{
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
}*/

 public function send_page ( $page )
  { echo view('header');
	   echo view($page);
	   echo view('footer');
  }

 public function index()
  { return redirect()->to(base_url("/login")); }

 public function login()
 { echo view('login'); }

 public function dashboard()
  { $this->send_page ("dashboard"); }


}
