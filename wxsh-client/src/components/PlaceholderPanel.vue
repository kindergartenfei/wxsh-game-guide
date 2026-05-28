<script setup>
defineProps({
  title: { type: String, required: true },
  desc: { type: String, default: '静态演示版暂未接入该模块数据。' },
})
</script>

<template>
  <section class="placeholder-panel">
    <h2>{{ title }}</h2>
    <p>{{ desc }}</p>
  </section>
</template>
