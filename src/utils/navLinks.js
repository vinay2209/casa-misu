export function pagePath(path) {
  return `${import.meta.env.BASE_URL}${path}`.replace(/\/{2,}/g, '/')
}

export function isHomePage() {
  if (typeof window === 'undefined') return true
  const params = new URLSearchParams(window.location.search)
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const path = window.location.pathname.replace(new RegExp(`^${base}`), '') || '/'
  return path === '/' && !params.get('page')
}

export function homeHref() {
  return pagePath('')
}

export function sectionHref(hash) {
  return isHomePage() ? `#${hash}` : `${homeHref()}#${hash}`
}

export function galleryHref() {
  return pagePath('?page=gallery')
}
