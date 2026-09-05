export const CUSTOMER_PHONE_KEY = 'casamisu_customer_phone'

export function rememberCustomerPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  if (digits.length >= 10) {
    localStorage.setItem(CUSTOMER_PHONE_KEY, digits)
  }
}
