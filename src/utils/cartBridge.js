// Adds a configured item to the order flow's cart. OrderFlow only exists on
// the homepage, so if we're already there (the #order section is in the DOM)
// we can dispatch the event directly and it's picked up instantly. From any
// other page (/menu, the product detail page) there's no listener mounted at
// all, so we stash the item and navigate home — OrderFlow picks it up from
// sessionStorage on mount.
export const PENDING_ITEM_KEY = 'casamisu_pending_item'

export function addItemToOrder(configuredItem) {
  if (document.getElementById('order')) {
    window.dispatchEvent(new CustomEvent('casamisu:add-configured-item', { detail: configuredItem }))
  } else {
    sessionStorage.setItem(PENDING_ITEM_KEY, JSON.stringify(configuredItem))
    window.location.href = `${import.meta.env.BASE_URL}#order`
  }
}
