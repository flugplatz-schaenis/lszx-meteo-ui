<?php
  require_once("emagram-common.php");

  $meta = getMeta();

  $snapshots = scandir(SNAPSHOT_DIR);
  $snapshotUrls =
    array_map(function($s) {
      $dtSubstring = substr($s, strlen(SNAPSHOT_PREFIX)+1, strlen($s) - strlen(SNAPSHOT_PREFIX) - 6);
      $dt = DateTime::createFromFormat(SNAPSHOT_DATETIME_PATTERN, $dtSubstring);
      return (object)[
        "dt" => $dt->format(DateTime::ATOM),
        "path" => SNAPSHOT_DIR."/".$s,
      ];
    },
    array_filter($snapshots, function($s) {
      return substr($s, 0, strlen(SNAPSHOT_PREFIX)) === SNAPSHOT_PREFIX;
    }
  ));

  $meta->snapshots = array_values($snapshotUrls);

  header('Content-Type: application/json');
  echo(json_encode($meta));
?>
