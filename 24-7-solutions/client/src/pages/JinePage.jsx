import PageHeader from '../components/PageHeader'
import PlanGrid from '../components/PlanGrid'

const plans = [
  {
    tag: 'Návrh',
    name: 'Návrh vzhledu webu',
    price: 'od 2 900 Kc',
    desc: 'V návrhu připravíme jasný základ pro celý web.',
    items: ['Struktura', 'Design', 'Layout'],
  },
  {
    tag: 'Úspora času',
    name: 'Automatizace rutinních činností',
    price: 'od 7 400 Kc',
    desc: 'Ruční kroky převedeme na automatický proces.',
    items: ['1 konkrétní proces', 'Napojení na 1 nástroj', 'Předání do 14 dní'],
  },
  {
    tag: 'Podpora',
    name: 'Průběžná pomoc',
    price: '250 Kc / hod',
    desc: 'Pravidelná správa a úpravy bez starostí.',
    items: ['24/7 podpora', 'Reakce do 24 hodin', 'Sjednání schůzky osobně'],
  },
]

function JinePage() {
  return (
    <>
      <PageHeader
        eyebrow="Jiné"
        title="Další služby"
        text="Pokud potřebujete něco navíc, připravíme jednoduchý plán na míru i s jasnou cenou."
      />
      <PlanGrid plans={plans} />
    </>
  )
}

export default JinePage
