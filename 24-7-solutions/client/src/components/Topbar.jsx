import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Hlavní' },
  { to: '/weby', label: 'Weby' },
  { to: '/hosting', label: 'Hosting' },
  { to: '/web-aplikace', label: 'Webové aplikace' },
  { to: '/kurzy', label: 'Kurzy' },
  { to: '/jine', label: 'Jiné' },
]

function Topbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <Link to="/" className="text-sm font-bold uppercase tracking-[0.26em] text-cyan-300">
          Solutions 24/7
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm transition ${
                  isActive
                    ? 'bg-cyan-300 text-slate-900'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="rounded-md border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200 md:hidden"
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      {isOpen && (
        <nav className="border-t border-white/10 bg-slate-950 px-5 py-3 md:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 sm:px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm transition ${
                    isActive ? 'bg-cyan-300 text-slate-900' : 'text-slate-200 hover:bg-white/10'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}

export default Topbar
