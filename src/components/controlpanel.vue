<template>
  <div class="page1-container">
    <div class="Controlpanel_content" id="Controlpanel_content">
      <div class="form" id = "form">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="Config" name="1">
            <el-form ref="form" :model="form" label-position="left">
              <el-form-item label="Datasets:" label-width="30%">
                <el-select v-model="form.region" placeholder="Please select">
                  <el-option label="NSW COVID-19 Datasets" value=""></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Time Scale:" label-width="30%" class="date_picker_box">
                <el-col :span="11">
                  <el-date-picker
                      prefix-icon="none"
                      clear-icon="none"
                      popper-class="elDatePicker"
                      type="date"
                      placeholder="From"
                      v-model="form.date1"
                      style="width: 100%;"
                  ></el-date-picker>
                </el-col>
                <el-col class="line" :span="2"> - </el-col>
                <el-col :span="11">
                  <el-date-picker
                      prefix-icon="none"
                      clear-icon="none"
                      popper-class="elDatePicker"
                      type="date"
                      placeholder="To"
                      v-model="form.date2"
                      style="width: 100%;"></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="Unit-based:" label-width="30%">
                <el-radio-group v-model="form.resource1">
                  <el-radio :label="1">LGAs</el-radio>
                  <el-radio :label="2">Postal Zones</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Columns:" label-width="30%">
                <el-radio-group v-model="form.resource2">
                  <el-radio :label="1">Optimized</el-radio>
                  <el-radio :label="2">All</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Lens Size:" label-width="30%">
                <el-slider
                    :format-tooltip="formatTooltip"
                    v-model="slide">
                </el-slider>
              </el-form-item>
              <el-form-item style="margin-left: 30%;">
                <el-button type="primary" @click="onSubmit">Create</el-button>
                <el-button>Cancel</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="Color Palette" name="2" >
            <div class="color-item">
              <div class="color-item-title">
                Map & Storage View:
              </div>
              <div>
                <div class="sub-color-item">
                  <div class="color-item-subTitle">
                    Lens:
                  </div>
                  <div id="lenscolor" class="color-group">
                    <el-tooltip class="item" effect="dark" content="Confirmed Cases Number" placement="top-start" offset="12" popper-class="tooltip">
                      <span style="background-color:#d73027;"></span>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="Testing Cases Number" placement="top-start" offset="12" popper-class="tooltip">
                      <span style="background-color:#006d2c;"></span>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="Timeline with Eased Interventions" placement="top-start" offset="12" popper-class="tooltip">
                      <span style="background-color:#7bccc4;"></span>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="Timeline with Restricted Interventions" placement="top-start" offset="12" popper-class="tooltip">
                      <span style="background-color:#2b8cbe;"></span>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="Confirmed Cases Rate Scale" placement="top-start" popper-class="tooltip">
                      <span class="c-bar c-bar-first" style="background: linear-gradient(to right, #ffeda0 ,#E1343F);"></span>
                    </el-tooltip>
                  </div>
                </div>

                <div class="sub-color-item">
                  <div class="color-item-subTitle">
                    Polygons:
                  </div>
                  <div id="polgyonscolor" class="color-group">
                    <el-tooltip class="item" effect="dark" content="LGA(s) with Multiple Clinics" placement="top-start" offset="12" popper-class="tooltip">
                      <span style="background-color:#238b45;"></span>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="LGA(s) with One Clinic" placement="top-start" offset="12" popper-class="tooltip">
                      <span style="background-color:#001F78;"></span>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="Selected LGA(s)" placement="top-start" offset="12" popper-class="tooltip">
                      <span style="background-color:#FA6E0A;"></span>
                    </el-tooltip>
                  </div>
                </div>
                <div class="sub-color-item">
                  <div class="color-item-subTitle">
                    Heatmap:
                  </div>
                  <div id="heatmapcolor" class="color-group">
                    <el-tooltip class="item" effect="dark" content="Heatmap Scale of Clinic Testing Capabilities" placement="top-start" popper-class="tooltip">
                      <span class="c-bar" style="background: linear-gradient(to right, #ffeda0 ,#E1343F);"></span>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
            <div class="color-item">
              <div class="color-item-title">
                Intended Tree-Matrix View:
              </div>
              <div class="sub-color-item">
                <div class="color-item-subTitle">
                  Factors:
                </div>
                <div id="factorcolor" class="color-group">
                  <el-tooltip class="item" effect="dark" content="Objective Binary Factors" placement="top-start" offset="12" popper-class="tooltip">
                    <span style="background-color:#3182bd;"></span>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="Opening Hours Scale" placement="top-start" offset="12" popper-class="tooltip">
                    <span class="c-bar c-bar-first" style="background: linear-gradient(to right, #d7191c ,#fdae61,#a6d96a,#1a9641);"></span>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div class="color-item">
              <div class="color-item-title">
                Prediction View:
              </div>
              <div>
                <div class="sub-color-item">
                  <div class="color-item-subTitle">
                    Effect:
                  </div>
                  <div id="effectcolor" class="color-group">
                    <el-tooltip class="item" effect="dark" content="Positive on Testing Capability" placement="top-start" offset="12" popper-class="tooltip">
                      <span style="background-color:#ff6b6b;"></span>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="Negative on Testing Capability" placement="top-start" offset="12" popper-class="tooltip">
                      <span style="background-color:#a7c957;"></span>
                    </el-tooltip>
                  </div>
                </div>
                <div class="sub-color-item">
                  <div class="color-item-subTitle">
                    Trends:
                  </div>
                  <div id="trendcolor" class="color-group">
                    <el-tooltip class="item" effect="dark" content="Predicted Sum of Each Clinic" placement="top-start" offset="12" popper-class="tooltip">
                      <span style="background-color:#0466c8;"></span>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="After Adjusted Clinic Factors" placement="top-start" offset="12" popper-class="tooltip">
                      <span style="background-color:#f72585;"></span>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
            <div class="sub-color-item">
              <div class="color-item-subTitle">
                Theme:
              </div>
              <div id="Themecolor" class="color-group">
                <el-tooltip class="item" effect="dark" content="Theme: Titles" placement="top-start" offset="12" popper-class="tooltip">
                  <span style="background-color:#3f2e2d;"></span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Theme: BorderLines" placement="top-start" offset="12" popper-class="tooltip">
                  <span style="background-color:#525252;"></span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Color Used in Regression Model View" placement="top-start" offset="12" popper-class="tooltip">
                  <span style="background-color:#74a9cf;"></span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Color Used in Indented Tree-Matrix View" placement="top-start" offset="12" popper-class="tooltip">
                  <span style="background-color:#9ecae1;"></span>
                </el-tooltip>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "container",
  data() {
    return {
      slide: 100,
      form: {
        resource1: 1,
        resource2: 1,
        name: '',
        region: '',
        date1: '2020-01-01',
        date2: '2022-10-28',
        type: [],
        resource: '',
        desc: '',
      },
      activeName: '1',
    }
  },
  mounted() {
    this.do();
  },
  methods: {
    onSubmit(){},
    do() {

    },
    handleClick(){
      console.log('test')
    },
    formatTooltip(val) {
      console.log('val',val)
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
  height: 30%;
}
.el-form-item {
  /* 行间距 */
  margin-bottom: 0px;
}
.el-form-item,#form /deep/ .el-form-item__content {
  height: 32px;
}
#form /deep/ .el-form-item__label {
  padding-right: 4px;
}
#form /deep/ .el-form-item__label,#form /deep/ .el-radio__label,#form /deep/ .el-button,#form /deep/ .el-form-item__content {
  font-size: 10px;
}
#form /deep/ .el-form-item__content {
  width: 70%;
  /* background: yellowgreen; */
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
  line-height: 30px;
  font-size: 10px;
}
#form /deep/ .el-select {
  width: 100%;
}
#form /deep/ .line  {
  text-align: center;
}
#form /deep/ .el-select .el-input__inner {
  padding-left: 8px;
}
#form /deep/ .el-date-editor .el-input__inner {
  padding: 0 8px;
}
.el-date-table td.available:hover {
  color: #252525;
}
.el-date-table td.current span {
  background: #252525;
}
#form /deep/ .el-select-dropdown__item {
  height: 30px;
}
.el-select-dropdown__item.selected {
  color: #252525;
}
.el-button {
  padding: 6px 6px;
}
#form /deep/ .el-button--primary ,#form /deep/ .el-radio__input.is-checked .el-radio__inner{
  background-color: #252525;
  border-color: #252525;
}
#form /deep/ .el-radio__input.is-checked+.el-radio__label {
  color: #252525;
  /* 选中时字体颜色不明显可以加粗 */
  /* font-weight: 600; */
}
#form /deep/ .el-radio__inner:hover {
  border-color: #252525;
}
.el-button:focus, .el-button:hover {
  color: #ffffff;
  border-color: #bdbdbd;
  background-color: #bdbdbd;
}
#form /deep/ .el-slider {
  margin-right: 16px;
  display: flex;
  align-items: center;
}
#form /deep/ .el-slider__bar {
  background-color: #252525;
}
/* slider 底色 */
#form /deep/ .el-slider__runway {
  margin: 12px 0;
  background-color: #737373;
}
#form /deep/ .el-slider__button {
  border-color: #252525;
}
.date_picker_box /deep/ input::-webkit-input-placeholder {
  width: 30px;
}
#form /deep/ .el-form-item__content , #form /deep/ .el-form-item__label ,#form /deep/ .el-input__icon{
  line-height: 30px;
}
#form /deep/ .el-collapse-item__header {
  height: 36px;
}
#form /deep/ .el-collapse-item__content {
  padding-bottom: 0px;
}
.color-item {
  border-bottom: 1px solid #737373;
}
.color-item:last-of-type{
  border-bottom: none;
}
.color-item-title {
  font-size: 12px;
  line-height: 1.7;
}
.color-item-subTitle {
  width: 25%;
  font-size: 10px;
  line-height: 1.7;
}
.sub-color-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.color-group {
  width: 75%;
  padding-left: 1em;
  line-height: 1.6;
  display: flex;
}
.color-group span {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 2px;
}
.c-bar-first{
  margin-left: 4px;
}
.c-bar {
  width: 30px!important;
  margin-right: 0!important;
}
</style>
<style>
.el-tooltip__popper.tooltip{
  opacity: 0.8;
}
.elDatePicker.el-picker-panel .el-date-table .current span {
  background: #252525;
}
.elDatePicker.el-picker-panel .el-date-table td.available:hover span {
  color:#ffffff;
  background: #737373;
}
.el-tooltip__popper.is-dark {
  opacity: 0.8;
}
</style>