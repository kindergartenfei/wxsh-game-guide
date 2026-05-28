import { computed, onMounted, ref } from 'vue'
import { fetchArchiveCards } from '../api/client.js'
import { records as fallbackRecords } from '../data/records.js'
import { YEAR_ORDER } from '../data/constants.js'
import { mergeHighYearRecords, matchesYearFilter } from '../data/mergeYears.js'
import { matchQuery } from '../utils/search.js'

export function useArchive() {
  const query = ref('')
  const part = ref('')
  const year = ref('')
  const tier = ref('')
  const activeTab = ref('attr')
  const theme = ref('light')

  const records = ref([])
  const loading = ref(true)
  const error = ref('')
  const dataSource = ref('api')

  async function loadRecords() {
    loading.value = true
    error.value = ''
    try {
      const data = await fetchArchiveCards()
      records.value = mergeHighYearRecords(data)
      dataSource.value = 'api'
    } catch (e) {
      console.warn('[archive] API 不可用，使用本地静态数据', e)
      records.value = mergeHighYearRecords(fallbackRecords)
      dataSource.value = 'static'
      error.value = `后端未连接（${e.message}），已使用本地缓存数据`
    } finally {
      loading.value = false
    }
  }

  onMounted(loadRecords)

  const filtered = computed(() => {
    return records.value
      .filter((r) => {
        if (part.value && r.part !== part.value) return false
        if (!matchesYearFilter(r, year.value)) return false
        if (tier.value && r.tier !== tier.value) return false
        if (!matchQuery(r, query.value)) return false
        return true
      })
      .sort((a, b) => {
        if (b.attack !== a.attack) return b.attack - a.attack
        return (YEAR_ORDER[b.year] ?? 0) - (YEAR_ORDER[a.year] ?? 0)
      })
  })

  const resultCount = computed(() => filtered.value.length)

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return {
    query,
    part,
    year,
    tier,
    activeTab,
    theme,
    records,
    loading,
    error,
    dataSource,
    filtered,
    resultCount,
    toggleTheme,
    reload: loadRecords,
  }
}
