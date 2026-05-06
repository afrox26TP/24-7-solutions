function PageHeader({ eyebrow, title, text }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-8 pt-12 sm:px-8 lg:px-12">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-slate-300">{text}</p>
    </section>
  )
}

export default PageHeader
