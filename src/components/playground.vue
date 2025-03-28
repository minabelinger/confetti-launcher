<script>
import { onMounted, ref } from "vue";
import { addConfettiToQueue } from "./confetti-handler";

export default {
  setup() {
    onMounted(() => {
      var conf = {
        color: "#6beb34",
        quaternion: {
          w: 1,
          x: 0,
          y: 0,
          z: 0,
        },
        quaternion_velocity: {
          w: 0,
          x: -0.2,
          y: 0.1,
          z: 0,
        },
        material_type: "shaded",
        position: {
          x: 1000,
          y: 500,
        },
        shapeOptions: {
          type: "ellipse",
          rx: "100",
          ry: "50",
        },
      };

      var conf2 = {
        color: "#1d75e0",
        quaternion: {
          w: 1,
          x: 0,
          y: 0,
          z: 0,
        },
        quaternion_velocity: {
          w: 0,
          x: 0,
          y: 0.1,
          z: 0.1,
        },
        material_type: "shaded",
        position: {
          x: 1300,
          y: 500,
        },
        shapeOptions: {
          type: "ellipse",
          rx: "100",
          ry: "50",
        },
      };

      const canvas = document.getElementById("playground");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      addConfettiToQueue([conf, conf2], canvas);
    });
  },
};
</script>

<template>
  <canvas id="playground"></canvas>
</template>

<style scoped>
#playground {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
