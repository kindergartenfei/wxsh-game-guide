<script setup>
import RecordCard from './RecordCard.vue'

defineProps({
  records: { type: Array, required: true },
  loading: { type: Boolean, default: false },
})
</script>

<template>
  <div class="record-grid">
    <p v-if="loading" class="empty-state">正在从后端加载数据…</p>
    <template v-else>
      <RecordCard v-for="item in records" :key="item.id" :record="item" />
      <p v-if="records.length === 0" class="empty-state">没有匹配的记录，请调整筛选条件。</p>
    </template>
  </div>
</template>
