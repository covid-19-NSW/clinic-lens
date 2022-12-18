window.predictflag = 0;
window.swithmodeflag = 0;
window.swithlinemodeflag = 0;


function DrawStepLine(lgadata,lgagroupdata, w, flag){
	// console.log(selectLGApredictiondata);
	// console.log(lgadata);
	// console.log(lgagroupdata);

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
	var subgroups;
	if (predictflag == 0){
		subgroups = lgagroupdata.column.slice(0);
		//have not clicked on prediction button
	}
	else{
		subgroups = selectLGApredictiondata[w]["getgroupdataarr"].column.slice(0);
		var subgrouptotal = selectLGApredictiondata[w]["getgroupdataarr"];
		var stackedDataCombined = d3v4_2.stack()
			.keys(subgroups)
			(subgrouptotal)
	}

	let stackedData = d3v4_2.stack()
		.keys(subgroups)
		(lgagroupdata) // this is new data

	const x = d3v4_2.scaleBand().rangeRound([0, width]).padding(0.01);
	const y = d3v4_2.scaleLinear().rangeRound([height, 0]);

	let xScale = x.domain(lgadata.map(function(d) {
		return d.date;
	}));
	let yScale = y.domain([0, d3v4_2.max(lgagroupdata, function(d) {
		return d.value * 1.2;
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
		.text("");

	if (predictflag == 0){

		stepsvg.append("path")
			.datum(lgagroupdata)
			.attr("id", 'Path_Before')
			.attr("class", "path")
			.attr("fill", "none")
			.attr("stroke", colorpanel.stepline.actualpath)
			// .attr("stroke-opacity", 0.5)
			.attr("stroke-width", 1.5)
			.attr("d", d3v4_2.line()
				.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
				.y(function(d) { return y(d.value); }) // set the y values for the line generator
				.curve(d3v4_2.curveStep) // apply smoothing to the line
			)
			.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");

		stepsvg.append("path")
			.datum(lgadata)
			.attr("id", 'Path_groundturth')
			.attr("class", "path")
			.attr("stroke-dasharray", 2)
			.attr("fill", "none")
			.attr("stroke", colorpanel.stepline.groundturth)
			.attr("stroke-width", 1)
			.attr("d", d3v4_2.line()
				.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
				.y(function(d) { return y(d.value); }) // set the y values for the line generator
				.curve(d3v4_2.curveStep) // apply smoothing to the line
			)
			.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");

		g.selectAll(".bar")
			.data(stackedData)
			.enter().append("g")
			.attr("fill", "white")
			.attr("stroke", "gray")
			.attr("stroke-width", 0.3)
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



	}
	else if (predictflag == 1){
		stepsvg.selectAll(".path").remove();
		g.selectAll(".bar").remove();

		if (w == selectLGApredictiondata.length - 1){
			stepsvg.append("path")
				.datum(selectLGApredictiondata[w-1].getgroupdataarr)
				.attr("id", 'Path_groundturth')
				.attr("class", "path")
				.attr("fill", "none")

				.attr("stroke", colorpanel.stepline.actualpath)
				.attr("stroke-width", 1.5)
				.attr("d", d3v4_2.line()
					.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
					.y(function(d) { return y(d.value); }) // set the y values for the line generator
					.curve(d3v4_2.curveStep) // apply smoothing to the line
				)
				.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");
			stepsvg.append("path")
				.datum(selectLGApredictiondata[w].getwholedataarr)
				.attr("id", 'Path_after')
				.attr("class", "path")
				.attr("fill", "none")
				.attr("stroke", colorpanel.stepline.afterpath)
				.attr("stroke-width", 1.5)
				.attr("d", d3v4_2.line()
					.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
					.y(function(d) { return y(d.value); }) // set the y values for the line generator
					.curve(d3v4_2.curveStep) // apply smoothing to the line
				)
				.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");
			stepsvg.append("path")
				.datum(selectLGApredictiondata[w-1].getwholedataarr)
				.attr("id", 'Path_groundturth')
				.attr("class", "path")
				.attr("fill", "none")
				.attr("stroke", colorpanel.stepline.groundturth)
				.attr("stroke-width", 1)
				.attr("stroke-dasharray", 2)
				.attr("d", d3v4_2.line()
					.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
					.y(function(d) { return y(d.value); }) // set the y values for the line generator
					.curve(d3v4_2.curveStep) // apply smoothing to the line
				)
				.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");


		}
		else if (w == selectLGApredictiondata.length - 2){
			stepsvg.append("path")
				.datum(selectLGApredictiondata[w].getgroupdataarr)
				.attr("id", 'Path_groundturth')
				.attr("class", "path")
				.attr("fill", "none")

				.attr("stroke", colorpanel.stepline.actualpath)
				.attr("stroke-width", 1.5)
				.attr("d", d3v4_2.line()
					.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
					.y(function(d) { return y(d.value); }) // set the y values for the line generator
					.curve(d3v4_2.curveStep) // apply smoothing to the line
				)
				.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");

			stepsvg.append("path")
				.datum(selectLGApredictiondata[w+1].getwholedataarr)
				.attr("id", 'Path_after')
				.attr("class", "path")
				.attr("fill", "none")
				.attr("stroke", colorpanel.stepline.afterpath)
				.attr("stroke-width", 1.5)
				.attr("d", d3v4_2.line()
					.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
					.y(function(d) { return y(d.value); }) // set the y values for the line generator
					.curve(d3v4_2.curveStep) // apply smoothing to the line
				)
				.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");
			stepsvg.append("path")
				.datum(selectLGApredictiondata[w].getwholedataarr)
				.attr("id", 'Path_groundturth')
				.attr("class", "path")
				.attr("fill", "none")
				.attr("stroke", colorpanel.stepline.groundturth)
				.attr("stroke-width", 1)
				.attr("stroke-dasharray", 2)
				.attr("d", d3v4_2.line()
					.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
					.y(function(d) { return y(d.value); }) // set the y values for the line generator
					.curve(d3v4_2.curveStep) // apply smoothing to the line
				)
				.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");

		}



		g.selectAll(".bar")
			.data(stackedDataCombined)
			.enter().append("g")
			.attr("id",(d,i) =>{
				return "stream_" + d.key;
				//console.log(d,i)
			})

			.attr("stroke", "gray")
			.attr("stroke-width", 0.3)
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
					.attr("fill-opacity", 0.4)
					.attr("id", (d,o) =>{
						return d["data"][tempkeyid+"status"];
					})
			}
		}

	}

}
function DrawCurveLine(lgadata,lgagroupdata, w){
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
	var subgroups;
	if (predictflag == 0){
		subgroups = lgagroupdata.column.slice(0);
		//have not clicked on prediction button
	}
	else{
		subgroups = selectLGApredictiondata[w]["getgroupdataarr"].column.slice(0);
		var subgrouptotal = selectLGApredictiondata[w]["getgroupdataarr"];
		var stackedDataCombined = d3v4_2.stack()
			.keys(subgroups)
			(subgrouptotal)
	}

	let stackedData = d3v4_2.stack()
		.keys(subgroups)
		(lgagroupdata) // this is new data

	const x = d3v4_2.scaleBand().rangeRound([0, width]).padding(0.01);
	const y = d3v4_2.scaleLinear().rangeRound([height, 0]);

	let xScale = x.domain(lgadata.map(function(d) {
		return d.date;
	}));
	let yScale = y.domain([0, d3v4_2.max(lgagroupdata, function(d) {
		return d.value * 1.2;
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
		.text("");

	if (predictflag == 0){

		stepsvg.append("path")
			.datum(lgagroupdata)
			.attr("id", 'Path_Before')
			.attr("class", "path")
			.attr("fill", "none")
			.attr("stroke", colorpanel.stepline.actualpath)
			// .attr("stroke-opacity", 0.5)
			.attr("stroke-width", 1.5)
			.attr("d", d3v4_2.line()
				.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
				.y(function(d) { return y(d.value); }) // set the y values for the line generator
				.curve(d3v4_2.curveNatural) // apply smoothing to the line
			)
			.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");

		stepsvg.append("path")
			.datum(lgadata)
			.attr("id", 'Path_groundturth')
			.attr("class", "path")
			.attr("stroke-dasharray", 2)
			.attr("fill", "none")
			.attr("stroke", colorpanel.stepline.groundturth)
			.attr("stroke-width", 1)
			.attr("d", d3v4_2.line()
				.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
				.y(function(d) { return y(d.value); }) // set the y values for the line generator
				.curve(d3v4_2.curveNatural) // apply smoothing to the line
			)
			.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");


	}
	else if (predictflag == 1){
		stepsvg.selectAll(".path").remove();

		if (w == selectLGApredictiondata.length - 1){
			stepsvg.append("path")
				.datum(selectLGApredictiondata[w-1].getgroupdataarr)
				.attr("id", 'Path_groundturth')
				.attr("class", "path")
				.attr("fill", "none")

				.attr("stroke", colorpanel.stepline.actualpath)
				.attr("stroke-width", 1.5)
				.attr("d", d3v4_2.line()
					.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
					.y(function(d) { return y(d.value); }) // set the y values for the line generator
					.curve(d3v4_2.curveNatural) // apply smoothing to the line
				)
				.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");
			stepsvg.append("path")
				.datum(selectLGApredictiondata[w].getwholedataarr)
				.attr("id", 'Path_after')
				.attr("class", "path")
				.attr("fill", "none")
				.attr("stroke", colorpanel.stepline.afterpath)
				.attr("stroke-width", 1.5)
				.attr("d", d3v4_2.line()
					.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
					.y(function(d) { return y(d.value); }) // set the y values for the line generator
					.curve(d3v4_2.curveNatural) // apply smoothing to the line
				)
				.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");
			stepsvg.append("path")
				.datum(selectLGApredictiondata[w-1].getwholedataarr)
				.attr("id", 'Path_groundturth')
				.attr("class", "path")
				.attr("fill", "none")
				.attr("stroke", colorpanel.stepline.groundturth)
				.attr("stroke-width", 1)
				.attr("stroke-dasharray", 2)
				.attr("d", d3v4_2.line()
					.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
					.y(function(d) { return y(d.value); }) // set the y values for the line generator
					.curve(d3v4_2.curveNatural) // apply smoothing to the line
				)
				.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");


		}
		else if (w == selectLGApredictiondata.length - 2){
			stepsvg.append("path")
				.datum(selectLGApredictiondata[w].getgroupdataarr)
				.attr("id", 'Path_groundturth')
				.attr("class", "path")
				.attr("fill", "none")

				.attr("stroke", colorpanel.stepline.actualpath)
				.attr("stroke-width", 1.5)
				.attr("d", d3v4_2.line()
					.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
					.y(function(d) { return y(d.value); }) // set the y values for the line generator
					.curve(d3v4_2.curveNatural) // apply smoothing to the line
				)
				.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");

			stepsvg.append("path")
				.datum(selectLGApredictiondata[w+1].getwholedataarr)
				.attr("id", 'Path_after')
				.attr("class", "path")
				.attr("fill", "none")
				.attr("stroke", colorpanel.stepline.afterpath)
				.attr("stroke-width", 1.5)
				.attr("d", d3v4_2.line()
					.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
					.y(function(d) { return y(d.value); }) // set the y values for the line generator
					.curve(d3v4_2.curveNatural) // apply smoothing to the line
				)
				.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");
			stepsvg.append("path")
				.datum(selectLGApredictiondata[w].getwholedataarr)
				.attr("id", 'Path_groundturth')
				.attr("class", "path")
				.attr("fill", "none")
				.attr("stroke", colorpanel.stepline.groundturth)
				.attr("stroke-width", 1)
				.attr("stroke-dasharray", 2)
				.attr("d", d3v4_2.line()
					.x(function(d, i) { return x(d.date) + x.bandwidth()/2; }) // set the x values for the line generator
					.y(function(d) { return y(d.value); }) // set the y values for the line generator
					.curve(d3v4_2.curveNatural) // apply smoothing to the line
				)
				.attr("transform", "translate("+ ( content_margin.left) + "," + (content_margin.top) + ")");

		}


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

