#!/bin/bash
docker run -d \
  -p 5100:80 \
  -v $(pwd)/src/:/var/www/html/ \
  --name lszx-meteo-dev \
  lszx-meteo-dev
