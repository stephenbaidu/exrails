#!/bin/bash

apt-add-repository -y ppa:brightbox/ruby-ng
add-apt-repository -y ppa:chris-lea/node.js
echo "deb http://nginx.org/packages/ubuntu/ precise nginx" | tee /etc/apt/sources.list.d/nginx.list
apt-key adv --keyserver keyserver.ubuntu.com --recv-keys ABF5BD827BD9BF62
apt-get update
apt-get upgrade

apt-get install -y python g++ python-software-properties git-core ruby2.1 ruby2.1-dev openssl libsqlite3-dev postgresql postgresql-contrib postgresql-server-dev-9.3 build-essential ufw nginx nodejs

# Configure Firewall
# echo "Configuring Firewall"
# ufw allow ssh
# ufw allow http
# ufw allow https
# ufw allow 3000
# ufw default deny
# ufw --force enable

# Configure postgresql
sudo -u postgres psql -c"CREATE ROLE exrailsdbusr WITH LOGIN CREATEDB SUPERUSER PASSWORD 'exrailsdbpwd'"

echo "Installing Compass"
gem install compass --no-ri --no-rdoc
gem install rails --no-ri --no-rdoc
