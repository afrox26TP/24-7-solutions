import PageHeader from '../components/PageHeader'
import PlanGrid from '../components/PlanGrid'

const plans = [
  {
    tag: 'Zaklad',
    name: 'Zakladni hosting',
    price: '390 Kc / mesic',
    desc: 'Pro mensi web, ktery ma stabilne bezet.',
    items: ['Bezpecne pripojeni', 'Pravidelne zalohy', 'Hlidaní dostupnosti webu'],
  },
  {
    tag: 'Oblibene',
    name: 'Firemni hosting',
    price: '790 Kc / mesic',
    desc: 'Pro firemni weby s vyssi navstevnosti.',
    items: ['Vyssi rychlost', 'Lepsi nacitani pro navstevniky', 'Rychla podpora'],
  },
  {
    tag: 'Na miru',
    name: 'Velky provoz',
    price: 'od 1 490 Kc / mesic',
    desc: 'Pro weby, ktere maji hodne navstevniku.',
    items: ['Stabilita i ve spicce', 'Podrobne hlidani', 'Prednostni podpora'],
  },
]

function HostingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Hosting"
        title="Aby web bez problemu bezel"
        text="Postarame se o provoz, bezpeci i zalohy. Nemusite resit technicke veci."
      />
      <PlanGrid plans={plans} />
    </>
  )
}

export default HostingPage
