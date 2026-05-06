function PlanGrid({ plans }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8 lg:px-12">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className="flex h-full min-h-[430px] flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-cyan-300/40"
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">{plan.tag}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{plan.name}</h2>
            <p className="mt-1 text-3xl font-bold text-cyan-200">{plan.price}</p>
            <p className="mt-3 text-sm text-slate-300">{plan.desc}</p>

            <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-200">
              {plan.items.map((item) => (
                <li key={item} className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold uppercase tracking-wider text-slate-900 transition hover:bg-cyan-200"
            >
              Nezávazně objednat
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PlanGrid
