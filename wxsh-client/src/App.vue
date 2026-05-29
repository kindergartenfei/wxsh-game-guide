<script setup>
import { watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import TabNav from './components/TabNav.vue'
import FilterBar from './components/FilterBar.vue'
import RecordGrid from './components/RecordGrid.vue'
import PlaceholderPanel from './components/PlaceholderPanel.vue'
import { useArchive } from './composables/useArchive.js'

const {
  query,
  part,
  year,
  tier,
  activeTab,
  theme,
  loading,
  error,
  dataSource,
  filtered,
  resultCount,
  reload,
  toggleTheme,
} = useArchive()

watch(
  theme,
  (v) => {
    document.documentElement.setAttribute('data-theme', v)
  },
  { immediate: true },
)
</script>

<template>
  <div class="app-shell">
    <AppHeader :theme="theme" @toggle-theme="toggleTheme" />

    <main id="main" class="main-content">
      <div class="layout-label">部位 · 宠物 · 档位</div>

      <TabNav v-model="activeTab" />

      <template v-if="activeTab === 'attr'">
        <FilterBar
          v-model:query="query"
          v-model:part="part"
          v-model:year="year"
          v-model:tier="tier"
        />
        <p v-if="error" class="api-hint warn">{{ error }}</p>
        <p class="result-meta">
          <template v-if="loading">加载中…</template>
          <template v-else>
            共 {{ resultCount }} 条 · 按攻击值排序
            <span class="source-tag">· {{ dataSource === 'api' ? '后端数据' : '本地缓存' }}</span>
          </template>
          <button v-if="!loading" type="button" class="reload-btn" @click="reload">刷新</button>
        </p>
        <RecordGrid :records="filtered" :loading="loading" />
      </template>

      <PlaceholderPanel
        v-else-if="activeTab === 'attack'"
        title="攻击对照"
        desc="对照表数据将在后续版本补充，当前可先使用「属性检索」。"
      />
      <PlaceholderPanel
        v-else
        title="特质对照"
        desc="特质规则对照将在后续版本补充。"
      />
    </main>

    <footer class="site-footer">
      <p>工具在线运行中 · 支持中文 / 拼音 / 首字母检索</p>
      <p class="footer-sub">妄想山海变异查询工具 · API: 8.130.179.156:3000</p>
    </footer>
  </div>
</template>
