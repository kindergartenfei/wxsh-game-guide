/**
 * 统一响应格式
 * { code, message, data }
 * code: 0 成功，非 0 失败
 */
export function success(res, data = null, message = 'success') {
  return res.json({ code: 0, message, data })
}

export function fail(res, message = 'error', code = 1, httpStatus = 400) {
  return res.status(httpStatus).json({ code, message, data: null })
}

export function pageData(list, total, page, pageSize) {
  return {
    list,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 0,
  }
}
