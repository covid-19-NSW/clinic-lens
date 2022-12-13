<template>
  <div class="page1-container">
    <div class="Controlpanel_content" id="Controlpanel_content">
<!--      <div class="form" id = "form">-->
<!--        <el-form ref="form" :model="form" label-width="100px">-->
<!--          <el-form-item label="Datasets:">-->
<!--            <el-select v-model="form.region" placeholder="Please select">-->
<!--              <el-option label="NSW COVID-19 Datasets" value=""></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="Time Scale:">-->
<!--            <el-col :span="11">-->
<!--              <el-date-picker type="date" placeholder="From" v-model="form.date1" style="width: 100%;"></el-date-picker>-->
<!--            </el-col>-->
<!--            <el-col class="line" :span="2"> - </el-col>-->
<!--            <el-col :span="11">-->
<!--              <el-date-picker type="date" placeholder="To" v-model="form.date2" style="width: 100%;"></el-date-picker>-->
<!--            </el-col>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="Columns:">-->
<!--            <el-radio-group v-model="form.resource">-->
<!--              <el-radio label="Optimized"></el-radio>-->
<!--              <el-radio label="All"></el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="Lens Size">-->
<!--            <el-slider-->
<!--                v-model="slide">-->
<!--            </el-slider>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button type="primary" @click="onSubmit">Create</el-button>-->
<!--            <el-button>Cancel</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->

<!--      </div>-->

      <div class="ColorLegend" id="ColorLegend">


      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "container",
  data() {
    return {slide: 100,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  mounted() {
    this.do();
  },
  methods: {
    onSubmit(){},
    do() {

      var colorsvg = d3v4_2.select("#ColorLegend").append("svg")

      // Handmade legend
      colorsvg.append("circle").attr("cx",10).attr("cy",100).attr("r", 5).style("fill", "#69b3a2")
      colorsvg.append("circle").attr("cx",10).attr("cy",120).attr("r", 5).style("fill", "#404080")
      colorsvg.append("text").attr("x", 20).attr("y", 100).text("variable A").style("font-size", "8px").attr("alignment-baseline","middle")
      colorsvg.append("text").attr("x", 20).attr("y", 120).text("variable B").style("font-size", "8px").attr("alignment-baseline","middle")

    },
    handleClick(){
      console.log('test')
    }
  },
};
</script>
<style scoped>
.page1-container {
  width: 100%;
  height: 100%;
}
.Controlpanel_content {
  width: 100%;
  height: 85%;
}
.form {
  width: 100%;
  height: 80%;
}

.ColorLegend {
  width: 100%;
  height: 20%;
}



</style>
