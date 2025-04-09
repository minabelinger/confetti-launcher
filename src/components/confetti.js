export function animateConfetti(conf, delta_time, ctx, light_dir) {
  ctx.resetTransform();

  conf.lifetime.current += delta_time;

  move(conf, delta_time);

  conf.quaternion = addQuaternionVelocity(conf.quaternion, conf.quaternionVelocity, delta_time);
  const matrix = createTranformationMatrix(conf.quaternion);
  ctx.transform(matrix[0][0], matrix[1][0], matrix[0][1], matrix[1][1], conf.position.x, conf.position.y);

  if (conf.shading) {
    const normal = calculateNormal(conf.quaternion);
    const light_overlap = [normal[0] - light_dir[0], normal[1] - light_dir[1], normal[2] - light_dir[2]];
    const light_level =
      2 -
      Math.sqrt(
        light_overlap[0] * light_overlap[0] + light_overlap[1] * light_overlap[1] + light_overlap[2] * light_overlap[2]
      );

    if (light_level >= 1) {
      const color = blendWithLight(conf.color, Math.abs(light_level - 1) * conf.shapeOptions.shininess, false);
      ctx.fillStyle = color;
    } else if (light_level < 1) {
      const color = blendWithLight(conf.color, (1 - light_level) * conf.shapeOptions.shadows, true);
      ctx.fillStyle = color;
    }
  } else {
    ctx.fillStyle = conf.color;
  }

  if (conf.lifetime.enabled) {
    alphadecay(conf, ctx);
  }

  fillShape(conf, ctx);
}

function move(conf, delta_time) {
  if (conf.velocity.y < conf.velocity.maxFallspeed) {
    conf.velocity.y += delta_time * conf.velocity.gravity;
  } else {
    conf.velocity.y -= conf.velocity.airdrag * delta_time;
  }

  const vx = Math.abs(conf.velocity.x) - conf.velocity.airdrag * delta_time;

  if (vx < 0) {
    conf.velocity.x = 0;
  } else {
    conf.velocity.x = Math.sign(conf.velocity.x) * vx;
  }

  conf.position.x += conf.velocity.x * delta_time;
  conf.position.y += conf.velocity.y * delta_time;
}

function alphadecay(conf, ctx) {
  if (conf.lifetime.current > conf.lifetime.onset && conf.lifetime.current < conf.lifetime.duration) {
    ctx.globalAlpha = (conf.lifetime.duration - conf.lifetime.current) / (conf.lifetime.duration - conf.lifetime.onset);
  } else if (conf.lifetime.current >= conf.lifetime.duration) {
    ctx.globalAlpha = 0;
  } else {
    ctx.globalAlpha = 1;
  }
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

function fillShape(conf, ctx) {
  if (conf.shapeOptions.type == "ellipse") {
    ctx.beginPath();
    ctx.ellipse(0, 0, conf.shapeOptions.width, conf.shapeOptions.height, 0, 0, 2 * Math.PI);
    ctx.fill();
  } else if (conf.shapeOptions.type == "image") {
    const offscreenCtx = conf.offscreenCanvas.getContext("2d", { willReadFrequently: true });
    const imageData = offscreenCtx.getImageData(0, 0, conf.shapeOptions.width, conf.shapeOptions.height);

    if (conf.shapeOptions.image.composition !== "none") {
      offscreenCtx.fillStyle = ctx.fillStyle;
      offscreenCtx.globalCompositeOperation = conf.shapeOptions.image.composition;
      offscreenCtx.fillRect(0, 0, conf.shapeOptions.width, conf.shapeOptions.height);
    }

    ctx.drawImage(
      conf.offscreenCanvas,
      -conf.shapeOptions.width / 2,
      -conf.shapeOptions.height / 2,
      conf.shapeOptions.width,
      conf.shapeOptions.height
    );
    offscreenCtx.putImageData(imageData, 0, 0);
  } else if (conf.shapeOptions.type == "rectangle") {
    ctx.fillRect(
      -conf.shapeOptions.width / 2,
      -conf.shapeOptions.height / 2,
      conf.shapeOptions.width,
      conf.shapeOptions.height
    );
  }
}
