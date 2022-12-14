//datashared是一个全局的数据存储
//会在下面点击rect之后，修改本数据，然后使用修改之后的数据去重新绘制。

function IntendedTreeMatrix(treedata, cliniccount){
    var datascale_color = d3v4_2.scaleQuantize()
        .domain([1,24])
        .range(colorpanel.default.multicolorscale);
    //console.log(cliniccount);
    var margin = {top: 20, right: 20, bottom: 20, left: 10},
        width = document.getElementById("intended_content").clientWidth - margin.left - margin.right,

        //height =  document.getElementById("intended_content").clientHeight - margin.top - margin.bottom,
        // barHeight =  19,
        barHeight = width / 32
    height = (11 * cliniccount + 1) * barHeight + margin.top + margin.bottom,
        //此处为图形中名字所在rect的默认宽度
        //是一个常量，可以通过计算，也可以直接指定一个数值。
        //barWidth = (width - margin.left - margin.right) * 0.15
        barWidth = 220,
        barminWidth = 45,
        //oject中rect的颜色，truecolor对应数据中的1的rect颜色，flaseColor对应数据0.
        colorObject={
            trueColor: colorpanel.intendtree.factor.trueColor,
            falseColor:colorpanel.intendtree.factor.falseColor
        }
    //time中rect的颜色，truecolor对应数据中的1的rect颜色，flaseColor对应数据0.
    colorTime={
        trueColor:colorpanel.intendtree.timeline.trueColor,
        falseColor:colorpanel.intendtree.timeline.falseColor
    };

    var i = 0,
        duration = 100,
        root;

    var diagonal = d3v4_2.linkHorizontal()
        .x(function(d) { return d.y; })
        .y(function(d) { return d.x; });

    var treesvg = d3v4_2.select(".intended_content").append("svg")
        .attr("id", "treesvg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //console.log(treedata)
    window.dataShared = treedata;
    root = d3v4_2.hierarchy(treedata);
    // console.log('root',root)
    root.x0 = 0;
    root.y0 = 0;
    update(root);

//用来修改rect点击之后的数据。
    function changeData(data,location,indexRow,indexCol,value)
    {
        let datapath=[]
        let d=data.children
        //通过循环拿到数据项的index
        for (let i =1;i<location.length;i++)
        {

            let target=d.filter(d=>d.name==location[i])
            datapath.push(d.indexOf(target[0]))
            d=d[d.indexOf(target[0])]
            d=d.children

        }
        if(indexRow===0){
            console.log("you revised Factors or first row of opening hours")
            data.children[datapath[0]]
                .children[datapath[1]]
                .children[datapath[2]]
                .children[datapath[3]].data[indexCol]=value
        }
        else
        {
            console.log("you revised Opending Hours")
            data.children[datapath[0]]
                .children[datapath[1]]
                .children[datapath[2]]
                .children[indexRow].data[indexCol]=value
        }
        //console.log(data);
        //revised data
        //console.log(treedata);

        return data

    }



    function update(source) {
        // Compute the flattened node list.
        var nodes = root.descendants();

        //var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

        d3v4_2.select("treesvg").transition()
            .duration(duration)
            .attr("height", height);

        d3v4_2.select(self.frameElement).transition()
            .duration(duration)
            .style("height", height + "px");

        var index = -1;
        root.eachBefore(function(n) {

            n.x = ++index * barHeight;
            n.y = n.depth * 15;
        });

        // Update the nodes…
        var node = treesvg.selectAll(".node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

        var nodeEnter = node.enter().append("g")
            .attr("class", d=>{
                if (d.data.name==='Obj') return 'node grid1';
                if (d.data.name=== 'Mon' || d.data.name== "Tue" || d.data.name== "Wed" || d.data.name== "Thu" || d.data.name== "Fri" || d.data.name== "Sat" || d.data.name== "Sun") return 'node grid2';

                return 'node'
            })
            .attr("id", (d,o) => {
                return d.height + "-" + d.depth;
            })
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .style("opacity", 0)
            .attr('id',d=>{
                if(d.depth==4){
                    let location=''
                    p=d
                    while(p.parent!=null){
                        location+=p.data.name+'_'
                        p=p.parent
                    }
                    location+=p.data.name

                    return location
                }
            });

        // Enter any new nodes at the parent's previous position.
        nodeEnter.append("g").append("rect")
            .attr("y", -barHeight / 2)
            .attr("height", barHeight)
            .attr("width", d => {
                //console.log(d);
                if (d.data.name == 'Root' || d.data.name == 'Factors')
                    return barminWidth;
                else if (d.data.name == 'Open Hours')
                    return barminWidth * 1.5;
                else if (d.depth === 2){
                    let tempname = d.data.name.split(',');
                    return tempname[0].length * 6; //clinic anme length
                }
                else
                    return barWidth; //lga length
            })
            .style("fill", color)
            .on("click", click)
            .on("mouseover", function (d) {
                //console.log(d);
                // if (d.depth == 1){
                //     let tempname = d.data.name.split(',');
                //     let templgacode = tempname[1].substring(4,tempname[1].length);
                //     map.setFilter('polygon-highlighted-line2', ['in', 'lgacode', templgacode]);
                // }//one lga
                if (d.height == 2){
                    let tempname = d.data.name.split(',');
                    let tempcliniccode = tempname[1];
                    map.setFilter('Clinic-pointhighlighted', ['in', 'ClinicID', tempcliniccode]);
                }//one clinic
            })
            .on('mouseout',function(d){
                d3v4_2.select('.infobox').style('display','none');
                // map.setFilter('polygon-highlighted-line2', ['in', 'lgacode', '']);
                map.setFilter('Clinic-pointhighlighted', ['in', 'ClinicID', '']);
            })

        let grid1XScale=d3v4_2.scaleLinear()
            .domain([0,6])
            .range([0,barHeight*6])

        // draw gird
        let grid1=d3v4_2.selectAll('.grid1')
            .attr('class',function(d){

                //remove original rect border  and  text
                d3v4_2.select(this)
                    .select('g')
                    .select('rect')
                    .style('stroke-width','0')

                //bind data to grid dom
                let gird1Bar= d3v4_2.select(this)
                    .selectAll('.rect1')
                    .data(d.data.data)
                    .enter()
                    .append('g')
                    .attr('class','rect1')

                //call axis and set ticksize to draw border of grid
                // d3v4_2.select(this).append('g')
                //     .attr('transform',`translate(0,${-barHeight/2})`)
                //     .call(d3v4_2.axisTop(grid1XScale).ticks(7).tickSize(-barHeight))

                //remove tick text
                // treesvg.selectAll('.tick').selectAll('text').text('')

                gird1Bar.append('rect')
                    .attr('x',(d,i)=> grid1XScale(i))
                    .attr('y',-barHeight/2)
                    .attr('width',barHeight)
                    .attr('height',barHeight)
                    .style('fill',d=>{
                        return d?colorObject.trueColor:colorObject.falseColor;
                    })
                    .on('click',(d,i)=>{
                        let changeValue=+!d
                        let currentId=d3v4_2.select(this)._groups[0][0].id
                        currentId=currentId.split('_').reverse()

                        dataShared=changeData(dataShared,currentId,0,i,changeValue)
                        root=d3v4_2.hierarchy(dataShared)
                        root.x0=0
                        root.y0=0
                        duration = 0
                        update(root)
                        duration=20
                        //console.log(dataShared);

                    })

                //highlight the bar when mouse hover
                gird1Bar.on('mouseover',function(d,i){
                    //
                    //     d3v4_2.selectAll('.rect1').style('opacity','.6')
                    //     d3v4_2.select(this).transition().duration(100).style('opacity',1)
                    // })
                    // .on('mouseenter',function(d,i){
                    d3v4_2.selectAll('.rect1').style('opacity','.6')
                    d3v4_2.select(this).transition().duration(50).style('opacity',1)
                    // console.log(d, i);
                    //i's order [Number(data["referralRequired"]),Number(data["ageLimit"]),Number(data["bookingRequired"]),Number(data["walkinAllowed"]),Number(data["driveThroughTesting"]),Number(data["wheelchairAccessible"])];
                    let tempword = "";
                    let tempstatus = "";
                    switch (i){
                        case 0:
                            tempword = "Required Referral";
                            break;
                        case 1:
                            tempword = "Age Limited";
                            break;
                        case 2:
                            tempword = "Required Booking";
                            break;
                        case 3:
                            tempword = "Allow Walk-in";
                            break;
                        case 4:
                            tempword = "Allow Drive-through";
                            break;
                        case 5:
                            tempword = "Wheelchair Accessible";
                            break;
                    }
                    switch (d){
                        case 1:
                            tempstatus = "Yes.";
                            break;
                        case 0:
                            tempstatus = "No.";
                            break;
                    }
                    d3v4_2.select('.infobox')
                        .style('display','block')
                        .style('left',d3v4_2.event.x-30+'px')
                        .style('top',d3v4_2.event.y-70+'px')
                    d3v4_2.select('.infobox')
                        .style('font-size','12px')
                        .style('color','white')
                        .html(tempword + ":" +'<br>'+ tempstatus + '</span>')
                })
                    .on('mouseout',function(d){
                        d3v4_2.selectAll('.rect1').style('opacity',1)
                        d3v4_2.select('.infobox').style('display','none');
                    })

                return 'grid1 node'
            })

        let grid2XScale=d3v4_2.scaleLinear()
            .domain([0,54])
            //.domain([0,48])
            .range([0,barHeight*28])

        // draw gird

        let grid2=d3v4_2.selectAll('.grid2')
            .attr('class',function(d,index){
                //console.log(d.data.data);
                let counthours = 0;
                for (let s = 0; s < d.data.data.length-1; s++){
                    counthours+=d.data.data[s];
                }

                currentThis=this;

                //remove original rect border
                d3.select(this)
                    .select('g')
                    .select('rect')
                    .style('stroke-width','0')
                    .remove()


                //bind data to grid dom
                let gird2Bar= d3v4_2.select(this)
                    .selectAll('.rect2')
                    .data(d.data.data)
                    .enter()
                    .append('g')
                    .attr('class','rect2')

                //draw grid lines
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',d=>{
                        return 'M'+grid2XScale(0)+' '+(barHeight/2)+
                            'L'+grid2XScale(48)+' '+(barHeight/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')

                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{

                        return 'M'+grid2XScale(0)+' '+(-barHeight* 1/2)+
                            'L'+grid2XScale(48)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')

                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(0)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(0)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')

                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(2)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(2)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(4)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(4)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(6)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(6)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(8)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(8)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(10)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(10)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(12)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(12)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(14)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(14)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(16)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(16)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(18)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(18)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(20)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(20)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(22)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(22)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')

                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(24)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(24)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(26)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(26)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(28)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(28)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(30)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(30)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(32)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(32)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(34)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(34)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(36)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(36)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(38)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(38)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(40)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(40)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(42)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(42)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(44)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(44)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')
                d3v4_2.select(this)
                    .append('path')
                    .attr('d',(d, o)=>{
                        return 'M'+grid2XScale(46)+' '+(barHeight* 1/2)+
                            'L'+grid2XScale(46)+' '+(-barHeight* 1/2)
                    })
                    .attr('stroke-width','1px')
                    .attr('stroke','#525252')

                //draw bar

                gird2Bar.append('g').append('rect')
                    .attr('x',(d,i)=> grid2XScale(i))
                    .attr('y',-barHeight/2)
                    .attr('width', function (d, i){
                        //console.log(d,i);
                        if (i == 48){
                            return barHeight * 3.5;
                        }
                        return barHeight*.5;
                    })
                    .attr('height',barHeight)
                    //.style('fill', 'white')
                    .style('fill',function (d, i, b){
                        // console.log(counthours);
                        // console.log(d, i)
                        if (i == 48 || d == 0) {
                            return "white";
                        }
                        else {
                            return d?datascale_color(counthours):colorTime.falseColor;
                        }

                    })
                    .style('stroke', (d, i) => {
                        return i == 48 ? "#525252" : "white"

                    })
                    .style('stroke-width','1px')
                    .attr('id', (d,i) => {
                        return 'time_rect_'+ i + "_"+ d;
                    })
                var tempcount = 0;
                gird2Bar.append("g")
                    .append("text")
                    .text(function (d,o,b) {
                        if (o != "48")
                            tempcount += d;
                        //console.log(d,o,b);
                        if (o == '48'){
                            //console.log(tempcount);
                            let temp = tempcount/2;
                            tempcount = 0;
                            let tempweekday = d.split("/")
                            return tempweekday[0]+"/"+temp + "h";
                        }
                    })
                    .attr('x',(d,i)=> grid2XScale(i) + barHeight/4)
                    .attr('y',".35em")
                    .attr("class", "HourText")
                    .style("font-size", 10)
                // .attr("transform", "translate(" + (barHeight / 2) + "," + (barHeight / 2) + ")");


                //hightlight the bar
                gird2Bar.on('mouseover',function(d){
                    d3v4_2.selectAll('.rect2').style('opacity','.6')
                    d3v4_2.select(this).transition().duration(100).style('opacity',1)
                })
                    .on('mouseout',function(d){
                        d3v4_2.selectAll('.rect2').style('opacity',1)
                        d3v4_2.select('.infobox').style('display','none')

                    })

                //hightlight the bar
                gird2Bar.on('mouseenter',(d,i)=>{
                    if (i != "48"){
                        d3v4_2.select('.infobox')
                            .style('display','block')
                            .style('left',d3v4_2.event.x-30+'px')
                            .style('top',d3v4_2.event.y-50+'px')

                        let hour=Math.ceil( (i)/2)
                        let pt=i%2==0?'past':'to'
                        let day=index+1<7?index+1:(index)%7+1
                        d3v4_2.select('.infobox')
                            .style('font-size','12px')
                            .style('color','white')
                            .html('day:    <span style="color:white">'+day+'</span>'+
                                '<br>time:<span style="color:white"> half '+pt+' '+hour+'</span>')
                    }


                }).on('mouseleave',d=>{
                    d3v4_2.select('.infobox').style('display','none')
                    d3v4_2.selectAll('.rect2').style('opacity',1)
                })
                //tooltip
                gird2Bar.on('click',(d,i)=>{
                    let changeValue=+!d
                    let currentId=d3v4_2.select(this)._groups[0][0].id
                    currentId=currentId.split('_').reverse()

                    let indexRow=index+1<7?index+1:(index)%7+1
                    dataShared=changeData(dataShared,currentId,indexRow-1,i,changeValue)
                    root=d3v4_2.hierarchy(dataShared)
                    root.x0=0
                    root.y0=0
                    duration = 0
                    update(root);
                    duration=20
                })
                    .on('mouseleave',d=>{
                        d3v4_2.select('.infobox').style('display','none')
                        d3v4_2.selectAll('.rect2').style('opacity',1)
                    })



                return 'grid2 node'
            })

        nodeEnter.append("text")
            .attr("dy", 3.5)
            .attr("dx", 5.5)
            .text(function(d) {
                if (d.depth===4) {
                    return '';
                }
                else if(d.depth === 2){
                    let tempname = d.data.name.split(",")
                    return tempname[0];
                }
                else{
                    return d.data.name;
                }
            });

        d3v4_2.select('.grid1').select('text').text('')
        // Transition nodes to their new position.
        nodeEnter.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
            .style("opacity", 1);

        node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
            .style("opacity", 1)
            .select("rect")
            .style("fill", color);

        // Transition exiting nodes to the parent's new position.
        node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .style("opacity", 0)
            .remove();

        // Update the links…
        var link = treesvg.selectAll(".links")
            .data(root.links(), function(d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "links")
            .attr("d", function(d) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            })
            .transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            })
            .remove();
        // Stash the old positions for transition.
        root.each(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
// Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        // console.log(d);
        update(d);
        d3v4_2.selectAll('.rect1').style('opacity',1)
        d3v4_2.selectAll('.rect2').style('opacity',1)
        d3v4_2.select('.infobox').html('')
    }
    function color(d) {
        return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fff";
    }



}




