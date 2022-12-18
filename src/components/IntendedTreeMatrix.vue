<template>
  <div class="page1-container">
    <div class="intended_content" id="intended_content"></div>
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

  }
}
</script>

<style>
.page1-container {
  width: 100%;
  height: 91%;
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