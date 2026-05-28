<script setup>
import { computed } from 'vue'
import { splitBio } from '../utils/bio.js'

const props = defineProps({
  record: { type: Object, required: true },
})

const sources = computed(() => splitBio(props.record.bio))
</script>

<template>
  <article class="record-card">
    <header class="card-top">
      <h3>{{ record.part }}</h3>
      <div class="card-badges">
        <span class="year-badge">{{ record.year }}</span>
        <span class="tier-badge" :class="`tier-${record.tier.toLowerCase()}`">
          {{ record.tier }}
        </span>
      </div>
    </header>

    <div class="attack-block">
      <span class="attack-value">{{ record.attack }}</span>
      <span class="attack-label">Attack Value</span>
    </div>

    <div class="source-block">
      <span class="source-label">Source Bio</span>
      <div class="source-tags">
        <span v-for="(name, i) in sources" :key="i" class="source-tag">
          {{ name }}
        </span>
      </div>
    </div>
  </article>
</template>
