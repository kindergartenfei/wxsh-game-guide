<script setup>
defineProps({
  theme: { type: String, required: true },
})
defineEmits(['toggle-theme'])
</script>

<template>
  <header class="site-header">
    <a href="#main" class="skip-link">跳转到主要内容</a>
    <div class="header-inner">
      <div class="brand">
        <span class="brand-tag">Archive System</span>
        <h1 class="brand-title">
          妄想山海<span class="brand-accent">ARCHIVE</span>
        </h1>
        <p class="brand-desc">
          宠物部位属性工具，支持拼音 / 首字母检索，快速对照攻击档位与特质规则。
        </p>
        <div class="brand-meta">
          <span class="badge">数据版本 Beta</span>
          <span class="badge muted">中文/拼音检索</span>
        </div>
      </div>
      <nav class="header-links" aria-label="外部链接">
        <a href="#" class="link-item" @click.prevent>混沌风景点工具</a>
        <a href="#" class="link-item" @click.prevent>QQ频道·反馈/交流</a>
        <a href="#" class="link-item" @click.prevent>数据来源·玉墨</a>
        <a href="mailto:author@example.com" class="link-item">作者邮箱</a>
        <button
          type="button"
          class="theme-btn"
          :aria-label="theme === 'light' ? '切换到夜间' : '切换到白天'"
          @click="$emit('toggle-theme')"
        >
          {{ theme === 'light' ? '白天' : '夜间' }}
        </button>
      </nav>
    </div>
  </header>
</template>
