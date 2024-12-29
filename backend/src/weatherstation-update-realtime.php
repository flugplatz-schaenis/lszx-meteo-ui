<?php

  // Using WeatherLink REST API to get Schänis Wx data
  $station_id = 187416; //Schaenis_LSZX Davis Weatherlink station ID
  $api_key = 'jwunkixs6plg8tfoekzvfoqbzziog6tt';
  $api_secret = 'qemouncosvstpcsjc5zl5h2pxkfdr9kt';

  $api_url_base = 'https://api.weatherlink.com/v2/';

  $gaugedata_filename = "realtimeLSZX.txt";
  $gauge_filePath = "weatherstation-live-gauges/wd/". $gaugedata_filename;

  $start_timestamp =  '1735412400'; // for historical searches only
  $end_timestamp =    '1735423200'; // for historical searches only

  $get_params_current = [
    'api-key' => $api_key
  ];
  $get_params_historic = [
    'api-key' => $api_key,
    'start-timestamp' => $start_timestamp,
    'end-timestamp' => $end_timestamp
  ];

  $api_url_current = $api_url_base . 'current/' . (string)$station_id . '?' . http_build_query($get_params_current);
  $api_url_historic = $api_url_base . 'historic/' . (string)$station_id . '?' . http_build_query($get_params_historic);
  
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $api_url_current); // Set the URL
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return the response as a string
  curl_setopt($ch, CURLOPT_HTTPHEADER, [ // Set the headers
      'x-api-secret: ' . $api_secret
  ]);

  // Execute the cURL request
  $response = curl_exec($ch);

  // Check for errors
  if (curl_errno($ch)) {
      echo 'cURL error: ' . curl_error($ch);
      exit;
  }

  // Decode the JSON response (into php array)
  $response_json = $response;
  $response_array = json_decode($response, true);

  if ($response_array) {
    // Save json file of actual data
    $snapshot_filePath = "snapshots/lszx_live.json";

    // write json file
    $exists = file_exists($snapshot_filePath);
    $fp = fopen($snapshot_filePath, "w");
    fwrite($fp, $response_json);
    fclose($fp);
  } else {
      echo "Failed to decode JSON response";
  }

  // // DEBUG: search for a key in array and output value to 
  // // Search for a key in the result array
  // $searchKey = 'ts';
  // $foundValues = searchKeyInNestedArray($searchKey, $response_array);

  // // Output the results
  // if (!empty($foundValues)) {
  //   echo "all values found for key '$searchKey':\n";
  //   print_r($foundValues);
  //   echo "<br>using: " . reset($foundValues);
  // } else {
  //   echo "Key '$searchKey' not found in the array.";
  // }

  $array_timestamp = searchKeyInNestedArray("ts", $response_array);
  $array_temp = searchKeyInNestedArray("temp", $response_array);
  $array_dewpoint = searchKeyInNestedArray("dew_point", $response_array);
  $array_hum = searchKeyInNestedArray("hum", $response_array);
  $array_qnh = searchKeyInNestedArray("bar_sea_level", $response_array);
  $array_wind_avg = searchKeyInNestedArray("wind_speed_avg_last_2_min", $response_array);
  $array_wind_avg_10 = searchKeyInNestedArray("wind_speed_avg_last_2_min", $response_array);
  $array_wind_max_10 = searchKeyInNestedArray("wind_speed_hi_last_10_min", $response_array);
  $array_wind_dir = searchKeyInNestedArray("wind_dir_scalar_avg_last_2_min", $response_array);
  $array_rainfall = searchKeyInNestedArray("rainfall_daily_mm", $response_array);

  // TODO use historic to get min and max value of day (temp, dewpoint, humidity, qnh)
  // TODO Test Wind (when coding, all wind values were 0)
  // populate values for textfile output (file structure replicates legacy weather station raw data export format for gauge compatibility)
  $_0_date = convertTimestamp(!empty($array_timestamp)? reset($array_timestamp) : 0, 'Europe/Zurich', 'd.m.y'); // date
  $_1_time = convertTimestamp(!empty($array_timestamp)? reset($array_timestamp) : 0, 'Europe/Zurich', 'H:i:s'); // time
  $_2_temp_act = !empty($array_temp) ? fahrenheitToCelsius(reset($array_temp)) : "0.0"; // outside temperature in °C, actual, 1 decimal place
  $_3_temp_dmin = $_2_temp_act; // outside temperature in °C, day minimum, 1 decimal place
  $_4_temp_dmin_t = "00:00"; // time of recorded minimum outside temperature
  $_5_temp_dmax = $_2_temp_act; // outside temperature in °C, day maximum, 1 decimal place
  $_6_temp_dmax_t = "00:00"; // time of recorded maximum outside temperature
  $_7_dew_act = !empty($array_dewpoint) ? fahrenheitToCelsius(reset($array_dewpoint)) : "0.0"; // dew point in °C outside, actual, 1 decimal place
  $_8_dew_dmin = $_7_dew_act; // dew point in °C outside, day minimum, 1 decimal place
  $_9_dew_dmin_t = "00:00"; // time of recorded minimum dew point
  $_10_dew_dmax = $_7_dew_act; // dew point in °C outside, day maximum, 1 decimal place
  $_11_dew_dmax_t = "00:00"; // time of recorded maximum dew point
  $_12_hum_act = !empty($array_hum) ? reset($array_hum) : "0"; // relative air humidity in % outside, actual, integer
  $_13_hum_dmin = $_12_hum_act; // relative air humidity in % outside, day minimum, integer
  $_14_hum_dmin_t = "00:00"; // time of recorded minimum relative air humidity
  $_15_hum_dmax = $_12_hum_act; // relative air humidity in % outside, day maximum, integer
  $_16_hum_dmax_t = "00:00"; // time of recorded maximum relative air humidity
  $_17_qnh_act = !empty($array_qnh) ? inHgToMbar(reset($array_qnh)) : "0.0"; // QNH in mbar, actual, 1 decimal place
  $_18_qnh_dmin = $_17_qnh_act; // QNH in mbar, day minimum, 1 decimal place
  $_19_qnh_dmin_t = "00:00"; // time of recorded minimum QNH
  $_20_qnh_dmax = $_17_qnh_act; // QNH in mbar, day maximum, 1 decimal place
  $_21_qnh_dmax_t = "00:00"; // time of recorded maximum QNH
  $_22_wind_v_act = !empty($array_wind_avg) ? round(reset($array_wind_avg),1) : "0.0"; // wind in m/s, actual, 1 decimal place
  $_23_wind_v_min_10 = "0.0"; // wind in m/s, minimum last 10 minutes, 1 decimal place
  $_24_wind_v_max_10 = "0.0"; // wind in m/s, maximum last 10 minutes, 1 decimal place
  $_25_wind_v_min_60 = "0.0"; // wind in m/s, minimum last 60 minutes, 1 decimal place
  $_26_wind_v_max_60 = "0.0"; // wind in m/s, maximum last 60 minutes, 1 decimal place
  $_27_wind_v_dmax = !empty($array_wind_max_10) ? round(reset($array_wind_max_10),1) : "0.0"; // wind in m/s, minimum day, 1 decimal place
  $_28_wind_v_dmax_t = "00:00"; // time of recorded maximum day wind
  $_29_wind_v_avg = !empty($array_wind_avg_10) ? round(reset($array_wind_avg_10),1) : "0.0"; // average wind in m/s, actual, 1 decimal place
  $_30_wind_v_avg_dmax = "0.0"; // average wind in m/s, day maximum, 1 decimal place
  $_31_wind_v_avg_dmax_t = "00:00"; // time of recorded maximum average wind
  $_32_wind_dir_act = "0"; // wind direction in ° (0° = North), actual, integer
  $_33_wind_dir_avg = !empty($array_wind_dir) ? round(reset($array_wind_dir),0) : "0"; // average wind direction in ° (0° = North), actual, integer
  $_34_rain_rate_act = "0.0"; // rain rate in mm/h, actual, 1 decimal place
  $_35_rain_rate_dmax = "0.0"; // rain rate in mm/h, day maximum, 1 decimal place
  $_36_rain_total_sum_d = !empty($array_rainfall) ? round(reset($array_rainfall),1) : "0.0";; // rain quantity in mm, day, 1 decimal place
  $_37_rain_total_max_month = "0.0"; // rain rate in mm, month max, 1 decimal place
  $_38_rain_total_max_year = "0.0"; // rain rate in mm, year max, 1 decimal place
  $_39_mbsystem_isday = "1"; // 1=day, 0=night

  // simulated raw output of legacy weatherstation uses space-separated values
  $realtime_data = $_0_date . " " . $_1_time . " " . $_2_temp_act . " " . $_3_temp_dmin . " " . $_4_temp_dmin_t . " " . $_5_temp_dmax . " " .
  $_6_temp_dmax_t . " " . $_7_dew_act . " " . $_8_dew_dmin . " " . $_9_dew_dmin_t . " " . $_10_dew_dmax . " " . $_11_dew_dmax_t . " " . $_12_hum_act . " " .
  $_13_hum_dmin . " " . $_14_hum_dmin_t . " " . $_15_hum_dmax . " " . $_16_hum_dmax_t . " " . $_17_qnh_act . " " . $_18_qnh_dmin . " "  . $_19_qnh_dmin_t . " " . 
  $_20_qnh_dmax . " " . $_21_qnh_dmax_t . " " . $_22_wind_v_act . " " . $_23_wind_v_min_10 . " " . $_24_wind_v_max_10 . " " . $_25_wind_v_min_60 . " " .
  $_26_wind_v_max_60 . " " . $_27_wind_v_dmax . " " . $_28_wind_v_dmax_t . " " . $_29_wind_v_avg . " " . $_30_wind_v_avg_dmax . " " . $_31_wind_v_avg_dmax_t . " " . 
  $_32_wind_dir_act . " " . $_33_wind_dir_avg . " " . $_34_rain_rate_act . " " . $_35_rain_rate_dmax . " " . $_36_rain_total_sum_d . " " . 
  $_37_rain_total_max_month . " " . $_38_rain_total_max_year . " " . $_39_mbsystem_isday;
  
  // output results:
  echo "Writing the following weather data to '" . $gauge_filePath . "'<br><br>";
  echo $realtime_data;

  // write to file for gauges (check for file first)
  $fp = fopen($gauge_filePath, "w");
  if (is_resource($fp)){
      fwrite($fp, $realtime_data);
      fclose($fp);  
  } else{
    echo "<br><br>File write failed, check permissions for write path";
  }


  // Recursive function to search for a key in an array
  function searchKeyInNestedArray($key, $array) {
    $results = [];
    
    foreach ($array as $k => $v) {
        if ($k === $key && $v != null) {
            $results[] = $v;
        }
        
        // If the value is an array, recursively search it
        if (is_array($v)) {
            $results = array_merge($results, searchKeyInNestedArray($key, $v));
        }
    }
    
    return $results;
  }

  function fahrenheitToCelsius($fahrenheit) {
    // Formula: Celsius = (Fahrenheit - 32) * 5 / 9
    $celsius = ($fahrenheit - 32) * 5 / 9;
    return round($celsius, 1);
  }

  function inHgToMbar($inHg) {
    // Conversion factor: 1 inHg = 33.8639 mbar
    $mbar = $inHg * 33.8639;
    return round($mbar, 1);
  }

  function convertTimestamp($unixtimestamp, $timezone, $output_format){
    $tz = new DateTimeZone($timezone);
    $datetime = new DateTime("@$unixtimestamp", new DateTimeZone("UTC"));
    $datetime->setTimezone($tz);
    return $datetime->format($output_format);
  }

?>
