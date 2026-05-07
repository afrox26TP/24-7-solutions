import { Link } from 'react-router-dom'

function HomePage() {
  const portfolio = [
    {
      name: 'Muzeer',
      type: 'Web aplikace',
      result: 'Streamovací aplikace hudby',
      url: 'https://muzeer.com',
    },
    {
      name: 'Conpath',
      type: 'Větší firemní web',
      result: 'Firemní web s vlastním stylizováním',
      url: 'https://conpath.info',
    },
    {
      name: 'afrox26TP',
      type: 'Basic web',
      result: 'Základní statický web',
      url: 'https://afrox26tp.com',
    },
  ]

  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 pb-10 pt-12 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
        <article>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300">O nás</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-6xl">
            Vytvoříme vám moderní web s vlastním designem a strukturou.
          </h1>
          <p className="mt-5 max-w-2xl text-slate-300 sm:text-lg">
            Vše vysvětlíme srozumitelně. Řekněte nám, co potřebujete, a my připravíme web nebo systém tak,
            aby byl jednoduchý pro vás i vaše zákazníky.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/weby" className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-bold uppercase tracking-wider text-slate-900">
              Chci nový web
            </Link>
            <Link to="/web-aplikace" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-white/10">
              Chci webovou aplikaci
            </Link>
          </div>
        </article>

        <aside className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-lime-300">Základní info</p>
          <ul className="mt-4 space-y-3 text-slate-200">
            <li className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">Doba realizace: do 1 týdne</li>
            <li className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">Máme tým zkušených vývojářů a programátorů</li>
            <li className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">Za vše ručíme</li>
            <li className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">Po spuštění: o web se staráme a můžeme ho dál vylepšovat</li>
          </ul>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8 lg:px-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Jak funguje navázání spolupráce</h2>
          <p className="mt-3 max-w-3xl text-slate-300">
            Spolupráce je jednoduchá a přehledná. Od první zprávy až po finální předání víte, co se děje a co
            bude následovat.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-slate-200">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">1. Výběr a kontakt</p>
              <p className="mt-2">Vyberete si plán, nebo nám rovnou napíšete, co potřebujete.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-slate-200">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">2. Krátká domluva</p>
              <p className="mt-2">Spojíme se přes hovor, chat nebo videochat a doladíme zadání.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-slate-200">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">3. Start práce</p>
              <p className="mt-2">Po přijetí 25% zálohy začneme na projektu pracovat.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-slate-200">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">4. Průběžné info</p>
              <p className="mt-2">Pravidelně posíláme aktuální stav, abyste měli přehled.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-slate-200">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">5. Úpravy během realizace</p>
              <p className="mt-2">Změny jsou možné podle vybraného plánu nebo podle domluvy.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-slate-200">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">6. Předání a reklamace</p>
              <p className="mt-2">Finální práci můžete reklamovat s důvodným vyjádřením a vše spolu projdeme.</p>
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
                Otevřít web
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 lg:px-12">
        <div className="rounded-3xl border border-cyan-300/30 bg-cyan-300/10 p-7">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-200">Co si můžete objednat</p>
          <p className="mt-3 text-slate-100">
            Vyberte v menu nebo klikněte rovnou na: <Link className="text-cyan-200 underline" to="/weby">Weby</Link>,{' '}
            <Link className="text-cyan-200 underline" to="/hosting">Hosting</Link>,{' '}
            <Link className="text-cyan-200 underline" to="/web-aplikace">Webové aplikace</Link>,{' '}
            <Link className="text-cyan-200 underline" to="/kurzy">Kurzy</Link>,{' '}
            <Link className="text-cyan-200 underline" to="/jine">Jiné</Link>.
          </p>
        </div>
      </section>
    </>
  )
}

export default HomePage
