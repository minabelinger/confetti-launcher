export function createConfetti(conf, canvas) {
  const ctx = canvas.getContext("2d");

  var light_dir = [-1, -1, -0.5];
  var light_magnitude = Math.sqrt(
    light_dir[0] * light_dir[0] + light_dir[1] * light_dir[1] + light_dir[2] * light_dir[2]
  );
  light_dir = [light_dir[0] / light_magnitude, light_dir[1] / light_magnitude, light_dir[2] / light_magnitude];

  ctx.fillStyle = conf.color;

  var last_time;

  const rotateConfetti = (timestamp) => {
    ctx.reset();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (last_time === undefined) {
      last_time = timestamp;
    }
    var delta_time = (timestamp - last_time) / 144;
    last_time = timestamp;

    conf.quaternion = addQuaternionVelocity(conf.quaternion, conf.quaternion_velocity, delta_time);
    const matrix = createTranformationMatrix(conf.quaternion);
    ctx.transform(matrix[0][0], matrix[1][0], matrix[0][1], matrix[1][1], conf.position.x, conf.position.y);

    const normal = calculateNormal(conf.quaternion);
    const light_overlap = [normal[0] - light_dir[0], normal[1] - light_dir[1], normal[2] - light_dir[2]];
    const light_level =
      2 -
      Math.sqrt(
        light_overlap[0] * light_overlap[0] + light_overlap[1] * light_overlap[1] + light_overlap[2] * light_overlap[2]
      );

    if (light_level > 0.3) {
      const color = blendWithLight(conf.color, light_level - 1, false);
      ctx.fillStyle = color;
    } else if (light_level < 0.3) {
      const color = blendWithLight(conf.color, (0.3 - light_level) * 0.5, true);
      ctx.fillStyle = color;
    }

    defineShape(conf, ctx);

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
  var normal = [2 * x * z + 2 * w * y, 2 * y * z - 2 * w * x, 1 - 2 * x * x - 2 * y * y];
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

  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}

function defineShape(conf, ctx) {
  if (conf.shapeOptions.type == "ellipse") {
    ctx.ellipse(0, 0, conf.shapeOptions.rx, conf.shapeOptions.ry, 0, 0, 2 * Math.PI);
    ctx.fill();
  } else {
    ctx.fillRect(-25, -25, 50, 50);
  }
}
