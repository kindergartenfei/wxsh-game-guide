export const PARTS = ['角', '头', '翅膀', '背部', '尾巴', '脖子', '手臂']

export const YEARS = [
  '百年',
  '千年',
  '万年',
  '三/四万年',
  '五/六/七/八万年',
]

export const TIERS = ['T1', 'T2', 'T3']

export const YEAR_ORDER = Object.fromEntries(YEARS.map((y, i) => [y, i]))

export const TABS = [
  { id: 'attr', label: '属性检索' },
  { id: 'attack', label: '攻击对照' },
  { id: 'trait', label: '特质对照' },
]
