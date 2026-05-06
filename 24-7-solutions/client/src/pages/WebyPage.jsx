import PageHeader from '../components/PageHeader'
import PlanGrid from '../components/PlanGrid'

const plans = [
  {
    tag: 'Zaklad',
    name: 'Jednoduchy web',
    price: 'od 24 900 Kc',
    desc: 'Pro male firmy, ktere chteji byt dohledatelne online.',
    items: ['Do 5 stranek', 'Funguje na mobilu i pocitaci', 'Kontaktni formular'],
  },
  {
    tag: 'Oblibene',
    name: 'Firemni web',
    price: 'od 54 900 Kc',
    desc: 'Pro firmy, ktere chteji vice obsahu a jednodussi spravu.',
    items: ['Do 15 stranek', 'Novinky nebo blog', 'Mereni navstevnosti'],
  },
  {
    tag: 'Na miru',
    name: 'Velky web',
    price: 'na poptavku',
    desc: 'Kdyz potrebujete vetsi web s individualnim resenim.',
    items: ['Neomezeny rozsah', 'Napojeni na dalsi nastroje', 'Prednostni podpora'],
  },
]

function WebyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Weby"
        title="Kolik stoji web"
        text="Vyberte si plan podle toho, jak velky web potrebujete. Kdykoli vam poradime, co je pro vas nejlepsi."
      />
      <PlanGrid plans={plans} />
    </>
  )
}

export default WebyPage
