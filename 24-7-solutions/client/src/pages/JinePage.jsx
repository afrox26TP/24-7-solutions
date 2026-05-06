import PageHeader from '../components/PageHeader'
import PlanGrid from '../components/PlanGrid'

const plans = [
  {
    tag: 'Navrh',
    name: 'Navrh vzhledu webu',
    price: 'od 19 900 Kc',
    desc: 'Kdyz chcete moderni a prehledny vzhled.',
    items: ['Navrh rozlozeni', 'Jednoduche ovladani', 'Ukazka pred vyvojem'],
  },
  {
    tag: 'Uspora casu',
    name: 'Automatizace rutinnich cinnosti',
    price: 'od 29 900 Kc',
    desc: 'Co dnes delate rucne, muze bezet automaticky.',
    items: ['Zjistime co brzdi praci', 'Navrhneme jednodussi postup', 'Nastavime automaticke kroky'],
  },
  {
    tag: 'Podpora',
    name: 'Prubezna pomoc',
    price: 'od 9 900 Kc / mesic',
    desc: 'Kdyz nechcete resit web sami a potrebujete partnera.',
    items: ['Pravidelne upravy', 'Rychla pomoc pri problemu', 'Doporuceni co zlepsit'],
  },
]

function JinePage() {
  return (
    <>
      <PageHeader
        eyebrow="Jine"
        title="Dalsi sluzby"
        text="Pokud potrebujete neco navic, pripravime jednoduchy plan na miru i s jasnou cenou."
      />
      <PlanGrid plans={plans} />
    </>
  )
}

export default JinePage
