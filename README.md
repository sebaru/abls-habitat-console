# Abls-Habitat Project

Abls-Habitat is my own project to do home automation. it presents:

* one or more [Agents](https://github.com/sebaru/abls-habitat-agent), in house, to interact with sensors and outputs
* one [API](https://github.com/sebaru/abls-habitat-api) on SaaS, main process of project, to handle all of agents
* one [Console](https://github.com/sebaru/abls-habitat-console) to configure each element and develop [D.L.S module](https://docs.abls-habitat.fr/)
* one [Home](https://github/com/sebaru/abls-habitat-home) frontend for all users

This software is Work In Progress. It is a complete refund of all-in-one Watchdog Project.
I'm developing on my sparse-time, not so easy with little kid :-).

All detailed documentations [are here](https://docs.abls-habitat.fr)
Have a good day, Sebaru.

## What is Abls-Habitat Console ?

**Console** is the priviledged user part of project.
It permits to manage domains and user access, to handle synoptics, DLS modules, and set every connectors configuration and mappings.

## Installation with apache Httpd

Make sure apache, php and composer packages are installed. Then follow these command lines:

    # dnf install -y httpd mod_ssl php-fpm php
    # mkdir /var/www/html/abls-console
    # cd /var/www/html/abls-console
    # git clone https://github.com/sebaru/abls-habitat-console.git .
    # mkdir writable
    # mkdir writable/cache
    # mkdir writable/debugbar
    # mkdir writable/logs
    # mkdir writable/session
    # mkdir writable/uploads
    # chmod a=rwx -R writable
    # composer update

Create Let's Encrypt certificate for your domain and adapt domain and certificate names in httpd-abls-console.conf.sample. And finally do:

    # cp httpd-abls-console.conf.sample /etc/httpd/conf.d/httpd-abls-console.conf
    # systemctl restart httpd

## Upgrade

When upgrading, follow these command lines:

    # cd /var/www/html/abls-console
    # git pull
    # cp vendor/codeigniter4/framework/public/index.php public/index.php
    # cp vendor/codeigniter4/framework/spark .

## Setup

Edit /var/www/html/abls-console/.env and change as you want:

    CI_ENVIRONMENT = production
    ABLS_API       = 'https://api.abls-habitat.fr'
    IDP_ADAPTER    = "https://idp.abls-habitat.fr/js/keycloak.js"
    IDP_REALM      = "Abls-Habitat"
    IDP_URL        = "https://idp.abls-habitat.fr/"
    IDP_CLIENT_ID  = "abls-habitat-console"
    app.baseURL    = 'https://console.abls-habitat.fr'
