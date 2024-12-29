<html>
<style type="text/css">
#table-2 {
	border: 1px solid #e3e3e3;
	background-color: #f2f2f2;
        width: 500px;
	border-radius: 6px;
	-webkit-border-radius: 6px;
	-moz-border-radius: 6px;
}
#table-2 td, #table-2 th {
	padding: 5px;
	color: #333;
}
#table-2 thead {
	font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
	padding: .2em 0 .2em .5em;
	text-align: left;
	color: #4B4B4B;
	background-color: #C8C8C8;
	background-image: -webkit-gradient(linear, left top, left bottom, from(#f2f2f2), to(#e3e3e3), color-stop(.6,#B3B3B3));
	background-image: -moz-linear-gradient(top, #D6D6D6, #B0B0B0, #B3B3B3 90%);
	border-bottom: solid 1px #999;
}
#table-2 th {
	font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
	font-size: 17px;
	line-height: 20px;
	font-style: normal;
	font-weight: normal;
	text-align: left;
	text-shadow: white 1px 1px 1px;
}
#table-2 td {
	line-height: 20px;
	font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
	font-size: 14px;
	border-bottom: 1px solid #fff;
	border-top: 1px solid #fff;
}
#table-2 td:hover {
	background-color: #fff;
}
</style>

<?php
    // read in json
    $filepath_snapshots = "snapshots/";
    $filename_live = "lszx_live.json";
    $filename_historic = "lszx_historic_" . date("Y-m-d") . ".json";

    $json_live = file_get_contents($filepath_snapshots . $filename_live);
    $json_historic = file_get_contents($filepath_snapshots . $filename_historic);

    $array_live = json_decode($json_live, true);
    $array_historic = json_decode($json_historic, true);

    $datetime_arr = searchKeyInNestedArray("ts", $array_live);
    $datetime = !empty($datetime_arr)? convertTimestamp(max($datetime_arr), "Europe/Zurich", "Y-m-d H:i:s") : "ERROR";
    
    $temp_act_arr = searchKeyInNestedArray("temp", $array_live);
    $temp_act = !empty($temp_act_arr)? fahrenheitToCelsius(reset($temp_act_arr)) : 0;
    
    $temp_min_arr = searchKeyInNestedArray("temp_last", $array_historic);
    $temp_min = !empty($temp_min_arr)? fahrenheitToCelsius(min($temp_min_arr)) : 0;
    
    $temp_max_arr = searchKeyInNestedArray("temp_last", $array_historic);
    $temp_max = !empty($temp_max_arr)? fahrenheitToCelsius(max($temp_max_arr)) : 0;
    
    $hum_act_arr = searchKeyInNestedArray("hum", $array_live);
    $hum_act = !empty($hum_act_arr)? round(reset($hum_act_arr),0) : 0;
    
    $hum_min_arr = searchKeyInNestedArray("hum_last", $array_historic);
    $hum_min = !empty($hum_min_arr)? round(min($hum_min_arr),0) : 0;
    
    $hum_max_arr = searchKeyInNestedArray("hum_last", $array_historic);
    $hum_max = !empty($hum_max_arr)? round(max($hum_max_arr),0) : 0;
    
    $dew_act_arr = searchKeyInNestedArray("dew_point", $array_live);
    $dew_act = !empty($dew_act_arr)? fahrenheitToCelsius(reset($dew_act_arr)) : 0;
    
    $dew_min_arr = searchKeyInNestedArray("dew_point_last", $array_historic);
    $dew_min = !empty($dew_min_arr)? fahrenheitToCelsius(min($dew_min_arr)) : 0;
    
    $dew_max_arr = searchKeyInNestedArray("dew_point_last", $array_historic);
    $dew_max = !empty($dew_max_arr)? fahrenheitToCelsius(max($dew_max_arr)) : 0;
    
    $qnh_act_arr = searchKeyInNestedArray("bar_sea_level", $array_live);
    $qnh_act = !empty($qnh_act_arr)? inHgToMbar(reset($qnh_act_arr)) : 0;
    
    $qnh_min_arr = searchKeyInNestedArray("bar_sea_level", $array_historic);
    $qnh_min = !empty($qnh_min_arr)? inHgToMbar(min($qnh_min_arr)) : 0;
    
    $qnh_max_arr = searchKeyInNestedArray("bar_sea_level", $array_historic);
    $qnh_max = !empty($qnh_max_arr)? inHgToMbar(max($qnh_max_arr)) : 0;
    
    $qfe_act_arr = searchKeyInNestedArray("bar_absolute", $array_live);
    $qfe_act = !empty($qfe_act_arr)? inHgToMbar(reset($qfe_act_arr)) : 0;
    
    $qfe_min_arr = searchKeyInNestedArray("bar_absolute", $array_historic);
    $qfe_min = !empty($qfe_min_arr)? inHgToMbar(min($qfe_min_arr)) : 0;
    
    $qfe_max_arr = searchKeyInNestedArray("bar_absolute", $array_historic);
    $qfe_max = !empty($qfe_max_arr)? inHgToMbar(max($qfe_max_arr)) : 0;
    
    $wind_dir_arr = searchKeyInNestedArray("wind_dir_scalar_avg_last_2_min", $array_live);
    $wind_dir = !empty($wind_dir_arr)? round(reset($wind_dir_arr),0) : 0;
    
    $wind_speed_arr = searchKeyInNestedArray("wind_speed_avg_last_2_min", $array_live);
    $wind_speed = !empty($wind_speed_arr)? meterspersecondToKph(reset($wind_speed_arr)) : 0;
    
    $wind_speed_min_arr = searchKeyInNestedArray("wind_speed_avg", $array_historic);
    $wind_speed_min = !empty($wind_speed_min_arr)? meterspersecondToKph(min($wind_speed_min_arr)) : 0;
    
    $wind_speed_max_arr = searchKeyInNestedArray("wind_speed_avg", $array_historic);
    $wind_speed_max = !empty($wind_speed_max_arr)? meterspersecondToKph(max($wind_speed_max_arr)) : 0;
    
    $wind_gusts_arr = searchKeyInNestedArray("wind_speed_hi_last_10_min", $array_live);
    $wind_gusts = !empty($wind_gusts_arr)? meterspersecondToKph(reset($wind_gusts_arr)) : 0;
    
    $wind_gusts_max_arr = searchKeyInNestedArray("wind_speed_hi", $array_historic);
    $wind_gusts_max = !empty($wind_gusts_max_arr)? meterspersecondToKph(max($wind_gusts_max_arr)) : 0;
    
    $rain_rate_arr = searchKeyInNestedArray("rain_rate_last_mm", $array_live);
    $rain_rate = !empty($rain_rate_arr)? round(max($rain_rate_arr), 1) : 0;
    
    $rain_total_day_arr = searchKeyInNestedArray("rainfall_daily_mm", $array_live);
    $rain_total_day = !empty($rain_total_day_arr)? round(max($rain_total_day_arr),1) : 0;

?>

<body>
  <table id="table-2">
    <thead><tr><th colspan="4">LSZX weather upload <?php echo $datetime ?> LT</th></tr></thead>
    <thead><tr><th>Sensor</th>
               <th>Current</th>
               <th>Today (min)</th>
               <th>Today (max)</th></tr></thead>
    <tbody>
      <tr><td>Outdoor Temperature</td>
          <td><?php echo $temp_act ?>&deg; C</td>
	  <td><?php echo $temp_min ?>&deg; C</td>
	  <td><?php echo $temp_max ?>&deg; C</td></tr>
      <tr><td>Outdoor Humidity</td>
          <td><?php echo $hum_act ?> %</td>
          <td><?php echo $hum_min ?> %</td>
          <td><?php echo $hum_max ?> %</td></tr>
      <tr><td>Outdoor Dew Point</td>
          <td><?php echo $dew_act ?>&deg; C</td>
          <td><?php echo $dew_min ?>&deg; C</td>
          <td><?php echo $dew_max ?>&deg; C</td></tr>
      <tr><td>Air Pressure (QNH)</td>
          <td><?php echo $qnh_act ?> hPa</td>
          <td><?php echo $qnh_min ?> hPa</td>
          <td><?php echo $qnh_max ?> hPa</td></tr>
      <tr><td>Air Pressure (QFE)</td>
          <td><?php echo $qfe_act ?> hPa</td>
          <td><?php echo $qfe_min ?> hPa</td>
          <td><?php echo $qfe_max ?> hPa</td></tr>
      <tr><td>Wind Direction</td>
          <td><?php echo $wind_dir ?>&deg;</td>
          <td></td><td></td></tr>
      <tr><td>Wind Speed<br>(2 minutes average)</td>
          <td><?php echo $wind_speed ?> km/h</td>
          <td><?php echo $wind_speed_min ?> km/h</td>
          <td><?php echo $wind_speed_max ?> km/h</td></tr>
      <tr><td>Gust Speed<br>(10 minutes maximum)</td>
          <td><?php echo $wind_gusts ?> km/h</td>
          <td>-</td>
          <td><?php echo $wind_gusts_max ?> km/h</td></tr>
      <tr><td>Rain</td>
          <td>rate: <?php echo $rain_rate ?> mm/h</td>
          <td>sum <?php echo $rain_total_day ?> mm</td>
          <td></td></tr>
    </tbody>
  </table>
</body>
<html>

<?php 

  // Recursive function to search for a key in an array
  function searchKeyInNestedArray($key, $array) {
    $results = [];
    
    foreach ($array as $k => $v) {
        if ($k === $key && $v !== null) {
            $results[] = $v;
        }
        
        // If the value is an array, recursively search it
        if (is_array($v)) {
            $results = array_merge($results, searchKeyInNestedArray($key, $v));
        }
    }

    return $results;
  }

  function convertTimestamp($unixtimestamp, $timezone, $output_format){
    $tz = new DateTimeZone($timezone);
    $datetime = new DateTime("@$unixtimestamp", new DateTimeZone("UTC"));
    $datetime->setTimezone($tz);
    return $datetime->format($output_format);
  }

  function fahrenheitToCelsius($fahrenheit) {
    // Formula: Celsius = (Fahrenheit - 32) * 5 / 9
    $celsius = ($fahrenheit - 32) * 5 / 9;
    return round($celsius, 1);
  }

  function meterspersecondToKph($meterspersecond){
    // Formula: 3.6 m/s = 1 kph
    $kph = 3.6 * $meterspersecond;
    return round($kph,1);
  }

  function inHgToMbar($inHg) {
    // Conversion factor: 1 inHg = 33.8639 mbar
    $mbar = $inHg * 33.8639;
    return round($mbar, 1);
  }

?>