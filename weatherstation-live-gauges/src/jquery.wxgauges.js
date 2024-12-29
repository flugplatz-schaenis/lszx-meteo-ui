$(function()
{
	var dataurl='wd/realtimeLSZX.txt';
	var updates=30;
	var timeout=60;
	var pausemsg="Update ist unterbrochen, Seite neu laden um fortzufahren<br/>";
	
	var showtemp=true;
	var tempgaugeMax=40;var tempgaugeMin=-20;
	var tempnumbersoffset=13;var tempuom='&deg;C';
	var tempdots=10;var tempdotsoffset=10;
	
	var showdew=true;
	var dewgaugeMax=40;var dewgaugeMin=-20;
	var dewnumbersoffset=13;var dewuom='&deg;C';
	var dewdots=10;var dewdotsoffset=10;
	
	var showhum=true;
	var humgaugeMax=100;var humgaugeMin=0;
	var humnumbersoffset=13;var humuom='%';
	var humdots=20;var humdotsoffset=10;
	
	var showbaro=true;
	var barogaugeMax=1040;var barogaugeMin=960;
	var baronumbersoffset=13;var barouom='hPa';
	var barodots=20;var barodotsoffset=10;
	
	var showwind=true;
	var showdir=true;
	var windgaugeMax=40;var windgaugeMin=0;
	var windnumbersoffset=6;var windpuom='km/h';var winddotsoffset=10;
	var showrain= true;
	var raingaugeheight=180;var rainuom='mm';

	var options={};
	var gactive = true;
	var fo = 0;

	if(showhum){var hum=$("#hum");}
	if(showbaro){var baro=$("#baro");}
	if(showtemp){var temp=$("#temp");}
	if(showdew){var dew=$("#dew");}
	if(showwind){var wind=$("#wind");}
	if(showdir){var dir=$("#dir");}
	if(showrain){var rain=$("#rain");}

	var iteration=0;

	function IsActive()
	{
		$(window).focus(function() { gactive=true; });
	    $(window).blur(function() { gactive=false; });
	    if(gactive){fo++;}else{fo=0;}
	    var t=fo%timeout;
	    if(t==1 && iteration < updates){update();}
	    //$("#debug").html('debug '+gactive+' '+fo+' '+t+' '+iteration+' < '+updates);
	    window.setTimeout(IsActive, 1000);
	};
   IsActive();

	function update()
	{
		function onDataReceived(series)
		{
			iteration++;
			if(iteration==updates)
			{
				$("#pausemsg").html(pausemsg);
				return;
			}
			options.tempgauge=false;
			options.humgauge=false;
			options.barogauge=false;
			options.snowvalue=false;
			options.windgauge=false;
			options.winddirs=false;
			options.raingauge=false;
			options.snow=false;

			var cr=series.split(' ');
			var cu=String(cr[0]).replace(/\//g,".")+' '+cr[1]; //clock date and time
			var crtemp=cr[2];var crmintemp=cr[3];var crmaxtemp=cr[5];
			var crdew=cr[7];var crmindew=cr[8];var crmaxdew=cr[10];
			var crhum=cr[12];var crminhum=cr[13];var crmaxhum=cr[15];
			var crbaro=cr[17];var crminbaro=cr[18];var crmaxbaro=cr[20];
			var crwspd=cr[29];var crmaxgust=cr[24];var crmingust=cr[23];var crmaxgustday=cr[27];
			var crwdir=cr[33];
			var crrain=cr[36];
			
			$("#clock").html(cu);
			$("#pausemsg").html(iteration);

			if((showhum)&&(crhum!=options.humcache))
			{
				options.gaugeMax=humgaugeMax;options.gaugeMin=humgaugeMin;
				options.numbersoffset=humnumbersoffset;
				options.uom=humuom;options.dots=humdots;options.dotsoffset=humdotsoffset;
				options.crvalue=crhum;options.humcache=crhum;
				options.dirgauge=false;options.humgauge=true;
				options.maxval=crmaxhum;options.minval=crminhum;
				$.ga(hum,options);
			}
			
			if((showbaro)&&(crbaro!=options.barocache))
			{
				options.gaugeMax=barogaugeMax;options.gaugeMin=barogaugeMin;
				options.numbersoffset=baronumbersoffset;
				options.uom=barouom;options.dots=barodots;options.dotsoffset=barodotsoffset;
				options.crvalue=crbaro;options.barocache=crbaro;
				options.barogauge=true;options.humgauge=false;options.dirgauge=false;
				options.maxval=crmaxbaro;options.minval=crminbaro;
				$.ga(baro,options);
			}
			if((showtemp)&&(crtemp!=options.tempcache))
			{
				options.gaugeMax=tempgaugeMax;options.gaugeMin=tempgaugeMin;
				options.numbersoffset=tempnumbersoffset;
				options.uom=tempuom;options.dots=tempdots;options.dotsoffset=tempdotsoffset;
				options.crvalue=crtemp;options.tempcache=crtemp;
				options.tempgauge=true;options.humgauge=false;options.humgauge=false;
				options.dirgauge=false;options.barogauge=false;
				options.maxval=crmaxtemp;options.minval=crmintemp;
				$.ga(temp,options);
			}
			if((showdew)&&(crdew!=options.dewcache))
			{
				options.gaugeMax=dewgaugeMax;options.gaugeMin=dewgaugeMin;
				options.numbersoffset=dewnumbersoffset;
				options.uom=dewuom;options.dots=dewdots;options.dotsoffset=dewdotsoffset;
				options.crvalue=crdew;options.dewcache=crdew;
				options.tempgauge=false;options.humgauge=false;options.dirgauge=false;
				options.maxval=crmaxdew;options.minval=crmindew;
				$.ga(dew,options);
			}
			var wchange=false;
			if(crwspd!=options.wscache){wchange=true;}
			if(crwdir!=options.dircache){wchange=true;}
			if(showwind&&wchange)
			{
				options.numbersoffset=windnumbersoffset;
				options.uom=windpuom;options.dotsoffset=winddotsoffset;
				options.crvalue=crwspd;options.wscache=crwspd;
				options.dircrvalue=crwdir;options.dircache=crwdir;
				options.windgauge=true;options.dirgauge=false;
				options.gaugeMax=windgaugeMax;options.gaugeMin=windgaugeMin;
				options.maxval=crmaxgust;options.minval=crmingust;
				options.maxdayvalue = crmaxgustday;
				$.ga(wind,options);
			}
			if(showdir&&wchange)
			{
				options.dircrvalue=crwdir;options.dircache=crwdir;
				options.windgauge=false;options.dirgauge=true;
				$.ga(dir,options);
			}
			if((showrain)&&(crrain!=options.raincache))
			{
				options.raingauge=true;
				options.raingaugeheight=raingaugeheight;options.crvalue=crrain;
				options.raincache=crrain;options.uom=rainuom;options.snow=false;
				$.ga(rain,options);
			}
			
			cr='';
			cr=false;
		}
		$.ajax({url:dataurl,method:'GET',dataType:'text',cache:false,success:onDataReceived,error:function(){}});
	};
});

(function()
{
	jQuery.color={};
	jQuery.color.make=function(E,D,B,C)
	{
		var F={};
		F.r=E||0;F.g=D||0;F.b=B||0;F.a=C!=null?C:1;
		F.add=function(I,H)
			{
				for(var G=0;G<I.length;++G)
				{
					F[I.charAt(G)]+=H
				}
				return F.normalize()
			};
		F.scale=function(I,H)
			{
				for(var G=0;G<I.length;++G)
				{
					F[I.charAt(G)]*=H
				}
				return F.normalize()
			};
		F.toString=function()
			{
				if(F.a>=1)
				{
					return"rgb("+[F.r,F.g,F.b].join(",")+")"
				}
				else
				{
					return"rgba("+[F.r,F.g,F.b,F.a].join(",")+")"
				}
			};
		F.normalize=function()
			{
				function G(I,J,H)
				{
					return J<I?I:(J>H?H:J)
				}
				F.r=G(0,parseInt(F.r),255);
				F.g=G(0,parseInt(F.g),255);
				F.b=G(0,parseInt(F.b),255);
				F.a=G(0,F.a,1);
				return F
			};
		F.clone=function()
			{
				return jQuery.color.make(F.r,F.b,F.g,F.a)
			};
			return F.normalize()
	};
	jQuery.color.extract=function(C,B)
	{
		var D;
		do
		{
			D=C.css(B).toLowerCase();
			if(D!=""&&D!="transparent")
			{
				break
			}
			C=C.parent()
		}while(!jQuery.nodeName(C.get(0),"body"));
		if(D=="rgba(0, 0, 0, 0)")
		{
			D="transparent"
		}
		return jQuery.color.parse(D)
	};
	jQuery.color.parse=function(E)
	{
		var D,B=jQuery.color.make;
		if(D=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(E))
		{
			return B(parseInt(D[1],10),parseInt(D[2],10),parseInt(D[3],10))
		}
		if(D=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(E))
		{
			return B(parseInt(D[1],10),parseInt(D[2],10),parseInt(D[3],10),parseFloat(D[4]))
		}
		if(D=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(E))
		{
			return B(parseFloat(D[1])*2.55,parseFloat(D[2])*2.55,parseFloat(D[3])*2.55)
		}
		if(D=/rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(E))
		{
			return B(parseFloat(D[1])*2.55,parseFloat(D[2])*2.55,parseFloat(D[3])*2.55,parseFloat(D[4]))
		}
		if(D=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(E))
		{
			return B(parseInt(D[1],16),parseInt(D[2],16),parseInt(D[3],16))
		}
		if(D=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(E))
		{
			return B(parseInt(D[1]+D[1],16),parseInt(D[2]+D[2],16),parseInt(D[3]+D[3],16))
		}
		var C=jQuery.trim(E).toLowerCase();
		if(C=="transparent")
		{
			return B(255,255,255,0)
		}
		else
		{
			D=A[C];
			return B(D[0],D[1],D[2])
		}
	};
	var A=
	{
		aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],
		blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],
		darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],
		darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],
		darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],
		gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],
		lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],
		lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],
		maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],
		pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],
		silver:[192,192,192],white:[255,255,255],yellow:[255,255,0]
	}
})();
(function($)
{
	function Ga(placeholder,options_)
	{
		var series=[],options={hooks:{}},canvas=null,
		eventHolder=null,ctx=null,
		maxRadius=null,centerLeft=null,centerTop=null;
		axes={xaxis:{},yaxis:{},x2axis:{},y2axis:{}},
		plotOffset={left:0,right:0,top:0,bottom:0},
		canvasWidth=0,canvasHeight=0,plotWidth=0,plotHeight=0,
		hooks={processOptions:[],processRawData:[],processDatapoints:[],draw:[],bindEvents:[],drawOverlay:[]},
		ga=this;ga.draw=draw;
		ga.getPlaceholder=function(){return placeholder;};
		ga.getCanvas=function(){return canvas;};
		ga.getPlotOffset=function(){return plotOffset;};
		ga.width=function(){return plotWidth;};
		ga.height=function(){return plotHeight;};
		ga.offset=function(){var o=eventHolder.offset();o.left+=plotOffset.left;o.top+=plotOffset.top;return o;};
		ga.getData=function(){return series;};
		ga.getAxes=function(){return axes;};
		ga.getOptions=function(){return options;};
		ga.hooks=hooks;parseOptions(options_);constructCanvas();draw(ctx);
		function executeHooks(hook,args)
		{
			args=[ga].concat(args);
			for(var i=0;i<hook.length;++i)hook[i].apply(this,args);
		}
		function parseOptions(opts)
		{
			$.extend(true,options,opts);
			for(var n in hooks)if(options.hooks[n]&&options.hooks[n].length)hooks[n]=hooks[n].concat(options.hooks[n]);executeHooks(hooks.processOptions,[options]);
		}
		function constructCanvas()
		{
			function makeCanvas(width,height)
			{
				var c=document.createElement('canvas');
				c.width=width;c.height=height;
				if(window.G_vmlCanvasManager)
				{
					c=window.G_vmlCanvasManager.initElement(c);
				}
				return c;
			}
			canvasWidth=placeholder.width();canvasHeight=placeholder.height();
			placeholder.empty();placeholder.html("");
			if(placeholder.css("position")=='static')placeholder.css("position","relative");
			if(canvasWidth<=0||canvasHeight<=0)throw"Invalid dimensions for plot, width = "+canvasWidth+", height = "+canvasHeight;
			if(window.G_vmlCanvasManager)
			{
				window.G_vmlCanvasManager.init_(document);
			}
			canvas=$(makeCanvas(canvasWidth,canvasHeight)).appendTo(placeholder).get(0);ctx=canvas.getContext("2d");
		}
		ga.hooks.draw.push(draw);
		function setupgauge()
		{
			maxRadius=Math.min(canvas.width,canvas.height)/2;
			centerTop=(canvas.height/2);
			centerLeft=(canvas.width/2);
			if(centerLeft<maxRadius)centerLeft=maxRadius;
			else if(centerLeft>canvas.width-maxRadius)centerLeft=canvas.width-maxRadius;
		}
		function draw(newCtx)
		{
			ctx=newCtx;setupgauge();
			drawgauge();
			function drawgauge()
			{
				startAngle=Math.PI*-0.5;
				var shadowoffset=4;
				var radius=maxRadius-shadowoffset;
				centerLeft=centerLeft-shadowoffset/2;
				centerTop=centerTop-shadowoffset/2;
				var raingauge=options.raingauge;
				if(raingauge){var gh=options.raingaugeheight;}
				ctx.clearRect(0,0,canvas.width,canvas.height);
				if(options.notusebgimage)
				{
					var gradient=ctx.createLinearGradient(radius,0,radius,radius*2);
					var gradientColors=options.gradient.colors;
					var ca=(1/(gradientColors.length-1))*1;
					var cc=ca;gradient.addColorStop(0,gradientColors[0]);
					for(var i=1,l=gradientColors.length;i<l-2;++i)
					{
						gradient.addColorStop(cc,gradientColors[i]);
						cc=cc+ca;
					}
					gradient.addColorStop(1,gradientColors[i]);
					var round=10;
					ctx.lineJoin="round";ctx.globalAlpha=1;ctx.beginPath();
					if(raingauge)
					{
						ctx.arc(radius*2-(round/2),round+1+shadowoffset,round,-Math.PI/2,0,0);
						ctx.arc(radius*2-(round/2),gh-(round/2),round,0,Math.PI/2,0);
						ctx.arc(round+1+shadowoffset,gh-(round/2),round,Math.PI/2,Math.PI,0);
						ctx.arc(round+1+shadowoffset,round+1+shadowoffset,round,Math.PI,3*Math.PI/2,0);
					}
					else
					{
						ctx.arc(radius*2-(round/2),round+1+shadowoffset,round,-Math.PI/2,0,0);
						ctx.arc(radius*2-(round/2),radius*2-(round/2),round,0,Math.PI/2,0);
						ctx.arc(round+1+shadowoffset,radius*2-(round/2),round,Math.PI/2,Math.PI,0);
						ctx.arc(round+1+shadowoffset,round+1+shadowoffset,round,Math.PI,3*Math.PI/2,0);
					}
					var alpha=0.2;
					ctx.globalAlpha=alpha;
					var shadow=ctx.createLinearGradient(0,0,radius*2,radius*2);
					shadow.addColorStop(0,'rgba(0,0,0,0.1)');
					shadow.addColorStop(1,'rgba(0,0,0,0.1)');
					ctx.fillStyle=shadow;ctx.closePath();ctx.fill();ctx.globalAlpha=1;
					ctx.save();ctx.restore();ctx.beginPath();
					if(raingauge)
					{
						ctx.arc(radius*2-(round/2)-shadowoffset,round+1,round,-Math.PI/2,0,0);
						ctx.arc(radius*2-(round/2)-shadowoffset,gh-round-shadowoffset,round,0,Math.PI/2,0);
						ctx.arc(round+1,gh-round-shadowoffset,round,Math.PI/2,Math.PI,0);
						ctx.arc(round+1,round+1,round,Math.PI,3*Math.PI/2,0);
					}
					else
					{
						ctx.arc(radius*2-(round/2)-shadowoffset,round+1,round,-Math.PI/2,0,0);
						ctx.arc(radius*2-(round/2)-shadowoffset,radius*2-(round/2)-shadowoffset,round,0,Math.PI/2,0);
						ctx.arc(round+1,radius*2-(round/2)-shadowoffset,round,Math.PI/2,Math.PI,0);
						ctx.arc(round+1,round+1,round,Math.PI,3*Math.PI/2,0);
					}
					ctx.fillStyle=gradient;ctx.closePath();ctx.fill();ctx.globalAlpha=1;
					ctx.save();ctx.restore();
				}
				ctx.translate(centerLeft,centerTop);
				currentAngle=startAngle;var angle=360;
				var radians=function(deg){return deg*Math.PI/180;};
				var a=135;var html='';var minData=options.gaugeMin;
				var maxData=options.gaugeMax;var range=(maxData-minData);
				var angleSpan=1.50;var startAngle=0.75;var gaugeValue=options.crvalue;
				var uom=options.uom;var numbersoffset=options.numbersoffset;
				var dotsoffset=options.dotsoffset;var dotintervall=options.dots;
				var windgauge=options.windgauge;var snowv=options.snowvalue;
				var halfAngle=((currentAngle+angle)+currentAngle)/2;
				var xx=centerLeft+Math.round(Math.cos(halfAngle));
				var yy=centerTop+Math.round(Math.sin(halfAngle))*options.tilt;
				var tempgauge=options.tempgauge;var barogauge=options.barogauge;
				var dirgauge=options.dirgauge;var humgauge=options.humgauge;
				
				colors = [new rgbaColor(254, 254, 254, 1),
						new rgbaColor(210, 210, 210, 1),
						new rgbaColor(179, 179, 179, 1),
						new rgbaColor(238, 238, 238, 1),
						new rgbaColor(160, 160, 160, 1),
						new rgbaColor(238, 238, 238, 1),
						new rgbaColor(179, 179, 179, 1),
						new rgbaColor(210, 210, 210, 1),
						new rgbaColor(254, 254, 254, 1)];
				fractions = [0.0,0.125,0.25,0.3472222222,0.5,0.6527777778,0.75,0.875,1.0];

				if(raingauge)
				{
					if(uom=='in'){gaugeValue=(gaugeValue*.0393700787).toFixed(2);}
					var rainvalue=gaugeValue;
					if(rainvalue<10){var rainmax=10;}
					if(rainvalue>=10){var rainmax=50;}
					if(rainvalue>50){var rainmax=100;}
					if(rainvalue>100){var rainmax=500;}
					if(rainvalue>500){var rainmax=1000;}
					if(rainvalue>1000){var rainmax=5000;}
					var bh=(gh*0.75);ctx.beginPath();
					var ch=(gh*0.85);ctx.beginPath();
					ctx.strokeStyle='rgb(100,100,100)';ctx.lineWidth=20;
					ctx.moveTo(7,-gh*0.445);ctx.lineTo(7,(-gh*0.35)+bh);
					ctx.closePath();ctx.stroke();ctx.save();ctx.restore();

					if(rainvalue>0)
					{
						ctx.beginPath();
						var rain=ctx.createLinearGradient(radius,-gh*0.4,radius,gh*0.75*(rainvalue/rainmax)-1);
						if(snowv)
						{
							rain.addColorStop(0,'rgba(255,255,255,1)');
							rain.addColorStop(1,'rgba(255,255,255,1)');
						}
						else
						{
							rain.addColorStop(0,'rgba(79,148,205,1)');
							rain.addColorStop(1,'rgba(135,206,255,1)');
						}
						ctx.fillStyle=rain;ctx.strokeStyle=rain;ctx.lineWidth=1;
						ctx.rect(-3,-gh*0.445+(ch-(ch*(rainvalue/rainmax))),20,ch*(rainvalue/rainmax));
						ctx.closePath();ctx.fill();ctx.save();ctx.restore();
					}
					
					ctx.translate(0,0);
					ctx.strokeStyle = 'rgb(45, 57, 57)';ctx.lineWidth=1.5;ctx.beginPath();
					for(var i=1;i<10;i++)
					{
						var to=((ch/10)*i);
						ctx.moveTo(-radius/6,(-gh*0.45)+to);
						ctx.lineTo(radius*0.37,(-gh*0.45)+to);
					}
					ctx.closePath();ctx.stroke();ctx.save();ctx.restore();
					var html='<span  class="valuelabel2" id="gaugeLabel99" style="display:block;position:absolute;top:'+(gh+9)+'px;width:'+radius*2+'px;text-align:center;"><div style="width:50px;margin:0 auto;">'+rainvalue+" "+uom+"</div></span>";
					placeholder.append(html);
					for(var i=0;i<6;i++)
					{
						var move=18+(ch/5*i)*1;
						var numb=rainmax-(i*(rainmax/5));
						var html='<span class="gaugelabel2" id="gaugeLabel'+i+'" style="position:absolute;display:block;text-align: right;top:'+(move)+'px;left:'+Math.floor(radius-radius/2)+'px;width: 15px;">'+numb+"</span>";placeholder.append(html);
					}
					
					// WIND SPEEDOMETER
				}else if(windgauge)
				{
					if(uom=='m/s')
					{
						gaugeValue=(gaugeValue*1).toFixed(1);
						maxvalue = (options.maxval*1).toFixed(1);
						minvalue = (options.minval*1).toFixed(1);
						maxdayvalue = (options.maxdayvalue*1).toFixed(1);
					}
					else if(uom=='km/h')
					{
						gaugeValue=(gaugeValue*3.6).toFixed(1);
						maxvalue = (options.maxval*3.6).toFixed(1);
						minvalue = (options.minval*3.6).toFixed(1);
						maxdayvalue = (options.maxdayvalue*3.6).toFixed(1);
					}
					if(maxdayvalue > 40)
					{
						maxData = Math.ceil((parseInt(maxdayvalue)+10)/10)*10;
						minData = Math.floor((parseInt(minvalue)-10)/10)*10;
					}

					var outvalue=(Math.PI*(startAngle+gaugeValue*angleSpan/(20-0)));
					var RAD_FACTOR = Math.PI / 270;
					freeAreaAngle = 60 * RAD_FACTOR;
					angleRange = 2 * Math.PI - freeAreaAngle;
					centerX = 0;
					centerY = 0;
					imageWidth = radius;
					imageHeight = radius;
					degAngleRange = angleRange / Math.PI * 180;
					
					ctx.save();ctx.lineWidth = 14;ctx.beginPath();
					ctx.translate(centerX, centerY);
					ctx.rotate(Math.PI*startAngle);
					ctx.translate(-centerX, -centerY);
					ctx.arc(centerX, centerY, imageWidth * 0.76, 0, 270 * Math.PI / 180, false);
					ctx.strokeStyle = 'rgb(150,150,150)';
					ctx.stroke();ctx.restore();
					
					uh = ((maxvalue-minData)/(maxData-minData))*(Math.PI+(Math.PI/2));
					uu = ((minvalue-minData)/(maxData-minData))*(Math.PI+(Math.PI/2));
					ctx.save();ctx.lineWidth = 14;ctx.beginPath();
					ctx.translate(centerX, centerY);
					ctx.rotate(Math.PI*startAngle);
					ctx.translate(-centerX, -centerY);
					ctx.arc(centerX, centerY, imageWidth * 0.76, uu, uh, false);
					ctx.strokeStyle = 'rgba(255, 165, 0, 1.0)';ctx.stroke();ctx.restore();   
        
					var numbers=minData;                  
					for(var i=0;i<=(maxData-minData);++i)
					{
						lw = 1.5; ll = 14;
						var xx=(Math.cos(radians(a))*(radius-dotsoffset+.1));
						var yy=(Math.sin(radians(a))*(radius-dotsoffset+.1));
						var Mx=(Math.cos(radians(a))*(radius-dotsoffset-ll));
						var My=(Math.sin(radians(a))*(radius-dotsoffset-ll));
						var labelx=(centerLeft+Math.cos(radians(a-2))*(radius-33));
						var labely=(centerTop+Math.sin(radians(a-2))*(radius-33));
						a+=270/(maxData-minData);
						ctx.lineWidth = lw;ctx.strokeStyle = 'rgba(60, 90, 90, 1)';
						ctx.beginPath();ctx.moveTo(xx, yy);
						ctx.lineTo(Mx, My);ctx.closePath();
						ctx.stroke();ctx.save();ctx.restore();
						n = parseInt((maxData-minData)/10);
						if(i%n==0)
						{
							if(numbers<10)
							{
								var offset=1;
							}
							if(numbers>=10){var offset=2;}
							var html='<span class="gaugelabel2" id="gaugeLabel'+i+'" style="position:absolute;top:'+(labely-7)+'px;left:'+(labelx-4-offset)+'px;">'+numbers+"</span>";
							placeholder.append(html);
						}
						++numbers;
					}

					//Clock hand
					var needlevalue=gaugeValue;
					var outvalue=(Math.PI*(startAngle+(needlevalue-minData)*angleSpan/(maxData-minData)));
					ctx.beginPath();ctx.translate(0,0);ctx.moveTo(0,0);
					ctx.rotate(outvalue);
					ctx.lineWidth=2;ctx.lineCap="round";
					ctx.lineTo(0,4);ctx.lineTo((radius-30),0);ctx.lineTo(0,-4);
					grad = ctx.createLinearGradient((0.4719626168224299 * radius), (0.49065420560747663 * radius), ((0.4719626168224299 + 0.056074766355140186) * radius), (0.49065420560747663 * radius));
					grad.addColorStop(0.0, 'rgba(255, 165, 0 ,1.0)');
					grad.addColorStop(0.46, 'rgba(255, 165, 0 ,1.0)');
					grad.addColorStop(0.47, 'rgba(255, 165, 0 ,1.0)');
					grad.addColorStop(1.0, 'rgba(255, 165, 0 ,1.0)');
					ctx.fillStyle = grad;
					ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
					ctx.shadowOffsetY = 1;ctx.shadowBlur = 2;ctx.closePath();
					ctx.fill();ctx.restore();ctx.beginPath();
					ctx.translate(0,0);
					ctx.arc(0,0,radius/10,0,Math.PI*2,true);
					var radgrad=ctx.createRadialGradient(0,0,2,0,0,9);
					radgrad.addColorStop(0,'#777');
					radgrad.addColorStop(1,'#333');
					ctx.closePath();ctx.fillStyle=radgrad;ctx.fill();ctx.save();ctx.restore();
					//max red mark
					var maavalue=(Math.PI*(startAngle+(maxdayvalue-minData)*angleSpan/(maxData-minData)));
					ctx.beginPath();ctx.translate(0,0);
					ctx.rotate(maavalue - outvalue);
					ctx.moveTo((radius-9),-6);
					ctx.lineTo((radius-25),0);
					ctx.lineTo((radius-9),6);
					ctx.lineTo((radius-9),-3);
					ctx.fillStyle = 'rgba(205,55,0, 1)';
					ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
					ctx.shadowOffsetY = 1;
					ctx.shadowBlur = 2;ctx.closePath();ctx.fill();ctx.restore();
					//Label
					var html='<span  class="valuelabel2" id="gaugeLabel99" style="position:absolute;text-align: center;display:block;width:30px;top:'+Math.floor(centerTop+radius/3-8)+'px;left:'+Math.floor(centerLeft-20)+'px;"><div>'+gaugeValue+'<div style="padding-top: 10px;">'+uom+'</div></div></span>';
					placeholder.append(html);

					// DIRGAUGE
				}
				else if(dirgauge)
				{
					centerX = 0;
					centerY = 0;
					imageWidth = radius*2.0;
					imageHeight = radius*2.0;
					var angle = this.value;
					ctx.strokeStyle = 'rgba(100,100,100, 1)';

					// Needle          
					ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
					ctx.shadowOffsetY = 2;
					ctx.shadowBlur = 2;
					ctx.save(); 
					ctx.fillStyle='rgba(255, 165, 0 ,1.0)';
					var wdir=options.dircrvalue;var wdir=(Math.PI*(-0.5+wdir*2/360));ctx.rotate(wdir);
					ctx.beginPath();
					ctx.translate(centerX, centerY);
					ctx.moveTo(0, 0);
					ctx.moveTo(59,0);
					ctx.lineTo(6,-6);ctx.bezierCurveTo(6,-2,6,2,6,6);ctx.lineTo(59,0);ctx.closePath();
					ctx.fill();ctx.save();
					ctx.fillStyle='rgba(80, 110, 255 ,1.0)';
					ctx.beginPath();ctx.moveTo(-59,0);ctx.lineTo(-6,-6);ctx.bezierCurveTo(-6,-2,-6,2,-6,6);ctx.lineTo(-59,0);ctx.closePath();
					ctx.fill();ctx.save();ctx.restore();
					ctx.beginPath();ctx.translate(0,0);
					ctx.arc(0,0,radius/8,0,Math.PI*2,true);
					var radgrad=ctx.createRadialGradient(0,0,2,0,0,9);radgrad.addColorStop(0,'#777');
					radgrad.addColorStop(1,'#333');
					ctx.closePath();
					ctx.fillStyle=radgrad;ctx.fill();ctx.save();
					//Label
					var html='<span  class="valuelabel2" id="gaugeLabel99" style="position:absolute;text-align: center;display:block;width:30px;top:'+Math.floor(centerTop+radius/2+3)+'px;left:'+Math.floor(centerLeft-20)+'px;"><div>'+options.dircrvalue+'°</div></span>';
					placeholder.append(html);

					// OTHER GAUGES
				}
				else
				{

					var maxvalue = options.maxval;
					var minvalue = options.minval;
					var numbers=minData;
					if(uom=='&deg;F'){gaugeValue=((gaugeValue*1.8)+32*1).toFixed(1);}
					if(uom=='in'){gaugeValue=(gaugeValue/33.86388158*1).toFixed(2);}
					var needlevalue=gaugeValue;
					if(minData<0)
					{
						var huh=minData-minData-minData;minData='0';maxData=maxData+huh;
						var hum=needlevalue-needlevalue-needlevalue;var needlevalue=huh-hum;
						var ham=maxvalue-maxvalue-maxvalue;var maxvalue=huh-ham;
						var him=minvalue-minvalue-minvalue;var minvalue=huh-him;
					}
					if(uom=='uvi'){range=100;}
					for(var i=0;i<=range;++i)
					{
						if(uom=="w/m&sup2;")
						{
							var gh = 50;
							if(i%50==0){ lw = 1; ll = 2;}
							if(i%100==0){ lw = 1.2; ll = 4;}
						}
						else
						{
							var gh = 5;
							if(i%5==0){ lw = 1; ll = 2;}
							if(i%10==0){ lw = 1.2; ll = 4;}
						}
						var xx=(Math.cos(radians(a))*(radius-dotsoffset));
						var yy=(Math.sin(radians(a))*(radius-dotsoffset));
						var Mx=(Math.cos(radians(a))*(radius-dotsoffset-ll));
						var My=(Math.sin(radians(a))*(radius-dotsoffset-ll));
						if(uom=='uvi'){a+=270/(100);}
						else{a+=270/(maxData-minData);}
						
						// ticks
						if(i%gh==0)
						{
							ctx.lineWidth = lw;
							ctx.strokeStyle = 'rgba(200, 200, 200, 1)';
							ctx.beginPath();ctx.moveTo(xx, yy);
							ctx.lineTo(Mx, My);ctx.closePath();
							ctx.stroke();ctx.save();ctx.restore();
						}
						if(uom=='uvi'){var dotintervall=10;}
						if(i%dotintervall==0)
						{
							var labelx=(centerLeft+Math.cos(radians(a-2))*(radius-numbersoffset-12));
							var labely=(centerTop+Math.sin(radians(a-2))*(radius-numbersoffset-12));
							if(numbers<10){var offset=1;}
							if(numbers<=-10){var offset=2;}
							if(numbers>=10){var offset=2;}
							if(numbers>=100){var offset=4;}
							if(numbers>=1000){var offset=10;}
							if(uom=='uvi'){var number=numbers/10;var offset=0;}
							else{var number=numbers;}
							var html='<span class="gaugelabel2" id="gaugeLabel'+i+'" style="position:absolute;top:'+(labely-8)+'px;left:'+(labelx-4-offset)+'px;">'+number+"</span>";placeholder.append(html);
						}
						++numbers;
					}
					if(tempgauge||barogauge||humgauge){var tr = options.trnd;}
					else{var tr = '';}
					if(tr>0)
					{
						tr='<span class="misc up_red" style="display:inline-block;position:absolute;top:'+(Math.floor(centerTop+radius/3)+15)+'px;left:'+Math.floor(centerLeft+15)+'px;"></span>';
					}
					else if(tr<0)
					{
						tr='<span class="misc down_blue" style="display:inline-block;position:absolute;top:'+(Math.floor(centerTop+radius/3)+15)+'px;left:'+Math.floor(centerLeft+15)+'px;"></span>';
					}
					else{tr="";}
					placeholder.append(tr);
					
					var outvalue=(Math.PI*(startAngle+needlevalue*angleSpan/(maxData-minData)));
					ctx.beginPath();ctx.translate(0,0);ctx.moveTo(0,0);
					ctx.rotate(outvalue);ctx.lineWidth=2;ctx.lineCap="round";
					ctx.lineTo(0,4);ctx.lineTo((radius-15),0);ctx.lineTo(0,-4);
					grad = ctx.createLinearGradient((0.4719626168224299 * radius), (0.49065420560747663 * radius), ((0.4719626168224299 + 0.056074766355140186) * radius), (0.49065420560747663 * radius));
					grad.addColorStop(0.0, 'rgba(255, 165, 0 ,1.0)');
					grad.addColorStop(0.46, 'rgba(255, 165, 0 ,1.0)');
					grad.addColorStop(0.47, 'rgba(255, 165, 0 ,1.0)');
					grad.addColorStop(1.0, 'rgba(255, 165, 0 ,1.0)');
					ctx.fillStyle = grad;ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
					ctx.shadowOffsetY = 1;ctx.shadowBlur = 2;ctx.closePath();
					ctx.fill();ctx.restore();ctx.beginPath();ctx.translate(0,0);
					ctx.arc(0,0,radius/10,0,Math.PI*2,true);
					var radgrad=ctx.createRadialGradient(0,0,2,0,0,9);
					radgrad.addColorStop(0,'#777');
					radgrad.addColorStop(1,'#333');
					ctx.closePath();ctx.fillStyle=radgrad;ctx.fill();ctx.save();ctx.restore();
					
					var maavalue=(Math.PI*(startAngle+maxvalue*angleSpan/(maxData-minData)));
					ctx.beginPath();ctx.translate(0,0);ctx.rotate(-outvalue);ctx.rotate(maavalue);
					ctx.moveTo((radius-12),-4);ctx.lineTo((radius-22),0);
					ctx.lineTo((radius-9),4);ctx.lineTo((radius-9),-3);
					ctx.fillStyle = 'rgba(205,55,0, 1)';ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
					ctx.shadowOffsetY = 1;ctx.shadowBlur = 2;ctx.closePath();ctx.fill();ctx.restore();
					if(uom!='uvi'&&uom!="w/m&sup2;")
					{
						var miivalue=(Math.PI*(startAngle+minvalue*angleSpan/(maxData-minData)));
						ctx.beginPath();
						ctx.translate(0,0);
						ctx.rotate(-maavalue);ctx.rotate(miivalue);
						ctx.moveTo((radius-12),-4);ctx.lineTo((radius-22),0);
						ctx.lineTo((radius-9),4);ctx.lineTo((radius-9),-3);
						ctx.fillStyle = 'rgba(79,148,205, 1)';
						ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
						ctx.shadowOffsetY = 1;ctx.shadowBlur = 2;
						ctx.closePath();ctx.fill();ctx.restore();
					}
					var html='<span  class="valuelabel2" id="gaugeLabel99" style="position:absolute;text-align: center;display:block;width:30px;top:'+Math.floor(centerTop+radius/3-8)+'px;left:'+Math.floor(centerLeft-20)+'px;"><div>'+gaugeValue+'<div style="padding-top: 10px;">'+uom+'</div></div></span>';placeholder.append(html);
				} // EOF Other gauge
			}
		}
	}

	$.ga=function(placeholder,options){var ga=new Ga($(placeholder),options);return ga;};
})(jQuery);

var rgbaColor = function(r, g, b, a) {
        var red;
        var green;
        var blue;
        var alpha;
        validateColors();
        function validateColors() {
            red = 0 > r ? 0 : r;
            red = 255 < r ? 255 : r;
            green = 0 > g ? 0 : g;
            green = 255 < g ? 255 : g;
            blue = 0 > b ? 0 : b;
            blue = 255 < b ? 255 : b;
            alpha = 0 > a ? 0 : a;
            alpha = 1 < a ? 1 : a;
        }
        this.getRed = function() {return red;};
        this.setRed = function(r) {red = 0 > r ? 0 : r; red = 255 < r ? 255 : r;};
        this.getGreen = function() { return green;};
        this.setGreen = function(g) {green = 0 > g ? 0 : g;green = 255 < g ? 255 : g;};
        this.getBlue = function() { return blue;};
        this.setBlue = function(b) {blue = 0 > b ? 0 : b;blue = 255 < b ? 255 : b;};
        this.getAlpha = function() {return alpha;};
        this.setAlpha = function(a) {alpha = 0 > a ? 0 : a;alpha = 1 < a ? 1 : a;};
        this.getRgbaColor = function() {return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';};
        this.getRgbColor = function() {return 'rgb(' + red + ', ' + green + ', ' + blue + ')';};
        this.getHexColor = function() {return '#' + red.toString(16) + green.toString(16) + blue.toString(16);}
};