<?php

  define("METEO_CSV_URL", "https://data.geo.admin.ch/ch.meteoschweiz.messwerte-aktuell/VQHA80.csv");
  define("METEO_CSV_LINEBREAK", "\r\n");
  define("METEO_CSV_DELIM", ";");
  define("METEO_CSV_KEY_TEMP", "tre200s0");
  define("METEO_CSV_KEY_DEWPOINT", "tde200s0");
  define("METEO_CSV_KEY_WINDDIR", "dkl010z0");
  define("METEO_CSV_KEY_WINDSPEED", "fu3010z0");
  define("METEO_CSV_KEY_WINDGUSTS", "fu3010z1");
  define("METEO_CSV_KEY_QNH", "pp0qnhs0");

  $dirPrefix = dirname(__FILE__).DIRECTORY_SEPARATOR;
  define("SNAPSHOT_DIR", $dirPrefix . "snapshots");
  define("SNAPSHOT_PREFIX", "stations-snapshot");
  define("SNAPSHOT_RETENTION", "PT24H"); // https://www.php.net/manual/de/datetime.sub.php
  define("SNAPSHOT_DATETIME_PATTERN", "Ymd-Hi");

  function getMeta() {
    $dirPrefix = dirname(__FILE__).DIRECTORY_SEPARATOR;
    $metaFileContents = file_get_contents($dirPrefix . "meta.json");
    return json_decode($metaFileContents);
  }

?>
