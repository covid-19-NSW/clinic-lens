<template>
  <div class="container-wrapper">
    <div class="header">
        <img class = "header-icon" src="/static/Image/LensIcon.png">
      ClinicLensVA
    </div>
    <div class="container">
      <div class="left">
        <div class="top bar">
          <p class="title title-padding">Control Panel</p>
          <Control />
        </div>
        <div class="bottom bar">
          <p class="title title-padding">Regression Model</p>
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
          <div class="title-box">
            <p class="title">Intended Tree-Matrix Comparison</p>
            <div class="icon-box">
              <img src="../assets/prediction.png" alt="prediction" @click="PredictClick()">
              <img src="../assets/dataoutput.png" alt="" @click="">

<!--              <img src="../assets/img.jpg" alt="" @click="handleCal3()">-->
            </div>
          </div>
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
  methods: {

    PredictClick(){
  predictflag = 1;

  //console.log(cloneClinicGeo);
  for (let i = 0; i < dataShared["children"].length; i++){
    let tempLGA = ' and LGA_code19 =' + dataShared["children"][i]["LGAcode"];
    let cliniccount = dataShared["children"][i]["cliniccount"];
    let tempLGAarr = dataShared["children"][i]["children"];
    // let tempLGAarrcomparing = pre["children"][i]["children"];
    $.ajax({
      url: "http://localhost:3001/querycases?lga=" + tempLGA +"&date="+ filterdate,
      method: "GET",
      //data: highlighted_lga,
      // dataType: "json", //因为是调用nodeJS返回的json数据，所以必须使用binary类型
      error: function(XMLHttpRequest, textStatus, errorThrown){
        var s1=XMLHttpRequest;
        var s2=textStatus;
        var s3=errorThrown;
        alert("error message : "+errorThrown.toString())
      },
      success: function(res){
        // console.log(data);
        // console.log(tempLGAarr);
        // console.log(tempLGAarrcomparing);
        //assemble dataset begins
        let tempconverarr = [];

        let tempclinictitle = [];
        let getgroupdataarr = [];
        let getwholedataarr = [];
        for (let k = 0; k < tempLGAarr.length; k++){
          let realhoursarr = [];
          let wholeweekhours = 0;
          //Order: [Number(data["referralRequired"]),Number(data["ageLimit"]),Number(data["bookingRequired"]),Number(data["walkinAllowed"]),Number(data["driveThroughTesting"]),Number(data["wheelchairAccessible"])];
          let tempforuid = tempLGAarr[k]["name"].split(",");
          tempclinictitle.push(tempforuid[1]);
          for (let v = 0; v<tempLGAarr[k]["children"][1]["children"].length; v++){
            let realhourcurrent = 0;
            for (let t = 0; t < tempLGAarr[k]["children"][1]["children"][v]["data"].length - 1; t++){
              realhourcurrent+= tempLGAarr[k]["children"][1]["children"][v]["data"][t];
            }
            // let realhoursstr = tempLGAarr[k]["children"][1]["children"][v]["data"][48].split('/');
            // console.log(realhoursstr);
            realhoursarr.push(realhourcurrent/2);
            wholeweekhours += realhourcurrent/2;
          } //repeated
          //console.log(realhoursarr);
          // let tempdatestr = filterdate.split('>');
          // let tempdate = getMyDay(new Date(tempdatestr[0]))
          // console.log(realhoursarr[tempdate]);
          //need:["daycount","personskm2","cliniccount","event_level","whichday","referralRequired","ageLimit","realhours","bookingRequired","walkinAllowed","driveThroughTesting","wheelchairAccessible"];
          tempconverarr.push({
            "uniqueID": tempforuid[1],
            "referralRequired": tempLGAarr[k]["children"][0]["children"][0]["data"][0],
            "ageLimit": tempLGAarr[k]["children"][0]["children"][0]["data"][1],
            "bookingRequired":  tempLGAarr[k]["children"][0]["children"][0]["data"][2],
            "walkinAllowed": tempLGAarr[k]["children"][0]["children"][0]["data"][3],
            "driveThroughTesting": tempLGAarr[k]["children"][0]["children"][0]["data"][4],
            "wheelchairAccessible":  tempLGAarr[k]["children"][0]["children"][0]["data"][5],
            "realhoursarr" : realhoursarr,
            "wholeweekhours": wholeweekhours
          })

        }
        //console.log(tempconverarr);
        // let temp = [];
        let newres = JSON.parse(JSON.stringify(res));
        //console.log(newres);
        for (let j = 0; j < newres.data.length; j += cliniccount) {
          // console.log(j)
          let tempframe2 = newres.data.slice(j, j + cliniccount);
          // console.log(tempframe2[j]["notification_date"]);
          // console.log(typeof tempframe2[j]["notification_date"]);
          // console.log(getMyDay(new Date(tempframe2[j]["notification_date"])));
          // console.log(tempframe2[j]);
          //let temprealhours = realhoursarr[getMyDay(new Date(tempframe2[j]["notification_date"]))];
          for (let a = 0; a < tempconverarr.length;a++){
            for (let b = 0; b < cliniccount; b++){
              if (tempconverarr[a]["uniqueID"] === tempframe2[b]["uniqueID"]){
                tempframe2[b]["realhours"] = tempconverarr[a]["realhoursarr"][getMyDay(new Date(tempframe2[b]["notification_date"]))].toString();
                tempframe2[b]["referralRequired"] = tempconverarr[a]["referralRequired"].toString();
                tempframe2[b]["ageLimit"] = tempconverarr[a]["ageLimit"].toString();
                tempframe2[b]["bookingRequired"] = tempconverarr[a]["bookingRequired"].toString();
                tempframe2[b]["walkinAllowed"] = tempconverarr[a]["walkinAllowed"].toString();
                tempframe2[b]["driveThroughTesting"] = tempconverarr[a]["driveThroughTesting"].toString();
                tempframe2[b]["wheelchairAccessible"] = tempconverarr[a]["wheelchairAccessible"].toString();
                tempframe2[b]["weekHours"] = tempconverarr[a]["wholeweekhours"].toString();
                // console.log(newres.data[b])
              }
            }
          }
          let tempframe1 = res.data.slice(j, j + cliniccount);
          // console.log(tempframe1);
          // console.log(tempframe2);
          $.ajax({
            url: "http://127.0.0.1:5001/predict2",
            method: "Post",
            data: {
              "Frame1": tempframe1,
              "Y1": Number(res.data[j]["TestCases"]),
              "Frame2": tempframe2,
              "L1": cliniccount,
              "L2": cliniccount
            },
            // dataType: "json", //因为是调用nodeJS返回的json数据，所以必须使用binary类型
            error: function(XMLHttpRequest, textStatus, errorThrown){
              console.log("error message : "+errorThrown.toString())
            },
            success: function(res2){
              // console.log(tempframe1);
              // console.log(res2);
              //console.log(newres);
              let tempgetgroupdataarr = {};
              let templocation = [];
              for (let q = 0; q < res2.length; q++){
                tempgetgroupdataarr["lga_code19"] = res.data[j].lga_code19;
                tempgetgroupdataarr[tempclinictitle[q]] = res2[q];
                tempgetgroupdataarr["date"] = res.data[j].notification_date;
                templocation.push([res.data[j+q]["Longitude"], res.data[j+q]["Latitude"]])
              }
              //console.log(tempgetgroupdataarr);
              getgroupdataarr.push(tempgetgroupdataarr);
              //console.log(getgroupdataarr)
              //console.log(res.data.length/cliniccount);
              if (getgroupdataarr.length === res.data.length/cliniccount){
                dealdatainprocess(getgroupdataarr,res,tempclinictitle,cliniccount,processcallback);
                console.log(getgroupdataarr);
                let templength = Math.ceil(getgroupdataarr.length/2);
                console.log(templength);
                for (let gl = 0; gl < tempclinictitle.length; gl++){
                  tempheatmaparr.features.splice(tempheatmaparr.features.findIndex(item=>item.clinicname==tempclinictitle[gl]),1)
                  tempheatmaparr.features.push({
                    clinicname: tempclinictitle[gl],
                    geometry: {
                      type: "Point",
                      coordinates: templocation[gl],
                    },
                    type: "Feature",
                    properties: {
                      dbh: getgroupdataarr[templength][tempclinictitle[gl]]
                    }
                  });
                }
                console.log(tempheatmaparr);

                map.getSource('cloneClinicGeo').setData(tempheatmaparr);


              }


            },timeout: 20000

          })

        }

      },
      timeout: 40000
    })


  }

  function dealdatainprocess(getgroupdataarr,res,tempclinictitle,cliniccount,callback){
    getgroupdataarr = MsgSortDate(getgroupdataarr);
    getgroupdataarr["column"] = tempclinictitle;
    //getgroupdataarr IS NOW DATA
    //console.log(globalcurrentwholedataarr);
    //console.log(selectLGApredictiondata[0]["getgroupdataarr"]);
    let orginalgrouparr = selectLGApredictiondata[0]["getgroupdataarr"];
    // console.log(orginalgrouparr);
    // console.log(getgroupdataarr);
    let newcombinegrouparr = [];
    let tempcombinename = [];
    let tempcombinename2 = [];
    let newsinglemode = [];
    let temptotalvalue = [];
    for (let t = 0; t < orginalgrouparr.length; t++){
      let tempclinicobj = {};
      let tempafterobj = {};
      let totalvaluebyclinics = 0;
      for (let r = 0; r < orginalgrouparr["column"].length; r++){
        //comparing mode
        tempclinicobj["lga_code19"] = orginalgrouparr[t]["lga_code19"];
        tempclinicobj["date"] = orginalgrouparr[t]["date"];

        tempcombinename.push(orginalgrouparr["column"][r]);
        tempcombinename2.push(orginalgrouparr["column"][r]);

        let tempjudge = getgroupdataarr[t][orginalgrouparr["column"][r]] - orginalgrouparr[t][orginalgrouparr["column"][r]];
        tempcombinename.push(orginalgrouparr["column"][r] + 'changed');
        if (tempjudge > 0){
          tempclinicobj[orginalgrouparr["column"][r]] = orginalgrouparr[t][orginalgrouparr["column"][r]];
          tempclinicobj[orginalgrouparr["column"][r] + 'changedstatus'] = '+';
        }
        else if (tempjudge == 0){
          tempclinicobj[orginalgrouparr["column"][r]] = getgroupdataarr[t][orginalgrouparr["column"][r]];
          tempclinicobj[orginalgrouparr["column"][r] + 'changedstatus'] = '0';
        }
        else{
          tempclinicobj[orginalgrouparr["column"][r]] = getgroupdataarr[t][orginalgrouparr["column"][r]];
          tempclinicobj[orginalgrouparr["column"][r] + 'changedstatus'] = '-';
        }
        tempclinicobj[orginalgrouparr["column"][r] + 'changed'] = Math.abs(tempjudge);

        //single mode
        totalvaluebyclinics += getgroupdataarr[t][orginalgrouparr["column"][r]];
        tempafterobj["lga_code19"] = orginalgrouparr[t]["lga_code19"];
        tempafterobj["date"] = orginalgrouparr[t]["date"];
        tempcombinename2.push(orginalgrouparr["column"][r]);
        tempafterobj[orginalgrouparr["column"][r]] = getgroupdataarr[t][orginalgrouparr["column"][r]];

      }
      newcombinegrouparr.push(tempclinicobj);
      newsinglemode.push(tempafterobj);
      //cleanedtotal
      temptotalvalue.push({
        "lga_code19": orginalgrouparr[t]["lga_code19"],
        "date": orginalgrouparr[t]["date"],
        "value": totalvaluebyclinics
      })
    }
    newcombinegrouparr["column"] = tempcombinename.slice(0,cliniccount*2);
    newsinglemode["column"] = orginalgrouparr["column"];
    // console.log(newcombinegrouparr);
    callback(newcombinegrouparr,newsinglemode,temptotalvalue);
  }

  function processcallback(newcombinegrouparr,newsinglemode,temptotalvalue){
    selectLGApredictiondata.push({
      "id": w,
      "getwholedataarr": globalcurrentwholedataarr,
      "getgroupdataarr": newcombinegrouparr
      // "getgroupdataarr": getgroupdataarr
    },{
      "id": w+1,
      "getwholedataarr": temptotalvalue,
      "getgroupdataarr": newsinglemode
    });

    DrawStepLine(globalcurrentwholedataarr,newcombinegrouparr, w);
    w +=2;
  }

  function MsgSortDate(obj){
    obj.sort((a,b)=>{
      let t1 = new Date(Date.parse(a["date"].replace(/-/g,"/")))
      let t2 = new Date(Date.parse(b["date"].replace(/-/g,"/")))
      return t1.getTime()-t2.getTime()
    })
    return obj
  }

  function getMyDay(date){
    let week;
    if(date.getDay()==0) week="6";
    if(date.getDay()==1) week="0";
    if(date.getDay()==2) week="1";
    if(date.getDay()==3) week="2";
    if(date.getDay()==4) week="3";
    if(date.getDay()==5) week="4";
    if(date.getDay()==6) week="5";
    return week;
  }
}




  },
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

.title-box {
  width: 99%;
  padding-left: 6px;
  padding-right: 16px;
  padding-top: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* 不需要右边图标的title多加这个样式 */
.title-padding {
  padding-left: 6px;
  padding-top: 6px;
}
.title {
  font-size: 14px;
  /*color: #9f7f63;*/
  color: #3f2e2d;
  font-weight: 600;
}
.icon-box {
  display: flex;
}
.icon-box img {
  /* 宽高对应左边的字体大小 */
  width: 25px;
  height: 25px;
  margin-left: 6px;
  cursor: pointer;
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
