FROM php:7.2.2-apache

#RUN docker-php-ext-install mysqli

RUN a2enmod headers

RUN apt-get update -y && \
    apt-get install -y locales && \
    sed -i 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
    sed -i 's/# de_CH.UTF-8 UTF-8/de_CH.UTF-8 UTF-8/' /etc/locale.gen && \
    locale-gen
