<script>
import { onMounted, ref } from "vue";

export default {
  setup() {
    const normal_debug = ref("");
    const light_level_debug = ref("");
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
          y: 0,
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

      createConfetti(conf, { normal_debug, light_level_debug });

      var conf2 = {
        color: "#fcba03",
        material_type: "shaded",
        quaternion: {
          z: 1,
          i: 0,
          j: 0,
          k: 0,
        },
        quaternion_velocity: {
          z: 0,
          i: 0,
          j: 0,
          k: 0,
        },
        position: {
          x: 800,
          y: 700,
        },
        shapeOptions: {
          type: "ellipse",
          rx: "80",
          ry: "20",
        },
      };
    });
    return {
      normal_debug,
      light_level_debug,
    };
  },
};

function createConfetti(conf, debug) {
  var light_dir = [-0.2, -1, 0.1];
  var light_magnitude = Math.sqrt(
    light_dir[0] * light_dir[0] +
      light_dir[1] * light_dir[1] +
      light_dir[2] * light_dir[2]
  );
  light_dir = [
    light_dir[0] / light_magnitude,
    light_dir[1] / light_magnitude,
    light_dir[2] / light_magnitude,
  ];

  for (const [k, v] of Object.entries(conf.shapeOptions)) {
    if (k == "type") {
      conf.shape = document.createElementNS("http://www.w3.org/2000/svg", v);
    } else {
      conf.shape.setAttribute(k, v);
    }
  }

  conf.shape.setAttribute("fill", conf.color);

  document.querySelector(".playground").appendChild(conf.shape);

  var last_time;

  const rotateConfetti = (timestamp) => {
    if (last_time === undefined) {
      last_time = timestamp;
    }
    var delta_time = (timestamp - last_time) / 144;
    last_time = timestamp;

    conf.quaternion = addQuaternionVelocity(
      conf.quaternion,
      conf.quaternion_velocity,
      delta_time
    );
    const matrix = createTranformationMatrix(conf.quaternion);
    conf.shape.setAttribute(
      "transform",
      `matrix(${matrix[0][0]},${matrix[0][1]},${matrix[1][0]},${matrix[1][1]},${conf.position.x},${conf.position.y})`
    );

    const normal = calculateNormal(conf.quaternion);
    const light_overlap = [
      normal[0] - light_dir[0],
      normal[1] - light_dir[1],
      normal[2] - light_dir[2],
    ];
    const light_level =
      2 -
      Math.sqrt(
        light_overlap[0] * light_overlap[0] +
          light_overlap[1] * light_overlap[1] +
          light_overlap[2] * light_overlap[2]
      );

    if (light_level > 0.3) {
      const color = blendWithLight(conf.color, light_level - 1, false);
      conf.shape.setAttribute("fill", color);
    } else if (light_level < 0.3) {
      const color = blendWithLight(conf.color, (0.3 - light_level) * 0.5, true);
      conf.shape.setAttribute("fill", color);
    }

    debug.normal_debug.value = `Normal: [${normal
      .map((n) => n.toFixed(2))
      .join(", ")}]`;
    debug.light_level_debug.value = `Light Level: ${light_level.toFixed(2)}`;

    requestAnimationFrame(rotateConfetti);
  };

  requestAnimationFrame(rotateConfetti);
}

function createTranformationMatrix(quaternion) {
  const { w, x, y, z } = quaternion;
  return [
    [1 - 2 * y * y - 2 * z * z, 2 * x * y - 2 * w * z],
    [2 * x * y + 2 * w * z, 1 - 2 * x * x - 2 * z * z],
  ];
}

function addQuaternionVelocity(quaternion, quaternion_velocity, dt) {
  const { w, x, y, z } = quaternion;
  const { w: wv, x: xv, y: yv, z: zv } = quaternion_velocity;

  const dw = w + 0.5 * dt * (w * wv - x * xv - y * yv - z * zv);
  const dx = x + 0.5 * dt * (w * xv + x * wv - y * zv + z * yv);
  const dy = y + 0.5 * dt * (w * yv + x * zv + y * wv - z * xv);
  const dz = z + 0.5 * dt * (w * zv - x * yv + y * xv + z * wv);

  const magnitude = Math.sqrt(dw * dw + dx * dx + dy * dy + dz * dz);
  return {
    w: dw / magnitude,
    x: dx / magnitude,
    y: dy / magnitude,
    z: dz / magnitude,
  };
}

function calculateNormal(quaternion) {
  const { w, x, y, z } = quaternion;
  var normal = [
    2 * x * z + 2 * w * y,
    2 * y * z - 2 * w * x,
    1 - 2 * x * x - 2 * y * y,
  ];
  if (normal[2] < 0) {
    const reverse = [-normal[0], -normal[1], -normal[2]];
    normal = reverse;
  }
  return normal;
}

function blendWithLight(hex, amount, reverse) {
  amount = Math.min(1, Math.max(0, amount));

  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  if (!reverse) {
    r = Math.round(r + (255 - r) * amount);
    g = Math.round(g + (255 - g) * amount);
    b = Math.round(b + (255 - b) * amount);
  } else {
    r = Math.round(r * (1 - amount));
    g = Math.round(g * (1 - amount));
    b = Math.round(b * (1 - amount));
  }

  return `#${((1 << 24) | (r << 16) | (g << 8) | b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}
</script>

<template>
  <pre class="debugtext"
    >{{ normal_debug }}
{{ light_level_debug }}</pre
  >
  <svg class="playground"></svg>
</template>

<style scoped>
.playground {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
