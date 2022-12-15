<template>
  <div class="page1-container">
    <div class="step_content" id="step_content"></div>
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
