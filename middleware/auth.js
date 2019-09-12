

export default async function ({ store, redirect, $axios, env }) {
  if (!store.state.admin.auth) {
    return redirect('/admin/login')
  }
}