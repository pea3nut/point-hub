FROM tutum/lamp
MAINTAINER pea3nut "626954412@qq.com"

WORKDIR /

## Install Nodejs and PhpMyAdmin

RUN apt-get update
RUN apt-get install -y wget
RUN apt-get install -y xz-utils

RUN wget https://nodejs.org/dist/v10.16.3/node-v10.16.3-linux-x64.tar.xz
RUN wget https://files.phpmyadmin.net/phpMyAdmin/4.9.1/phpMyAdmin-4.9.1-all-languages.tar.xz
RUN tar -xJvf phpMyAdmin-4.9.1-all-languages.tar.xz
RUN tar -xvJf node-v10.16.3-linux-x64.tar.xz

RUN mv phpMyAdmin-4.9.1-all-languages /app/phpmyadmin
RUN mv node-v10.16.3-linux-x64 /node

WORKDIR /app/phpmyadmin

RUN mkdir tmp
RUN chmod 777 tmp/

RUN ln -s /node/bin/node /usr/bin/node
RUN ln -s /node/bin/npm /usr/bin/npm

## Deploy App

RUN mkdir /point-hub
COPY . /point-hub/

WORKDIR /point-hub/

RUN rm -rf /point-hub/node_modules
RUN npm install --production

RUN echo "[program:point-server]" >> /etc/supervisor/conf.d/point-server.conf
RUN echo "command=/node/bin/node /point-hub/point-server/bin/www" >> /etc/supervisor/conf.d/point-server.conf
RUN echo "numprocs=1" >> /etc/supervisor/conf.d/point-server.conf
RUN echo "autostart=true" >> /etc/supervisor/conf.d/point-server.conf

EXPOSE 3306
EXPOSE 3000
EXPOSE 80
