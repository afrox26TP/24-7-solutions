import PageHeader from '../components/PageHeader'
import PlanGrid from '../components/PlanGrid'

const plans = [
  {
    tag: 'Základ',
    name: 'Jednoduchý web',
    price: 'od 6 200 Kc',
    desc: 'Pro malé firmy, které chtějí být dohledatelné online.',
    items: ['Statický web', 'Do 5 stránek', 'Základní SEO nastavení'],
  },
  {
    tag: 'Oblíbené',
    name: 'Firemní web',
    price: 'od 13 700 Kc',
    desc: 'Pro firmy, které chtějí více obsahu a jednodušší správu.',
    items: ['Dynamický web', 'Do 15 stránek', 'Napojení na API'],
  },
  {
    tag: 'Na míru',
    name: 'Velký web',
    price: 'na poptavku',
    desc: 'Když potřebujete větší web s individuálním řešením.',
    items: ['Neomezený rozsah', 'Napojení na další nástroje', 'Přednostní podpora'],
  },
]

function WebyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Weby"
        title="Kolik stojí web"
        text="Vyberte si plán podle toho, jak velký web potřebujete. Kdykoli vám poradíme, co je pro vás nejlepší."
      />
      <PlanGrid plans={plans} />
    </>
  )
}

export default WebyPage
