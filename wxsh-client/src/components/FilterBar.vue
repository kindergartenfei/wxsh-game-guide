<script setup>
import { PARTS, YEARS, TIERS } from '../data/constants.js'

defineProps({
  query: { type: String, default: '' },
  part: { type: String, default: '' },
  year: { type: String, default: '' },
  tier: { type: String, default: '' },
})

defineEmits(['update:query', 'update:part', 'update:year', 'update:tier'])
</script>

<template>
  <section class="filter-panel">
    <div class="filter-head">
      <h2>属性检索</h2>
      <p>选择部位/年份/档位并快速定位目标数值。</p>
      <p class="hint">输入支持拼音 / 首字母</p>
    </div>

    <label class="search-box">
      <span class="sr-only">搜索</span>
      <input
        type="search"
        placeholder="搜索部位、年份、异兽名…"
        :value="query"
        @input="$emit('update:query', $event.target.value)"
      />
    </label>

    <div class="chip-group">
      <span class="chip-label">所有部位</span>
      <button
        type="button"
        class="chip"
        :class="{ active: !part }"
        @click="$emit('update:part', '')"
      >
        全部
      </button>
      <button
        v-for="p in PARTS"
        :key="p"
        type="button"
        class="chip"
        :class="{ active: part === p }"
        @click="$emit('update:part', p)"
      >
        {{ p }}
      </button>
    </div>

    <div class="chip-group">
      <span class="chip-label">所有年份</span>
      <button
        type="button"
        class="chip"
        :class="{ active: !year }"
        @click="$emit('update:year', '')"
      >
        全部
      </button>
      <button
        v-for="y in YEARS"
        :key="y"
        type="button"
        class="chip"
        :class="{ active: year === y }"
        @click="$emit('update:year', y)"
      >
        {{ y }}
      </button>
    </div>

    <div class="chip-group">
      <span class="chip-label">所有档位</span>
      <button
        type="button"
        class="chip"
        :class="{ active: !tier }"
        @click="$emit('update:tier', '')"
      >
        全部
      </button>
      <button
        v-for="t in TIERS"
        :key="t"
        type="button"
        class="chip tier-chip"
        :class="{ active: tier === t, [`tier-${t.toLowerCase()}`]: true }"
        @click="$emit('update:tier', t)"
      >
        {{ t }}
      </button>
    </div>
  </section>
</template>
