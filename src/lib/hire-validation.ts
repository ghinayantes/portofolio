export type HireField = 'name' | 'email' | 'message'
type HireLang = 'en' | 'id'

/** Single-field messages, identical to the submit-time messages in Hire.tsx. */
export function validateHireField(field: HireField, rawValue: string, lang: HireLang): string | null {
  const value = rawValue.trim()
  const id = lang === 'id'
  if (field === 'name') {
    if (!value) return id ? 'Nama wajib diisi.' : 'Enter your name.'
    return null
  }
  if (field === 'email') {
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      return id ? 'Masukkan email yang valid, misalnya nama@gmail.com.' : 'Enter a valid email, like name@gmail.com.'
    }
    return null
  }
  if (!value) return id ? 'Tulis pesan singkat.' : 'Write a short message.'
  return null
}
