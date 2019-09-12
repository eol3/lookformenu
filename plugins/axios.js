export default function ({ $axios, app, store }) {
  $axios.onRequest(config => {
    config.headers.common['CSRF-Token'] = store.state.csrf_token
  })
}