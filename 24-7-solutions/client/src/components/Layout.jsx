import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'

function Layout() {
  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-[35rem] h-96 w-96 rounded-full bg-lime-300/15 blur-3xl" />

      <Topbar />
      <Outlet />

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-2 px-5 text-sm text-slate-300 sm:flex-row sm:px-8 lg:px-12">
          <p>Solutions 24/7</p>
          <p>Weby | Hosting | Webové aplikace | Kurzy | Jiné</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
