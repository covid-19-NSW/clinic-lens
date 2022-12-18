function changemodelpara(data){

    d3v4.select(".module_content")
        .select("#modulesvg").remove();

    var margin = {top: 3, right: 3, bottom: 1, left: 5},
        width = document.getElementById("module_content").clientWidth,
        height = document.getElementById("module_content").clientHeight;

// append the svg object to the body of the page
    var modulesvg = d3v4.select(".module_content")
        .append("svg")
        .attr("id", "modulesvg")
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data

    // Add X axis
    var x = d3v4.scaleLinear()
        .domain([0, 1])
        .range([ 0, width]);


    // Y axis
    var y = d3v4.scaleBand()
        .range([ 0, height - margin.top - margin.bottom ])
        .domain(data.map(function(d) { return d.Name; }))
        .padding(.2);

    modulesvg.selectAll("rect").remove();
    //Bars
    modulesvg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0) )
        .attr("y", function(d) { return y(d.Name); })
        .attr("width", function(d) {
            //console.log(d);
            return x(d.Importance) < 0.001 ? 1 + x(d.Importance) * 10 : x(d.Importance) * 1.6 + 3;
        })
        .attr("height", y.bandwidth() )
        .attr("fill", colorpanel.default.interfacelightcolor)
        .attr("fill-opacity", 0.8)

    modulesvg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3v4.axisTop(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .attr("opacity", 0)
        .style("text-anchor", "end");
    modulesvg.append("g")
        .call(d3v4.axisRight(y))

}