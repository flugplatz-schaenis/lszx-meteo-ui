<?php
  require_once("emagram-common.php");

  $meta = getMeta();
  $stations = get_object_vars($meta->stations);
  $stationKeys = array_keys($stations);

  $measurementCsv = file_get_contents(METEO_CSV_URL);
  $line = strtok($measurementCsv, METEO_CSV_LINEBREAK);

  $stationIdx = 0;
  $timeIdx = 1;
  $tempIdx = 0;
  $dewpointIdx = 0;
  $windDirIdx = 0;
  $windSpeedIdx = 0;
  $windGustsIdx = 0;
  $qnhIdx = 0;
  $stationResults = [];
  $maxDt = new DateTime("1984-11-11");

  while ($line !== false) {

    $parts = explode(METEO_CSV_DELIM, $line);

    if(count($parts) > 2) {

      $stationKey = $parts[$stationIdx];

      if($stationKey == "stn") { // this is the header row, get indices

        $tempIdx = array_search(METEO_CSV_KEY_TEMP, $parts);
        $dewpointIdx = array_search(METEO_CSV_KEY_DEWPOINT, $parts);
        $windDirIdx = array_search(METEO_CSV_KEY_WINDDIR, $parts);
        $windSpeedIdx = array_search(METEO_CSV_KEY_WINDSPEED, $parts);
        $windGustsIdx = array_search(METEO_CSV_KEY_WINDGUSTS, $parts);
        $qnhIdx = array_search(METEO_CSV_KEY_QNH, $parts);

      }
      else if(array_search($stationKey, $stationKeys) !== FALSE) { // a station of interest

        $dt = DateTime::createFromFormat('YmdHi', $parts[$timeIdx]);
        if($dt > $maxDt)
          $maxDt = $dt;

        $stationResults[$stationKey] = (object)[
          "dt" => $dt->format(DateTime::ATOM),
          "temperature" => floatval($parts[$tempIdx]),
          "dewpoint" => floatval($parts[$dewpointIdx]),
          "windDirection" => floatval($parts[$windDirIdx]),
          "windSpeed" => floatval($parts[$windSpeedIdx]),
          "windGusts" => floatval($parts[$windGustsIdx]),
          "qnh" => floatval($parts[$qnhIdx])
        ];
      }
    }
    $line = strtok(METEO_CSV_LINEBREAK); // next line
  }

  $filePath = SNAPSHOT_DIR."/".getFilename($maxDt);

  // write file
  $exists = file_exists($filePath);
  $fp = fopen($filePath, "w");
  fwrite($fp, json_encode($stationResults));
  fclose($fp);

  // delete old files
  $retentionDeadline = $maxDt;
  $retentionDeadline->sub(new DateInterval(SNAPSHOT_RETENTION));
  $retentionFilename = getFilename($retentionDeadline);

  $snapshots = scandir(SNAPSHOT_DIR);
  $snapshotToDelete = array_values(array_filter($snapshots, function($s) use (&$retentionFilename) {
    return $s != "." && $s != ".." && $s <= $retentionFilename;
  }));

  foreach($snapshotToDelete as $snapshot){
    $file = SNAPSHOT_DIR."/".$snapshot;
    if(is_file($file))
        unlink($file);
  }

  header('Content-Type: application/json');
  echo(json_encode([
    "result" => $exists ? "replaced" : "created",
    "filename" => $filename,
    "maxDt" => $dt->format(DateTime::ATOM),
    "deleted" => count($snapshotToDelete)
  ]));

  function getFilename($dt) {
    return SNAPSHOT_PREFIX."-".$dt->format("Ymd-Hi").".json";
  }

?>
