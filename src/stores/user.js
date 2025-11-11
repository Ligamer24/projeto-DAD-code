import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const name = ref('Ana Oliveira')
  const nickname = ref('Ana')
  const email = ref('ana@example.com')
  const coins = ref(300)
  const rating = ref(1520)
  const rank = ref('35687')
  const createdAt = ref(new Date('2024-01-12T10:15:00Z'))
  const avatarUrl = ref(null) // can hold data URL

  const shortDate = computed(() => createdAt.value.toLocaleDateString())

  function updateProfile({ name: newName, nickname: newNickname, email: newEmail }) {
    if (typeof newName === 'string') name.value = newName
    if (typeof newNickname === 'string') nickname.value = newNickname
    if (typeof newEmail === 'string') email.value = newEmail
  }

  function updateAvatar(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => { avatarUrl.value = e.target.result }
    reader.readAsDataURL(file)
  }

  function changePassword({ current, next, confirm }) {
    // Placeholder validation logic (no backend)
    const errors = []
    if (!current) errors.push('Current password required')
    if (!next) errors.push('New password required')
    if (next && next.length < 6) errors.push('New password must be at least 6 characters')
    if (next === current) errors.push('New password must be different from current password')
    if (next !== confirm) errors.push('Confirmation does not match new password')
    if (errors.length) return { ok: false, errors }
    // Pretend success
    return { ok: true }
  }

  return {
    name,
    nickname,
    email,
    coins,
    rating,
    rank,
    createdAt,
    avatarUrl,
    shortDate,
    updateProfile,
    updateAvatar,
    changePassword,
  }
})

