import { Link } from 'react-router-dom'

function HomePage() {
  const portfolio = [
    {
      name: 'Muzeer.com',
      type: 'Web aplikace',
      result: 'Web, kde si lide jednoduse objednaji sluzbu',
      url: 'https://muzeer.com',
    },
    {
      name: 'conpath.info',
      type: 'Vetsi firemni web',
      result: 'Prehledne informace a jednoduche poptani',
      url: 'https://conpath.info',
    },
    {
      name: 'afrox26tp.com',
      type: 'Basic web',
      result: 'Jednoducha prezentace sluzeb',
      url: 'https://afrox26tp.com',
    },
  ]

  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 pb-10 pt-12 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
        <article>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300">O nas</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-6xl">
            Vytvorime vam web, kde se lide rychle zorientuji a snadno objednaji.
          </h1>
          <p className="mt-5 max-w-2xl text-slate-300 sm:text-lg">
            Vse vysvetlime srozumitelne. Reknete nam, co potrebujete, a my pripravime web nebo system tak,
            aby byl jednoduchy pro vas i vase zakazniky.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/weby" className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-bold uppercase tracking-wider text-slate-900">
              Chci novy web
            </Link>
            <Link to="/web-aplikace" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-white/10">
              Chci webovou aplikaci
            </Link>
          </div>
        </article>

        <aside className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-lime-300">Zakladni info</p>
          <ul className="mt-4 space-y-3 text-slate-200">
            <li className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">Doba realizace: vetsinou 2-8 tydnu</li>
            <li className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">Prubeh: zavolame si, domluvime plan, pak stavime</li>
            <li className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">Po spusteni: web se starame a muzeme ho dal vylepsovat</li>
          </ul>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8 lg:px-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Jak funguje navazani spoluprace</h2>
          <p className="mt-3 max-w-3xl text-slate-300">
            Spoluprace je jednoducha a prehledna. Od prvni zpravy az po finalni predani vis, co se deje a co
            bude nasledovat.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-slate-200">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">1. Vyber a kontakt</p>
              <p className="mt-2">Vyberete si plan, nebo nam rovnou napisete, co potrebujete.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-slate-200">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">2. Kratka domluva</p>
              <p className="mt-2">Spojime se pres hovor, chat nebo videochat a doladime zadani.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-slate-200">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">3. Start prace</p>
              <p className="mt-2">Po prijeti 25% zalohy zacneme na projektu pracovat.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-slate-200">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">4. Prubezne info</p>
              <p className="mt-2">Pravidelne posilame aktualni stav, abyste meli prehled.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-slate-200">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">5. Upravy behem realizace</p>
              <p className="mt-2">Zmeny jsou mozne podle vybraneho planu nebo podle domluvy.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-slate-200">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">6. Predani a reklamace</p>
              <p className="mt-2">Finalni praci muzete reklamovat s duvodnym vyjadrenim a vse spolu projdeme.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8 lg:px-12">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Portfolio</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {portfolio.map((project) => (
            <article key={project.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">{project.type}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{project.name}</h3>
              <p className="mt-2 text-slate-300">{project.result}</p>
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-cyan-200 underline decoration-cyan-400/60 underline-offset-4"
              >
                Otevrit web
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 lg:px-12">
        <div className="rounded-3xl border border-cyan-300/30 bg-cyan-300/10 p-7">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-200">Co si muzete objednat</p>
          <p className="mt-3 text-slate-100">
            Vyber v menu nebo klikni rovnou na: <Link className="text-cyan-200 underline" to="/weby">Weby</Link>,{' '}
            <Link className="text-cyan-200 underline" to="/hosting">Hosting</Link>,{' '}
            <Link className="text-cyan-200 underline" to="/web-aplikace">Web aplikace</Link>,{' '}
            <Link className="text-cyan-200 underline" to="/jine">Jine</Link>.
          </p>
        </div>
      </section>
    </>
  )
}

export default HomePage
