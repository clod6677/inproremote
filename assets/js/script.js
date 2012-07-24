$(document).ready(function(){
	
	// Caching some of the selectors for better performance
	var performancePlotSouth = $('#plotsouth'),
		performancePlotNorth = $('#plotnorth');
	
	
	var PrepareDraw = function(obj){
		
		obj.bind('render',function(e,plotData,labels){

				var ticksLength = 7;

				// Using the Flot jQuery plugin to generate
				// the performance graph:
			
				var plot = $.plot(obj,
					[{
						// Passing the datapoints received as a parameter
						// and setting the color and legend label.
					
						data: plotData,
						color:'#86c9ff',
						label: "Traffic Jam in km"
					}], {
							series: {
								// Setting additional options for the styling.
								lines: {
									show:true,
									fill:true,
									fillColor:'rgba(237,247,255,0.4)',
									lineWidth:1
								},
							shadowSize: 0,
							points: { show: (labels.length == 1) }
							},
							grid: {
								tickColor:'#e0e0e0',
								hoverable: true,
								borderWidth:1,
								borderColor:'#cccccc'
							},
							xaxis:{
						
								// This function is called by the plugin
								// which passes a "range" object. The function
								// must generate an array with the divisions ticks:
						
								ticks:function(range){
	
									ticksLength = range.max-range.min;
									var dv = 1;
							
									// Trying to find a suitable number of ticks,
									// given the varying number of data points in
									// the
									// graph:
							
									while(ticksLength>12){
										ticksLength = Math.floor(ticksLength/++dv);
										if(dv>30) break;
									}
							
									var ratio = (range.max-range.min)/ticksLength,
										ret = [];
								
									ticksLength++;
							
									for(var i=0;i<ticksLength;i++){
										ret.push(Math.floor(i*ratio));
									}
							
									return ret;
								}
							}
						}
					)										

				// The Flot plugin has some limitations. In the snippet below
				// we are replacing the ticks with proper, more descriptive lables:
				
				var elem = $('div.tickLabel').slice(0,ticksLength).each(function(){
					var l = $(this);
					l.text(labels[parseInt(l.text())]);
				}).last().next().hide();
				
				
				// Displaying a tooltip over the points of the plot:
				
				var prev = null;
				$('div').bind("plothover", function (e,pos,item) {
		
					if (item) {
		
						if(item.datapoint.toString() == prev){
							return;
						}
						
						prev = item.datapoint.toString();
						
						// Calling the show method of the tooltip object,
						// with X and Y coordinates, and a tooltip text:
						
						tooltip.show(
							item.pageX,
							item.pageY,
							currentData.chart.tooltip.replace('%2',item.datapoint[1])
													 .replace('%1',currentData.chart.data[item.dataIndex].label)
						);
					}
					else {
						tooltip.hide();
						prev = null;
					}
		
				});
		
			}).bind("mouseleave",function(){
				tooltip.hide();
				prev = null;			
			});
	}


	
	// This object provides methods for hiding and showing the tooltip:
	
	var tooltip = {
		show : function(x, y, str) {

			if(!this.tooltipObj){
				this.tooltipObj = $('<div>',{
					id		: 'plotTooltip',
					html	: str,
					css		: {
						opacity	: 0.75
					}
				}).appendTo("body");
			}
			
			this.tooltipObj.hide().html(str);
			var width = this.tooltipObj.outerWidth();
			
			this.tooltipObj.css({left: x-width/2, top: y+15}).fadeIn(200);
		},
		hide : function(){
			$("#plotTooltip").hide();
		}
	}

	// Loading the data for the last 24hours on page load:
	//loadPeriod('24hours','/getdatasouth/',performancePlotSouth);
	//loadPeriod('24hours','/getdatanorth/',performancePlotNorth);
	loadPeriod();

	
	// This function fetches AJAX data.
	function loadPeriod(){
			
		// Otherwise initiate an AJAX request:
		$.get('/getdata/',function(r){
				//render(r.chartsouth,performancePlotSouth);	//doesn't work on both !!!
			render(r.chartnorth,performancePlotNorth);
				
		},'json');
		
		$.get('/getdata/',function(r){
			//render(r.chartsouth,performancePlotSouth);	//doesn't work on both !!!
		render(r.chartsouth,performancePlotSouth);
			
		},'json');
		
		
		
		//render the object in location (div)
		function render(chart,location){

			var plotData = [],
				labels = [];
			
			// Generating plotData and labels arrays.
			$.each(chart.data,function(i){
				plotData.push([i,this.value]);
				labels.push(this.label);
			});
			
			PrepareDraw(location);
			location.trigger('render',[plotData, labels]);
			
		}
	}
});
