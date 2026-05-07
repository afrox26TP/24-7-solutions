import PageHeader from '../components/PageHeader'
import PlanGrid from '../components/PlanGrid'

const plans = [
  {
    tag: 'Start',
    name: 'Postup tvorby webu',
    price: 'od 1 900 Kc',
    desc: 'Praktický postup od nápadu až po spuštění firemního webu.',
    items: ['Struktura webu krok za krokem', 'Návrh obsahu a rozložení', 'Publikace a základní kontrola'],
  },
  {
    tag: 'Oblíbené',
    name: 'Postup tvorby webové aplikace',
    price: 'od 4 900 Kc',
    desc: 'Jak správně navrhnout a postavit webovou aplikaci v praxi.',
    items: ['Návrh funkcí a uživatelských rolí', 'Rozdělení do etap vývoje', 'Testování a předání do provozu'],
  },
  {
    tag: 'Na míru',
    name: 'Ovládání a údržba webu',
    price: 'od 2 900 Kc',
    desc: 'Naučíme vás web dlouhodobě spravovat bez závislosti na dodavateli.',
    items: ['Úprava textů a obrázků', 'Pravidelná kontrola a aktualizace', 'Bezpečná práce v administraci'],
  },
]

function KurzyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kurzy"
        title="Kurzy a školení"
        text="Naučíme vás i váš tým pracovat s webem rychle, srozumitelně a bez zbytečné teorie."
      />
      <PlanGrid plans={plans} />
    </>
  )
}

export default KurzyPage
