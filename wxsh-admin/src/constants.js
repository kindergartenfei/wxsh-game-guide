export const YEAR_OPTIONS = [
  { value: 1, label: '百年' },
  { value: 2, label: '千年' },
  { value: 3, label: '万年' },
  { value: 4, label: '三/四万年' },
  { value: 5, label: '五/六/七/八万年' },
]

export const TIER_OPTIONS = ['T1', 'T2', 'T3']

export const PART_OPTIONS = ['角', '头', '翅膀', '背部', '尾巴', '脖子', '手臂']

export const emptyForm = () => ({
  pet_name: '',
  mutate_part: '尾巴',
  attack_value: 0,
  penetrate_value: 0,
  pet_year: 3,
  tier: 'T1',
})
