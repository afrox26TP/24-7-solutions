import PageHeader from '../components/PageHeader'
import PlanGrid from '../components/PlanGrid'

const plans = [
  {
    tag: 'Základ',
    name: 'Hosting Start',
    price: '170 Kc / mesic',
    desc: 'Jasný základ pro menší web. Bez složitostí.',
    items: ['1 web', 'Úložiště 10 GB', '5 e-mailových schránek'],
  },
  {
    tag: 'Oblíbené',
    name: 'Hosting Business',
    price: '370 Kc / mesic',
    desc: 'Nejlepší volba pro běžný firemní web.',
    items: ['1 web + 1 testovací verze', 'Úložiště 30 GB', '20 e-mailových schránek'],
  },
  {
    tag: 'Na míru',
    name: 'Hosting Premium',
    price: 'od 740 Kc / mesic',
    desc: 'Pro větší projekty a více webů.',
    items: ['Až 3 weby', 'Úložiště 100 GB', '50 e-mailových schránek'],
  },
]

function HostingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Hosting"
        title="Hosting, který se vám vyplatí"
        text="Přesně víte, co dostanete za cenu. Žádná technická omáčka, jen jasné limity a podpora."
      />
      <PlanGrid plans={plans} />
    </>
  )
}

export default HostingPage
