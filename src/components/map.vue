
<template>
  <div id="wrapper">
    <div id="map" class="map"></div>

  </div>
</template>
<script>

export default {
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
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      var mapcirclecolor = ["#238b45", "#001F78", "#FA6E0A"]; //aldi color
      //initialize svg lens
      var width = document.getElementById("map").clientWidth,
          height = document.getElementById("map").clientHeight;
      var cx = document.getElementById("map").clientWidth / 2,
          cy = document.getElementById("map").clientHeight / 2;
      // var svg;
      window.colorpanel = {
        "map": {
          "test": '#006d2c',
          'cases': '#d73027',
          'polygons':mapcirclecolor,
          "timeline": ['#fff', 'rgba(0,0,0,0.2)']
        },
        'intendtree': {
          "factor":{
            trueColor:'#3182bd',
            falseColor:'white'
          },
          "timeline":{
            trueColor:'#3182bd',
            falseColor:'white'
          }
        },
        "stepline":{
          "increase": "#ff6b6b",
          "decrease": "#a7c957",
          "groundturth": '#073b4c',
          "actualpath": '#0466c8',
          'afterpath': '#f72585'
        },
        "default": {
          "eventcategory1": '#7bccc4',
          "eventcategory2": '#2b8cbe',
          "interfacelightcolor": '#74a9cf',
          "multicolorscale": ['#d7191c', '#fdae61', '#a6d96a', '#1a9641']
        }

      };
      window.styleControler = {
        "single": {
          color: colorpanel.map.polygons[1],
          opacity: 0.7,
          strokeWidth: 2,
          strokeColor: "rgb(255,255,255)",
          innertSize: 0.7 //内部方块的大小  80%
        },
        "multiple": {
          color: colorpanel.map.polygons[0],
          opacity: 0.7,
          strokeWidth: 2,
          strokeColor: "rgb(255,255,255)",
          innertSize: 0.7 //内部方块的大小  80%
        },
        "grouped": {
          color: colorpanel.map.polygons[2],
          opacity: 0.8,
          strokeWidth: 2,
          strokeColor: "rgb(255,255,255)",
          innertSize: 0.7 //内部方块的大小  80%
        },
        "none": {
          color: "#808080",
          opacity: 0.6,
          strokeWidth: 2,
          strokeColor: "rgb(255,255,255)",
          innertSize: 0.7 //内部方块的大小  80%
        }
      };

      window.innerRadius = 280;
      window.outerRadius = 300;
      window.gaps = 20;

      window.portionnum = 1;
      window.polygonheatmapflag = 0;
      window.polygonmapflag = 1;
      window.switchflag = 0;
      window.lensflag = 0;
      window.moveflag = 0;
      window.lockflag = 1;
      window.readyforstorage = 0;

      window.loadingflag = 0;
      let isClick = true;
      window.filterdate = "2020-01-01>2020-09-15";
      var startflag = 0;
      window.wholetimeline = ["2020-01-01", "2022-10-26"];
      var storeid = 1;
      var savetotaldata = [];
      window.lensselecttime = [-90, 0];
      window.timeSelection = [
        new Date("2020-01-01"),
        new Date(moment("2020-09-15")),
      ];

      window.divlegend = d3
          .select("body")
          .append("div")
          .attr("class", "divlegend")
          .attr("z-index", 100);

      // var pietestdata1 = [1, 2, 3, 4, 5, 6, 7, 8];
      // var pietestdata2 = [11, 12, 13, 14, 15, 16, 17, 15];
      // var pietestarr1 = [];
      window.storagecount = 0; //记录第几次存储

      //pietestarr1 = Calpiedata(pietestdata1, window.portionnum);
      var NoDuplicateLGAarr = [];
      window.LGAarr = [];
      window.LGAarrDuplicate = [];
      window.LGAarrNoDuplicate = [];
      window.highlighted_lga = [];

      //PIEJS PARAMS START
      var defaultinnerradius = window.innerRadius;
      var defaultouterradius = window.outerRadius;
      var defaultgaps = window.gaps;
      var portionnum = window.portionnum;
      var map = window.map;
      var svg = window.svg;

      var datascale_color = d3.scale.linear()
          .domain([0,1])
          .range(["#ffeda0", "#E1343F"]);

      var pie_rate = d3.layout.pie()
          .sort(null)
          //默认降序排列，除非传入null
          .value(function(d) {
            return d.rate;
          });

      var pie_cases = d3.layout.pie()
          .sort(null)
          //默认降序排列，除非传入null
          .value(function(d) {
            return d.cases;
          });

      var pie_test = d3.layout.pie()
          .sort(null)
          //默认降序排列，除非传入null
          .value(function(d) {
            return d.testcases;
          });


      var arc_inner = d3.svg.arc()
          .startAngle(function(d) {
            //console.log(d);
            return d.data.start * 2 * Math.PI/360;
          })
          .endAngle(function(d) { return d.data.end * 2 * Math.PI/360; })
          .innerRadius(300)
          .outerRadius(320)
          .cornerRadius(5);

      var arc_outer = d3.svg.arc()
          .startAngle(function(d) {
            //console.log(d);
            return d.data.start * 2 * Math.PI/360;
          })
          .endAngle(function(d) { return d.data.end * 2 * Math.PI/360; })
          .innerRadius(320)
          .outerRadius(function (d) {
            //console.log(d)
            if( d.value === 0){
              return 320;

            }
            else{
              //console.log(d.value);
              //return 320 + 1.5 * (2 + Math.log(d.value) * 5);
              return 320 + 2 * (Math.log(d.value/100 + 20) + d.value / 20000);
              //return 15;
            }
          })
          //外部高低
          .cornerRadius(10);
      //PIEJS PARAM ENDS

      var ClinicGeo = {
        type: "FeatureCollection",
        features: [],
      };

      mapboxgl.accessToken =
          "pk.eyJ1IjoibWFnZTUwMTgiLCJhIjoiY2psd3cwemxuMTlyYzNwb2d4cXhyNGx0ZSJ9.VkkG4riV7oxGcAnStBiHJA";
      var map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mage5018/ckbumhoti0mes1iqmcl4m1qo7",
        zoom: 8,
        center: [151.2005, -33.8835],
        pitchWithRotate: false,
        dragRotate: false,
        //maxBounds: nswBounds,
        attributionControl: false,
        // hash:true
      });
      window.map = map;
      var container = map.getCanvasContainer();
      var draw = new MapboxDraw({
        displayControlsDefault: false,
        // Select which mapbox-gl-draw control buttons to add to the map.
        controls: {
          polygon: true,
          trash: true,
        },
        // Set mapbox-gl-draw to draw by default.
        // The user does not have to click the polygon control button first.
        //defaultMode: 'draw_polygon'
      });
      map.addControl(draw);
      var geojsonforusing = [];

      // export default class PitchToggle {
      class PitchToggle {
        constructor({ bearing = -20, pitch = 70, minpitchzoom = null }) {
          this._bearing = bearing;
          this._pitch = pitch;
          this._minpitchzoom = minpitchzoom;
        }

        onAdd(map) {
          this._map = map;
          let _this = this;

          this._btn = document.createElement("button");
          this._btn.className =
              "mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-3d";
          this._btn.type = "button";
          this._btn["aria-label"] = "Toggle Pitch";
          this._btn.onclick = function() {
            if (map.getPitch() === 0) {
              let options = { pitch: _this._pitch, bearing: _this._bearing };
              if (_this._minpitchzoom && map.getZoom() > _this._minpitchzoom) {
                options.zoom = _this._minpitchzoom;
              }
              map.easeTo(options);
              _this._btn.className =
                  "mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-2d";
            } else {
              map.easeTo({ pitch: 0, bearing: 0 });
              _this._btn.className =
                  "mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-3d";
            }
          };

          this._container = document.createElement("div");
          this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
          this._container.appendChild(this._btn);

          return this._container;
        }

        onRemove() {
          this._container.parentNode.removeChild(this._container);
          this._map = undefined;
        }
      }

      /* Idea from Stack Overflow https://stackoverflow.com/a/51683226  */
      class MapboxGLButtonControl {
        constructor({ className = "", title = "", eventHandler = evtHndlr }) {
          this._className = className;
          this._title = title;
          this._eventHandler = eventHandler;
        }

        onAdd(map) {
          this._btn = document.createElement("button");
          this._btn.className = "mapboxgl-ctrl-icon" + " " + this._className;
          this._btn.type = "button";
          this._btn.title = this._title;
          this._btn.onclick = this._eventHandler;

          this._container = document.createElement("div");
          this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
          this._container.appendChild(this._btn);

          return this._container;
        }

        onRemove() {
          this._container.parentNode.removeChild(this._container);
          this._map = undefined;
        }
      }

      /* Event Handlers */
      // function one(event) {
      //   console.log("Event handler when clicking on \r\n" + event.target.className);
      //   console.log("event number 1", event);
      // }

      function lens(event) {
        //console.log(lensflag);
        if (lensflag == 0) {
          map.setLayoutProperty("circle", "visibility", "none");
          d3.select("#lenssvg")
              .attr("width", 0)
              .attr("height", 0);
          //document.getElementsByClassName("mapboxgl-canvas")[0].style.display="none";//隐藏
          lensflag = 1;
        } else {
          map.setLayoutProperty("circle", "visibility", "visible");
          d3.select("#lenssvg")
              .attr("width", "100%")
              .attr("height", "100%");
          // document.getElementsByClassName("mapboxgl-canvas")[0].style.display="";//xianshi
          lensflag = 0;
        }
        console.log("event number 2", event);
      }
      function cancel(event) {
        console.log("Event handler when cancel \r\n" + event.target.className);
      }

      function save(event) {
        if (readyforstorage == 1){
          d3.select('.mapbox-gl-draw_symbol_correct').attr('class', 'ld ld-ring ld-spin').attr('id', 'loading');
          console.log("savelicked" + event.target.className);
          // console.log(highlighted_lga);
          // console.log(LGAarr);

          // if (highlighted_lga.length == 0)
          //return;
          highlighted_lga = LGAarr;

          var tempsqllga = "";
          for (var i = 0; i < highlighted_lga.length; i++) {
            tempsqllga += ' lga_code19 = "' + highlighted_lga[i] + '" or';
          }
          tempsqllga = tempsqllga.substring(0, tempsqllga.length - 2);
          if (tempsqllga == "") {
            tempsqllga = "";
          } else {
            tempsqllga = " and (" + tempsqllga + ") ";
          }

          //console.log(filterdate);
          var tempMapPolygons = map.getLayer("polygon-highlighted");
          // console.log(tempMapPolygons);
          // console.log(geojsonforusing);
          //get data from node.js
          $.ajax({
            url:
                "http://localhost:3001/querysumcases?lga=" +
                tempsqllga +
                "&date=" +
                filterdate,
            method: "GET",
            //data: highlighted_lga,
            // dataType: "json", //因为是调用nodeJS返回的json数据，所以必须使用binary类型
            error: function(XMLHttpRequest, textStatus, errorThrown) {
              var s1 = XMLHttpRequest;
              var s2 = textStatus;
              var s3 = errorThrown;
              console.log("error message : " + errorThrown.toString());
            },
            success: function(data) {
              AssembleStorage(data, filterdate, drawmatrix);
              //playRects(appendIdStr, teststorage, styleControler, cols + 1, rectPadding, mapcirclecolor);
              //console.log(data);
              storeid++;
            },
            timeout: 3000,
          });


        }
        else {
          alert('Please wait for prediction!')
        }

      }

      function switchdiv(event) {
        //alert("Event handler when clicking on \r\n" + event.target.className);
        //console.log("swtich point", event);
        if (switchflag == 0) {
          map.setLayoutProperty("Clinic-point2", "visibility", "none");
          //map.setLayoutProperty("Clinic-point", 'visibility', 'none');
          switchflag = 1;
        } else {
          map.setLayoutProperty("Clinic-point2", "visibility", "visible");
          //map.setLayoutProperty("Clinic-point", 'visibility', 'visible');
          switchflag = 0;
        }
      }

      function lock(event) {
        //console.log("lock clicked" + event.target.className);
        //console.log(this)
        if (lockflag === 0) {
          this.className = "mapboxgl-ctrl-icon mapbox-gl-draw_symbol_unlocked";
          lockflag = 1;

          //console.log(LGAarr);
        } else {
          this.className = "mapboxgl-ctrl-icon mapbox-gl-draw_symbol_locked";
          lockflag = 0;

          //console.log(LGAarr);
        }
      }

      function Heatmap(event) {
        //console.log("Polygon clicked" + event.target.className);
        //console.log(this)
        if (polygonheatmapflag == 1) {
          map.setLayoutProperty("Clinic-heat", "visibility", "none");
          this.className =
              "mapboxgl-ctrl-icon mapbox-gl-draw_heatmap_empty";
          //map.setLayoutProperty("Clinic-point", 'visibility', 'none');
          polygonheatmapflag = 0;
        } else {
          map.setLayoutProperty("Clinic-heat", "visibility", "visible");
          this.className = "mapboxgl-ctrl-icon mapbox-gl-draw_heatmap_switchon";
          //map.setLayoutProperty("Clinic-point", 'visibility', 'visible');
          polygonheatmapflag = 1;
        }
      }

      function Polygon(event) {
        //console.log("Polygon clicked" + event.target.className);
        //console.log(this)
        if (polygonmapflag == 1) {
          map.setLayoutProperty("polygon-highlighted", "visibility", "none");
          this.className =
              "mapboxgl-ctrl-icon mapbox-gl-draw_polygon_uncolored";
          //map.setLayoutProperty("Clinic-point", 'visibility', 'none');
          polygonmapflag = 0;
        } else {
          map.setLayoutProperty("polygon-highlighted", "visibility", "visible");
          this.className = "mapboxgl-ctrl-icon mapbox-gl-draw_polygon_colored";
          //map.setLayoutProperty("Clinic-point", 'visibility', 'visible');
          polygonmapflag = 1;
        }
      }


      /* Instantiate new controls with custom event handlers */
      const ctrlLocker = new MapboxGLButtonControl({
        className: "mapbox-gl-draw_symbol_unlocked",
        title: "Lock status",
        eventHandler: lock,
      });

      const ctrlClinicHeatmap = new MapboxGLButtonControl({
        className: "mapbox-gl-draw_heatmap_empty",
        title: "Heatmap status",
        eventHandler: Heatmap,
      });

      const ctrlPolygon = new MapboxGLButtonControl({
        className: "mapbox-gl-draw_polygon_colored",
        title: "Polygon status",
        eventHandler: Polygon,
      });

      const ctrlCorrect = new MapboxGLButtonControl({
        className: "mapbox-gl-draw_symbol_correct",
        title: "Save",
        eventHandler: save,
      });
      const ctrlFalse = new MapboxGLButtonControl({
        className: "mapbox-gl-draw_symbol_false",
        title: "Draw Line",
        eventHandler: cancel,
      });
      const ctrlFlower = new MapboxGLButtonControl({
        className: "mapbox-gl-draw_symbol_flower",
        title: "Draw Lens",
        eventHandler: lens,
      });
      // const ctrlRadialarea = new MapboxGLButtonControl({
      //     className: "mapbox-gl-draw_symbol_radialarea",
      //     title: "Draw Line",
      //     eventHandler: two
      // });

      const ctrlSwitch = new MapboxGLButtonControl({
        className: "mapbox-gl-draw_symbol_switch",
        title: "Draw Polygon",
        eventHandler: switchdiv,
      });

      /* Add Controls to the Map */
      map.addControl(new mapboxgl.NavigationControl(), "top-left");
      map.addControl(new PitchToggle({ minpitchzoom: 11 }), "top-left");
      //map.addControl(ctrlPoint, "bottom-left");
      map.addControl(ctrlCorrect, "bottom-right");

      map.addControl(ctrlFalse, "bottom-right");

      map.addControl(ctrlFlower, "top-right");
      map.addControl(ctrlLocker, "top-right");
      map.addControl(ctrlSwitch, "top-right");
      map.addControl(ctrlPolygon, "top-right");
      map.addControl(ctrlClinicHeatmap, "top-right");
      // map.addControl(ctrlRadialarea, "top-right");

      $.getJSON("../../static/Dataset/nsw_lga_polygon_V5.geojson", function(geojson) {
        d3.csv("../../static/Dataset/clinics.csv", function(error, data) {
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < geojson.features.length; j++) {

              if (
                  geojson.features[j]["properties"]["lgacode"] ===
                  data[i]["lga_code19"]
              ) {
                geojson.features[j]["properties"]["lgacount"] =
                    data[i]["lgacount"];
                geojson.features[j]["properties"]["cliniccount"] =
                    data[i]["clinicmark"];
                geojson.features[j]["properties"]["cliniccountforclassification"] =
                    data[i]["clinicmark"];
              }
            }
            ClinicGeo.features.push({
              geometry: {
                type: "Point",
                coordinates: [data[i]["Longitude"], data[i]["Latitude"]],
              },
              type: "Feature",
              properties: {
                Longitude: data[i]["Longitude"],
                Latitude: data[i]["Latitude"],
                dbh:0,
                //dbh: Math.random() * 62,
                name: data[i]["title"],
                ClinicID: data[i]["uniqueID"],
                postcode: data[i]["postcode"],
                state: data[i]["state"],
                suburb: data[i]["suburb"],
                title: data[i]["uniqueID"],
                // // "Clinicurl": data[i]["bookingLink"],
                // bookingPhoneNumber: data[i]["bookingPhoneNumber"],
                lga_code19: data[i]["lga_code19"],
                lgacount: data[i]["lgacount"],
                cliniccount: data[i]["clinicmark"]
              }
            });
          }
          geojsonforusing = geojson;
          //console.log(geojsonforusing);
          window.cloneClinicGeo = JSON.parse(JSON.stringify(ClinicGeo));

          map.on("load", () => {
            map.on("draw.create", updateArea);
            map.on("draw.delete", updateAreaAfterDelete);
            map.on("draw.update", updateArea);

            // //YOUR TURN: Add source layer cloneClinicGeo
            map.addSource("ClinicGeo", {
              type: "geojson",
              data: ClinicGeo,
            });
            map.addSource("cloneClinicGeo", {
              type: "geojson",
              data: cloneClinicGeo,
            });
            // 区域geojson
            map.addSource("lga-polygon", {
              type: "geojson",
              data: geojsonforusing,
            });

            // 区域中的点
            map.addLayer(
                {
                  id: "Clinic-point2",
                  type: "circle",
                  source: "ClinicGeo",
                  layout: {
                    // Make the layer visible by default.
                    visibility: "visible",
                  },
                  paint: {
                    "circle-radius": 5,

                    "circle-color": "black",
                    "circle-stroke-color": "white",
                    "circle-stroke-width": 1,
                    "circle-opacity": 0.8,
                  },

                },
                "waterway-label"
            );

            map.addLayer(
                {
                  id: "Clinic-pointhighlighted",
                  type: "circle",
                  source: "ClinicGeo",
                  layout: {
                    // Make the layer visible by default.
                    visibility: "visible",
                  },
                  paint: {
                    "circle-radius": 6,
                    "circle-color": "red",
                    "circle-stroke-color": "white",
                    "circle-stroke-width": 1,
                    "circle-opacity": 0.8,
                  },
                  filter: ["in", "ClinicID", ""],
                },
                "waterway-label"
            );

            // 热力图图层
            map.addLayer(
                {
                  id: "Clinic-heat",
                  type: "heatmap",
                  source: "cloneClinicGeo",
                  maxzoom: 12,
                  layout: {
                    // Make the layer visible by default.
                    visibility: "none",
                  },
                  paint: {
                    // increase weight as diameter breast height increases
                    'heatmap-weight': [
                      'interpolate',
                      ['linear'],
                      ['get', 'dbh'],
                      0,
                      0,
                      500,
                      1
                    ],
                    // increase intensity as zoom level increases
                    "heatmap-intensity": {
                      stops: [
                        [5, 1],
                        [25, 20],
                      ],
                    },
                    // use sequential color palette to use exponentially as the weight increases
                    "heatmap-color": [
                      "interpolate",
                      ["linear"],
                      ["heatmap-density"],
                      0,
                      "rgba(6,0,8,0)",
                      0.2,
                      "#ffeda0",
                      0.5,
                      "#fc4e2a",
                      1,
                      "#b10026"
                    ],
                    // increase radius as zoom increases
                    "heatmap-radius": {
                      stops: [
                        [4, 50],
                        [12, 100],
                      ],
                    },
                    // decrease opacity to transition into the circle layer
                    "heatmap-opacity": {
                      default: 1,
                      stops: [
                        [5, 0.8],
                        [25, 0],
                      ],
                    },
                  },
                },
                "Clinic-point2"
            );

            map.addLayer(
                {
                  id: "polygon-fill",
                  type: "fill",
                  source: "lga-polygon", // reference the data source
                  layout: {
                    // Make the layer visible by default.
                    visibility: "visible",
                  },
                  paint: {
                    "fill-outline-color": "#484896",
                    "fill-color": "#f1f1f1", // blue color fill
                    "fill-opacity": 0.5,
                  },
                },
                "Clinic-heat"
            );

            map.addLayer(
                {
                  id: "polygon-highlighted-line",
                  type: "line",
                  source: "lga-polygon",
                  paint: {
                    "line-width": 1.2,
                  },
                  "fill-opacity": 0.5,
                  filter: ["in", "lgacode", ""],
                },
                "polygon-fill"
            ); // Place polygon under these labels.

            map.addLayer(
                {
                  id: "polygon-highlighted",
                  type: "fill",
                  source: "lga-polygon",
                  paint: {
                    "fill-outline-color": "#484896",
                    // 'fill-color': '#c6dbef',
                    "fill-color": [
                      "match",
                      ["get", "cliniccountforclassification"],
                      "10",
                      colorpanel.map.polygons[2],
                      "2",
                      colorpanel.map.polygons[0],
                      "1",
                      colorpanel.map.polygons[1],
                      "#f1f1f1",
                    ],

                    "fill-opacity": 0.9,
                  },
                  filter: ["in", "lgacode", ""],
                },
                "polygon-fill"
            ); // Place polygon under these labels.
            map.addLayer(
                {
                  id: "polygon-highlighted-line2",
                  type: "line",
                  source: "lga-polygon",
                  paint: {
                    "line-width": 2,
                  },
                  "fill-opacity": 0.8,
                  filter: ["in", "lgacode", ""],
                },
                "waterway-label"
            ); // Place polygon under these labels.

            map.addSource("circle", {
              type: "geojson",
              // 空的geojson数据
              data: turf.featureCollection([]),
            });

            map.addLayer(
                {
                  id: "circle",
                  type: "fill",
                  source: "circle",
                  paint: {
                    // 'fill-outline-color': '#f00',
                    "fill-color": "rgba(56, 135, 190, 0)",
                  },
                },
                "polygon-fill"
            );

            // console.log(container);
            svg = d3
                .select(container)
                .append("svg")
                .attr("id", "lenssvg")
                .style("position", "absolute")
                .attr("width", cx * 2)
                .attr("height", cy * 2);

            drawDragArc("lenssvg", wholetimeline[0], wholetimeline[1]);
            //playLensPie();

            map.once("render", () => {
              console.log("render happened");
            });


            map.on("moveend", () => {
              console.log("move happened");
              moveflag = 1;
              Allpointset(estconnection);
            });

            map.on("zoomend", () => {
              console.log("zoom happened");
              moveflag = 1;
              Allpointset(estconnection);
            });

            // map.on("click", (e) => {
            //     // When the map is clicked, get the geographic coordinate.
            //     const coordinate = map.unproject(e.point);
            //     console.log("map.on ~ widfdsth2", coordinate, e);
            // });
          });

          map.on("click", "Clinic-point2", (e) => {
            var mousemovefeatures = map.queryRenderedFeatures(e.point);
            //console.log(mousemovefeatures[0].properties);
          });

          map.on("click", "polygon-fill", (e) => {
            if (isClick) {
              var mousemovefeatures = map.queryRenderedFeatures(e.point);
              map.getCanvas().style.cursor = "pointer";
              if (
                  typeof mousemovefeatures[0].properties.lgacode == "undefined"
              ) {
                console.log("it is undefined");
                return;
              }
              if (e.features.length > 0) {
                //console.log(mousemovefeatures[0].properties.lgacode);
                LGAarr.push(mousemovefeatures[0].properties.lgacode.toString());
                var tempobj = getArrItemNum(LGAarr);

                //console.log(tempobj);
                highlighted_lga = [];
                for (var i = 0; i < tempobj.length; i++) {
                  if (tempobj[i]["num"] % 2 != 0) {
                    highlighted_lga.push(tempobj[i]["key"]);
                  }
                }

                map.setFilter("polygon-highlighted-line", [
                  "in",
                  "lgacode",
                  ...highlighted_lga,
                ]);
                map.setFilter("polygon-highlighted", [
                  "in",
                  "lgacode",
                  ...highlighted_lga,
                ]);
                console.log(highlighted_lga);

                LGAarr = highlighted_lga;

                var tempsqllga = "";
                for (var i = 0; i < LGAarr.length; i++) {
                  tempsqllga += ' lga_code19 = "' + LGAarr[i] + '" or';
                }
                tempsqllga = tempsqllga.substring(0, tempsqllga.length - 2);

                //console.log(tempsqllga);

                estconnection(tempsqllga);
              }
            }
          });

          var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
          });

          function FirstRender() {
            console.log("FirstRendered.");
          }
        });
      });

      function Allpointset(callback) {
        if (lockflag == 1) {
          readyforstorage = 0;
          // 获取地图中心点
          if (lensflag != 1) {
            d3.select('.mapbox-gl-draw_symbol_correct').attr('class', 'ld ld-ring ld-spin').attr('id', 'loading');
            const mapCenter = map.getCenter();
            const screenCenter = map.project(mapCenter);
            const circleLeftPoi = map.unproject([
              screenCenter.x + innerRadius,
              screenCenter.y,
            ]);

            // 圆的半径在地图上面的距离
            const distance = getDistance(
                [circleLeftPoi.lng, mapCenter.lat],
                [mapCenter.lng, mapCenter.lat]
            );
            // console.log(turf.point([circleLeftPoi.lng, mapCenter.lat]));
            // console.log(mapCenter);
            // console.log(circleLeftPoi);
            // console.log(distance);

            const circle = turf.circle(
                turf.point([mapCenter.lng, mapCenter.lat]),
                distance
            );
            map.getSource("circle").setData(turf.featureCollection([circle]));

            if (moveflag == 0) return;

            // If bbox exists. use this value as the argument for `queryRenderedFeatures`
            if (circle) {
              const bbox = turf.bbox(circle);

              // 从source中获取features数据
              const features = map.querySourceFeatures("lga-polygon", {
                sourceLayer: "polygon-fill",
              });

              var intersectFeatures = [];
              features.forEach((f) => {
                // 判断是否在圆圈内
                var inCircle = false;
                var explode = turf.explode(f);
                for (let p of explode.features) {
                  if (turf.booleanPointInPolygon(p, circle)) {
                    inCircle = true;
                  } else {
                    inCircle = false;
                    break;
                  }
                }
                if (inCircle) {
                  intersectFeatures.push(f);
                }
              });

              // Run through the selected features and set a filter
              // to match features with unique FIPS codes to activate
              // the `counties-highlighted` layer.
              var filter = intersectFeatures.reduce(
                  function (memo, feature) {
                    memo.push(feature.properties.lgacode);
                    //console.log(memo);
                    return memo;
                  },
                  ["in", "lgacode"]
              );

              LGAarrDuplicate = [];
              LGAarrNoDuplicate = [];


              //console.log(filter.slice(2));
              //console.log(filterpoint.slice(2,filter.length));
              LGAarr = uniquearr(filter.slice(2, filter.length)); //1
              // if (lockflag == 1) {
              map.setFilter("polygon-highlighted", [
                "in",
                "lgacode",
                ...LGAarr,
              ]);
              map.setFilter("polygon-highlighted-line", [
                "in",
                "lgacode",
                ...LGAarr,
              ]);
              // }

              //console.log(LGAarr); //get lgas in circle
              var tempsqllga = "";
              for (var i = 0; i < LGAarr.length; i++) {
                tempsqllga += ' lga_code19 = "' + LGAarr[i] + '" or';
              }
              tempsqllga = tempsqllga.substring(0, tempsqllga.length - 2);

              callback(tempsqllga);
            }
          }
        }

        console.log("Refresh done");
      }
      function estconnection(tempsqllga) {
        //console.log(filterdate);
        //console.log(tempsqllga)
        //console.log(LGAarr);
        //console.log(ClinicGeo);
        if (tempsqllga == "") {
          tempsqllga = "";
        } else {
          tempsqllga = " and (" + tempsqllga + ") ";
        }
        //average ability
        let temptimearr = filterdate.split('>');

        let timefordivide = Math.abs(moment(temptimearr[1]).diff(moment(temptimearr[0]),'days') + 2);
        if (timefordivide%2 == 1){
          timefordivide = (timefordivide+1)/2;
        }
        else{
          timefordivide = timefordivide/2
        }
        let dateforprediction = moment(temptimearr[0]).add(timefordivide,'days').format('YYYY-MM-DD')
        //console.log(dateforprediction);

        //get data from node.js
        $.ajax({
          url:
              "http://localhost:3001/querydate?lga=" +
              tempsqllga +
              "&date=" +
              filterdate,
          method: "GET",
          //data: highlighted_lga,
          // dataType: "json", //因为是调用nodeJS返回的json数据，所以必须使用binary类型
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            var s1 = XMLHttpRequest;
            var s2 = textStatus;
            var s3 = errorThrown;
            console.log("error message : " + errorThrown.toString());
          },
          success: function(raw) {
            //console.log(raw);
            var filterpiedata = Calpiedata(raw.data, window.portionnum);
            if (startflag == 0) {
              playLensPie(filterpiedata);
              startflag++;
            } else {
              playLensPieAgain(filterpiedata);
              console.log("you are querying new date data");
            }
            //console.log(LGAarr);
            var clinicperLGAarr = [];
            let nullcount = 0;
            for (let n = 0; n < LGAarr.length; n++){
              const temponelga = 'and lga_code19 = ' + LGAarr[n];
              $.ajax({
                url:
                    "http://localhost:3001/queryforheatmap?lga=" +
                    temponelga +
                    "&date=" +
                    dateforprediction,
                method: "GET",
                //data: highlighted_lga,
                // dataType: "json", //因为是调用nodeJS返回的json数据，所以必须使用binary类型
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                  var s1 = XMLHttpRequest;
                  var s2 = textStatus;
                  var s3 = errorThrown;
                  console.log("error message : " + errorThrown.toString());
                },
                success: function(data) {
                  //console.log(data.data);
                  if (data.data.length == 0) nullcount++;
                  if (data.data.length > 0){
                    let clinicname = [];
                    let cliniclocation = [];
                    for (let u = 0; u < data.data.length; u++){
                      clinicname.push(data.data[u]["uniqueID"]);
                      cliniclocation.push([data.data[u]["Longitude"], data.data[u]["Latitude"]]);
                    }

                    $.ajax({
                      url: "http://127.0.0.1:5001/" + modelname+ "predict1",
                      method: "Post",
                      data: {
                        "Frame1": data.data,
                        "Y1": Number(data.data[0]["TestCases"]),
                        "L1": data.data[0]["count"]
                      },
                      // dataType: "json",
                      error: function(XMLHttpRequest, textStatus, errorThrown){
                        console.log("error message : "+errorThrown.toString())
                      },
                      success: function(res){
                        //console.log(res);
                        clinicperLGAarr.push({
                          "lga_code19": LGAarr[n],
                          "clinicname": clinicname,
                          "location": cliniclocation,
                          "prediction": res
                        })
                        // console.log(clinicperLGAarr);
                        // console.log(LGAarr);
                        // console.log(nullcount);
                        if (clinicperLGAarr.length == LGAarr.length - nullcount){
                          console.log("done!", clinicperLGAarr);
                          Updateheatmap(clinicperLGAarr, Drawheatmap);
                          d3.select('#loading').attr('class', 'mapbox-gl-draw_symbol_correct');
                          readyforstorage = 1;
                        }


                      },
                      timeout: 200
                    });
                  }

                },
                timeout: 25000,
              });
            }


          },
          timeout: 60000,
        });
      }

      function Updateheatmap(clinicperLGAarr,callback){
        //console.log(clinicperLGAarr);
        window.tempheatmaparr = {
          type: "FeatureCollection",
          features: [],
        };

        for (let j = 0; j < clinicperLGAarr.length; j++){
          for (let k = 0; k < clinicperLGAarr[j].clinicname.length; k++){
            tempheatmaparr.features.push({
              clinicname: clinicperLGAarr[j]["clinicname"][k],
              geometry: {
                type: "Point",
                coordinates: clinicperLGAarr[j]["location"][k],
              },
              type: "Feature",
              properties: {
                dbh: clinicperLGAarr[j]["prediction"][k]
              }
            });

          }

        }

        callback(tempheatmaparr);
      }

      function Drawheatmap(tempheatmaparr){
        //console.log(ClinicGeo);
        map.getSource('cloneClinicGeo').setData(tempheatmaparr);
      }

      function getDistance(point1, point2) {
        const from = turf.point(point1);
        const to = turf.point(point2);
        const options = { units: "kilometers" };
        return turf.distance(from, to, options);
      }

      //properties.title去重
      function Unique(arr) {
        const res = new Map();
        return arr.filter(
            (a) => !res.has(a.properties) && res.set(a.properties, 1)
        );
      }

      function uniquesimplearr(arr) {
        if (!Array.isArray(arr)) {
          console.log('type error!')
          return
        }
        var array = [];
        for (var i = 0; i < arr.length; i++) {
          if (array .indexOf(arr[i]) === -1) {
            array .push(arr[i])
          }
        }
        return array;
      }

      function findnoDuplicates(array) {
        let arr = [];
        for (let i in array) {
          if (arr.indexOf(array[i] < 0)) {
            arr.push(array[i]);
          }
        }
        return arr;
      }

      function uniquearr(arr) {
        return Array.from(new Set(arr));
      }
      function findDuplicates(arr) {
        const filtered = arr.filter(
            (item, index) => arr.indexOf(item) !== index
        );
        return [...new Set(filtered)];
      }

      function getArrItemNum(arr) {
        let ArrObj = [];
        arr.sort();
        arr.forEach((element, index) => {
          if (element === arr[index - 1]) {
            ArrObj[ArrObj.length - 1].num++;
          } else {
            ArrObj.push({
              key: element,
              num: 1,
            });
          }
        });
        return ArrObj;
      }

      function Calpiedata(data, num) {
        var temparr = [];

        for (var i = 0; i < data.length; i++) {
          if (data[i]["TestCases"] < data[i]["Cases"])
            data[i]["TestCases"] += data[i]["Cases"];
          if (data[i]["Rate"] == null) data[i]["Rate"] = 0;
          temparr.push({
            filterdate: moment(data[i]["FilterDate"]).format("YYYY-MM-DD"),
            cases: data[i]["Cases"],
            testcases: data[i]["TestCases"],
            rate: data[i]["Rate"],
            start: (360 / data.length / num) * i,
            end: (360 / data.length / num) * (i + 1),
          });
        }

        return temparr;
      }

      function updateAreaAfterDelete(e) {}

      function updateArea(e) {
        isClick = false;

        //console.log("clicked polygon select");
        var draw_polygon = turf.bbox(e.features[0]);
        var southWest = [draw_polygon[0], draw_polygon[1]];
        var northEast = [draw_polygon[2], draw_polygon[3]];

        var northEastPointPixel = map.project(northEast);
        var southWestPointPixel = map.project(southWest);

        var features_polygonselected = map.queryRenderedFeatures(
            [southWestPointPixel, northEastPointPixel],
            { layers: ["Clinic-point2"] }
        );
        var tempgrouped = [];
        var tempLGAarr = [];
        for (let o = 0; o < features_polygonselected.length; o++) {
          //tempgrouped.push(features_polygonselected[o].properties);
          tempLGAarr.push(features_polygonselected[o].properties.lga_code19);
        }
        // map.setFilter('polygon-highlighted1', ['in', 'lgacode', ...tempLGAarr]);
        // map.setFilter('polygon-highlighted-line1', ['in', 'lgacode', ...tempLGAarr]);
        NoDuplicateLGAarr = [];
        NoDuplicateLGAarr = uniquearr(tempLGAarr);

        for (var j = 0; j < geojsonforusing.features.length; j++) {
          for (var i = 0; i < NoDuplicateLGAarr.length; i++) {
            if (
                geojsonforusing.features[j]["properties"]["lgacode"] ===
                NoDuplicateLGAarr[i]
            ) {

              geojsonforusing.features[j]["properties"]["cliniccountforclassification"] = "10";
              //console.log(geojsonforusing.features[j]["properties"]);
            }
          }
        }
        //console.log(tempgrouped);
        //.log(geojsonforusing.features, e);
        map.getSource("lga-polygon").setData(geojsonforusing);

        isClick = true;
      }

      function AssembleStorage(data, filterdate, callback) {
        var mapcenter = map.getCenter();
        var mapzoom = map.getZoom();
        var mapbearing = map.getBearing();
        var mappitch = map.getPitch();
        var mapcurrentSource = map.getLayer("polygon-highlighted");
        // console.log(highlighted_lga);
        // console.log(data);
        var tempsaveforeach = [];

        for (let p = 0; p < NoDuplicateLGAarr.length; p++) {
          for (let q = 0; q < highlighted_lga.length; q++) {
            if (NoDuplicateLGAarr[p] == highlighted_lga[q]) {
              highlighted_lga.splice(q, 1);
            }
          }
        }
        // console.log(NoDuplicateLGAarr);
        // console.log(highlighted_lga);
        CalMatrix(data, highlighted_lga, tempsaveforeach, 0);
        CalMatrix(data, NoDuplicateLGAarr, tempsaveforeach, 1);
        //console.log(tempsaveforeach);
        savetotaldata.push({
          Storageid: storeid,
          mappara: [
            {
              mapcenter: mapcenter,
              mapzoom: mapzoom,
              //"clusterradius": mapcurrentSource._options.clusterRadius,
              mapbearing: mapbearing,
              mappitch: mappitch,
            },
          ],
          Details: tempsaveforeach,
          Timeline: [new Date(filterdate[0]), new Date(filterdate[1])],
        });
        //console.log(savetotaldata);
        map.getSource("lga-polygon").setData(geojsonforusing);
        callback();
      }

      function drawmatrix() {
        playRects(
            appendIdStr,
            savetotaldata,
            styleControler,
            cols,
            rectPadding,
            mapcirclecolor
        );
        d3.select('#loading').attr('class', 'mapbox-gl-draw_symbol_correct');
        //finish
      }

      function CalMatrix(data, temp, tempsaveforeach, flag) {
        // console.log(temp);
        // console.log(data.data);
        // console.log(filterdate); //for substring current timeline
        // let temptimenow = filterdate.split('>');
        // let starttimefornum = moment(temptimenow[0]).diff(moment(maxTimeSelection[0]),'days');
        // let endtimefornum = moment(temptimenow[1]).diff(moment(maxTimeSelection[0]),'days') + 1;
        // console.log(starttimefornum, endtimefornum);
        //console.log(data);
        for (let o = 0; o < temp.length; o++) {
          let templgasum = [];
          let count;
          let clinicmark;
          let countbymapstatus;
          let templganame = ""
          for (let i = 0; i < data.data.length; i++) {
            if (data.data[i]["lga_code19"] == temp[o]) {
              templgasum.push({
                notification_date: data.data[i]["FilterDate"],
                daycount: data.data[i]["daycount"],
                testcases: data.data[i]["TestCases"],
                confirmcases: data.data[i]["Cases"],
                lga_code19: temp[o],
                lga_name19: data.data[i]["lga_name19"]
                // "start": 360 / centrepointcaseslist.length * l,
                // "end": 360 / centrepointcaseslist.length * (l+1)
              });
              count = data.data[i]["count"];
              countbymapstatus = data.data[i]["count"];
              templganame = data.data[i]["lga_name19"];
            }
          }
          if (typeof count == "undefined") {
            countbymapstatus = 0;
            count = 0
          }
          if (flag == 1) countbymapstatus = 100;

          switch (countbymapstatus) {
            case 0:
              clinicmark = "none";
              // code block
              break;
            case 1:
              clinicmark = "single";
              // code block
              break;
            case 100:
              clinicmark = "grouped";
              // code block
              break;
            default:
              clinicmark = "multiple";
              // code block
          }

          tempsaveforeach.push({
            //"Name": data.data[i]["lga_name19"],
            LGAname: templganame,
            LGAcode: temp[o],
            caseslist: templgasum,
            status: clinicmark,
            count: count,
            //"coordinates": centre_coordinates,
          });
        }
        //console.log(tempsaveforeach);
        return tempsaveforeach;
      }
      // PIE.JS
      function playLensPie(filterpiedata){
        console.log("drawpie once")
        //console.log(portionnum);
        //console.log(filterpiedata);
        var storagenumber = [];
        for (let i = 0; i < portionnum; i++){
          storagenumber.push({
            "step": i,
            "start": 360 / portionnum * i,
            "end": 360 / portionnum * (i + 1),
            "cases": 20,

          })
        }
        //console.log(storagenumber);

        var lens_node = svg.append("g")
            .attr('id', "lens_node")
            .attr("class", "node")
            .attr("transform", function(data) {
              return "translate(" + cx + "," + cy + ")";
            })

        lens_node.append("g")
            .attr("id", "g-inner")
            .selectAll("path")
            .data(function (d) {
              //console.log(d);
              return pie_rate(filterpiedata);
            })
            .enter()
            .append("path")
            .attr("d", arc_inner)
            .attr('id', function(d, o) {
              //console.log(d);
              //console.log(o);
              return 'innerpiebar-' + o;
            })
            //.style("fill", d=>datascale_color(Math.log(1 + d.data.rate*(Math.E-1))))
            .style("fill", function (d){
              if (d.data.rate == 0){
                return "white";
              }
              return datascale_color(Math.log(1 + d.data.rate*(Math.E-1) * 2));
            })
            .style("fill-opacity", 1)
            //.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
            .style("stroke-width", 1)
            .style("stroke", "green")
            .on("mousemove",function(d,o){
              //console.log(d,o)
              divlegend.style("display","none");
              let temprate = Math.round(d["data"]["rate"] * 100000)/1000;
              //console.log(Math.round(d["data"]["rate"] * 100000)/1000);
              divlegend.html("Date: "+ d["data"]["filterdate"] +"</br>"
                  + "Confirmed Cases: " + d["data"]["cases"] +"</br>"
                  + "Tested Cases: " + d["data"]["testcases"] +"</br>"
                  + "Confirmed Rate: " + temprate + '%' +"</br>"
              )
                  .style("left", (d3.event.pageX+10) + "px")
                  .style("top", (d3.event.pageY+10) + "px")
                  .style("opacity", 0.8)
                  .style("display","block")
                  .style("z-index", 100)
            })
            .on("mouseout", function(d,o){
              divlegend.style("display","none");
            })



        lens_node.append("g")
            .attr("id", "g-testouter")
            .selectAll("path")
            .data(function (d) {
              //console.log(d);
              return pie_test(filterpiedata);
            })
            .enter()
            .append("path")
            .attr("d", arc_outer)
            .attr('id', function(d, o) {
              //console.log(d);
              //console.log(o);
              return 'outertestpiebar-' + o;
            })
            .style("fill", colorpanel.map.test)
            .style("fill-opacity", 1)
            //.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
            .style("stroke-width", function(d, o) {
              //console.log(d.data);
              if (d.data.testcases == 0)
                return 0;
              else
                return 1;
            })
            .style("stroke", "white")

            .on("mousemove",function(d,o){
              //console.log(d,o);

            })


        lens_node.append("g")
            .attr("id", "g-caseouter")
            .selectAll("path")
            .data(function (d) {
              //console.log(d);
              return pie_cases(filterpiedata);
            })
            .enter()
            .append("path")
            .attr("d", arc_outer)
            .attr('id', function(d, o) {
              //console.log(d);
              //console.log(o);
              return 'outercasepiebar-' + o;
            })
            .style("fill", colorpanel.map.cases)
            .style("fill-opacity", 1)
            //.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
            .style("stroke-width", function(d, o) {
              //console.log(d.data);
              if (d.data.cases == 0)
                return 0;
              else
                return 1;
            })
            .style("stroke", "white")



      }

      function playLensPieAgain(filterpiedata){
        //console.log(portionnum);
        //console.log(filterpiedata);
        var storagenumber = [];
        for (let i = 0; i < portionnum; i++){
          storagenumber.push({
            "step": i,
            "start": 360 / portionnum * i,
            "end": 360 / portionnum * (i + 1),
            "cases": 20,

          })
        }
        //console.log(storagenumber);


        d3.select("#g-inner")
            .selectAll("path")
            .remove();

        d3.select("#g-inner")
            .selectAll("path")
            .data(function (d) {
              //console.log(d);
              return pie_rate(filterpiedata);
            })
            .enter()
            .append("path")
            .attr("d", arc_inner)
            .attr('id', function(d, o) {
              //console.log(d);
              //console.log(o);
              return 'innerpiebar-' + o;
            })
            .style("fill", function (d){
              if (d.data.rate == 0){
                return "white";
              }
              return datascale_color(Math.log(1 + d.data.rate*(Math.E-1) * 2));
            })
            .style("fill-opacity", 1)
            //.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
            .style("stroke-width", 1)
            .style("stroke", "green")
            .on("mousemove",function(d,o){
              //console.log(d,o)
              divlegend.style("display","none");
              let temprate = Math.round(d["data"]["rate"] * 100000)/1000;
              //console.log(Math.round(d["data"]["rate"] * 100000)/1000);
              divlegend.html("Date: "+ d["data"]["filterdate"] +"</br>"
                  + "Confirmed Cases: " + d["data"]["cases"] +"</br>"
                  + "Tested Cases: " + d["data"]["testcases"] +"</br>"
                  + "Confirmed Rate: " + temprate + '%' +"</br>"
              )
                  .style("left", (d3.event.pageX+10) + "px")
                  .style("top", (d3.event.pageY+10) + "px")
                  .style("opacity", 0.8)
                  .style("display","block")
                  .style("z-index", 100)
            })
            .on("mouseout", function(d,o){
              divlegend.style("display","none");
            })


        d3.select("#g-testouter")
            .selectAll("path")
            .remove();

        d3.select("#g-testouter")
            .selectAll("path")
            .data(function (d) {
              //console.log(d);
              return pie_test(filterpiedata);
            })
            .enter()
            .append("path")
            .attr("d", arc_outer)
            .attr('id', function(d, o) {
              //console.log(d);
              //console.log(o);
              return 'outertestpiebar-' + o;
            })
            .style("fill", colorpanel.map.test)
            .style("fill-opacity", 1)
            //.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
            .style("stroke-width", function(d, o) {
              //console.log(d.data);
              if (d.data.testcases == 0)
                return 0;
              else
                return 1;
            })
            .style("stroke", "white")
            .on("mousemove",function(d,o){

            })

        d3.select("#g-caseouter")
            .selectAll("path")
            .remove();

        d3.select("#g-caseouter")
            .selectAll("path")
            .data(function (d) {
              //console.log(d);
              return pie_cases(filterpiedata);
            })
            .enter()
            .append("path")
            .attr("d", arc_outer)
            .attr('id', function(d, o) {
              //console.log(d);
              //console.log(o);
              return 'outercasepiebar-' + o;
            })
            .style("fill", colorpanel.map.cases)
            .style("fill-opacity", 1)
            //.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
            .style("stroke-width", function(d, o) {
              //console.log(d.data);
              if (d.data.testcases == 0)
                return 0;
              else
                return 1;
            })
            .style("stroke", "white")
            .on("mousemove",function(d,o){

            })
      }


      function drawDragArc(id, startTime, endTime){
        d3.csv("../../static/Dataset/timelinedata.csv", function(error, data) {
          //console.log(data);
          window.maxTimeSelection = [new Date(startTime), new Date(endTime)];
          let daysSum = Math.abs(moment(endTime).diff(moment(startTime),'days') + 2);
          let temptimelinedata = [];
          for (let o = 0; o < data.length; o++){
            let tempstart = data[o]["datefrom"];
            let startangle = 2*Math.PI * Math.abs(moment(tempstart).diff(moment(startTime),'days') + 2)/daysSum;
            let tempend = data[o]["dateto"];
            let endangle = 2*Math.PI * Math.abs(moment(tempend).diff(moment(startTime),'days') + 2)/daysSum;
            temptimelinedata.push({
              "startAngle": startangle,
              "endAngle": endangle,
              "event": data[o]["name"],
              "category": data[o]["category"],
              "timeline":data[o]["timeline"]
            })
          }


          //console.log(daysSum);
          let tickRang = d3v5.range(-90, 270, 90);
          // 瞄准镜用的
          let linerRange = d3v5.scaleLinear()
              .domain([-90,270])
              .range([0,daysSum]);
          // 输出时间用的
          let timeRange = d3v5.scaleLinear()
              .domain([0,2 * Math.PI])
              .range([0,daysSum]);

          let svglens = d3v5.select('#' + id),
              lenswidth = +svglens.attr("width"),
              lensheight = +svglens.attr("height"),
              g = svglens.append("g")
                  .attr("transform", "translate(" + lenswidth / 2 + "," + lensheight / 2 + ")");
          function getAngle (x1, y1, x2, y2) {
            let angle = Math.atan2(x2 - x1, y1-y2) ;
            return angle;
          }
          function getPoints (x0,y0,ao,r) {
            let x1   =   x0   +   r   *   Math.cos(ao   *   Math.PI   /180   );
            let y1   =   y0   +   r   *   Math.sin(ao   *   Math.PI   /180   );
            return [
              x1, y1
            ]
          }

          // center
          let radius = (outerRadius - innerRadius) / 2 +innerRadius;

          let arcAngles = {
            startAngles: 0,
            endAngles: 0.5 * Math.PI
          }

          let arc = d3v5.arc()
              .innerRadius(innerRadius)
              .outerRadius(outerRadius)
              .startAngle(arcAngles.startAngles);

          let eventarc = d3v5.arc()
              .innerRadius(innerRadius)
              .outerRadius(outerRadius);

          // // 底层的灰色全 圆环
          let background = g.append("path")
              .datum({endAngle: 2 * Math.PI})
              .style("fill", (d,i) => {
                //console.log(d,i)
                //return 'red';
                return colorpanel.map.timeline[0];
              })
              .style("fill-opacity", 0)
              .attr("stroke", "gray")
              .attr("stroke-width",0.5)
              .attr("d", arc);
          for(let y = 0; y < temptimelinedata.length; y++){
            g.append("path")
                .datum(temptimelinedata[y])
                .style("fill", (d,i) => {
                  //console.log(d,i)
                  if (d["category"] == "0"){
                    return colorpanel.default.eventcategory1;
                  }else if (d["category"] == "1"){
                    return colorpanel.default.eventcategory2;
                  }
                  else{
                    return 'white'
                  }
                })
                .style("fill-opacity", (d) => {
                  if (d["category"] == "0"){
                    return 0.8
                  }else if (d["category"] == "1"){
                    return 0.8
                  }
                  else{
                    return 0
                  }
                })
                .attr("stroke", "gray")
                .attr("stroke-width",0.5)
                .attr("stroke-opacity", 1)
                .attr("d", eventarc)
                .on('mousemove', (d,o) =>{
                  divlegend.style("display","none");
                  //console.log(Math.round(d["data"]["rate"] * 100000)/1000);
                  let eventlevel = "";
                  if (d["timeline"] == 0){
                    eventlevel = 'Encourage Prevention';
                  }
                  else{
                    eventlevel = 'Restrictive Intervention';
                  }
                  divlegend.html("Period: "+ d["timeline"] +"</br>"
                      + "Event: " + d["event"] +"</br>"
                      + "Standard: " + eventlevel +"</br>"
                  )
                      .style("left", (d3v5.event.pageX+10) + "px")
                      .style("top", (d3v5.event.pageY+10) + "px")
                      .style("opacity", 0.8)
                      .style("display","block")
                      .style("z-index", 100)
                })
                .on('mouseout', (d,o) =>{
                  divlegend.style("display","none");
                });
          }



          // draggable?
          let canMove = null;
          // ground
          let foreground = g.append("path")
              .datum({endAngle: arcAngles.endAngles})
              //.style("fill", "orange")
              .style("fill", colorpanel.map.timeline[0])
              .style("fill-opacity", 0)
              .attr("d", arc)
              .attr("stroke", "black")
              .attr("stroke-width",1.5)


          // circle center
          // svg.append("circle")
          //     .attr("cx",width / 2)
          //     .attr("cy", height / 2)
          //     .attr("r",4)

          // 初始的开始点位置
          let startCirclePoint = getPoints(0, 0,arcAngles.startAngles / (2 * Math.PI) * 360 - 90,radius);
          // 初始的开始点
          let startCircle =g.append("circle")
              .attr("cx",startCirclePoint[0])
              .attr("cy",startCirclePoint[1])
              .attr("fill","white")
              .attr("stroke", "black")
              .attr("stroke-width", "1.5px")
              .attr("r",8)
              .on('mousedown',function(d){
                canMove = {
                  pageX: d3v5.event.pageX,
                  pageY: d3v5.event.pageY,
                  moveType: 'start'
                }
                map["dragPan"].disable();
              })

          // 初始的结束点位置
          let endCirclePoint = getPoints(0, 0,arcAngles.endAngles / (2 * Math.PI) * 360 - 90,radius);
          // 初始的结束点
          let endCircle =g.append("circle")
              .attr("cx",endCirclePoint[0])
              .attr("cy",endCirclePoint[1])
              .attr("fill","white")
              .attr("stroke", "black")
              .attr("stroke-width", "1.5px")
              .attr("r",8)
              .on('mousedown',function(d){
                canMove = {
                  pageX: d3v5.event.pageX,
                  pageY: d3v5.event.pageY,
                  moveType: 'end'
                }
                map["dragPan"].disable();
              })

          svglens.on('mousemove',function(d) {

            // console.log(arcAngles)
            // console.log(timeRange(arcAngles.startAngles))
            // console.log(Math.ceil(timeRange(arcAngles.startAngles)))
            // 拖动点
            if(canMove){
              let n = getAngle(lenswidth / 2, lensheight / 2,d3v5.event.pageX,d3v5.event.pageY);
              n = n < 0 ? n + 2 * Math.PI : n;
              // n = getLimitAngle(n,arcAngles.startAngles, arcAngles.endAngles,canMove.moveType);
              let  arcNew = n / (2 * Math.PI) * 360;
              let current = arcNew - 90;
              //console.log(current);
              if (current < -80 || current > 260){
                let temporder = tickRang.indexOf(-90);
                if (temporder!= -1)
                  tickRang.splice(temporder,1);

              }else if (current > 80 && current < 100){
                let temporder = tickRang.indexOf(90);
                if (temporder!= -1)
                  tickRang.splice(temporder,1);
              }
              else{
                tickRang = d3v5.range(-90, 270, 90);
              }
              tickRang.push(current);
              // 拖动的结束点
              if(canMove.moveType == 'end'){
                arcAngles.endAngles = n;
                let endPoint = getPoints(0, 0, current,radius);
                endCircle.attr("cx",endPoint[0])
                    .attr("cy",endPoint[1]);
                arc.endAngle(n);
                lensselecttime[1] = current;

              } else {
                // 拖动的开始点
                arcAngles.startAngles = n;
                let startPoint = getPoints(0, 0, current,radius);
                startCircle.attr("cx",startPoint[0])
                    .attr("cy",startPoint[1]);
                arc.startAngle(n);
                lensselecttime[0] = current;

              }
              foreground.attr("d", arc);

              // console.log(lensselecttime);
              tickRang.push(lensselecttime[0],lensselecttime[1])

              tickRang = uniquesimplearr(tickRang);
              tickRang = tickRang.sort(function(a,b){
                return a-b;
              });
              //console.log(tickRang);
              d3v5.selectAll('g').selectAll(".aaxis").remove();
              let timeTick = g.append("g")
                  .attr("class", "aaxis")
                  .selectAll("g")
                  .data(tickRang)
                  .enter().append("g")
                  .attr("transform", function(d) {
                    return "rotate(" + d + ")";
                  });
              timeTick.append("rect")
                  .attr('width',5)
                  .attr("height",1)
                  .attr('x',innerRadius)
                  .attr('y',0)
              // 刻度文字
              timeTick.append("text")
                  //.attr("x", radius - 25 )
                  .attr("x", function (d){

                    if (d == 0)
                      return radius - 35
                    else if (d == 180)
                      return radius - 15
                    else if ((d == 270) ||(d == 90) || (d == -90))
                      return radius - 25
                    else if ((d > -90) && (d < 90))
                      return radius - 35
                    else
                      return radius - 15
                  })
                  .attr("dy", ".35em")
                  .style("text-anchor", function(d) { return d < 270 && d > 90 ? "middle" : "middle"; })
                  .attr("transform", function(d) {
                    //console.log(d);
                    return "rotate("+ -d +" " + (radius - 25) + ",0)";
                    //return d < 270 && d > 90 ? "rotate(180 " + (radius - 25) + ",0)" : null;
                  })
                  .attr("font-size", 8)
                  .text(function(d,i) {
                    //return moment(startTime).add(linerRange(d),'day').format('YYYY-MM-DD')
                    return moment(startTime).add(linerRange(d),'day').format('YYYY-MM-DD')
                  });

              for (let i = 0; i < tickRang.length; i++){
                if (tickRang[i] == arcNew - 90){
                  tickRang.splice(i,1);
                }
              }

            }
          })
          svglens.on('mouseup',function(d) {
            //console.log(arcAngles.endAngles,arcAngles.startAngles)
            let daysEnd = Math.ceil(timeRange(arcAngles.endAngles));
            let daysStart = Math.ceil(timeRange(arcAngles.startAngles));
            let daysN = null;
            if(daysStart > daysEnd){
              daysN = daysEnd;
              daysEnd = daysStart;
              daysStart = daysN;
            }
            filterdate = moment(startTime).add(daysStart,'days').format('YYYY-MM-DD')+ '>'+moment(startTime).add(daysEnd,'days').format('YYYY-MM-DD');
            window.timeSelection = [new Date(moment(startTime).add(daysStart,'days').format('YYYY-MM-DD')), new Date(moment(startTime).add(daysEnd,'days').format('YYYY-MM-DD'))];
            //console.log(window.timeSelection)

            canMove = null;

            map["dragPan"].enable();
          })



          // 刻度
          let timeTick = g.append("g")
              .attr("class", "aaxis")
              .selectAll("g")
              .data(tickRang)
              .enter().append("g")
              .attr("transform", function(d) {
                return "rotate(" + d + ")";
              });
          //console.log(tickRang)

          timeTick.append("rect")
              .attr('width',5)
              .attr("height",1)
              .attr('x',innerRadius)
              .attr('y',0)

          // 刻度文字
          timeTick.append("text")
              //.attr("x", radius - 25 )
              .attr("x", function (d){
                if (d == 0)
                  return radius - 35
                else if (d == 180)
                  return radius - 15
                else
                  return radius - 25
              })
              .attr("dy", ".35em")
              .style("text-anchor", function(d) { return d < 270 && d > 90 ? "middle" : "middle"; })
              .attr("transform", function(d) {
                //console.log(d);
                return "rotate("+ -d +" " + (radius - 25) + ",0)";
                //return d < 270 && d > 90 ? "rotate(180 " + (radius - 25) + ",0)" : null;
              })
              .attr("font-size", 8)
              .text(function(d,i) {
                //return moment(startTime).add(linerRange(d),'day').format('YYYY-MM-DD')
                return moment(startTime).add(linerRange(d),'day').format('YYYY-MM-DD')
              });

        })
        //end d3 query
      }


    },
  },
};
</script>
<style scoped>
#wrapper {
  width: 100%;
  height: 100%;
}
.map {
  width: 100%;
  height: 100%;
}






</style>
