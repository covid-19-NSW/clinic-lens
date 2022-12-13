window.predictflag = 0;
window.swithmodeflag = 0;
window.swithlinemodeflag = 0;

function DrawStepLine(lgadata,lgagroupdata, w){
	d3v4_2.select("#step_content")
		.select("#stepsvg").remove();
	var divlegend = d3v4_2
		.select("body")
		.append("div")
		.attr("class", "divlegend");
	// set the dimensions and margins of the graph
	let content_margin = {top: 20, right: 10, bottom: 20, left: 45},
		width = document.getElementById("step_content").clientWidth - content_margin.left - content_margin.right,
		height = document.getElementById("step_content").clientHeight - content_margin.top - content_margin.bottom;
	// append the svg object to the body of the page
	let stepsvg = d3v4_2.select("#step_content")
		.append("svg")
		.attr("id", "stepsvg")
		.attr("width", width + content_margin.left + content_margin.right)
		.attr("height", height + content_margin.top + content_margin.bottom);
	let g = stepsvg.append("g")
		.attr("transform", "translate(" + content_margin.left + "," + content_margin.top + ")");

	console.log(lgadata);
	console.log(lgagroupdata);
	let groups = d3v4_2.map(lgagroupdata, function(d){return(d.date)}).keys();
	console.log(selectLGApredictiondata);
	var subgroups, subgroupsafter;
	if (predictflag == 1){
		subgroups = selectLGApredictiondata[w]["getgroupdataarr"].column.slice(0);
		var subgrouptotal = selectLGApredictiondata[w]["getgroupdataarr"];
		var stackedDataCombined = d3v4_2.stack()
			.keys(subgroups)
			(subgrouptotal)

	}
	else{
		subgroups = lgagroupdata.column.slice(0);
	}
	var cliniccount = subgroups.length;
	// console.log(subgroups);
	// console.log(stackedDataCombined);
	let stackedData = d3v4_2.stack()
		.keys(subgroups)
		(lgagroupdata) // this is new data

// Add X axis --> it is a date format
	const x = d3v4_2.scaleBand().rangeRound([0, width]).padding(0.01);
	const y = d3v4_2.scaleLinear().rangeRound([height, 0]);
	// data.forEach(function(d){
	//   d.value = d.value / 3600;
	// });

	let xScale = x.domain(lgadata.map(function(d) {
		return d.date;
	}));
	y.domain([0, d3v4_2.max(lgadata, function(d) {
		return d.value * 1.5;
	})]);

	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3v4_2.axisBottom(x).tickValues(xScale.domain().filter(function(d,i){
			//console.log(d, i);
			return !(i%30)
		})));

	g.append("g")
		.attr("class", "axis axis--y")
		.call(d3v4_2.axisLeft(y))
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Frequency");

	if (predictflag == 0){
		g.selectAll(".bar")
			.data(stackedData)
			.enter().append("g")
			.attr("fill", "white")
			.attr("stroke", "black")
			.attr("stroke-width", 0.5)
			.selectAll("rect")
			// enter a second time = loop subgroup per subgroup to add all rectangles
			.data(function(d) { return d; })
			.enter().append("rect")
			.attr("x", function(d) {
				//console.log(d);
				return x(d.data.date);
			})
			.attr("y", function(d) {
				//console.log(y(d[1]))
				return y(d[1]);
			})
			.attr("height", function(d) {
				//console.log(y(d[0]-d[1]),y(d[0])-y(d[1]));
				return y(d[0]) - y(d[1]);
			})
			.attr("width",x.bandwidth())
			.on("mousemove",function(d,o){
				divlegend.style("display","none");
				//console.log(d ,o)
				let tempvalue = (d[1] - d[0]).toFixed(5);
				//console.log(Math.round(d["data"]["rate"] * 100000)/1000);
				divlegend.html("Date:" + d.data.date+"</br>"
					+ "LGA: " + d.data.lga_code19 + "</br>"
					+ "ClinicID: " + findKeyByValue(d.data,tempvalue) +  "</br>"
					+ "Predicted Testing: " + Number(d["data"][findKeyByValue(d.data,tempvalue)]).toFixed(2) + "</br>"
				)
					.style("left", (d3v4_2.event.pageX+10) + "px")
					.style("top", (d3v4_2.event.pageY+10) + "px")
					.style("opacity", 0.8)
					.style("display","block")
					.style("z-index", 100)
			})
			.on("mouseout", function (d,o) {
				divlegend.style("display","none");
			})

		predictflag = 1;
	}
	else if (predictflag == 1){
		g.selectAll(".bar").remove();
		g.selectAll(".bar")
			.data(stackedDataCombined)
			.enter().append("g")
			.attr("id",(d,i) =>{
				return "stream_" + d.key;
				//console.log(d,i)
			})
			// .attr("fill-opacity",0)
			.attr("stroke", "black")
			.attr("stroke-width", 0.5)

			.selectAll("rect")
			// enter a second time = loop subgroup per subgroup to add all rectangles
			.data(function(d) { return d; })
			.enter().append("rect")
			.attr("class", "rect")
			.attr("id", function (d,i){
				return "bar_" + i;
			})
			.attr("y", function(d,i) {
				return y(d[1]);
			})
			.attr("height", function(d) {
				//console.log(d);
				return Math.abs(y(d[0]) - y(d[1]));
			})
			.attr("x", function(d,i) {
				// console.log(d.data,i);
				return x(d.data.date);
			})
			.attr("width",x.bandwidth())
			.on("mousemove",function(d,o){
				divlegend.style("display","none");
				//console.log(d ,o)
				let tempvalue = (d[1] - d[0]).toFixed(5);
				//console.log(Math.round(d["data"]["rate"] * 100000)/1000);
				divlegend.html("Date:" + d.data.date+"</br>"
					+ "LGA: " + d.data.lga_code19 + "</br>"
					+ "ClinicID: " + findKeyByValue(d.data,tempvalue) +  "</br>"
					+ "Predicted Testing: " + Number(d["data"][findKeyByValue(d.data,tempvalue)]).toFixed(2) + "</br>"
				)
					.style("left", (d3v4_2.event.pageX+10) + "px")
					.style("top", (d3v4_2.event.pageY+10) + "px")
					.style("opacity", 0.8)
					.style("display","block")
					.style("z-index", 100)
			})
			.on("mouseout", function (d,o) {
				divlegend.style("display","none");
			})
		//
		// console.log(subgroups);
		// console.log(stackedDataCombined);
		d3v4_2.select("#step_content").select("#stepsvg").selectAll(".rect").attr("fill","white")
		for (let te = 0; te < subgroups.length; te++){
			//console.log(subgroups);
			let tempkeyid = subgroups[te];
			if (te%2 == 1){
				let tempselection = d3v4_2.select("#stepsvg").select("g").select("#stream_"+tempkeyid).selectAll(".rect");
				tempselection.attr("fill", (d,o) =>{
						//console.log(d["data"])
						// console.log(tempkeyid+"status");
						// console.log(d["data"][tempkeyid+"status"]);
						if (d["data"][tempkeyid+"status"] == "+"){
							// console.log("+",d["data"])
							return colorpanel.stepline.increase;
						}else if(d["data"][tempkeyid+"status"] == "-") {
							// console.log("-",d["data"])
							return colorpanel.stepline.decrease;
						}
						else {
							return 'white';
						}
					})
					.attr("fill-opacity", 0.7)
					.attr("id", (d,o) =>{
						return d["data"][tempkeyid+"status"];
					})
			}
		}

	}

	// Add the line
	stepsvg.append("path")
		.datum(lgadata)
		.attr("fill", "none")
		.attr("stroke", colorpanel.stepline.previouspath)
		.attr("stroke-width", 1.5)
		.attr("d", d3v4_2.line()
			.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
			.y(function(d) { return y(d.value); }) // set the y values for the line generator
			.curve(d3v4_2.curveStep) // apply smoothing to the line
		)
		.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");
		//.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top)+ ")");

	if(swithmodeflag == 1){
		// Add the line
		stepsvg.append("path")
			.datum(selectLGApredictiondata[w]["getwholedataarr"])
			.attr("fill", "none")
			.attr("stroke", colorpanel.stepline.afterpath)
			.attr("stroke-width", 1.5)
			.attr("d", d3v4_2.line()
				.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
				.y(function(d) { return y(d.value); }) // set the y values for the line generator
				.curve(d3v4_2.curveStep) // apply smoothing to the line
			)
			.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");
	}

}

function DrawCurveLine(lgadata,lgadata2, w){
	d3v4_2.select("#step_content")
		.select("#stepsvg").remove();
	var divlegend = d3v4_2
		.select("body")
		.append("div")
		.attr("class", "divlegend");
	// set the dimensions and margins of the graph
	let content_margin = {top: 20, right: 10, bottom: 20, left: 45},
		width = document.getElementById("step_content").clientWidth - content_margin.left - content_margin.right,
		height = document.getElementById("step_content").clientHeight - content_margin.top - content_margin.bottom;
	// append the svg object to the body of the page
	let stepsvg = d3v4_2.select("#step_content")
		.append("svg")
		.attr("id", "stepsvg")
		.attr("width", width + content_margin.left + content_margin.right)
		.attr("height", height + content_margin.top + content_margin.bottom);
	let g = stepsvg.append("g")
		.attr("transform", "translate(" + content_margin.left + "," + content_margin.top + ")");
	const x = d3v4_2.scaleBand().rangeRound([0, width]).padding(0.01);
	const y = d3v4_2.scaleLinear().rangeRound([height, 0]);

	let xScale = x.domain(lgadata.map(function(d) {
		return d.date;
	}));
	y.domain([0, d3v4_2.max(lgadata, function(d) {
		return d.value * 1.5;
	})]);

	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3v4_2.axisBottom(x).tickValues(xScale.domain().filter(function(d,i){
			//console.log(d, i);
			return !(i%30)
		})));

	g.append("g")
		.attr("class", "axis axis--y")
		.call(d3v4_2.axisLeft(y))
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Frequency");
	stepsvg.append("path")
		.datum(lgadata)
		.attr("fill", "none")
		.attr("stroke", colorpanel.stepline.previouspath)
		.attr("stroke-width", 1.5)
		.attr("d", d3v4_2.line()
			.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
			.y(function(d) { return y(d.value); }) // set the y values for the line generator
			.curve(d3v4_2.curveNatural) // apply smoothing to the line
		)
		.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");

	if (lgadata2.length > 0){
		stepsvg.append("path")
			.datum(lgadata2)
			.attr("fill", "none")
			.attr("stroke", colorpanel.stepline.afterpath)
			.attr("stroke-width", 1.5)
			.attr("d", d3v4_2.line()
				.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
				.y(function(d) { return y(d.value); }) // set the y values for the line generator
				.curve(d3v4_2.curveNatural) // apply smoothing to the line
			)
			.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");
	}


}


function findKeyByValue(obj, value){
	//console.log(Object.keys(obj));
	for (let i = 0; i < Object.keys(obj).length; i++){
		if (obj[Object.keys(obj)[i]].toString().substring(0,5) === value.toString().substring(0,5)){
			return Object.keys(obj)[i];
		}
	}
}

