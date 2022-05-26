# Abls-Habitat Project

Abls-Habitat is my own project to do home automation. it presents:
* one or more [Agents](https://github.com/sebaru/abls-habitat-agent, in house, to interact with sensors and outputs)
* one [API](https://github.com/sebaru/abls-habitat-api) on SaaS, main process of project, to handle all of agents
* one [Console](https://github.com/sebaru/abls-habitat-console) to configure each element and develop [D.L.S module](https://docs.abls-habitat.fr/https://docs.abls-habitat.fr/dls/)
* one [Home](https://github/com/sebaru/abls-habitat-home) frontend for all users

## What is Abls-Habitat Console ?

**Console** is the priviledged user part of project.
It permits to handle synoptics, DLS modules, set every connectors configuration and mappings

## Installation with apache Httpd

Make sure apache, php and composer packages are installed. Then follow these command lines:

    # mkdir /var/ww/html/abls-console
    # cd /var/ww/html/abls-console
    # git clone https://github.com/sebaru/abls-habitat-console.git .
    # composer update

Create Let's Encrypt certificate for your domain and adapt domain and certificate names in httpd-abls-console.conf.sample. And finally do:

    # cp httpd-abls-console.conf.sample /etc/httpd/conf.d/httpd-abls-console.conf
    # systemctl restart httpd

## Upgrade

When upgrading, follow these command lines:

    # git pull /var/ww/html/abls-console

## Setup

Edit /var/ww/html/abls-console/public/js/config.json and change:

* the `api_url` to your own API Instance
* the `idp_url` to your own OpenID IDP Instance


# All docs

all documentation [is here](https://docs;abls-habitat.fr)
