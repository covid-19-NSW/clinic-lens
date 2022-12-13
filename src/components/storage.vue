<template>
  <div class="page1-container">
    <div id="storage">
      <div id="appendSVG"></div>
    </div>
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
  mounted() {},
  methods: {},
};
</script>
<style scoped>
/*.svg-container {*/
/*  width: 100%;*/
/*  height: 90%;*/
/*  padding: 5px;*/
/*  overflow: scroll;*/
/*}*/

#storage {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
