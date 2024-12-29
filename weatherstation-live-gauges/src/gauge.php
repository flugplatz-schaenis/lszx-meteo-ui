<!DOCTYPE HTML>
<html lang="en">
 <head>
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <title>JQuery weathergauges 2 Examples</title>
    
    <script type="text/javascript" src="jquery.1.6.4.min.js"></script>
    <script type="text/javascript" src="jquery.flot.js"></script>
    <script type="text/javascript" src="jquery.wxgauges.js"></script>
	
	<style>

    .gaugelabel2 {font-size:8px;font-family:Tahoma,sans-serif;font-weight:bold;color:#e5e5e5;text-align:center}
    .valuelabel2 div{font-size:9px;font-family:Tahoma,sans-serif;font-weight:bold;color:#f1f1f1;text-align:center;width:40px}
    .graph {width:150px;height:150px;background:url('images/gauge.png') 0px 0px no-repeat;}
    .raingraph {width:100px;height:220px;background:url('images/gauge_rain.png') no-repeat;}
    .dirgraph {width:150px;height:150px;background:url('images/gauge_compass.png') 0px 0px no-repeat;}
    .gaugetd {width:25%;text-align:center;vertical-align:top;}
		
    </style>
</head>
<body>
    <h1>Flugplatz Schaenis Wetter Testseite</h1>
autoupdate jede Minute, maximal 30 Updates<br/>
    <div id="pausemsg"></div><br/>
    <div id="clock"></div>
    <div id="temp" class="graph"></div>
    <p>Temperatur</p>
    <div id="dew" class="graph"></div>
    <p>Taupunkt</p>
    <div id="hum" class="graph"></div>
    <p>Relative Feuchtigkeit</p>
    <div id="baro" class="graph"></div>
    <p>Luftdruck QNH</p>
    <div id="wind" class="graph"></div>
    <p>Windgeschwindigkeit</p>
    <div id="dir" class="dirgraph"></div>
    <p>Windrichtung</p>
    <div id="rain" class="raingraph"></div>
    <p>Regenmenge pro Tag</p>
 </body>
</html>