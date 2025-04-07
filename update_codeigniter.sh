#!/bin/sh
composer update
cp ./vendor/codeigniter4/framework/app/Config/Exceptions.php app/Config/
cp ./vendor/codeigniter4/framework/public/index.php public/
cp ./vendor/codeigniter4/framework/app/Config/App.php app/Config/
cp ./vendor/codeigniter4/framework/app/Config/Autoload.php app/Config/
cp ./vendor/codeigniter4/framework/app/Config/Honeypot.php app/Config/
cp ./vendor/codeigniter4/framework/app/Config/Modules.php app/Config/
cp ./vendor/codeigniter4/framework/app/Config/Cookie.php app/Config/
cp ./vendor/codeigniter4/framework/app/Config/Security.php app/Config/
cp ./vendor/codeigniter4/framework/app/Config/Session.php app/Config/
cp ./vendor/codeigniter4/framework/app/Config/App.php app/Config/
git add app/Config/*
