<template>
  <div class="page1-container">
    <div class="Controlpanel_content" id="Controlpanel_content">
      <div class="form" id = "form">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="Config" name="1">
            <el-form ref="form" :model="form" label-position="left">
              <el-form-item label="Datasets:" label-width="70px">
                <el-select v-model="form.region" placeholder="Please select">
                  <el-option label="NSW COVID-19 Datasets" value=""></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Time Scale:" label-width="90px" class="date_picker_box">
                <el-col :span="11">
                  <el-date-picker type="date" placeholder="From" v-model="form.date1" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2"> - </el-col>
                <el-col :span="11">
                  <el-date-picker type="date" placeholder="To" v-model="form.date2" style="width: 100%;"></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="Columns:" label-width="70px">
                <el-radio-group v-model="form.resource">
                  <el-radio label="Optimized"></el-radio>
                  <el-radio label="All"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Lens Size:" label-width="80px">
                <el-slider
                    v-model="slide">
                </el-slider>
              </el-form-item>
              <el-form-item style="text-align:center;">
                <el-button type="primary" @click="onSubmit">Create</el-button>
                <el-button>Cancel</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="Color Palette" name="2" >
            <div style = 'height: 80px'>
              <div style = 'height: 20px'>
                Map & Storage View:
              </div>
              <div style = 'height: 60px'>

              </div>
            </div>
            <div style = 'height: 40px'>
              <div style = 'height: 20px'>
                Intended Tree-Matrix View:
              </div>
              <div style = 'height: 20px'>

              </div>
            </div>
            <div style = 'height: 40px'>
              <div style = 'height: 20px'>
                Prediction View:
              </div>
              <div style = 'height: 20px'>

              </div>
            </div>
            <div style = 'height: 40px'>
              <div style = 'height: 20px; font-size: 6px'>
                Theme:
              </div>
              <div style = 'height: 20px'>

              </div>

            </div>
          </el-collapse-item>
        </el-collapse>


      </div>

      <!-- <div class="ColorLegend" id="ColorLegend"> -->


      <!-- </div> -->
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
        desc: '',
      },
      activeName: '1'
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
    },
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
.el-form-item {
  /* 行间距 */
  margin-bottom: 0px;
}
.el-form-item__label {
  line-height: 32px;
}
#form /deep/ .el-form-item__label,#form /deep/ .el-radio__label,#form /deep/ .el-button,#form /deep/ .el-form-item__content {
  font-size: 10px;
}
#form /deep/ .el-icon-arrow-down {
  font-size: 10px;
  font-weight: 700;
  line-height: 44px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #252525;
}
.el-icon-arrow-down {
  font-size: 10px;
}
#form /deep/ .el-input__inner {
  height: 30px!important;
  line-height: 32px;
  font-size: 6px;
}
#form /deep/ .el-select-dropdown__item {
  height: 30px;
}
.el-select-dropdown__item.selected {
  color: #252525;
}
.el-slider {
  margin-right: 18px;
}
.el-button {
  padding: 6px 6px;
}
#form /deep/ .el-button--primary {
  background-color: #252525;
  border-color: #252525;
}
.el-button:focus, .el-button:hover {
  color: #ffffff;
  border-color: #bdbdbd;
  background-color: #bdbdbd;
}
#form /deep/ .el-slider__bar {
  background-color: #252525;
}
/* slider 底色 */
#form /deep/ .el-slider__runway {
  background-color: #737373;
}
#form /deep/ .el-slider__button {
  border-color: #252525;
}
.date_picker_box /deep/ input::-webkit-input-placeholder {
  width: 30px;
}
#form /deep/ .el-form-item__content {
  line-height: 40px;
}
#form /deep/ .el-collapse-item__header {
  height: 40px;
}
#form /deep/ .el-collapse-item__content {
  padding-bottom: 0px;
}
</style>
