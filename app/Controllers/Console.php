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
 { echo view('login'); }

 public function test()
  { $this->send_page ("dashboard"); }


}
