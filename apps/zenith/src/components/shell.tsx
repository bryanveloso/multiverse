import { NavLink, Outlet } from 'react-router'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/editorials', label: 'Editorials' },
  { to: '/posts', label: 'Posts' },
]

export function Shell() {
  return (
    <div className="flex min-h-screen">
      <nav className="w-56 shrink-0 border-r border-neutral-800 bg-neutral-950 p-4">
        <div className="mb-8">
          <h1 className="text-lg font-bold tracking-tight">Zenith</h1>
          <p className="text-xs text-neutral-500">Content Management</p>
        </div>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `block rounded px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-neutral-800 text-white'
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 bg-neutral-950 p-8">
        <Outlet />
      </main>
    </div>
  )
}
