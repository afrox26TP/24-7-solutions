import { useEffect, useState } from 'react'

function App() {
  const [apiStatus, setApiStatus] = useState('Checking...')

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch('/api/health')
        const data = await response.json()
        setApiStatus(data.message)
      } catch (error) {
        setApiStatus('API is not running')
      }
    }

    checkApi()
  }, [])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10">
      <section className="w-full rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          24-7 Solutions Boilerplate
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          React + Tailwind + Node.js
        </h1>
        <p className="mt-3 text-slate-600">
          Frontend bezi na <code className="rounded bg-slate-100 px-2 py-1">:5173</code> a backend na{' '}
          <code className="rounded bg-slate-100 px-2 py-1">:5000</code>.
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">API health:</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{apiStatus}</p>
        </div>

        <div className="mt-6 space-y-2 text-sm text-slate-600">
          <p>
            Start: <code className="rounded bg-slate-100 px-2 py-1">npm run dev</code>
          </p>
          <p>
            Client code: <code className="rounded bg-slate-100 px-2 py-1">client/src</code>
          </p>
          <p>
            Server code: <code className="rounded bg-slate-100 px-2 py-1">server/src</code>
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
