<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import PetFormModal from './components/PetFormModal.vue'
import { YEAR_OPTIONS, TIER_OPTIONS, PART_OPTIONS } from './constants.js'
import {
  fetchPetList,
  createPet,
  updatePet,
  deletePet,
  batchDeletePets,
  fetchStats,
} from './api/pet.js'

const ADMIN_PASSWORD = '123456'
const isLoggedIn = ref(false)
const loginForm = reactive({ username: '', password: '' })
const loginError = ref('')

function handleLogin() {
  if (loginForm.password === ADMIN_PASSWORD) {
    isLoggedIn.value = true
    loginError.value = ''
  } else {
    loginError.value = '密码错误，请重试'
  }
}

function handleLogout() {
  isLoggedIn.value = false
  loginForm.username = ''
  loginForm.password = ''
  loginError.value = ''
}

const list = ref([])
const total = ref(0)
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const stats = ref(null)
const selectedIds = ref([])

const filters = reactive({
  keyword: '',
  mutate_part: '',
  pet_year: '',
  tier: '',
  page: 1,
  pageSize: 15,
})

const modal = reactive({
  open: false,
  mode: 'create',
  editing: null,
})

const totalPages = computed(() => Math.ceil(total.value / filters.pageSize) || 1)
const allSelected = computed(
  () => list.value.length > 0 && selectedIds.value.length === list.value.length,
)

async function loadList() {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchPetList({
      page: filters.page,
      pageSize: filters.pageSize,
      keyword: filters.keyword,
      mutate_part: filters.mutate_part,
      pet_year: filters.pet_year,
      tier: filters.tier,
      sortBy: 'id',
      sortOrder: 'desc',
    })
    list.value = data.list
    total.value = data.total
    selectedIds.value = []
  } catch (e) {
    error.value = e.message
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  try {
    stats.value = await fetchStats()
  } catch {
    stats.value = null
  }
}

function search() {
  filters.page = 1
  loadList()
}

function resetFilters() {
  filters.keyword = ''
  filters.mutate_part = ''
  filters.pet_year = ''
  filters.tier = ''
  filters.page = 1
  loadList()
}

function openCreate() {
  modal.mode = 'create'
  modal.editing = null
  modal.open = true
}

function openEdit(row) {
  modal.mode = 'edit'
  modal.editing = row
  modal.open = true
}

function closeModal() {
  modal.open = false
}

async function handleSubmit(form) {
  saving.value = true
  error.value = ''
  try {
    if (modal.mode === 'create') {
      await createPet(form)
    } else {
      await updatePet(modal.editing.id, form)
    }
    closeModal()
    await loadList()
    await loadStats()
  } catch (e) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}

async function handleDelete(row) {
  if (!confirm(`确定删除「${row.pet_name}」？`)) return
  try {
    await deletePet(row.id)
    await loadList()
    await loadStats()
  } catch (e) {
    error.value = e.message
  }
}

async function handleBatchDelete() {
  if (!selectedIds.value.length) return
  if (!confirm(`确定删除选中的 ${selectedIds.value.length} 条记录？`)) return
  try {
    await batchDeletePets(selectedIds.value)
    await loadList()
    await loadStats()
  } catch (e) {
    error.value = e.message
  }
}

function toggleAll(e) {
  selectedIds.value = e.target.checked ? list.value.map((r) => r.id) : []
}

function toggleSelect(id, checked) {
  if (checked) {
    if (!selectedIds.value.includes(id)) selectedIds.value.push(id)
  } else {
    selectedIds.value = selectedIds.value.filter((x) => x !== id)
  }
}

function goPage(p) {
  if (p < 1 || p > totalPages.value) return
  filters.page = p
  loadList()
}

onMounted(() => {
  loadList()
  loadStats()
})
</script>

<template>
  <div class="admin">
    <!-- 登录页面 -->
    <div v-if="!isLoggedIn" class="login-container">
      <div class="login-card">
        <div class="logo">WXSH Admin</div>
        <p class="logo-sub">宠物变异数据管理</p>
        <form class="login-form" @submit.prevent="handleLogin">
          <input
            v-model="loginForm.username"
            type="text"
            placeholder="用户名（任意）"
            class="login-input"
          />
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            class="login-input"
          />
          <p v-if="loginError" class="alert error">{{ loginError }}</p>
          <button type="submit" class="btn primary login-btn">登录</button>
        </form>
      </div>
    </div>

    <!-- 管理后台 -->
    <div v-else class="dashboard">
      <aside class="sidebar">
        <div class="logo">WXSH Admin</div>
        <p class="logo-sub">宠物变异数据管理</p>
        <nav>
          <a class="nav-item active" href="#">pet_mutate</a>
        </nav>
        <a class="site-link" href="/" target="_blank" rel="noreferrer">
          打开攻略前台 →
        </a>
        <button type="button" class="btn ghost" @click="handleLogout" style="margin-top: 12px;">退出登录</button>
      </aside>

      <main class="main">
        <header class="page-header">
          <div>
            <h1>数据管理</h1>
            <p>对 pet_mutate 表进行增删改查</p>
          </div>
          <button type="button" class="btn primary" @click="openCreate">+ 新增</button>
        </header>

      <section v-if="stats" class="stats">
        <div class="stat-card">
          <span class="stat-label">总记录</span>
          <strong>{{ stats.summary.total }}</strong>
        </div>
        <div class="stat-card">
          <span class="stat-label">宠物种类</span>
          <strong>{{ stats.summary.pet_types }}</strong>
        </div>
        <div class="stat-card">
          <span class="stat-label">部位类型</span>
          <strong>{{ stats.summary.part_types }}</strong>
        </div>
        <div class="stat-card">
          <span class="stat-label">攻击区间</span>
          <strong>{{ stats.summary.min_attack }} ~ {{ stats.summary.max_attack }}</strong>
        </div>
      </section>

      <section class="panel">
        <form class="filters" @submit.prevent="search">
          <input
            v-model="filters.keyword"
            type="search"
            placeholder="搜索宠物名 / 部位"
          />
          <select v-model="filters.mutate_part">
            <option value="">全部部位</option>
            <option v-for="p in PART_OPTIONS" :key="p" :value="p">{{ p }}</option>
          </select>
          <select v-model="filters.pet_year">
            <option value="">全部年份</option>
            <option v-for="y in YEAR_OPTIONS" :key="y.value" :value="y.value">
              {{ y.label }}
            </option>
          </select>
          <select v-model="filters.tier">
            <option value="">全部档位</option>
            <option v-for="t in TIER_OPTIONS" :key="t" :value="t">{{ t }}</option>
          </select>
          <button type="submit" class="btn primary">查询</button>
          <button type="button" class="btn ghost" @click="resetFilters">重置</button>
        </form>

        <p v-if="error" class="alert error">{{ error }}</p>

        <div class="toolbar">
          <span>共 {{ total }} 条</span>
          <button
            type="button"
            class="btn danger"
            :disabled="!selectedIds.length"
            @click="handleBatchDelete"
          >
            批量删除 ({{ selectedIds.length }})
          </button>
          <button type="button" class="btn ghost" :disabled="loading" @click="loadList">
            刷新
          </button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th class="col-check">
                  <input type="checkbox" :checked="allSelected" @change="toggleAll" />
                </th>
                <th>ID</th>
                <th>宠物名称</th>
                <th>变异部位</th>
                <th>攻击</th>
                <th>穿透</th>
                <th>年份</th>
                <th>档位</th>
                <th class="col-actions">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="9" class="empty">加载中…</td>
              </tr>
              <tr v-else-if="!list.length">
                <td colspan="9" class="empty">暂无数据</td>
              </tr>
              <tr v-for="row in list" :key="row.id">
                <td>
                  <input
                    type="checkbox"
                    :checked="selectedIds.includes(row.id)"
                    @change="toggleSelect(row.id, $event.target.checked)"
                  />
                </td>
                <td>{{ row.id }}</td>
                <td class="name-cell">{{ row.pet_name }}</td>
                <td>{{ row.mutate_part }}</td>
                <td>{{ row.attack_value }}</td>
                <td>{{ row.penetrate_value }}</td>
                <td>{{ row.pet_year_label || row.pet_year }}</td>
                <td><span class="tier-tag">{{ row.tier }}</span></td>
                <td class="col-actions">
                  <button type="button" class="btn link" @click="openEdit(row)">编辑</button>
                  <button type="button" class="btn link danger" @click="handleDelete(row)">
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer class="pagination">
          <button type="button" class="btn ghost" :disabled="filters.page <= 1" @click="goPage(filters.page - 1)">
            上一页
          </button>
          <span>第 {{ filters.page }} / {{ totalPages }} 页</span>
          <button
            type="button"
            class="btn ghost"
            :disabled="filters.page >= totalPages"
            @click="goPage(filters.page + 1)"
          >
            下一页
          </button>
        </footer>
      </section>
    </main>

    <PetFormModal
      :open="modal.open"
      :mode="modal.mode"
      :initial="modal.editing"
      :saving="saving"
      @close="closeModal"
      @submit="handleSubmit"
    />
    </div>
  </div>
</template>
