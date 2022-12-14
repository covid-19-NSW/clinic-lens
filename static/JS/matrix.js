//var mapcirclecolor = ["#3E9A34","#223971","#F4801F"]; //aldi color

const appendIdStr = "appendSVG";
const cols = 20;
const rectPadding = 1;
matrixsvg = null;
window.SelectedLGAfromStorage = [];
window.HoveredLGAfromStorage = [];
window.totalcliniccount = 0;
window.totalclinicdata = [];
window.selectLGApredictiondata = [];
let w = 0;
/**
 * @param {Object} eleID	追加元素的id
 * @param {Object} data		指定格式定义好的数据
 * @param {Object} styleControler		格式控制数组
 * @param {Object} cols		一行多少列
 * @param {Object} padding		方格之前的间距
 * @param {Object} mapcirclecolor		方格的颜色
 */
function playRects(eleID, data, styleControler, cols, padding, mapcirclecolor) {
	//console.log(data);
	let ColNum = 0;
	for (let i = 0; i < data.length; i++){
		ColNum += Math.ceil(data[i]["Details"].length / Number(cols - 1));
		//console.log(ColNum);
	}
	var svgWidth = document.getElementById(eleID).clientWidth - 10;
	// svgWidth/Number(cols)
	//var svgHeight = document.getElementById(eleID).clientHeight;
	var svgHeight = (svgWidth/Number(cols)) * ColNum;
	// // var svgsvgWidth / 12
	// var svgHeight = HeightNum * ColNum * 100;
	var rectWH = parseInt((svgWidth - (cols - 1) * padding) / cols);
	if (matrixsvg) {
		matrixsvg.remove();
	}
	matrixsvg = d3.select("#" + eleID)
		.append("svg")
		.attr("id", "matrixsvg")
		.attr("width", svgWidth)
		.attr("height", svgHeight)
		.attr("viewBox", "0 0 " + svgWidth + " " + svgHeight);
	var svg = matrixsvg;


	function sortByCaseNum(data, sortType = "desc") {
		for (var i = 0; i < data.length; i++) {
			var storageDetails = data[i]["Details"];
			for (var j = 0; j < storageDetails.length; j++) {
				var caseslist = storageDetails[j]["caseslist"];
				storageDetails[j]["caseSum"] = d3.sum(caseslist, function(d) {
					return d["testcases"]
				});
			}
			data[i]["Details"] = storageDetails.sort(function(d2, d1) {
				if (sortType == "desc") {
					return d1["caseSum"] - d2["caseSum"];
				} else {
					return d2["caseSum"] - d1["caseSum"];
				}
			});
		}
		return data;
	}

	function drawTimeLine(key, apendGS, styleConfig) {
		key
		if (!window.storageTime) {
			window.storageTime = {};
		}
		if (!window.storageTime[key]) {
			window.storageTime[key] = {
				timeSelection: window.timeSelection,
				maxTimeSelection: window.maxTimeSelection
			};
		}
		//console.log(storageTime);
		var rdistance = new Date(window.storageTime[key].timeSelection[1]).getTime() - new Date(window.storageTime[key]
			.timeSelection[0]).getTime();
		var tdistance = new Date(window.storageTime[key].maxTimeSelection[1]).getTime() - new Date(window.storageTime[
			key].maxTimeSelection[0]).getTime();

		var dataset = [new Date(window.storageTime[key].timeSelection[0]).getTime() - new Date(window.storageTime[key]
			.maxTimeSelection[0]).getTime(),
			rdistance,
			new Date(window.storageTime[key].maxTimeSelection[1]).getTime() - new Date(window.storageTime[key]
				.timeSelection[1]).getTime()
		];

		if (dataset[0] == 0 && dataset[2] == 0) {
			dataset = [dataset[1]];
		}
		var pie = d3.layout.pie().sort(null).value(function(d) {
			//console.log(d);
			return d;
		})
		var piedata = pie(dataset);
		//console.log(dataset);
		var arc = d3.svg.arc()
			.innerRadius(styleConfig["outcircle"]["innerRadius"])
			.outerRadius(styleConfig["outcircle"]["outerRadius"]);

		var arcs = apendGS
			.selectAll("g")
			.data(piedata)
			.enter()
			.append("g")
			.attr("transform",
				"translate(0,0)");
		arcs.append("path").attr("fill", function(d, i) {
			//console.log("i", i);
			if (i == 1 || dataset.length == 1) {
				return styleConfig["outcircleColor"];
			} else {
				return "white";
			}
		}).attr("d", function(d) {
			return arc(d);
		}).attr("stroke", 'black').attr('stroke-width', '0.5px');
	}

	function doLGAcodeToArray(data) {
		//console.log(data);
		for (var i = 0; i < data.length; i++) {
			var storageDetails = data[i]["Details"];
			for (var j = 0; j < storageDetails.length; j++) {
				var strLGAcode = storageDetails[j]["LGAcode"];
				//console.log(strLGAcode);
				var arayLGAcode = strLGAcode.split("-");
				arayLGAcode = arayLGAcode.filter(function(d) {
					if (d) {
						return true;
					} else {
						return false;
					}
				})
				storageDetails[j]["LGAcodeArr"] = arayLGAcode;
				storageDetails[j]["Storageid"] = data[i]["Storageid"];
			}
			data[i]["Details"] = storageDetails;
		}
		return data;
	}

	data = sortByCaseNum(data);
	data = doLGAcodeToArray(data);

	//console.log("matrix", data);

	var startYpos = 0;

	var rowGArr = {};
	for (var i = 0; i < data.length; i++) {
		var storageDetails = data[i]["Details"];
		rowGArr["rowId" + data[i]["Storageid"]] = {};
		rowGArr["rowId" + data[i]["Storageid"]]["svg"] = svg.append("g").attr("id", "rowId" + data[i]["Storageid"])
			.style("cursor", "move")
			.attr("x", "0")
			.attr("class", "row")
			.attr("y", startYpos)
			.attr("transform", "translate(0," + (startYpos) + ")");
		startYpos = startYpos + Math.ceil(storageDetails.length / (cols - 1)) * (rectWH + padding);
		rowGArr["rowId" + data[i]["Storageid"]]["data"] = storageDetails;
		rowGArr["rowId" + data[i]["Storageid"]]["Storageid"] = data[i]["Storageid"]
	}

	for (var key in rowGArr) {
		//修改成 圆圈
		var styleConfig = {
			selectedCircleColor: '#7c7c7c',
			selectedCircleSize: rectWH / 3,
			outerCircleSize: rectWH / 2,
			outcircleColor: colorpanel.default.interfacelightcolor, //外圈颜色 instead of #9f7f63
			//outcircleColor: "#ffffbf", //外圈颜色
			outcircle: {
				innerRadius: rectWH / 3.5,
				outerRadius: rectWH / 2 - 1,
			}
		}
		rowGArr[key]["svg"].append("g")
			.attr("transform", "translate(" + (rectWH / 2) + "," + (rectWH / 2) + ")")
			.append("circle")
			.style("fill", "white")
			.style("stroke", "white")
			.attr("r", rectWH / 2 - 2);
		drawTimeLine(
			key,
			rowGArr[key]["svg"].append("g").attr("transform", "translate(" + (rectWH / 2) + "," + (rectWH / 2) +
				")"),
			styleConfig);
		rowGArr[key]["svg"].append("g")
			.append("text")
			.text(key.replace("rowId", ""))
			.attr("class", "StorageidText")
			.attr("dy", styleConfig["selectedCircleSize"] / 2)
			.style("text-anchor", "middle")
			.style("user-selec", "none")
			.style("font-size", styleConfig["selectedCircleSize"])
			.style("stroke", "black")
			.attr("transform", "translate(" + (rectWH / 2) + "," + (rectWH / 2) + ")");
	}
	for (var key in rowGArr) {
		rowGArr[key]["svg"].append("g")
			.selectAll("g")
			.data(rowGArr[key]["data"])
			.enter().append("g")
			.attr("transform", (d, i) => "translate(" + (Math.floor((i) % (cols - 1)) + 1.5) * (rectWH + padding) + "," +
				(Math.floor((i) / (cols - 1)) + 0.5) * (rectWH + padding) + ")")
			.attr("x", function(d, i) {
				return (Math.floor((i) % (cols - 1)) + 1) * (rectWH + padding);
			})
			.attr("y", function(d, i) {
				return (Math.floor((i) / (cols - 1))) * (rectWH + padding);
			})
			.append("circle")
			.attr("id", (d) => {
				//console.log(d);
				return "circle_outer_" + d["Storageid"] + d.LGAcode;
			})
			.attr("r", rectWH / 2)
			// .attr("height", rectWH)
			.style('stroke-dasharray', ('2,3'))
			.style('stroke', '#dedede')
			.style('stroke-width', 1)
			.style("fill", "white")


	}

	/**
	 * 判断数组a是否包涵数组b
	 * @param {Object} a 数组
	 * @param {Object} b 数组
	 */
	function isAIncludesB(a, b) {
		return b.every(val => a.includes(val));
	}
	var cancelStatusIds = [];
	var removeStatusIds = [];

	for (var key in rowGArr) {
		rowGArr[key]["svg"].append("g")
			.selectAll("g")
			.data(rowGArr[key]["data"])
			.enter().append("g")
			.attr("transform", (d, i) => "translate(" + (Math.floor((i) % (cols - 1)) + 1.5) * (rectWH + padding) + "," +
				(Math.floor((i) / (cols - 1)) + 0.5) * (rectWH + padding) + ")")
			// .attr("transform", (d, i) => "translate(" + (Math.floor((i) % (cols - 1)) + 1) * (rectWH + padding) + "," +
			// 	(Math.floor((i) % (cols - 1))) * (rectWH + padding) + ")")
			.attr("x", function(d, i) {
				return (Math.floor((i) % (cols - 1)) + 1) * (rectWH + padding);
			})
			.attr("y", function(d, i) {
				return (Math.floor((i) / (cols - 1))) * (rectWH + padding);
			})
			.attr("class", "OuterRect")
			.attr("id", function(d) {
				return "outer-" + d["Storageid"] + "-" + d["LGAcode"];
			})
			.on("mousewheel.zoom", function (od, i, n){
				//console.log(od);
				for (let i = 0; i < SelectedLGAfromStorage.length; i++){
					if (SelectedLGAfromStorage[i] == od.LGAcode){
						SelectedLGAfromStorage.remove(od.LGAcode);
					}
				}
				map.setFilter('polygon-highlighted-line2', ['in', 'lgacode',...SelectedLGAfromStorage]);
				d3.select("#circle_outer_"+od["Storageid"] + od.LGAcode)
					.style('stroke-dasharray', "0")
					.style('stroke', '#dedede')
					.style('stroke-width', 1)
				totalclinicdata.splice(totalclinicdata.findIndex(item=>item.LGAcode==od.LGAcode),1);
				//console.log(totalclinicdata);
				let tempmatrix = {
					"name": "Root",
					"children": totalclinicdata
				};
				let tempcurrentcliniccount=0;
				for (let i = 0; i < totalclinicdata.length; i++){
					tempcurrentcliniccount += totalclinicdata[i]["children"].length;
				}
				d3v4_2.select(".intended_content").select("#treesvg").remove();

				IntendedTreeMatrix(tempmatrix,tempcurrentcliniccount);

			})
			.on("mousedown", function(od, i, n) {
				d3.select('.mapbox-gl-draw_symbol_correct').attr('class', 'ld ld-ring ld-spin').attr('id', 'loading');
				var temptitle=document.getElementById("steplinetitle");
				temptitle.innerHTML='Testing Capabilities Prediction of ' + od.caseslist[0]["lga_name19"] + ", LGA" + od.caseslist[0]["lga_code19"];
				//console.log(od);
				unique(SelectedLGAfromStorage);
				SelectedLGAfromStorage.push(od.LGAcode);
				d3.select("#circle_outer_"+od["Storageid"]+od.LGAcode)
					.style('stroke-dasharray', ('2,3'))
					.style('stroke', 'black')
					.style('stroke-width', 2)
				//console.log(SelectedLGAfromStorage);

				map.setFilter('polygon-highlighted-line2', ['in', 'lgacode',...SelectedLGAfromStorage]);
				let tempAllLGAcode= "";
				let tempCurrentLGAcode = "";
				for (let i = 0; i < SelectedLGAfromStorage.length; i++){
					tempAllLGAcode += " lga_code19 = " + SelectedLGAfromStorage[i] + " or";
				}
				tempAllLGAcode = " and (" + tempAllLGAcode.substring(0, tempAllLGAcode.length - 2) + ")";
				tempCurrentLGAcode = ' and lga_code19 = '+ od.LGAcode;
				const cliniccount = od["count"];
				totalcliniccount += cliniccount;
				const colNeed=["daycount","personskm2","cliniccount","event_level","whichday","referralRequired","ageLimit","realhours","bookingRequired","walkinAllowed","driveThroughTesting","wheelchairAccessible"];
				const openhoursNeed = [["mondayOpeningHours","mondayBreakStartTime","mondayBreakEndTime","mondayClosingHours"],
					["tuesdayOpeningHours","tuesdayBreakStartTime","tuesdayBreakEndTime","tuesdayClosingHours"],
					["wednesdayOpeningHours","wednesdayBreakStartTime","wednesdayBreakEndTime","wednesdayClosingHours"],
					["thursdayOpeningHours","thursdayBreakStartTime","thursdayBreakEndTime","thursdayClosingHours"],
					["fridayOpeningHours","fridayBreakStartTime","fridayBreakEndTime","fridayClosingHours"],
					["saturdayOpeningHours","saturdayBreakStartTime","saturdayBreakEndTime","saturdayClosingHours"],
					["sundayOpeningHours","sundayBreakStartTime","sundayBreakEndTime","sundayClosingHours"]
				];

				$.ajax({
					url: "http://localhost:3001/querycases?lga=" + tempCurrentLGAcode +"&date="+ filterdate,
					method: "GET",
					//data: highlighted_lga,
					// dataType: "json", //因为是调用nodeJS返回的json数据，所以必须使用binary类型
					error: function(XMLHttpRequest, textStatus, errorThrown){
						var s1=XMLHttpRequest;
						var s2=textStatus;
						var s3=errorThrown;
						alert("error message : "+errorThrown.toString())
					},
					success: function(data){
						//console.log(data);
						let getgroupdataarr = [];
						let getwholedataarr = [];
						let tempclinicinfo = data.data.slice(0, cliniccount);
						let tempclinictitle = [];
						let tempassembleClinic = [];

						for (let o = 0; o < tempclinicinfo.length; o++){
							//console.log(tempclinicinfo[o]);
							tempclinictitle.push(tempclinicinfo[o]["uniqueID"]);
							tempassembleClinic.push({
								"name": FindMatrixInfo(tempclinicinfo[o], [], "title"),
								"children": [
									{
										"name": "Factors",
										"children":[
											{
												"name":"Obj",
												"data": FindMatrixInfo(tempclinicinfo[o], colNeed, "obj")
											}
										]
									},{
										"name": "Open Hours",
										"children": FindMatrixInfo(tempclinicinfo[o],openhoursNeed, "openhours")
									}
								]
							})
						}
						totalclinicdata.push({
							"LGAcode": od["LGAcode"],
							"cliniccount": cliniccount,
							"name": od["caseslist"][0]["lga_name19"]+", LGA" + od["LGAcode"],
							"children": tempassembleClinic
						})
						//console.log(tempmatrix)
						let tempmatrix = {
							"name": "Root",
							"children": totalclinicdata
						};
						d3v4_2.select(".intended_content").select("#treesvg").remove();
						//tempmatrix["children"][0]["children"]
						// console.log(tempclinictitle);
						// console.log(tempmatrix);
						IntendedTreeMatrix(tempmatrix,totalcliniccount);
						//console.log(data);
						let temp = [];
						for (let i = 0; i < data.data.length; i += cliniccount) {
							temp.push({
								"Frame1": data.data.slice(i, i + cliniccount),
								"Y1": Number(data.data[i]["TestCases"]),
								"L1": cliniccount
							});
							//console.log(temp);
							$.ajax({
								url: "http://127.0.0.1:5001/predict1",
								method: "Post",
								data: {
									"Frame1": data.data.slice(i, i + cliniccount),
									"Y1": Number(data.data[i]["TestCases"]),
									"L1": cliniccount
								},
								// dataType: "json",
								error: function(XMLHttpRequest, textStatus, errorThrown){
									console.log("error message : "+errorThrown.toString())
								},
								success: function(res){
									//console.log(res);
									//console.log(tempclinictitle);
									let tempgetgroupdataarr = {};
									for (let q = 0; q < res.length; q++){
										tempgetgroupdataarr["lga_code19"] = data.data[i].lga_code19;
										tempgetgroupdataarr[tempclinictitle[q]] = res[q];
										tempgetgroupdataarr["date"] = data.data[i].notification_date;
									}
									getgroupdataarr.push(tempgetgroupdataarr);
									//console.log(getgroupdataarr);

									//console.log(res);
									// console.log(getdataarr.length);
									// console.log(data.data.length);
									if (getgroupdataarr.length == data.data.length/cliniccount){
										for (let j = 0; j < od.caseslist.length; j++){
											getwholedataarr.push({
												date: od.caseslist[j]["notification_date"],
												value: od.caseslist[j]["testcases"]/cliniccount,
												lga_code19: od["LGAcode"]
											})
										}
										getgroupdataarr = MsgSortDate(getgroupdataarr);
										getgroupdataarr["column"] = tempclinictitle;
										d3v4_2.select("#step_content")
											.select("#stepsvg").remove();

										selectLGApredictiondata.push({
											"id": w,
											"getwholedataarr": getwholedataarr,
											"getgroupdataarr": getgroupdataarr
										});
										window.globalcurrentwholedataarr = getwholedataarr;
										window.globalcurrentgroupdataarr = getgroupdataarr;

										DrawStepLine(getwholedataarr,getgroupdataarr, w);
										w++;
										//console.log(selectLGApredictiondata);
										d3.select('#loading').attr('class', 'mapbox-gl-draw_symbol_correct');
										// console.log(getwholedataarr);
										// console.log(getgroupdataarr);
										// console.log(temp);
									}
									//console.log(getdataarr);
								},
								timeout: 20000
							});

						}

					},
					timeout: 20000
				});

			})
			.append("circle")
			.attr("transform", "translate( 0 , 0 )")
			.attr("r", function(d) {
				return rectWH * styleControler[d["status"]]["innertSize"] / 2;
			})
			.style("stroke", function(d) {
				return styleControler[d["status"]]["color"];
			})
			.style("stroke-opacity", function(d) {
				return styleControler[d["status"]]["opacity"];
			})
			.style("fill", function(d) {
				return styleControler[d["status"]]["color"];
			})
			.style("fill-opacity", function(d) {
				return styleControler[d["status"]]["opacity"];
			})

			.on("mouseover", function(od, i, n) {
				d3.select('#matrixsvg').selectAll('circle').style("opacity", 0.3);
				//console.log(od);
				// d3.select("#" + "outer-" + od["Storageid"] + "-" + od["LGAcode"])
				// 	.style("stroke-width", styleControler[od["status"]]["strokeWidth"])
				// 	.style("stroke", styleControler[od["status"]]["strokeColor"])
				// 	.style("stroke-opacity", styleControler[od["status"]]["opacity"]);
				// SelectedLGAfromStorage.push(od.LGAcode);
				// console.log(SelectedLGAfromStorage);
				//d3.select(this).style("stroke-opacity", 1)
				d3.select(this).style("fill-opacity", 1)
				//console.log(rowGArr);
				for (var _key in rowGArr) {
					d3.select("#" + "outer-" + rowGArr[_key]["Storageid"] + "-" + od["LGAcode"]).select("circle")
						.style("opacity", 1);
					//console.log("#" + "outer-" + rowGArr[_key]["Storageid"] + "-" + od["LGAcode"])
					if (rowGArr[_key]["Storageid"] != od["Storageid"]) {
						rowGArr[_key]['data'].forEach((_d, i) => {
							if (isAIncludesB(_d["LGAcodeArr"], od["LGAcodeArr"])) {
								if (_d["status"] == od["status"]) {
									cancelStatusIds.push("#" + "outer-" + _d["Storageid"] + "-" +
										_d["LGAcode"]);

									d3.select("#" + "outer-" + _d["Storageid"] + "-" + _d["LGAcode"])
										.style("stroke-width", styleControler[_d["status"]][
											"strokeWidth"
											])
										.style("stroke", styleControler[_d["status"]][
											"strokeColor"
											])
										// .style("stroke-opacity", 0.2)
										.style("opacity", 1)
										.style("fill-opacity", 1)
								} else {
									removeStatusIds.push("#" + "inner-" + _d["Storageid"] + "-" + _d[
										"LGAcode"]);
									d3.select("#" + "outer-" + _d["Storageid"] + "-" + _d["LGAcode"])
										.append("circle")
										.attr("id", function() {
											return "inner-" + _d["Storageid"] + "-" + _d["LGAcode"];
										}())
										.attr("transform", (d, i) => "translate(" + (Math.floor((i) % (cols - 1))) * (rectWH + padding) + "," +
											(Math.floor((i) / (cols - 1))) * (rectWH + padding) + ")")
										.attr("r", function() {
											return rectWH * styleControler[_d["status"]][
													"innertSize"
													] /
												2;
										}())

										.style("stroke", function() {
											return styleControler[_d["status"]]["color"];
										}())
										// .style("stroke-width", 2)
										// .style("stroke", "white")
										.style("fill", styleControler[od["status"]]["color"])
										.style("opacity", 1)
										.style("fill-opacity", 1)

								}
							}
						})
					}
				}
				//console.log(templgaarr);
				//console.log(od);
				map.setFilter('polygon-highlighted-line2', ['in', 'lgacode', od.LGAcode]);
				// console.log(d3.select(this));
				console.log(od);
				divlegend.style("display","none");
				divlegend.html("LGA: "+ od["LGAcode"] +"</br>"
					+ "Name: "+ od["LGAname"] +"</br>"
					+ "Testing Cases: "+ od["caseSum"] +"</br>")
					.style("left", (d3.event.pageX+10) + "px")
					//d3.event.pageX 鼠标坐标x
					//get divlegendwidth
					//外部容器是
					.style("top", (d3.event.pageY+10) + "px")
					.style("opacity", 0.8)
					// .style("height", function(){
					//     //console.log(tempevents);
					//     return 23 * temprows + 'px';
					// })
					.style("display","block");
				//divlegend.style("display","none");
			})
			.on("mouseout", function(od, i, n) {
				// SelectedLGAfromStorage.pop();
				d3.select('#matrixsvg').selectAll('circle').style("opacity", 1)
				divlegend.style("display","none");
				map.setFilter('polygon-highlighted-line2', ['in', 'lgacode', ...SelectedLGAfromStorage]);

				d3.select("#" + "outer-" + od["Storageid"] + "-" + od["LGAcode"])
					.style("stroke-width", 1)

				d3.select(this).style("fill-opacity", 0.8)
				d3.select(this).style("stroke-opacity", 0.8)
				cancelStatusIds.forEach((d, i) => {
					d3.select(d)
						.style("stroke-width", 1)
				})
				removeStatusIds.forEach((d, i) => {
					d3.select(d).remove();
				})
				cancelStatusIds = [];
				removeStatusIds = [];
			})

		rowGArr[key]["svg"].selectAll(".OuterRect").append("g")
			.append("svg:text")
			.text(function (d,o) {
				//console.log(d,o);
				return d.count;
			})
			// .attr("class", "StorageidText")
			.attr("dx", 0)
			.attr("dy", ".35em")
			.attr('id', function(d, i) {
				return 'text-' + d.index
			})
			.style("text-anchor", "middle")
			.style("user-selec", "none")
			.style("font-size", styleConfig["selectedCircleSize"])
			.style("stroke", "white")
		// .attr("transform", "translate(0,0)")


	}

	d3.selection.prototype.moveToFront = function() {
		return this.each(function() {
			this.parentNode.appendChild(this);
		});
	};
	var lastDragPosY = 0;
	var haveDrag = false;
	for (var key in rowGArr) {
		rowGArr[key]["svg"].call(
			d3.behavior.drag().origin(function(d) {
				var t = d3.select(this);
				return {
					x: t.attr("x"),
					y: t.attr("y")
				};
			}).on("dragstart", function(d) {
				sel = d3.select(this);
				sel.moveToFront();
			}).on("drag", function(d) {
				d3.select(this).attr("transform", "translate(0, " + d3.event.y + ")");
				d3.select(this).attr("x", d3.event.x);
				d3.select(this).attr("y", d3.event.y);
				d3.select(this).attr("class", "activeRow")
				d3.selectAll(".row").attr("opacity", 0.8);
				var moveLength = Math.floor(rowGArr[d3.select(this).attr("id")]["data"].length / (cols - 1)) +
					1;
				d3.selectAll(".row").each(function(d) {
					if (Math.abs(d3.select(this).attr("y") - d3.event.y) < rectWH / 2) {
						var posY = d3.select(this).attr("y") * 1.0 + (rectWH + padding) * (d3.event
							.y - d3.select(this).attr("y")) / Math.abs(d3.select(this).attr(
							"y") - d3.event.y) * moveLength;
						d3.select(this).attr("x", 0);
						d3.select(this).attr("y", posY);
						d3.select(this).attr("transform", "translate(0, " + posY +
							")");
					}
				})
				lastDragPosY = d3.event.y;
				haveDrag = true;
			}).on("dragend", function(d) {
				if (haveDrag) {
					d3.select(this).attr("class", "row")
					d3.selectAll(".row").attr("opacity", 8);
					d3.select(this).attr("x", 0);
					var posY = Math.ceil(lastDragPosY / ((rectWH + padding) / 2)) * ((rectWH + padding) / 2)
					posY = Math.floor(posY / (rectWH + padding)) * (rectWH + padding)
					d3.select(this).attr("y", posY);
					d3.select(this).attr("transform", "translate(0, " + posY + ")");
					haveDrag = false;
				}
			})
		);
	}

}

function FindMatrixInfo(data, need,type){
	switch(type){
		case "title":
			// let tempname = data["title"].split(' ');
			// let tempnamestr = tempname[0] +" "+ tempname[1] + " " + tempname[2];
			// if (tempname.length > 3){
			// 	return tempnamestr + "..."
			// }
			// if (tempname.length <= 3){
			// 	return tempnamestr;
			// }
			return data["title"]+","+ data["uniqueID"]
			break;
		case "obj":
			//need:["daycount","personskm2","cliniccount","event_level","whichday","referralRequired","ageLimit","realhours","bookingRequired","walkinAllowed","driveThroughTesting","wheelchairAccessible"];
			let temparr = [Number(data["referralRequired"]),Number(data["ageLimit"]),Number(data["bookingRequired"]),Number(data["walkinAllowed"]),Number(data["driveThroughTesting"]),Number(data["wheelchairAccessible"])];
			return temparr;
			break;
		case "openhours":
			//		openhoursNeed:[["mondayOpeningHours","mondayBreakStartTime","mondayBreakEndTime","mondayClosingHours"],
			// 					["tuesdayOpeningHours","tuesdayBreakStartTime","tuesdayBreakEndTime","tuesdayClosingHours"],
			// 					["wednesdayOpeningHours","wednesdayBreakStartTime","wednesdayBreakEndTime","wednesdayClosingHours"],
			// 					["thursdayOpeningHours","thursdayBreakStartTime","thursdayBreakEndTime","thursdayClosingHours"],
			// 					["fridayOpeningHours","fridayBreakStartTime","fridayBreakEndTime","fridayClosingHours"],
			// 					["saturdayOpeningHours","saturdayBreakStartTime","saturdayBreakEndTime","saturdayClosingHours"],
			// 					["sundayOpeningHours","sundayBreakStartTime","sundayBreakEndTime","sundayClosingHours"],
			// 				];
			let temphourarr = [];
			// console.log(need);
			// console.log(need[0])
			// console.log(data);
			// console.log(data[need[0][0]]);
			for (let i = 0; i < need.length; i++){
				let tempweekday;
				switch (i+1) {
					case 1:
						tempweekday = 'Mon'
						break;
					case 2:
						tempweekday = "Tue"
						break;
					case 3:
						tempweekday = "Wed"
						break;
					case 4:
						tempweekday = "Thu"
						break;
					case 5:
						tempweekday = "Fri"
						break;
					case 6:
						tempweekday = "Sat"
						break;
					case 7:
						tempweekday = "Sun"
						break;
				}

				var onedaytemp = new Array(49).fill(0);
				var starthourflag = 0 , breakstartflag = 0, breakendflag = 0, endhourflag = 0;
				var tempstarttime =  data[need[i][0]];
				var tempbreakstarttime =  data[need[i][1]];
				var tempbreakendtime =  data[need[i][2]];
				var tempendtime =  data[need[i][3]];

				//console.log(tempstarttime, tempbreakstarttime, tempbreakendtime, tempendtime);
				if (tempstarttime == 'None'){
					onedaytemp = new Array(49).fill(0);
					onedaytemp[onedaytemp.length - 1] = tempweekday + "/0h";
				}//not open
				else if (tempbreakstarttime == 'None'){
					let opensplit = data[need[i][0]].split(':'); //split by hh/mm/ss
					let closesplit = data[need[i][3]].split(':');
					//console.log(opensplit)
					if (opensplit[1] == '30')
					{
						starthourflag = 1
					}
					if (closesplit[1] == '30')
					{
						endhourflag = 1
					}
					for(let j = Number(opensplit[0]) * 2 + Number(starthourflag); j < Number(closesplit[0]) * 2 + Number(endhourflag); j++){
						onedaytemp[j] = 1;
					}
					let temphours = 0;
					for (let e = 0; e < onedaytemp.length; e++){
						temphours += onedaytemp[e];
					}
					onedaytemp[onedaytemp.length - 1] = tempweekday + "/" +Number(temphours)/2 + 'h';
				}//no break
				else{
					let opensplit = data[need[i][0]].split(':'); //split by hh/mm/ss
					let startbreaksplit = data[need[i][1]].split(':');
					let endbreaksplit = data[need[i][2]].split(':');
					let closesplit = data[need[i][3]].split(':');
					//console.log(opensplit)
					if (opensplit[1] == '30')
					{
						starthourflag = 1
					}
					if (startbreaksplit[1] == '30')
					{
						breakstartflag = 1
					}
					if (endbreaksplit[1] == '30')
					{
						breakendflag = 1
					}
					if (closesplit[1] == '30')
					{
						endhourflag = 1
					}
					for(let j = Number(opensplit[0]) * 2 + Number(starthourflag); j < Number(closesplit[0]) * 2 + Number(endhourflag); j++){
						onedaytemp[j] = 1;
					}
					for(let k = Number(startbreaksplit[0]) * 2 + Number(breakstartflag); k < Number(endbreaksplit[0]) * 2 + Number(breakendflag); k++){
						onedaytemp[k] = 0;
					}
					let temphours = 0;
					for (let e = 0; e < onedaytemp.length; e++){
						temphours += onedaytemp[e];
					}
					onedaytemp[onedaytemp.length - 1] = tempweekday + "/" +Number(temphours)/2 + 'h';
				}
				//console.log(i + 1);
				temphourarr.push({
					"name": tempweekday,
					"data" :onedaytemp
				})
			}
			//console.log(temphourarr);
			return temphourarr;
			break;
	}
}

Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};
function unique (arr) {
	return Array.from(new Set(arr))
}

function MsgSortDate(obj){
	obj.sort((a,b)=>{
		let t1 = new Date(Date.parse(a["date"].replace(/-/g,"/")))
		let t2 = new Date(Date.parse(b["date"].replace(/-/g,"/")))
		return t1.getTime()-t2.getTime()
	})
	return obj
}