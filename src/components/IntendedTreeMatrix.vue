<template>
  <div class="page1-container">
    <div class="intended_content" id="intended_content"></div>
    <el-button @click="handleClick">Predict</el-button>
    <div class="infobox"></div>
  </div>
</template>

<script>
export default {
  name: "IntendedTreeMatrix",
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

    this.todo();
  },
  methods: {
    todo(){

    },

    handleClick(){
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
  }
}
</script>

<style>
.page1-container {
  width: 100%;
  height: 95%;
  padding: 5px;
}
.intended_content{
  width: 100%;
  height: 100%;
  /*overflow: auto;*/
  overflow-y: scroll;
  overflow-x: hidden;
}
.node rect {
  cursor: pointer;
  fill: #fff;
  fill-opacity: 0.8;
  stroke: #525252;
  stroke-width: 1px;

}

.node text {
  font: 10px sans-serif;
  pointer-events: none;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}

.links {
  fill: none;
  stroke: #9ecae1;
  stroke-width: 1px;
}
.infobox{
  display: none;
  position: absolute;
  left: 500px;
  top: 10px;
  padding: 5px;
  background-color: rgb(52, 48, 48);
  height: 40px;
  width: 140px;
  border: rgb(174, 170, 170);
  border-radius: 5px;
  opacity: .8;

}

</style>