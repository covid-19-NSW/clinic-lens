<template>
  <div class="page1-container">
    <div class="el-item">
      <div class="el-item__label">Select:
      </div>
      <div>
        <el-dropdown @command="(command)=>{changeMethod(command)}">
        <span class="el-input__inner" id = 'modeldown'>
         Random Forest<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
<!--            <el-dropdown-item>Decision Tree</el-dropdown-item>-->
<!--            <el-dropdown-item divided>GBDT</el-dropdown-item>-->
<!--            <el-dropdown-item>CatBoost</el-dropdown-item>-->
<!--            <el-dropdown-item>Lightgbm</el-dropdown-item>-->
            <el-dropdown-item command="rf">Random Forest</el-dropdown-item>
            <el-dropdown-item command="xg">XGBoost</el-dropdown-item>
<!--            <el-dropdown-item divided>Linear</el-dropdown-item>-->
          </el-dropdown-menu>
        </el-dropdown>

      </div>

    </div>



    <div class="module_content" id="module_content"></div>
  </div>
</template>
<script>
export default {
  name: "module_content",
  data() {
    return {
      form: {
        label: "",
        date: "",
        type: [],
      },
    };
  },
  mounted() {
    window.modelname = "rf";
    this.do();
  },
  methods: {
    changeMethod(command){
      let tempname = "";
      if (command == 'rf'){
        tempname = "Random Forest";
      }
      else
      {
        tempname = "XGBoost";
      }
      document.getElementById("modeldown").innerHTML = tempname + '<i class="el-icon-arrow-down el-icon--right"></i>';
      window.modelname = command;
    },

    //
    do(){
      var margin = {top: 5, right: 5, bottom: 5, left: 5},
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
      d3v4.csv("../static/Dataset/Module.csv", function(data) {
        data.sort(function(b, a) {
          return a.Importance - b.Importance;
        });
        // Add X axis
        var x = d3v4.scaleLinear()
            .domain([0, 1])
            .range([ 0, width]);


        // Y axis
        var y = d3v4.scaleBand()
            .range([ 0, height - margin.top - margin.bottom ])
            .domain(data.map(function(d) { return d.Name; }))
            .padding(.2);


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

        // .attr("x", function(d) { return x(d.Country); })
        // .attr("y", function(d) { return y(d.Value); })
        // .attr("width", x.bandwidth())
        // .attr("height", function(d) { return height - y(d.Value); })
        // .attr("fill", "#69b3a2")

      })
    }
  },
};
</script>
<style scoped>
.page1-container {
  width: 100%;
  height: 90%;
}

.page1-container .title{
  height: 10%;
  background: #ffffff;
}

.page1-container .module_content{
  height: 90%;
  background: white;
  display: block;
}
.axis {
  font: 10px sans-serif;
}

.axis path,
.axis line {
  fill: none;
  stroke: #fff;
  shape-rendering: crispEdges;
}

.axis path {
  display: none;
}

.el-dropdown-link {
  cursor: pointer;
  color: #000000;
}
.el-icon-arrow-down {
  font-size: 10px;
}


.page1-container .el-item__label {
  width: 50px;
  font-size: 13px;
  /* padding-right: 12px; */
  font-weight: 500;
  color: #303133;
}

.page1-container .el-item{
  height: 41px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.el-input__inner {

  height: 30px!important;
  line-height: 28px;
  font-size: 13px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #252525;
}
.el-select-dropdown__item.selected {
  color: #252525;
}
.el-dropdown-menu li:focus,.el-dropdown-menu li:not(.is-disabled):hover{
  color: #252525;
  background-color: #bdbdbd;
  font-weight: 700;
}
</style>
