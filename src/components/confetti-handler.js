import { animateConfetti } from "./confetti";

var queue = [];

var light_dir = [-1, -1, -0.5];
var light_magnitude = Math.sqrt(
  light_dir[0] * light_dir[0] + light_dir[1] * light_dir[1] + light_dir[2] * light_dir[2]
);
light_dir = [light_dir[0] / light_magnitude, light_dir[1] / light_magnitude, light_dir[2] / light_magnitude];

var last_time;

let ctx = {};
let canvas_width;
let canvas_height;

export function addConfettiToQueue(confList, canvas) {
  ctx = canvas.getContext("2d");
  canvas_width = canvas.width;
  canvas_height = canvas_height;
  for (let c of confList) {
    queue.push(c);
  }
  requestAnimationFrame(animateConfettiQueue);
}

function animateConfettiQueue(timestamp) {
  ctx.reset();

  if (last_time === undefined) {
    last_time = timestamp;
  }
  var delta_time = (timestamp - last_time) / 144;
  last_time = timestamp;

  for (let conf of queue) {
    animateConfetti(conf, delta_time, ctx, light_dir);
  }

  requestAnimationFrame(animateConfettiQueue);
}
