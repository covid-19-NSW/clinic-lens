<template>
  <div class="container-wrapper">
    <div class="header">
        <img class = "header-icon" src="/static/Image/LensIcon.png">
      ClinicLensVA
    </div>
    <div class="container">
      <div class="left">
        <div class="top bar">
          <p class="title">Control Panel</p>
          <Control />
        </div>
        <div class="bottom bar">
          <p class="title">Regression Model</p>
            <modulestat />
        </div>
      </div>
      <div class="center">
        <div class="center-main mapbar">
<!--          <p class="title">All Promotions</p>-->
          <Map />
        </div>
      </div>
      <div class="right">
        <div class="top bar">
          <p class="title">Storage View</p>
          <Storage />
        </div>
        <div class="bottom bar">
          <p class="title">Intended Tree-Matrix Comparison</p>
          <IntendedTreeMatrix />
        </div>
      </div>
    </div>
    <div class="bottom1 bar" >
      <p class="title" id="steplinetitle">Testing Capabilities Prediction</p>
      <StepLineBar/>
    </div>

  </div>
</template>
<script>
import modulestat from "../components/modulestat.vue";
import Map from "../components/map.vue";
import Storage from "../components/storage.vue";
import Control from "../components/controlpanel.vue";
import StepLineBar from "../components/StepLineBar.vue";
import IntendedTreeMatrix from "../components/IntendedTreeMatrix.vue";


export default {
  components: {
    modulestat,
    Map,
    Storage,
    Control,
    StepLineBar,
    IntendedTreeMatrix
  },
  name: "container",
  data() {
    return {
      form: {
        label: "",
        date: "",
        type: [],
      },
    };
  },
  mounted() {},
  methods: {},
};
</script>
<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html,body {
  width: 100%;
  height: 100%;
  font-family: "Microsoft YaHei";
  background: rgba(159,127,99,0.3);
}
/* 1% =* 0.32rem */
.container-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(159,127,99,0.2);
  padding: 8px;
}
.header {
  width: 100%;
  height: 2%;
  line-height: 20px;
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
  padding-left: 18px;
  /*padding-top: 1px;*/
  background: #252525;
  /* background: rgb(182, 119, 119); */
  border-radius: 6px;
  margin-bottom: 5px;
}
.header-icon{
  /*display: inline-block;*/
  /*vertical-align: middle;*/
  padding-top: 4px;
  width: 12px;
  height: 16px;
}
.title {
  padding-left: 6px;
  padding-top: 6px;
  /*color: #9f7f63;*/
  color: #3f2e2d;
  font-weight: 600;
}
.bar {
  padding: 0 0.1875rem 0.5rem;
  margin-bottom: 10px;
  border: 1px solid #3f2e2d;
  border-radius: 6px;
  background: #ffffff;
}

.mapbar {
  padding: 0 0 0 0;
  margin-bottom: 10px;
  border: 1px solid #3f2e2d;
  border-radius: 6px;
  background: #ffffff;
  z-index: 10;
}

.container {
  display: flex;
  width: 100%;
  height: 71%;
}
.container .left {
  width: 15%;
  margin-right: 0.1875rem;
}
.container .left .top {
  height: 48.8%;
  /* overflow: scroll; */
}
.container .left .bottom {
  height: 48.8%;
  /* overflow: scroll; */
}
.container .center {
  /* width: 55%; */
  flex: 1;
  margin: 0 5px;
}
.container .center .center-main{
  height: 99%;
  /*background: rgb(61, 57, 50);*/
  /* overflow: scroll; */
}

.container .center .top {
  height: 400px;
  /* overflow: scroll; */
}
.container .center .bottom {
  height: 150px;
  /* overflow: scroll; */
}

.container .right {
  width: 30%;
  margin-left: 0.1875rem;
}

.container .right .top {
  height: 48.8%;
  /* height: calc(50% -10px); */
  /* overflow: scroll; */
}
.container .right .bottom {
  height: 48.8%;
  /* overflow: scroll; */
}

.bottom1 {
  height: 27%;
  width: 100%;
  flex: 1;
  /*margin-top: 5px;*/
  margin-bottom: 1px;
}
</style>
