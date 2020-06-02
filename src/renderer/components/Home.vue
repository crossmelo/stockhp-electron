<!--
 * @Descripttion: 
 * @version: 
 * @Author: lizhengang9
 * @Date: 2020-06-02 15:40:27
 * @LastEditors: lizhengang9
 * @LastEditTime: 2020-06-02 16:39:51
--> 
<template>
  <div id="wrapper">
    <main>
      <div v-for="(item, index) in list" :key="index">{{item}}</div>
    </main>
  </div>
</template>

<script>
export default {
  name: "home-page",
  data () {
    return {
      list: []
    };
  },
  methods: {},
  mounted () {
    require("electron").ipcRenderer.on("data", (event, message) => {
      this.list.push(message);
      this.list = Array.from(new Set(this.list));
    });
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
}
main {
  /* display: flex;
  justify-content: space-between; */
}

main > div {
  /* flex-basis: 50%; */
}
</style>