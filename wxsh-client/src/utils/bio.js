/** 将拼接的 Source Bio 拆成标签（启发式，对齐原站展示） */
const PREFIXES =
  /(?=魅煌·|忱心·|迷蛊·|斓波·|睚眦·|螭吻·|飞廉·|嘲风·|狻猊·|帝江·|飒踏·|凌铄·|莽苍·|冲炎·|青荧·|乘黄·|绵寿·|戾角·|玄煞·|并封·|霹煞·|雳煞·)/

export function splitBio(bio) {
  if (!bio) return []
  const parts = bio.split(PREFIXES).filter(Boolean)
  if (parts.length <= 1 && bio.length > 8) {
    return [bio]
  }
  return parts
}
