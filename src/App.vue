<template>
  <div class="canvas-wrap">
    <canvas ref="canvas" id="renderCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import initGames from "./plugins/babylon";
import { ref, onMounted } from "vue";

const canvas = ref<HTMLCanvasElement>();
onMounted(() => {
  canvas.value && initGames(canvas.value);
});
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.canvas-wrap {
  border: 1px solid #2c3e50;
  height: 800px;

  #renderCanvas {
    width: 100%;
    height: 100%;
  }
}
</style>
