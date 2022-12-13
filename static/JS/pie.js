

var defaultinnerradius = window.innerRadius;
var defaultouterradius = window.outerRadius;
var defaultgaps = window.gaps;
var portionnum = window.portionnum;
 // var map = window.map;
 // var svg = window.svg;

var datascale_color = d3.scale.linear()
    .domain([0,1])
    .range(["#fee090", "#d73027"]);

var pie_rate = d3.layout.pie()
    .sort(null)
    //默认降序排列，除非传入null
    .value(function(d) {
        return d.rate;
    });

var pie_cases = d3.layout.pie()
    .sort(null)
    //默认降序排列，除非传入null
    .value(function(d) {
        return d.cases;
    });

var pie_test = d3.layout.pie()
    .sort(null)
    //默认降序排列，除非传入null
    .value(function(d) {
        return d.testcases;
    });


var arc_inner = d3.svg.arc()
    .startAngle(function(d) {
        //console.log(d);
        return d.data.start * 2 * Math.PI/360;
    })
    .endAngle(function(d) { return d.data.end * 2 * Math.PI/360; })
    .innerRadius(300)
    .outerRadius(320)
    .cornerRadius(5);

var arc_outer = d3.svg.arc()
    .startAngle(function(d) {
        //console.log(d);
        return d.data.start * 2 * Math.PI/360;
    })
    .endAngle(function(d) { return d.data.end * 2 * Math.PI/360; })
    .innerRadius(320)
    .outerRadius(function (d) {
        //console.log(d)
        if( d.value === 0){
            return 320;

        }
        else{
            //console.log(d.value);
            //return 320 + 1.5 * (2 + Math.log(d.value) * 5);
            return 320 + 2.2 * (Math.log(d.value/100 + 20) + d.value / 15000);
            //return 15;
        }
    })
    //外部高低
    .cornerRadius(10);

function playLensPie(filterpiedata){
    console.log("drawpie once")
    //console.log(portionnum);
    console.log(filterpiedata);
    var storagenumber = [];
    for (let i = 0; i < portionnum; i++){
        storagenumber.push({
            "step": i,
            "start": 360 / portionnum * i,
            "end": 360 / portionnum * (i + 1),
            "cases": 20,

        })
    }
    console.log(storagenumber);

    var lens_node = svg.append("g")
        .attr('id', "lens_node")
        .attr("class", "node")
        .attr("transform", function(data) {
            return "translate(" + cx + "," + cy + ")";
        })

    lens_node.append("g")
        .attr("id", "g-inner")
        .selectAll("path")
        .data(function (d) {
            //console.log(d);
            return pie_rate(filterpiedata);
        })
        .enter()
        .append("path")
        .attr("d", arc_inner)
        .attr('id', function(d, o) {
            //console.log(d);
            //console.log(o);
            return 'innerpiebar-' + o;
        })
        //.style("fill", d=>datascale_color(Math.log(1 + d.data.rate*(Math.E-1))))
        .style("fill", function (d){
            if (d.data.rate == 0){
                return "white";
            }
            return datascale_color(Math.log(1 + d.data.rate*(Math.E-1)));
        })
        .style("fill-opacity", 1)
        //.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
        .style("stroke-width", 1)
        .style("stroke", "green")


    lens_node.append("g")
        .attr("id", "g-testouter")
        .selectAll("path")
        .data(function (d) {
            //console.log(d);
            return pie_test(filterpiedata);
        })
        .enter()
        .append("path")
        .attr("d", arc_outer)
        .attr('id', function(d, o) {
            //console.log(d);
            //console.log(o);
            return 'outertestpiebar-' + o;
        })
        .style("fill", "#1a9850")
        .style("fill-opacity", 1)
        //.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
        .style("stroke-width", function(d, o) {
            //console.log(d.data);
            if (d.data.testcases == 0)
                return 0;
            else
                return 1;
        })
        .style("stroke", "white")

        .on("mousemove",function(d,o){

        })


    lens_node.append("g")
        .attr("id", "g-caseouter")
        .selectAll("path")
        .data(function (d) {
            //console.log(d);
            return pie_cases(filterpiedata);
        })
        .enter()
        .append("path")
        .attr("d", arc_outer)
        .attr('id', function(d, o) {
            //console.log(d);
            //console.log(o);
            return 'outercasepiebar-' + o;
        })
        .style("fill", "#d73027")
        .style("fill-opacity", 1)
        //.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
        .style("stroke-width", function(d, o) {
            //console.log(d.data);
            if (d.data.cases == 0)
                return 0;
            else
                return 1;
        })
        .style("stroke", "white")
        .on("mousemove",function(d,o){

        })



}

function playLensPieAgain(filterpiedata){
    //console.log(portionnum);
    console.log(filterpiedata);
    var storagenumber = [];
    for (let i = 0; i < portionnum; i++){
        storagenumber.push({
            "step": i,
            "start": 360 / portionnum * i,
            "end": 360 / portionnum * (i + 1),
            "cases": 20,

        })
    }
    //console.log(storagenumber);


    d3.select("#g-inner")
        .selectAll("path")
        .remove();

    d3.select("#g-inner")
        .selectAll("path")
        .data(function (d) {
            //console.log(d);
            return pie_rate(filterpiedata);
        })
        .enter()
        .append("path")
        .attr("d", arc_inner)
        .attr('id', function(d, o) {
            //console.log(d);
            //console.log(o);
            return 'innerpiebar-' + o;
        })
        .style("fill", function (d){
            if (d.data.rate == 0){
                return "white";
            }
            return datascale_color(Math.log(1 + d.data.rate*(Math.E-1)));
        })
        .style("fill-opacity", 1)
        //.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
        .style("stroke-width", 1)
        .style("stroke", "green")


    d3.select("#g-testouter")
        .selectAll("path")
        .remove();

    d3.select("#g-testouter")
        .selectAll("path")
        .data(function (d) {
            //console.log(d);
            return pie_test(filterpiedata);
        })
        .enter()
        .append("path")
        .attr("d", arc_outer)
        .attr('id', function(d, o) {
            //console.log(d);
            //console.log(o);
            return 'outertestpiebar-' + o;
        })
        .style("fill", "#1a9850")
        .style("fill-opacity", 1)
        //.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
        .style("stroke-width", function(d, o) {
            //console.log(d.data);
            if (d.data.testcases == 0)
                return 0;
            else
                return 1;
        })
        .style("stroke", "white")
        .on("mousemove",function(d,o){

        })

    d3.select("#g-caseouter")
        .selectAll("path")
        .remove();

    d3.select("#g-caseouter")
        .selectAll("path")
        .data(function (d) {
            //console.log(d);
            return pie_cases(filterpiedata);
        })
        .enter()
        .append("path")
        .attr("d", arc_outer)
        .attr('id', function(d, o) {
            //console.log(d);
            //console.log(o);
            return 'outercasepiebar-' + o;
        })
        .style("fill", "#d73027")
        .style("fill-opacity", 1)
        //.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
        .style("stroke-width", function(d, o) {
            //console.log(d.data);
            if (d.data.testcases == 0)
                return 0;
            else
                return 1;
        })
        .style("stroke", "white")
        .on("mouseover",function(d,o){


        })
}

function drawDragArc(id, startTime, endTime){
    // console.log(startTime);
    // console.log(endTime);

    window.maxTimeSelection = [new Date(startTime), new Date(endTime)];
    let daysSum = Math.abs(moment(endTime).diff(moment(startTime),'days') + 2);
    let tickRang = d3v5.range(-90, 270, 45);
    // 瞄准镜用的
    let linerRange = d3v5.scaleLinear()
        .domain([-90,270])
        .range([0,daysSum]);
    // 输出时间用的
    let timeRange = d3v5.scaleLinear()
        .domain([0,2 * Math.PI])
        .range([0,daysSum]);

    var svglens = d3v5.select('#' + id),
        width = +svglens.attr("width"),
        height = +svglens.attr("height"),
        g = svglens.append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    function getAngle (x1, y1, x2, y2) {
        let angle = Math.atan2(x2 - x1, y1-y2) ;
        return angle;
    }
    function getPoints (x0,y0,ao,r) {
        let x1   =   x0   +   r   *   Math.cos(ao   *   Math.PI   /180   );
        let y1   =   y0   +   r   *   Math.sin(ao   *   Math.PI   /180   );
        return [
            x1, y1
        ]
    }
    // 内径
    // let innerRadius = 180;
    // // 外径
    // let outerRadius = 240;
    // 中心半径
    let radius = (outerRadius - innerRadius) / 2 +innerRadius;

    let arcAngles = {
        startAngles: 0,
        endAngles: 0.5 * Math.PI
    }

    let arc = d3v5.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(arcAngles.startAngles);

    // 底层的灰色全 圆环
    let background = g.append("path")
        .datum({endAngle: 2 * Math.PI})
        .style("fill", colorpanel.map.timeline[0])
        .style("fill-opacity", 0.1)
        .attr("d", arc);
    // 判断是否可以拖动
    let canMove = null;
    // 上面橙色的圆环
    let foreground = g.append("path")
        .datum({endAngle: arcAngles.endAngles})
        //.style("fill", "orange")
        .style("fill", colorpanel.map.timeline[1])
        .attr("d", arc);
    // 中心的圆点不要可以去掉
    // svg.append("circle")
    //     .attr("cx",width / 2)
    //     .attr("cy", height / 2)
    //     .attr("r",4)

    // 初始的开始点位置
    let startCirclePoint = getPoints(0, 0,arcAngles.startAngles / (2 * Math.PI) * 360 - 90,radius);
    // 初始的开始点
    let startCircle =g.append("circle")

        .attr("cx",startCirclePoint[0])
        .attr("cy",startCirclePoint[1])
        .attr("fill","white")
        .attr("stroke", "grey")
        .attr("r",8)
        .on('mousedown',function(d){
            canMove = {
                pageX: d3v5.event.pageX,
                pageY: d3v5.event.pageY,
                moveType: 'start'
            }
            map["dragPan"].disable();
        });
    // 初始的结束点位置
    let endCirclePoint = getPoints(0, 0,arcAngles.endAngles / (2 * Math.PI) * 360 - 90,radius);
    // 初始的结束点
    let endCircle =g.append("circle")
        .attr("cx",endCirclePoint[0])
        .attr("cy",endCirclePoint[1])
        .attr("fill","white")
        .attr("stroke", "grey")
        .attr("r",8)
        .on('mousedown',function(d){
            canMove = {
                pageX: d3v5.event.pageX,
                pageY: d3v5.event.pageY,
                moveType: 'end'
            }
            map["dragPan"].disable();
        });

    svglens.on('mousemove',function(d) {
        // console.log(arcAngles)
        // console.log(timeRange(arcAngles.startAngles))
        // console.log(Math.ceil(timeRange(arcAngles.startAngles)))
        // 拖动点
        if(canMove){
            let n = getAngle(width / 2, height / 2,d3v5.event.pageX,d3v5.event.pageY);
            n = n < 0 ? n + 2 * Math.PI : n;
            // n = getLimitAngle(n,arcAngles.startAngles, arcAngles.endAngles,canMove.moveType);
            let  arcNew = n / (2 * Math.PI) * 360;
            // 拖动的结束点
            if(canMove.moveType == 'end'){
                arcAngles.endAngles = n;
                let endPoint = getPoints(0, 0, arcNew - 90,radius);
                endCircle.attr("cx",endPoint[0])
                    .attr("cy",endPoint[1]);

                arc.endAngle(n);
            } else {
                // 拖动的开始点
                arcAngles.startAngles = n;
                let startPoint = getPoints(0, 0, arcNew - 90,radius);
                startCircle.attr("cx",startPoint[0])
                    .attr("cy",startPoint[1]);

                arc.startAngle(n);
            }
            foreground.attr("d", arc);
        }
    })
    svglens.on('mouseup',function(d) {
        let daysEnd = Math.ceil(timeRange(arcAngles.endAngles));
        let daysStart = Math.ceil(timeRange(arcAngles.startAngles));
        let daysN = null;
        if(daysStart > daysEnd){
            daysN = daysEnd;
            daysEnd = daysStart;
            daysStart = daysN;
        }
        filterdate = moment(startTime).add(daysStart,'days').format('YYYY-MM-DD')+ '>'+moment(startTime).add(daysEnd,'days').format('YYYY-MM-DD');
        window.timeSelection = [new Date(moment(startTime).add(daysStart,'days').format('YYYY-MM-DD')), new Date(moment(startTime).add(daysEnd,'days').format('YYYY-MM-DD'))];
        //console.log(window.timeSelection)

        canMove = null;

        map["dragPan"].enable();
    })
    // 刻度
    let timeTick = g.append("g")
        .attr("class", "a axis")
        .selectAll("g")
        .data(tickRang)
        .enter().append("g")
        .attr("transform", function(d) {
            return "rotate(" + d + ")";
        });

    // ga.append("line")
    //       .attr("x2", radius);
    // 刻度圆点
    // timeTick.append("circle")
    //     .attr('r',3)
    //     .attr('cx',innerRadius)
    //     .attr('cy',0)

    timeTick.append("rect")
        .attr('width',5)
        .attr("height",1)
        .attr('x',innerRadius)
        .attr('y',0)

    // 刻度文字
    timeTick.append("text")
        //.attr("x", radius - 25 )
        .attr("x", function (d){
            if (d == 0)
                return radius - 45
            else if (d == 180)
                return radius - 5
            else
                return radius - 25
        })
        .attr("dy", ".35em")
        .style("text-anchor", function(d) { return d < 270 && d > 90 ? "middle" : "middle"; })
        .attr("transform", function(d) {
            //console.log(d);
            return "rotate("+ -d +" " + (radius - 25) + ",0)";
            //return d < 270 && d > 90 ? "rotate(180 " + (radius - 25) + ",0)" : null;
        })
        .text(function(d,i) {
            //return moment(startTime).add(linerRange(d),'day').format('YYYY-MM-DD')
            return moment(startTime).add(linerRange(d),'day').format('YYYY-MM-DD')
        });
}
