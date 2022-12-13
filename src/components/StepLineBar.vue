<template>
  <div class="page1-container">
    <div class="step_content" id="step_content"></div>
    <el-button @click="handleClick">Switch Mode</el-button>
    <el-button @click="handleClickLine">Switch Curve/Step Line</el-button>
  </div>
</template>

<script>
export default {
  name: "StepLineBar",
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
    this.do();
  },
  methods: {
    do(){


    },
    handleClick(){
      //console.log(selectLGApredictiondata);
      let templength = selectLGApredictiondata.length;
      let globalstoragedata = selectLGApredictiondata;

      if (swithmodeflag == 1){
        swithmodeflag = 0;
        DrawStepLine(globalstoragedata[templength - 2]["getwholedataarr"],globalstoragedata[templength - 2]["getgroupdataarr"], templength - 2);

      }
      else{
        swithmodeflag = 1;
        DrawStepLine(globalstoragedata[templength - 2]["getwholedataarr"],globalstoragedata[templength - 1]["getgroupdataarr"], templength - 1);
      }

    },
    handleClickLine(){
      let templength = selectLGApredictiondata.length;
      let globalstoragedata = selectLGApredictiondata;
      if (swithlinemodeflag == 1){
        if (templength == 1){
          swithlinemodeflag = 0;
          DrawStepLine(globalstoragedata[0]["getwholedataarr"], globalstoragedata[0]["getgroupdataarr"], 0);
        }
        else{
          swithlinemodeflag = 0;
          DrawStepLine(globalstoragedata[templength - 2]["getwholedataarr"],globalstoragedata[templength - 1]["getgroupdataarr"], templength - 1);

        }
      }
      else{
        swithlinemodeflag = 1;
        if (templength == 1){
          DrawCurveLine(globalstoragedata[0]["getwholedataarr"],[], 0);
        }
        else{
          DrawCurveLine(globalstoragedata[templength - 2]["getwholedataarr"],globalstoragedata[templength - 1]["getwholedataarr"], templength - 1);
        }
      }



    }

  }
}
</script>

<style scoped>

.page1-container {
  width: 100%;
  height: 85%;

}
.step_content{
  width: 100%;
  height: 100%;
  overflow:hidden
}


</style>
