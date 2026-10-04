const KEY = 'donezo-user'

export function getUser() {
  return localStorage.getItem(KEY)
}

export function login(email: string) {
  localStorage.setItem(KEY, email)
}

export function logout() {
  localStorage.removeItem(KEY)
}
