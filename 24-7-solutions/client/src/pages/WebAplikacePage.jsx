import PageHeader from '../components/PageHeader'
import PlanGrid from '../components/PlanGrid'

const plans = [
  {
    tag: 'Start',
    name: 'Jednoduchá webová aplikace',
    price: 'od 22 250 Kc',
    desc: 'Pro firmy, které chtějí digitalizovat jeden konkrétní proces.',
    items: ['1 hlavní funkce', 'Do 5 interních sekcí', '1 admin panel'],
  },
  {
    tag: 'Oblíbené',
    name: 'Firemní webová aplikace',
    price: 'od 39 750 Kc',
    desc: 'Pro firmy, které chtějí aplikaci pro každodenní provoz.',
    items: ['Do 3 hlavních funkcí', 'Do 15 interních sekcí', 'Napojení na 1 externí službu'],
  },
  {
    tag: 'Na míru',
    name: 'Velká webová aplikace',
    price: 'na poptavku',
    desc: 'Pro projekty s větším rozsahem a individuálními požadavky.',
    items: ['Neomezený rozsah funkcí', 'Neomezený počet sekcí', 'Více napojení podle domluvy'],
  },
]

function WebAplikacePage() {
  return (
    <>
      <PageHeader
        eyebrow="Webové aplikace"
        title="Když potřebujete víc než klasický web"
        text="Vytvoříme jednoduchý online systém, který ušetří čas vám i lidem v týmu."
      />
      <PlanGrid plans={plans} />
    </>
  )
}

export default WebAplikacePage
