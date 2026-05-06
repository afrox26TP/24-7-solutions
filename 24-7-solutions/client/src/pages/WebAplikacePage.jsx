import PageHeader from '../components/PageHeader'
import PlanGrid from '../components/PlanGrid'

const plans = [
  {
    tag: 'Start',
    name: 'Jednoducha web aplikace',
    price: 'od 89 000 Kc',
    desc: 'Kdyz chcete nahradit rucni praci jednoduchym online systemem.',
    items: ['Spolecne upresnime potreby', 'Prihlaseni uzivatelu', 'Zakladni sprava dat'],
  },
  {
    tag: 'Oblibene',
    name: 'Firemni web aplikace',
    price: 'od 159 000 Kc',
    desc: 'Pro firmy, ktere chteji vice funkci a prehlednejsi rizeni.',
    items: ['Vice uzivatelskych roli', 'Napojeni na pouzivane sluzby', 'Prehledy a statistiky'],
  },
  {
    tag: 'Na miru',
    name: 'Velka web aplikace',
    price: 'na poptavku',
    desc: 'Pro narocnejsi projekty s individualnimi pozadavky.',
    items: ['Reseni na miru', 'Vyssi uroven zabezpeceni', 'Dlouhodoba spoluprace'],
  },
]

function WebAplikacePage() {
  return (
    <>
      <PageHeader
        eyebrow="Web aplikace"
        title="Kdyz potrebujete vic nez klasicky web"
        text="Vytvorime jednoduchy online system, ktery usetri cas vam i lidem v tymu."
      />
      <PlanGrid plans={plans} />
    </>
  )
}

export default WebAplikacePage
