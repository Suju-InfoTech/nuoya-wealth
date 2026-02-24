<template>
  <div class="captcha" @click="refresh" :title="'点击更换'">
    <canvas ref="canvasRef" :width="width" :height="height"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

const props = withDefaults(defineProps<{ length?: number; width?: number; height?: number }>(), {
  length: 4,
  width: 100,
  height: 38
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const code = ref("");

const randomChar = () => {
  const chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  return chars.charAt(Math.floor(Math.random() * chars.length));
};

const randomColor = (min = 150, max = 255) => {
  const r = Math.floor(Math.random() * (max - min) + min);
  const g = Math.floor(Math.random() * (max - min) + min);
  const b = Math.floor(Math.random() * (max - min) + min);
  return `rgb(${r},${g},${b})`;
};

const draw = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = randomColor(230, 255);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  code.value = "";
  for (let i = 0; i < props.length; i++) {
    const ch = randomChar();
    code.value += ch;
    const fontSize = Math.floor(canvas.height * 0.6);
    ctx.font = `${fontSize}px SimHei`;
    ctx.fillStyle = randomColor(50, 160);
    const x = (canvas.width / props.length) * (i + 0.3);
    const y = canvas.height * 0.75;
    const angle = (Math.random() - 0.5) * 0.6;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  }

  // 干扰线
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = randomColor(100, 200);
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }

  // 像素点
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = randomColor(0, 255);
    ctx.beginPath();
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
    ctx.fill();
  }
};

const refresh = () => {
  draw();
};

onMounted(draw);
watch(() => [props.length, props.width, props.height], draw);

defineExpose({ refresh, getCode: () => code.value });
</script>

<style scoped>
.captcha {
  display: inline-block;
  cursor: pointer;
  user-select: none;
}
.captcha canvas {
  display: block;
}
</style>
