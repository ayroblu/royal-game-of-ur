let apiUrl = 'http://localhost:3001'
apiUrl = ''
if (process.env.NODE_ENV === 'production') {
  apiUrl = ''
}
export {
  apiUrl
}
export const hotReload = false
