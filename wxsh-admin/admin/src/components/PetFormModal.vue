<script setup>
import { reactive, watch } from 'vue'
import { YEAR_OPTIONS, TIER_OPTIONS, PART_OPTIONS, emptyForm } from '../constants.js'

const props = defineProps({
  open: Boolean,
  mode: { type: String, default: 'create' },
  initial: { type: Object, default: null },
  saving: Boolean,
})

const emit = defineEmits(['close', 'submit'])

const form = reactive(emptyForm())

watch(
  () => [props.open, props.initial],
  () => {
    if (!props.open) return
    if (props.initial) {
      Object.assign(form, {
        pet_name: props.initial.pet_name,
        mutate_part: props.initial.mutate_part,
        attack_value: props.initial.attack_value,
        penetrate_value: props.initial.penetrate_value,
        pet_year: props.initial.pet_year,
        tier: props.initial.tier,
      })
    } else {
      Object.assign(form, emptyForm())
    }
  },
  { immediate: true },
)

function onSubmit() {
  emit('submit', { ...form })
}
</script>

<template>
  <div v-if="open" class="modal-mask" @click.self="emit('close')">
    <div class="modal" role="dialog">
      <header class="modal-head">
        <h2>{{ mode === 'create' ? '新增记录' : '编辑记录' }}</h2>
        <button type="button" class="icon-btn" aria-label="关闭" @click="emit('close')">×</button>
      </header>

      <form class="modal-body" @submit.prevent="onSubmit">
        <label class="field">
          <span>宠物名称</span>
          <input v-model="form.pet_name" required maxlength="50" placeholder="如：穷奇" />
        </label>

        <label class="field">
          <span>变异部位</span>
          <select v-model="form.mutate_part">
            <option v-for="p in PART_OPTIONS" :key="p" :value="p">{{ p }}</option>
          </select>
        </label>

        <div class="field-row">
          <label class="field">
            <span>攻击数值</span>
            <input v-model.number="form.attack_value" type="number" min="0" required />
          </label>
          <label class="field">
            <span>穿透数值</span>
            <input v-model.number="form.penetrate_value" type="number" min="0" required />
          </label>
        </div>

        <div class="field-row">
          <label class="field">
            <span>宠物年份</span>
            <select v-model.number="form.pet_year">
              <option v-for="y in YEAR_OPTIONS" :key="y.value" :value="y.value">
                {{ y.label }}
              </option>
            </select>
          </label>
          <label class="field">
            <span>档位</span>
            <select v-model="form.tier">
              <option v-for="t in TIER_OPTIONS" :key="t" :value="t">{{ t }}</option>
            </select>
          </label>
        </div>

        <footer class="modal-foot">
          <button type="button" class="btn ghost" @click="emit('close')">取消</button>
          <button type="submit" class="btn primary" :disabled="saving">
            {{ saving ? '保存中…' : '保存' }}
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>
