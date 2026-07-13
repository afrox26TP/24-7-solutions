import { useMemo, useState } from 'react'

const BACKGROUND_OPTIONS = [
  { id: 'clean', label: 'Clean' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'forest', label: 'Forest' },
  { id: 'grid', label: 'Grid' },
]

const DEFAULT_COMPONENT_STYLE = {
  textColor: '#1f2937',
  backgroundColor: '#ffffff',
  borderColor: '#cbd5e1',
  hoverColor: '#2563eb',
  fontSize: 16,
  fontWeight: 400,
  lineHeight: 1.5,
  letterSpacing: 0,
  padding: 0,
  radius: 12,
  opacity: 100,
  hoverScale: 1.03,
  hoverShadow: true,
  animation: 'none',
  fontFamily: 'inherit',
}

const COMPONENT_STYLE_PRESETS = {
  modern: {
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    hoverColor: '#2563eb',
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.55,
    letterSpacing: 0,
    padding: 10,
    radius: 12,
    opacity: 100,
    hoverScale: 1.03,
    hoverShadow: true,
    animation: 'none',
    fontFamily: "'Segoe UI', sans-serif",
  },
  bold: {
    textColor: '#0b1020',
    backgroundColor: '#f8fafc',
    borderColor: '#1d4ed8',
    hoverColor: '#ef4444',
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1.35,
    letterSpacing: 0.5,
    padding: 14,
    radius: 14,
    opacity: 100,
    hoverScale: 1.06,
    hoverShadow: true,
    animation: 'pulse',
    fontFamily: "'Trebuchet MS', sans-serif",
  },
  minimal: {
    textColor: '#334155',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    hoverColor: '#0f172a',
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: 0,
    padding: 6,
    radius: 6,
    opacity: 96,
    hoverScale: 1.01,
    hoverShadow: false,
    animation: 'fade',
    fontFamily: 'inherit',
  },
}

function withDefaultComponentStyle(style) {
  return {
    ...DEFAULT_COMPONENT_STYLE,
    ...(style ?? {}),
  }
}

const COMPONENT_LIBRARY = [
  {
    type: 'header',
    label: 'Header',
    category: 'Layout',
    defaults: {
      brand: 'ORCAVE',
      links: 'Produkt, Cenik, FAQ, Kontakt',
      cta: 'Zacit zdarma',
    },
  },
  { type: 'heading', label: 'Heading', category: 'Text', defaults: { text: 'Hlavni nadpis sekce' } },
  { type: 'subheading', label: 'Subheading', category: 'Text', defaults: { text: 'Podnadpis sekce' } },
  { type: 'text', label: 'Text', category: 'Text', defaults: { text: 'Delsi odstavcovy text obsahu.' } },
  {
    type: 'image',
    label: 'Image',
    category: 'Media',
    defaults: { src: 'https://picsum.photos/seed/orcave/1200/700', alt: 'Ukazkovy obrazek' },
  },
  {
    type: 'video',
    label: 'Video',
    category: 'Media',
    defaults: { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Video blok' },
  },
  { type: 'button', label: 'Button', category: 'CTA', defaults: { text: 'Klikni sem', href: '#' } },
  {
    type: 'button-group',
    label: 'Button Group',
    category: 'CTA',
    defaults: { items: 'Primarni, Sekundarni' },
  },
  {
    type: 'accordion',
    label: 'Accordion',
    category: 'Content',
    defaults: { title: 'Casto kladena otazka', content: 'Sem pride odpoved v accordionu.', open: false },
  },
  {
    type: 'collapsible',
    label: 'Collapsible',
    category: 'Content',
    defaults: { title: 'Dalsi detail', content: 'Skryty obsah collapsible komponenty.', open: false },
  },
  { type: 'alert', label: 'Alert', category: 'Feedback', defaults: { text: 'Dulezite upozorneni nebo casove omezena akce.' } },
  { type: 'card', label: 'Card', category: 'Content', defaults: { title: 'Benefit title', content: 'Jedna karta s benefitem nebo hodnotou.' } },
  { type: 'badge', label: 'Badge', category: 'Feedback', defaults: { text: 'New' } },
  {
    type: 'avatar',
    label: 'Avatar',
    category: 'Social Proof',
    defaults: { name: 'Tereza Novak', src: 'https://i.pravatar.cc/120?img=32' },
  },
  { type: 'checkbox', label: 'Checkbox', category: 'Form', defaults: { label: 'Souhlasim s podminkami', checked: false } },
  { type: 'input', label: 'Input', category: 'Form', defaults: { label: 'Jmeno', placeholder: 'Zadej hodnotu' } },
  { type: 'textarea', label: 'Textarea', category: 'Form', defaults: { label: 'Zprava', placeholder: 'Napis text...' } },
  {
    type: 'select',
    label: 'Select',
    category: 'Form',
    defaults: { label: 'Vyber moznost', options: 'Varianta A, Varianta B, Varianta C' },
  },
  {
    type: 'radio-group',
    label: 'Radio Group',
    category: 'Form',
    defaults: { label: 'Typ planu', options: 'Free, Pro, Enterprise', selected: 'Pro' },
  },
  {
    type: 'carousel',
    label: 'Carousel',
    category: 'Social Proof',
    defaults: {
      images:
        'https://picsum.photos/seed/car-1/600/360, https://picsum.photos/seed/car-2/600/360, https://picsum.photos/seed/car-3/600/360',
    },
  },
  { type: 'chart', label: 'Chart', category: 'Social Proof', defaults: { values: '24, 56, 36, 78, 42' } },
  { type: 'progress', label: 'Progress', category: 'Utility', defaults: { value: 62, label: 'Kapacita 62%' } },
  { type: 'separator', label: 'Separator', category: 'Layout', defaults: { text: 'Sekce' } },
  {
    type: 'aspect-ratio',
    label: 'Aspect Ratio',
    category: 'Layout',
    defaults: { ratio: '16/9', src: 'https://picsum.photos/seed/aspect/1000/560' },
  },
  {
    type: 'quote',
    label: 'Quote',
    category: 'Social Proof',
    defaults: {
      text: 'Spoluprace byla rychla, jasna a mela realny dopad na vysledky.',
      author: 'Martina K., CMO',
    },
  },
  {
    type: 'logo-row',
    label: 'Logo Row',
    category: 'Social Proof',
    defaults: { items: 'Acme, Vertex, Novus, Orbit, Prime' },
  },
  {
    type: 'kpi',
    label: 'KPI',
    category: 'Social Proof',
    defaults: { value: '34%', label: 'Rust poptavek', note: 'za 30 dni' },
  },
  {
    type: 'pricing-card',
    label: 'Pricing Card',
    category: 'CTA',
    defaults: {
      plan: 'Pro Plan',
      price: '1490 Kc',
      period: '/ mesic',
      features: 'Neomezene projekty, Prioritni podpora, Integrace',
      cta: 'Zacit zdarma',
    },
  },
  {
    type: 'feature-list',
    label: 'Feature List',
    category: 'Content',
    defaults: { items: 'Rychle nasazeni, Jasna analytika, Vyssi konverze' },
  },
  {
    type: 'countdown',
    label: 'Countdown',
    category: 'CTA',
    defaults: { days: 7, hours: 12, minutes: 45, label: 'Akce konci za' },
  },
  {
    type: 'limited-offer',
    label: 'Limited Offer',
    category: 'CTA',
    defaults: {
      title: 'Limitovana nabidka',
      subtitle: 'Jen pro prvnich 50 klientu.',
      code: 'START2026',
      cta: 'Aktivovat nabidku',
    },
  },
  {
    type: 'cookie-popup',
    label: 'Cookie Popup',
    category: 'Utility',
    defaults: {
      title: 'Pouzivame cookies',
      text: 'Pomahaji nam zlepsit web a merit vykon kampani.',
      accept: 'Prijmout',
      reject: 'Odmittnout',
    },
  },
  {
    type: 'footer',
    label: 'Footer',
    category: 'Layout',
    defaults: {
      brand: 'ORCAVE',
      note: 'Copyright 2026 ORCAVE. Vsechna prava vyhrazena.',
      links: 'Podminky, Ochrana udaju, Kontakt',
    },
  },
]

const PREMADE_SECTIONS = [
  {
    id: 'form',
    label: 'Formular',
    description: 'Lead form se zakladnimi poli a CTA.',
    blocks: [
      { type: 'separator', props: { text: 'Kontaktni formular' } },
      { type: 'heading', props: { text: 'Posli nam poptavku' } },
      { type: 'text', props: { text: 'Odpovime ti do 24 hodin.' } },
      { type: 'input', props: { label: 'Jmeno a prijmeni', placeholder: 'Jan Novak' } },
      { type: 'input', props: { label: 'Email', placeholder: 'jan@firma.cz' } },
      { type: 'textarea', props: { label: 'Pozadavek', placeholder: 'Co potrebujes vyresit?' } },
      { type: 'checkbox', props: { label: 'Souhlasim se zpracovanim osobnich udaju', checked: false } },
      { type: 'button', props: { text: 'Odeslat poptavku', href: '#' } },
    ],
  },
  {
    id: 'contact',
    label: 'Kontakt',
    description: 'Blok s kontaktnimi udaji a rychlymi akcemi.',
    blocks: [
      { type: 'separator', props: { text: 'Kontakt' } },
      { type: 'heading', props: { text: 'Spoj se s nami' } },
      { type: 'text', props: { text: 'Po-Pa 8:00-18:00 | Odpovime jeste dnes.' } },
      { type: 'card', props: { title: 'Email', content: 'hello@orcave.cz' } },
      { type: 'card', props: { title: 'Telefon', content: '+420 777 123 456' } },
      { type: 'button-group', props: { items: 'Zavolat, Napsat email, Domluvit call' } },
    ],
  },
  {
    id: 'stats',
    label: 'Statistiky',
    description: 'Dukaz vykonu pomoci metrik a cisel.',
    blocks: [
      { type: 'separator', props: { text: 'Vysledky klientu' } },
      { type: 'heading', props: { text: 'Metriky, ktere mluvi jasne' } },
      { type: 'chart', props: { values: '22, 48, 37, 64, 89' } },
      { type: 'progress', props: { label: 'Rust konverze', value: 74 } },
      { type: 'card', props: { title: '+34%', content: 'Vice poptavek za prvnich 30 dni.' } },
      { type: 'card', props: { title: '-18%', content: 'Nizsi cena za lead po optimalizaci.' } },
    ],
  },
  {
    id: 'links',
    label: 'Odkazy',
    description: 'Rychle odkazy na dalsi obsah nebo sekce.',
    blocks: [
      { type: 'separator', props: { text: 'Rychle odkazy' } },
      { type: 'subheading', props: { text: 'Vyber dalsi krok' } },
      { type: 'button-group', props: { items: 'Cenik, Pripadove studie, FAQ, Kontakt' } },
      { type: 'alert', props: { text: 'Tip: zacni pripadovymi studiemi a over vysledky.' } },
    ],
  },
  {
    id: 'references',
    label: 'Reference',
    description: 'Social proof od klientu a ukazky.',
    blocks: [
      { type: 'separator', props: { text: 'Reference klientu' } },
      { type: 'heading', props: { text: 'Duvira vice nez 120 firm' } },
      { type: 'avatar', props: { name: 'Martina K., CMO', src: 'https://i.pravatar.cc/120?img=47' } },
      {
        type: 'card',
        props: {
          title: '"Skvela spoluprace"',
          content: 'Behem 2 tydnu jsme zvedli pocet leadu o tretinu a konecne mame jasnou komunikaci hodnoty.',
        },
      },
      { type: 'carousel', props: { images: 'https://picsum.photos/seed/ref-1/600/360, https://picsum.photos/seed/ref-2/600/360, https://picsum.photos/seed/ref-3/600/360' } },
      { type: 'badge', props: { text: '4.9/5 hodnoceni' } },
    ],
  },
  {
    id: 'hero-launch',
    label: 'Hero Launch',
    description: 'Nadpis, podnadpis, CTA, media a social proof.',
    blocks: [
      { type: 'badge', props: { text: 'Nova verze 2026' } },
      { type: 'heading', props: { text: 'Postav landing page za 15 minut' } },
      { type: 'subheading', props: { text: 'Editor pro rychly navrh sdeleni, CTA a formulare bez kodu.' } },
      { type: 'button-group', props: { items: 'Vyzkouset zdarma, Rezervovat demo' } },
      { type: 'aspect-ratio', props: { ratio: '16/9', src: 'https://picsum.photos/seed/hero-launch/1200/675' } },
      { type: 'logo-row', props: { items: 'Acme, Brisk, Northlabs, Pixelio, Vanta' } },
    ],
  },
  {
    id: 'benefits',
    label: 'Benefity',
    description: 'Sekce s vyhodami a strukturou argumentu.',
    blocks: [
      { type: 'separator', props: { text: 'Proc ORCAVE' } },
      { type: 'heading', props: { text: 'Co ziskas hned po nasazeni' } },
      { type: 'feature-list', props: { items: 'Jasny message-market fit, Vyssi konverzni pomer, Rychle A/B iterace' } },
      { type: 'card', props: { title: 'Jednoducha sprava', content: 'Obsah i strukturu menis v jednom panelu.' } },
      { type: 'card', props: { title: 'Skalovatelnost', content: 'Stejny framework pouzijes pro dalsi kampane.' } },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing',
    description: 'Cenovy blok a porovnani hlavniho planu.',
    blocks: [
      { type: 'separator', props: { text: 'Cenik' } },
      { type: 'heading', props: { text: 'Jednoduche ceny bez skrytych poplatku' } },
      {
        type: 'pricing-card',
        props: {
          plan: 'Growth',
          price: '1490 Kc',
          period: '/ mesic',
          features: 'Neomezene landing pages, Heatmapy, Integrace CRM, Priority support',
          cta: 'Zacit Growth',
        },
      },
      { type: 'countdown', props: { label: 'Launch sleva konci za', days: 3, hours: 8, minutes: 14 } },
    ],
  },
  {
    id: 'faq',
    label: 'FAQ',
    description: 'Predpripravene casto kladene dotazy.',
    blocks: [
      { type: 'separator', props: { text: 'FAQ' } },
      { type: 'heading', props: { text: 'Na co se ptate nejcasteji' } },
      { type: 'accordion', props: { title: 'Jak rychle spustim prvni stranku?', content: 'Zakladni variantu zvladnes behem jednoho odpoledne.', open: true } },
      { type: 'accordion', props: { title: 'Muzu exportovat kod?', content: 'Ano, projekt zustava plne pod tvoji kontrolou.', open: false } },
      { type: 'accordion', props: { title: 'Jde to propojit s CRM?', content: 'Ano, pres webhooky a integrace formularu.', open: false } },
    ],
  },
  {
    id: 'final-cta',
    label: 'Finalni CTA',
    description: 'Zaverecna vyzva k akci s dukazy duvery.',
    blocks: [
      { type: 'separator', props: { text: 'Posledni krok' } },
      { type: 'heading', props: { text: 'Pripraveni zvednout konverze?' } },
      { type: 'quote', props: { text: 'Po nasazeni jsme meli o 34 % vice relevantnich leadu.', author: 'Pavel R., CEO' } },
      { type: 'kpi', props: { value: '+34%', label: 'Vice leadu', note: 'behem 30 dni' } },
      { type: 'button', props: { text: 'Chci zacit dnes', href: '#' } },
    ],
  },
  {
    id: 'top-header',
    label: 'Top Header',
    description: 'Elegantni horni navigace pro landing page.',
    blocks: [
      {
        type: 'header',
        props: {
          brand: 'ORCAVE Studio',
          links: 'Funkce, Reference, Cenik, FAQ',
          cta: 'Book demo',
        },
      },
    ],
  },
  {
    id: 'footer-contact',
    label: 'Footer Kontakt',
    description: 'Paticka s kontakty a legal odkazy.',
    blocks: [
      {
        type: 'footer',
        props: {
          brand: 'ORCAVE',
          note: 'Kontakt: hello@orcave.cz | +420 777 123 456',
          links: 'Obchodni podminky, GDPR, Podpora',
        },
      },
    ],
  },
  {
    id: 'limited-offer-premade',
    label: 'Limited Nabidka',
    description: 'Samostatny promo blok s casove omezenou akci.',
    blocks: [
      {
        type: 'limited-offer',
        props: {
          title: 'Flash sleva 25 %',
          subtitle: 'Plati jen dnes do pulnoci.',
          code: 'FLASH25',
          cta: 'Uplatnit kod',
        },
      },
    ],
  },
  {
    id: 'cookie-popup-premade',
    label: 'Cookie Popup',
    description: 'Samostatny blok pro souhlas s cookies.',
    blocks: [
      {
        type: 'cookie-popup',
        props: {
          title: 'Nastaveni cookies',
          text: 'Pouzivame analyticke i marketingove cookies pro lepsi vysledky kampani.',
          accept: 'Prijmout vse',
          reject: 'Jen nezbytne',
        },
      },
    ],
  },
  {
    id: 'boilerplate-saas',
    label: 'Boilerplate SaaS',
    description: 'Zakladni SaaS landing: hero, benefity, social proof, CTA.',
    blocks: [
      { type: 'header', props: { brand: 'Nimbus AI', links: 'Produkt, Integrace, Cenik, Kontakt', cta: 'Start free' } },
      { type: 'badge', props: { text: 'B2B SaaS' } },
      { type: 'heading', props: { text: 'Automatizuj reporty behem 5 minut' } },
      { type: 'subheading', props: { text: 'Jedna platforma pro data, dashboardy a tydenni reporting bez manualni prace.' } },
      { type: 'button-group', props: { items: 'Vyzkouset zdarma, Rezervovat demo' } },
      { type: 'aspect-ratio', props: { ratio: '16/9', src: 'https://picsum.photos/seed/saas-boiler/1200/680' } },
      { type: 'feature-list', props: { items: 'Napojeni na CRM, Live dashboard, AI shrnuti pro management' } },
      { type: 'logo-row', props: { items: 'Inovo, DeltaTech, Brightly, OpenGrid, Axis' } },
      { type: 'footer', props: { brand: 'Nimbus AI', note: 'Trusted by 200+ teams', links: 'Terms, Privacy, Contact' } },
    ],
  },
  {
    id: 'boilerplate-agency',
    label: 'Boilerplate Agentura',
    description: 'Stranka pro marketingovou/webovou agenturu.',
    blocks: [
      { type: 'header', props: { brand: 'Studio North', links: 'Sluzby, Projekty, O nas, Kontakt', cta: 'Nezavazna konzultace' } },
      { type: 'heading', props: { text: 'Weby a kampane, ktere realne prodavaji' } },
      { type: 'text', props: { text: 'Kombinujeme strategii, obsah a performance marketing do jednoho procesu.' } },
      { type: 'card', props: { title: 'Strategie', content: 'Analyza trhu a jasny plan rustu.' } },
      { type: 'card', props: { title: 'Design + UX', content: 'Zamereno na konverzi a srozumitelnost.' } },
      { type: 'card', props: { title: 'Performance', content: 'PPC + SEO + analytika pod jednou strechou.' } },
      { type: 'quote', props: { text: 'Nejlepsi investice za posledni rok. Leady sly okamzite nahoru.', author: 'Lucie V., COO' } },
      { type: 'button', props: { text: 'Domluvit call', href: '#' } },
    ],
  },
  {
    id: 'boilerplate-webinar',
    label: 'Boilerplate Webinar',
    description: 'Rychla sablona pro registraci na webinar/event.',
    blocks: [
      { type: 'badge', props: { text: 'Live Webinar' } },
      { type: 'heading', props: { text: 'Jak zvednout konverze landing page o 30 %' } },
      { type: 'text', props: { text: 'Streda 24. 7. v 18:00 | 45 minut + Q&A.' } },
      { type: 'countdown', props: { label: 'Startujeme za', days: 5, hours: 3, minutes: 22 } },
      { type: 'input', props: { label: 'Jmeno', placeholder: 'Tvoje jmeno' } },
      { type: 'input', props: { label: 'Email', placeholder: 'email@firma.cz' } },
      { type: 'checkbox', props: { label: 'Souhlasim se zaslanim zaznamu po akci', checked: true } },
      { type: 'button', props: { text: 'Registrovat se', href: '#' } },
      { type: 'cookie-popup', props: { title: 'Cookies pro event', text: 'Pouzivame cookies pro mereni navstevnosti registrace.', accept: 'OK', reject: 'Ne ted' } },
    ],
  },
  {
    id: 'boilerplate-eshop',
    label: 'Boilerplate E-shop Promo',
    description: 'Promo stranka pro produkt nebo sezonni akci.',
    blocks: [
      { type: 'header', props: { brand: 'UrbanWear', links: 'New In, Kolekce, Doprava, FAQ', cta: 'Nakupovat' } },
      { type: 'limited-offer', props: { title: 'Summer Drop -20 %', subtitle: 'Pouze tento vikend na vybrane produkty.', code: 'SUMMER20', cta: 'Nakoupit ted' } },
      { type: 'image', props: { src: 'https://picsum.photos/seed/shop-promo/1200/800', alt: 'Promo kolekce' } },
      { type: 'pricing-card', props: { plan: 'Starter Pack', price: '990 Kc', period: '', features: 'Tri bestsellery, Doprava zdarma, Vymena do 30 dni', cta: 'Pridat do kosiku' } },
      { type: 'carousel', props: { images: 'https://picsum.photos/seed/shop-1/600/360, https://picsum.photos/seed/shop-2/600/360, https://picsum.photos/seed/shop-3/600/360' } },
      { type: 'footer', props: { brand: 'UrbanWear', note: 'Fast shipping across CZ/SK', links: 'Vráceni, Podpora, Kontakt' } },
    ],
  },
  {
    id: 'boilerplate-consultant',
    label: 'Boilerplate Konzultant',
    description: 'Osobni landing pro freelancera nebo konzultanta.',
    blocks: [
      { type: 'heading', props: { text: 'Pomaham firmam rust systematicky' } },
      { type: 'subheading', props: { text: 'Strategie, funnel a exekuce pro mensi a stredni firmy.' } },
      { type: 'avatar', props: { name: 'Jan Novak, Growth Consultant', src: 'https://i.pravatar.cc/120?img=18' } },
      { type: 'kpi', props: { value: '80+', label: 'Dokoncenych projektu', note: 'v poslednich 3 letech' } },
      { type: 'quote', props: { text: 'Pragmaticky pristup, jasne priority a meritelne vysledky.', author: 'Eva N., Founder' } },
      { type: 'input', props: { label: 'Email', placeholder: 'kam mam poslat navrh?' } },
      { type: 'textarea', props: { label: 'Co chcete zlepsit?', placeholder: 'Napis kratce kontext a cil...' } },
      { type: 'button', props: { text: 'Poslat poptavku', href: '#' } },
    ],
  },
]

function toList(value) {
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value)
  if (Number.isNaN(number)) return fallback
  return Math.max(min, Math.min(max, number))
}

function createBlock(type, index) {
  const definition = COMPONENT_LIBRARY.find((component) => component.type === type)
  if (!definition) {
    return {
      id: `unknown-${Date.now()}-${index}`,
      type: 'text',
      props: { text: 'Neznamy blok' },
    }
  }

  return {
    id: `${type}-${Date.now()}-${index}`,
    type,
    props: { ...definition.defaults },
  }
}

function createBlockFromTemplate(template, index) {
  const baseBlock = createBlock(template.type, index)

  return {
    ...baseBlock,
    props: {
      ...baseBlock.props,
      ...(template.props ?? {}),
    },
  }
}

function renderPreviewBlock(block, state, onStateChange) {
  const { type, props } = block

  function getStateValue(key, fallback) {
    if (state && key in state) {
      return state[key]
    }

    return fallback
  }

  if (type === 'heading') return <h1 key={block.id}>{props.text}</h1>
  if (type === 'subheading') return <h2 key={block.id}>{props.text}</h2>
  if (type === 'text') return <p key={block.id}>{props.text}</p>

  if (type === 'header') {
    return (
      <header key={block.id} className="preview-header">
        <strong>{props.brand}</strong>
        <nav>
          {toList(props.links).map((link, index) => (
            <a href="#" key={`${link}-${index}`}>
              {link}
            </a>
          ))}
        </nav>
        <button type="button">{props.cta}</button>
      </header>
    )
  }

  if (type === 'image') {
    return <img key={block.id} className="preview-image" src={props.src} alt={props.alt} loading="lazy" />
  }

  if (type === 'video') {
    return (
      <div key={block.id} className="preview-video-wrap">
        <iframe
          src={props.url}
          title={props.title}
          className="preview-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (type === 'button') {
    return (
      <a key={block.id} className="preview-button" href={props.href}>
        {props.text}
      </a>
    )
  }

  if (type === 'button-group') {
    const activeIndex = getStateValue('activeIndex', -1)

    return (
      <div key={block.id} className="preview-button-group">
        {toList(props.items).map((item, index) => (
          <button
            type="button"
            key={`${item}-${index}`}
            className={index === activeIndex ? 'is-active' : ''}
            onClick={() => onStateChange({ activeIndex: index })}
          >
            {item}
          </button>
        ))}
      </div>
    )
  }

  if (type === 'accordion' || type === 'collapsible') {
    const isOpen = Boolean(getStateValue('open', props.open))

    return (
      <details
        key={block.id}
        className="preview-accordion"
        open={isOpen}
        onToggle={(event) => onStateChange({ open: event.currentTarget.open })}
      >
        <summary>{props.title}</summary>
        <p>{props.content}</p>
      </details>
    )
  }

  if (type === 'alert') {
    return (
      <div key={block.id} className="preview-alert" role="alert">
        {props.text}
      </div>
    )
  }

  if (type === 'card') {
    return (
      <article key={block.id} className="preview-card">
        <h3>{props.title}</h3>
        <p>{props.content}</p>
      </article>
    )
  }

  if (type === 'badge') {
    return (
      <span key={block.id} className="preview-badge">
        {props.text}
      </span>
    )
  }

  if (type === 'avatar') {
    return (
      <div key={block.id} className="preview-avatar">
        <img src={props.src} alt={props.name} />
        <span>{props.name}</span>
      </div>
    )
  }

  if (type === 'checkbox') {
    const checked = Boolean(getStateValue('checked', props.checked))

    return (
      <label key={block.id} className="preview-check">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onStateChange({ checked: event.target.checked })}
        />
        <span>{props.label}</span>
      </label>
    )
  }

  if (type === 'input') {
    const value = String(getStateValue('value', ''))

    return (
      <label key={block.id} className="preview-field">
        <span>{props.label}</span>
        <input
          type="text"
          placeholder={props.placeholder}
          value={value}
          onChange={(event) => onStateChange({ value: event.target.value })}
        />
      </label>
    )
  }

  if (type === 'textarea') {
    const value = String(getStateValue('value', ''))

    return (
      <label key={block.id} className="preview-field">
        <span>{props.label}</span>
        <textarea
          placeholder={props.placeholder}
          rows={4}
          value={value}
          onChange={(event) => onStateChange({ value: event.target.value })}
        />
      </label>
    )
  }

  if (type === 'select') {
    const options = toList(props.options)
    const fallbackValue = options[0] ?? ''
    const value = String(getStateValue('value', fallbackValue))

    return (
      <label key={block.id} className="preview-field">
        <span>{props.label}</span>
        <select value={value} onChange={(event) => onStateChange({ value: event.target.value })}>
          {options.map((option, index) => (
            <option key={`${option}-${index}`}>{option}</option>
          ))}
        </select>
      </label>
    )
  }

  if (type === 'radio-group') {
    const options = toList(props.options)
    const selectedValue = String(getStateValue('selected', props.selected))

    return (
      <fieldset key={block.id} className="preview-radio-group">
        <legend>{props.label}</legend>
        {options.map((option, index) => (
          <label key={`${option}-${index}`}>
            <input
              type="radio"
              name={`radio-${block.id}`}
              checked={selectedValue === option}
              onChange={() => onStateChange({ selected: option })}
            />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
    )
  }

  if (type === 'carousel') {
    return (
      <div key={block.id} className="preview-carousel">
        {toList(props.images).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt={`slide-${index + 1}`} />
        ))}
      </div>
    )
  }

  if (type === 'chart') {
    const values = toList(props.values).map((value) => clampNumber(value, 0, 100, 0))
    return (
      <div key={block.id} className="preview-chart">
        {values.map((value, index) => (
          <div key={`${value}-${index}`} style={{ height: `${value}%` }} title={`${value}%`} />
        ))}
      </div>
    )
  }

  if (type === 'progress') {
    const value = clampNumber(props.value, 0, 100, 0)
    return (
      <div key={block.id} className="preview-progress-wrap">
        <span>{props.label}</span>
        <progress max="100" value={value} />
      </div>
    )
  }

  if (type === 'separator') {
    return (
      <div key={block.id} className="preview-separator">
        <hr />
        <span>{props.text}</span>
      </div>
    )
  }

  if (type === 'aspect-ratio') {
    const isSquare = String(props.ratio).trim() === '1/1'
    return (
      <div key={block.id} className={`preview-aspect ${isSquare ? 'is-square' : ''}`}>
        <img src={props.src} alt="aspect content" />
      </div>
    )
  }

  if (type === 'quote') {
    return (
      <figure key={block.id} className="preview-quote">
        <blockquote>"{props.text}"</blockquote>
        <figcaption>{props.author}</figcaption>
      </figure>
    )
  }

  if (type === 'logo-row') {
    return (
      <div key={block.id} className="preview-logo-row">
        {toList(props.items).map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    )
  }

  if (type === 'kpi') {
    return (
      <article key={block.id} className="preview-kpi">
        <strong>{props.value}</strong>
        <p>{props.label}</p>
        <small>{props.note}</small>
      </article>
    )
  }

  if (type === 'pricing-card') {
    return (
      <article key={block.id} className="preview-pricing-card">
        <h3>{props.plan}</h3>
        <p className="preview-pricing-line">
          <strong>{props.price}</strong>
          <span>{props.period}</span>
        </p>
        <ul>
          {toList(props.features).map((feature, index) => (
            <li key={`${feature}-${index}`}>{feature}</li>
          ))}
        </ul>
        <button type="button">{props.cta}</button>
      </article>
    )
  }

  if (type === 'feature-list') {
    return (
      <ul key={block.id} className="preview-feature-list">
        {toList(props.items).map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    )
  }

  if (type === 'countdown') {
    const days = clampNumber(props.days, 0, 365, 0)
    const hours = clampNumber(props.hours, 0, 23, 0)
    const minutes = clampNumber(props.minutes, 0, 59, 0)

    return (
      <div key={block.id} className="preview-countdown">
        <p>{props.label}</p>
        <div>
          <span>
            <strong>{days}</strong>
            <small>dnu</small>
          </span>
          <span>
            <strong>{hours}</strong>
            <small>hod</small>
          </span>
          <span>
            <strong>{minutes}</strong>
            <small>min</small>
          </span>
        </div>
      </div>
    )
  }

  if (type === 'limited-offer') {
    return (
      <article key={block.id} className="preview-offer">
        <div>
          <h3>{props.title}</h3>
          <p>{props.subtitle}</p>
        </div>
        <code>{props.code}</code>
        <button type="button">{props.cta}</button>
      </article>
    )
  }

  if (type === 'cookie-popup') {
    const closed = Boolean(getStateValue('closed', false))
    if (closed) return null

    return (
      <aside key={block.id} className="preview-cookie-popup" role="dialog" aria-label="Cookie consent">
        <h4>{props.title}</h4>
        <p>{props.text}</p>
        <div>
          <button type="button" onClick={() => onStateChange({ closed: true })}>
            {props.reject}
          </button>
          <button type="button" className="is-primary" onClick={() => onStateChange({ closed: true, accepted: true })}>
            {props.accept}
          </button>
        </div>
      </aside>
    )
  }

  if (type === 'footer') {
    return (
      <footer key={block.id} className="preview-footer">
        <strong>{props.brand}</strong>
        <p>{props.note}</p>
        <div>
          {toList(props.links).map((link, index) => (
            <a href="#" key={`${link}-${index}`}>
              {link}
            </a>
          ))}
        </div>
      </footer>
    )
  }

  return null
}

function renderEditorFields(block, onChange) {
  const { type, props } = block

  if (type === 'header') {
    return (
      <>
        <input type="text" value={props.brand} onChange={(event) => onChange('brand', event.target.value)} placeholder="Brand" />
        <input type="text" value={props.links} onChange={(event) => onChange('links', event.target.value)} placeholder="Link1, Link2" />
        <input type="text" value={props.cta} onChange={(event) => onChange('cta', event.target.value)} placeholder="CTA" />
      </>
    )
  }

  if (type === 'heading' || type === 'subheading' || type === 'text' || type === 'alert') {
    return <textarea value={props.text} onChange={(event) => onChange('text', event.target.value)} rows={type === 'text' ? 4 : 2} />
  }

  if (type === 'image') {
    return (
      <>
        <input type="text" value={props.src} onChange={(event) => onChange('src', event.target.value)} placeholder="Image URL" />
        <input type="text" value={props.alt} onChange={(event) => onChange('alt', event.target.value)} placeholder="Alt text" />
      </>
    )
  }

  if (type === 'video') {
    return (
      <>
        <input type="text" value={props.url} onChange={(event) => onChange('url', event.target.value)} placeholder="Embed URL" />
        <input type="text" value={props.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Video title" />
      </>
    )
  }

  if (type === 'button') {
    return (
      <>
        <input type="text" value={props.text} onChange={(event) => onChange('text', event.target.value)} placeholder="Button label" />
        <input type="text" value={props.href} onChange={(event) => onChange('href', event.target.value)} placeholder="Button href" />
      </>
    )
  }

  if (type === 'button-group' || type === 'carousel' || type === 'chart') {
    const propName = type === 'carousel' ? 'images' : type === 'chart' ? 'values' : 'items'
    return <input type="text" value={props[propName]} onChange={(event) => onChange(propName, event.target.value)} placeholder="Polozka1, Polozka2" />
  }

  if (type === 'accordion' || type === 'collapsible') {
    return (
      <>
        <input type="text" value={props.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Title" />
        <textarea value={props.content} onChange={(event) => onChange('content', event.target.value)} rows={3} />
        <label className="tiny-check">
          <input type="checkbox" checked={props.open} onChange={(event) => onChange('open', event.target.checked)} />
          <span>Open by default</span>
        </label>
      </>
    )
  }

  if (type === 'card') {
    return (
      <>
        <input type="text" value={props.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Title" />
        <textarea value={props.content} onChange={(event) => onChange('content', event.target.value)} rows={3} />
      </>
    )
  }

  if (type === 'badge') {
    return <input type="text" value={props.text} onChange={(event) => onChange('text', event.target.value)} placeholder="Badge text" />
  }

  if (type === 'avatar') {
    return (
      <>
        <input type="text" value={props.name} onChange={(event) => onChange('name', event.target.value)} placeholder="Name" />
        <input type="text" value={props.src} onChange={(event) => onChange('src', event.target.value)} placeholder="Avatar URL" />
      </>
    )
  }

  if (type === 'checkbox') {
    return (
      <>
        <input type="text" value={props.label} onChange={(event) => onChange('label', event.target.value)} placeholder="Label" />
        <label className="tiny-check">
          <input type="checkbox" checked={props.checked} onChange={(event) => onChange('checked', event.target.checked)} />
          <span>Checked</span>
        </label>
      </>
    )
  }

  if (type === 'input' || type === 'textarea') {
    return (
      <>
        <input type="text" value={props.label} onChange={(event) => onChange('label', event.target.value)} placeholder="Field label" />
        <input type="text" value={props.placeholder} onChange={(event) => onChange('placeholder', event.target.value)} placeholder="Placeholder" />
      </>
    )
  }

  if (type === 'select') {
    return (
      <>
        <input type="text" value={props.label} onChange={(event) => onChange('label', event.target.value)} placeholder="Field label" />
        <input type="text" value={props.options} onChange={(event) => onChange('options', event.target.value)} placeholder="A, B, C" />
      </>
    )
  }

  if (type === 'radio-group') {
    return (
      <>
        <input type="text" value={props.label} onChange={(event) => onChange('label', event.target.value)} placeholder="Label" />
        <input type="text" value={props.options} onChange={(event) => onChange('options', event.target.value)} placeholder="A, B, C" />
        <input type="text" value={props.selected} onChange={(event) => onChange('selected', event.target.value)} placeholder="Selected" />
      </>
    )
  }

  if (type === 'progress') {
    return (
      <>
        <input type="text" value={props.label} onChange={(event) => onChange('label', event.target.value)} placeholder="Progress label" />
        <input type="number" min="0" max="100" value={props.value} onChange={(event) => onChange('value', event.target.value)} />
      </>
    )
  }

  if (type === 'separator') {
    return <input type="text" value={props.text} onChange={(event) => onChange('text', event.target.value)} placeholder="Separator label" />
  }

  if (type === 'aspect-ratio') {
    return (
      <>
        <input type="text" value={props.ratio} onChange={(event) => onChange('ratio', event.target.value)} placeholder="16/9 or 1/1" />
        <input type="text" value={props.src} onChange={(event) => onChange('src', event.target.value)} placeholder="Image URL" />
      </>
    )
  }

  if (type === 'quote') {
    return (
      <>
        <textarea value={props.text} onChange={(event) => onChange('text', event.target.value)} rows={3} />
        <input type="text" value={props.author} onChange={(event) => onChange('author', event.target.value)} placeholder="Autor" />
      </>
    )
  }

  if (type === 'logo-row' || type === 'feature-list') {
    return <input type="text" value={props.items} onChange={(event) => onChange('items', event.target.value)} placeholder="Polozka1, Polozka2" />
  }

  if (type === 'kpi') {
    return (
      <>
        <input type="text" value={props.value} onChange={(event) => onChange('value', event.target.value)} placeholder="Hodnota" />
        <input type="text" value={props.label} onChange={(event) => onChange('label', event.target.value)} placeholder="Popis" />
        <input type="text" value={props.note} onChange={(event) => onChange('note', event.target.value)} placeholder="Doplnek" />
      </>
    )
  }

  if (type === 'pricing-card') {
    return (
      <>
        <input type="text" value={props.plan} onChange={(event) => onChange('plan', event.target.value)} placeholder="Nazev planu" />
        <input type="text" value={props.price} onChange={(event) => onChange('price', event.target.value)} placeholder="Cena" />
        <input type="text" value={props.period} onChange={(event) => onChange('period', event.target.value)} placeholder="Perioda" />
        <input type="text" value={props.features} onChange={(event) => onChange('features', event.target.value)} placeholder="Feature1, Feature2" />
        <input type="text" value={props.cta} onChange={(event) => onChange('cta', event.target.value)} placeholder="CTA label" />
      </>
    )
  }

  if (type === 'countdown') {
    return (
      <>
        <input type="text" value={props.label} onChange={(event) => onChange('label', event.target.value)} placeholder="Label" />
        <input type="number" min="0" max="365" value={props.days} onChange={(event) => onChange('days', event.target.value)} />
        <input type="number" min="0" max="23" value={props.hours} onChange={(event) => onChange('hours', event.target.value)} />
        <input type="number" min="0" max="59" value={props.minutes} onChange={(event) => onChange('minutes', event.target.value)} />
      </>
    )
  }

  if (type === 'limited-offer') {
    return (
      <>
        <input type="text" value={props.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Nadpis nabidky" />
        <input type="text" value={props.subtitle} onChange={(event) => onChange('subtitle', event.target.value)} placeholder="Podtext" />
        <input type="text" value={props.code} onChange={(event) => onChange('code', event.target.value)} placeholder="Slevovy kod" />
        <input type="text" value={props.cta} onChange={(event) => onChange('cta', event.target.value)} placeholder="CTA" />
      </>
    )
  }

  if (type === 'cookie-popup') {
    return (
      <>
        <input type="text" value={props.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Nadpis" />
        <textarea value={props.text} onChange={(event) => onChange('text', event.target.value)} rows={3} />
        <input type="text" value={props.accept} onChange={(event) => onChange('accept', event.target.value)} placeholder="Accept label" />
        <input type="text" value={props.reject} onChange={(event) => onChange('reject', event.target.value)} placeholder="Reject label" />
      </>
    )
  }

  if (type === 'footer') {
    return (
      <>
        <input type="text" value={props.brand} onChange={(event) => onChange('brand', event.target.value)} placeholder="Brand" />
        <textarea value={props.note} onChange={(event) => onChange('note', event.target.value)} rows={2} />
        <input type="text" value={props.links} onChange={(event) => onChange('links', event.target.value)} placeholder="Link1, Link2" />
      </>
    )
  }

  return null
}

export default function App() {
  const [blocks, setBlocks] = useState([createBlock('heading', 0), createBlock('text', 1), createBlock('button', 2)])
  const [backgroundId, setBackgroundId] = useState('clean')
  const [componentQuery, setComponentQuery] = useState('')
  const [previewState, setPreviewState] = useState({})
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const [componentStyles, setComponentStyles] = useState({})
  const [copiedComponentStyle, setCopiedComponentStyle] = useState(null)
  const [customBackground, setCustomBackground] = useState('#ffffff')
  const [appearance, setAppearance] = useState({
    textColor: '#1f2937',
    headingColor: '#0f172a',
    accentColor: '#2563eb',
    cardBg: '#ffffff',
    borderColor: '#cbd5e1',
    radius: 12,
    gap: 14,
    buttonRadius: 10,
    canvasWidth: 920,
  })

  const hasBlocks = blocks.length > 0
  const selectedBlock = blocks.find((block) => block.id === selectedBlockId) ?? null
  const selectedComponent = selectedBlock
    ? COMPONENT_LIBRARY.find((item) => item.type === selectedBlock.type)
    : null
  const selectedStyle = withDefaultComponentStyle(
    selectedBlock ? componentStyles[selectedBlock.id] : null,
  )

  const blockCountLabel = useMemo(() => {
    const count = blocks.length
    if (count === 1) return '1 blok'
    if (count > 1 && count < 5) return `${count} bloky`
    return `${count} bloku`
  }, [blocks])

  const filteredComponents = useMemo(() => {
    const query = componentQuery.trim().toLowerCase()
    if (!query) return COMPONENT_LIBRARY

    return COMPONENT_LIBRARY.filter((component) => {
      const target = `${component.label} ${component.category}`.toLowerCase()
      return target.includes(query)
    })
  }, [componentQuery])

  function addBlock(type) {
    let createdBlock = null
    setBlocks((prev) => {
      createdBlock = createBlock(type, prev.length)
      return [...prev, createdBlock]
    })

    if (createdBlock) {
      setSelectedBlockId(createdBlock.id)
    }
  }

  function addPremadeSection(sectionId) {
    const section = PREMADE_SECTIONS.find((item) => item.id === sectionId)
    if (!section) return

    let firstCreatedId = null

    setBlocks((prev) => {
      const offset = prev.length
      const nextBlocks = section.blocks.map((template, index) =>
        createBlockFromTemplate(template, offset + index),
      )

      firstCreatedId = nextBlocks[0]?.id ?? null

      return [...prev, ...nextBlocks]
    })

    if (firstCreatedId) {
      setSelectedBlockId(firstCreatedId)
    }
  }

  function updateBlockProp(id, propName, value) {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id
          ? { ...block, props: { ...block.props, [propName]: value } }
          : block,
      ),
    )
  }

  function removeBlock(id) {
    setBlocks((prev) => prev.filter((block) => block.id !== id))
    setPreviewState((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })

    setComponentStyles((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })

    setSelectedBlockId((prevSelected) => (prevSelected === id ? null : prevSelected))
  }

  function updatePreviewState(id, patch) {
    setPreviewState((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] ?? {}),
        ...patch,
      },
    }))
  }

  function updateAppearance(name, value) {
    setAppearance((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function updateSelectedComponentStyle(name, value) {
    if (!selectedBlockId) return

    setComponentStyles((prev) => ({
      ...prev,
      [selectedBlockId]: {
        ...withDefaultComponentStyle(prev[selectedBlockId]),
        [name]: value,
      },
    }))
  }

  function resetSelectedComponentStyle() {
    if (!selectedBlockId) return

    setComponentStyles((prev) => {
      const next = { ...prev }
      delete next[selectedBlockId]
      return next
    })
  }

  function copySelectedComponentStyle() {
    if (!selectedBlockId) return
    setCopiedComponentStyle(withDefaultComponentStyle(componentStyles[selectedBlockId]))
  }

  function pasteToSelectedComponentStyle() {
    if (!selectedBlockId || !copiedComponentStyle) return

    setComponentStyles((prev) => ({
      ...prev,
      [selectedBlockId]: {
        ...withDefaultComponentStyle(prev[selectedBlockId]),
        ...copiedComponentStyle,
      },
    }))
  }

  function applyStylePresetToSelected(presetKey) {
    if (!selectedBlockId) return
    const preset = COMPONENT_STYLE_PRESETS[presetKey]
    if (!preset) return

    setComponentStyles((prev) => ({
      ...prev,
      [selectedBlockId]: {
        ...withDefaultComponentStyle(prev[selectedBlockId]),
        ...preset,
      },
    }))
  }

  function getComponentStyle(id) {
    const style = withDefaultComponentStyle(componentStyles[id])

    return {
      '--component-text-color': style.textColor,
      '--component-bg-color': style.backgroundColor,
      '--component-border-color': style.borderColor,
      '--component-hover-color': style.hoverColor,
      '--component-font-size': `${style.fontSize}px`,
      '--component-font-weight': style.fontWeight,
      '--component-line-height': style.lineHeight,
      '--component-letter-spacing': `${style.letterSpacing}px`,
      '--component-padding': `${style.padding}px`,
      '--component-radius': `${style.radius}px`,
      '--component-opacity': style.opacity / 100,
      '--component-hover-scale': style.hoverScale,
      '--component-font-family': style.fontFamily,
    }
  }

  function getComponentWrapperClass(id) {
    const style = withDefaultComponentStyle(componentStyles[id])
    const classes = ['preview-component']

    if (id === selectedBlockId) {
      classes.push('is-selected')
    }

    if (style.hoverShadow) {
      classes.push('has-hover-shadow')
    }

    if (style.animation !== 'none') {
      classes.push(`anim-${style.animation}`)
    }

    return classes.join(' ')
  }

  const previewStyle = {
    '--preview-text': appearance.textColor,
    '--preview-heading': appearance.headingColor,
    '--preview-accent': appearance.accentColor,
    '--preview-card-bg': appearance.cardBg,
    '--preview-border': appearance.borderColor,
    '--preview-radius': `${appearance.radius}px`,
    '--preview-gap': `${appearance.gap}px`,
    '--preview-button-radius': `${appearance.buttonRadius}px`,
    '--preview-canvas-width': `${appearance.canvasWidth}px`,
    '--preview-custom-bg': customBackground,
  }

  return (
    <div className="editor-layout">
      <aside className="editor-panel">
        <h1>Live Editor</h1>
        <p className="panel-muted">Toolbox je pro landing page (bez menu/tabs/breadcrumbs).</p>

        <div className="editor-meta">{blockCountLabel}</div>

        <div>
          <p className="panel-muted">Pozadi preview</p>
          <div className="tool-row">
            {BACKGROUND_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={option.id === backgroundId ? 'is-selected-bg' : undefined}
                onClick={() => setBackgroundId(option.id)}
              >
                {option.label}
              </button>
            ))}
            <button
              type="button"
              className={backgroundId === 'custom' ? 'is-selected-bg' : undefined}
              onClick={() => setBackgroundId('custom')}
            >
              Custom
            </button>
          </div>
          {backgroundId === 'custom' && (
            <div className="custom-inline-control">
              <label htmlFor="custom-bg-input">Custom pozadi</label>
              <input
                id="custom-bg-input"
                type="color"
                value={customBackground}
                onChange={(event) => setCustomBackground(event.target.value)}
              />
            </div>
          )}
        </div>

        <div className="custom-style-panel">
          <p className="panel-muted">Custom upravy (barvicky + komponenty)</p>

          <div className="custom-grid">
            <label>
              Text
              <input
                type="color"
                value={appearance.textColor}
                onChange={(event) => updateAppearance('textColor', event.target.value)}
              />
            </label>
            <label>
              Heading
              <input
                type="color"
                value={appearance.headingColor}
                onChange={(event) => updateAppearance('headingColor', event.target.value)}
              />
            </label>
            <label>
              Accent
              <input
                type="color"
                value={appearance.accentColor}
                onChange={(event) => updateAppearance('accentColor', event.target.value)}
              />
            </label>
            <label>
              Card BG
              <input
                type="color"
                value={appearance.cardBg}
                onChange={(event) => updateAppearance('cardBg', event.target.value)}
              />
            </label>
            <label>
              Border
              <input
                type="color"
                value={appearance.borderColor}
                onChange={(event) => updateAppearance('borderColor', event.target.value)}
              />
            </label>
          </div>

          <div className="custom-range-list">
            <label>
              Radius: {appearance.radius}px
              <input
                type="range"
                min="4"
                max="30"
                value={appearance.radius}
                onChange={(event) => updateAppearance('radius', Number(event.target.value))}
              />
            </label>
            <label>
              Mezery: {appearance.gap}px
              <input
                type="range"
                min="8"
                max="28"
                value={appearance.gap}
                onChange={(event) => updateAppearance('gap', Number(event.target.value))}
              />
            </label>
            <label>
              Radius tlacitek: {appearance.buttonRadius}px
              <input
                type="range"
                min="4"
                max="24"
                value={appearance.buttonRadius}
                onChange={(event) => updateAppearance('buttonRadius', Number(event.target.value))}
              />
            </label>
            <label>
              Sirka canvasu: {appearance.canvasWidth}px
              <input
                type="range"
                min="680"
                max="1200"
                step="10"
                value={appearance.canvasWidth}
                onChange={(event) => updateAppearance('canvasWidth', Number(event.target.value))}
              />
            </label>
          </div>
        </div>

        <div className="component-picker">
          <p className="panel-muted">Pridat komponentu</p>
          <input
            type="text"
            value={componentQuery}
            onChange={(event) => setComponentQuery(event.target.value)}
            placeholder="Hledej: card, image, input..."
          />
          <div className="component-list">
            {filteredComponents.map((component) => (
              <button
                key={component.type}
                type="button"
                className="component-item"
                onClick={() => addBlock(component.type)}
              >
                <span>{component.label}</span>
                <small>{component.category}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="premade-picker">
          <p className="panel-muted">Premade bloky</p>
          <div className="premade-list">
            {PREMADE_SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                className="premade-item"
                onClick={() => addPremadeSection(section.id)}
              >
                <strong>{section.label}</strong>
                <small>{section.description}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="block-list">
          {hasBlocks ? (
            blocks.map((block, index) => {
              const component = COMPONENT_LIBRARY.find((item) => item.type === block.type)

              return (
                <section
                  className={`block-editor ${block.id === selectedBlockId ? 'is-selected' : ''}`}
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                >
                  <div className="block-editor-head">
                    <strong>
                      {index + 1}. {component?.label ?? block.type}
                    </strong>
                    <button type="button" className="ghost-danger" onClick={() => removeBlock(block.id)}>
                      Smazat
                    </button>
                  </div>
                  <div className="block-fields">
                    {renderEditorFields(block, (propName, value) => updateBlockProp(block.id, propName, value))}
                  </div>
                </section>
              )
            })
          ) : (
            <p className="panel-muted">Zatim tu nic neni. Pridat prvni blok.</p>
          )}
        </div>
      </aside>

      <section className="preview-shell">
        <div className={`preview-canvas preview-bg-${backgroundId}`} style={previewStyle}>
          {hasBlocks ? (
            blocks.map((block) => {
              const component = COMPONENT_LIBRARY.find((item) => item.type === block.type)

              return (
                <div
                  key={block.id}
                  className={getComponentWrapperClass(block.id)}
                  style={getComponentStyle(block.id)}
                  onClick={() => setSelectedBlockId(block.id)}
                >
                  <div className="preview-component-label">{component?.label ?? block.type}</div>
                  <div className="preview-component-body">
                    {renderPreviewBlock(block, previewState[block.id], (patch) =>
                      updatePreviewState(block.id, patch),
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <p className="preview-empty">Preview je prazdny.</p>
          )}
        </div>

        <aside className="inspector-panel">
          <h2>Inspector</h2>
          {selectedBlock ? (
            <>
              <p className="panel-muted">
                Upravy pro: <strong>{selectedComponent?.label ?? selectedBlock.type}</strong>
              </p>

              <div className="inspector-actions">
                <button type="button" onClick={resetSelectedComponentStyle}>
                  Reset stylu
                </button>
                <button type="button" onClick={copySelectedComponentStyle}>
                  Copy styl
                </button>
                <button
                  type="button"
                  disabled={!copiedComponentStyle}
                  onClick={pasteToSelectedComponentStyle}
                >
                  Paste styl
                </button>
              </div>

              <div className="inspector-presets">
                <button type="button" onClick={() => applyStylePresetToSelected('modern')}>
                  Modern
                </button>
                <button type="button" onClick={() => applyStylePresetToSelected('bold')}>
                  Bold
                </button>
                <button type="button" onClick={() => applyStylePresetToSelected('minimal')}>
                  Minimal
                </button>
              </div>

              <div className="inspector-group">
                <label>
                  Font family
                  <select
                    value={selectedStyle.fontFamily}
                    onChange={(event) =>
                      updateSelectedComponentStyle('fontFamily', event.target.value)
                    }
                  >
                    <option value="inherit">Default</option>
                    <option value="Georgia, serif">Serif</option>
                    <option value="'Trebuchet MS', sans-serif">Trebuchet</option>
                    <option value="'Courier New', monospace">Monospace</option>
                    <option value="'Segoe UI', sans-serif">Segoe UI</option>
                  </select>
                </label>

                <label>
                  Velikost pismene: {selectedStyle.fontSize}px
                  <input
                    type="range"
                    min="12"
                    max="52"
                    value={selectedStyle.fontSize}
                    onChange={(event) =>
                      updateSelectedComponentStyle('fontSize', Number(event.target.value))
                    }
                  />
                </label>

                <label>
                  Font weight: {selectedStyle.fontWeight}
                  <input
                    type="range"
                    min="300"
                    max="800"
                    step="100"
                    value={selectedStyle.fontWeight}
                    onChange={(event) =>
                      updateSelectedComponentStyle('fontWeight', Number(event.target.value))
                    }
                  />
                </label>

                <label>
                  Line height: {selectedStyle.lineHeight}
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.05"
                    value={selectedStyle.lineHeight}
                    onChange={(event) =>
                      updateSelectedComponentStyle('lineHeight', Number(event.target.value))
                    }
                  />
                </label>

                <label>
                  Letter spacing: {selectedStyle.letterSpacing}px
                  <input
                    type="range"
                    min="-1"
                    max="8"
                    step="0.5"
                    value={selectedStyle.letterSpacing}
                    onChange={(event) =>
                      updateSelectedComponentStyle('letterSpacing', Number(event.target.value))
                    }
                  />
                </label>
              </div>

              <div className="inspector-group inspector-colors">
                <label>
                  Text
                  <input
                    type="color"
                    value={selectedStyle.textColor}
                    onChange={(event) =>
                      updateSelectedComponentStyle('textColor', event.target.value)
                    }
                  />
                </label>
                <label>
                  Background
                  <input
                    type="color"
                    value={selectedStyle.backgroundColor}
                    onChange={(event) =>
                      updateSelectedComponentStyle('backgroundColor', event.target.value)
                    }
                  />
                </label>
                <label>
                  Border
                  <input
                    type="color"
                    value={selectedStyle.borderColor}
                    onChange={(event) =>
                      updateSelectedComponentStyle('borderColor', event.target.value)
                    }
                  />
                </label>
                <label>
                  Hover
                  <input
                    type="color"
                    value={selectedStyle.hoverColor}
                    onChange={(event) =>
                      updateSelectedComponentStyle('hoverColor', event.target.value)
                    }
                  />
                </label>
              </div>

              <div className="inspector-group">
                <label>
                  Padding: {selectedStyle.padding}px
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={selectedStyle.padding}
                    onChange={(event) =>
                      updateSelectedComponentStyle('padding', Number(event.target.value))
                    }
                  />
                </label>
                <label>
                  Radius: {selectedStyle.radius}px
                  <input
                    type="range"
                    min="0"
                    max="28"
                    value={selectedStyle.radius}
                    onChange={(event) =>
                      updateSelectedComponentStyle('radius', Number(event.target.value))
                    }
                  />
                </label>
                <label>
                  Opacity: {selectedStyle.opacity}%
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={selectedStyle.opacity}
                    onChange={(event) =>
                      updateSelectedComponentStyle('opacity', Number(event.target.value))
                    }
                  />
                </label>
              </div>

              <div className="inspector-group">
                <label>
                  Hover scale: {selectedStyle.hoverScale.toFixed(2)}
                  <input
                    type="range"
                    min="1"
                    max="1.15"
                    step="0.01"
                    value={selectedStyle.hoverScale}
                    onChange={(event) =>
                      updateSelectedComponentStyle('hoverScale', Number(event.target.value))
                    }
                  />
                </label>

                <label className="tiny-check">
                  <input
                    type="checkbox"
                    checked={selectedStyle.hoverShadow}
                    onChange={(event) =>
                      updateSelectedComponentStyle('hoverShadow', event.target.checked)
                    }
                  />
                  <span>Hover shadow</span>
                </label>

                <label>
                  Animace
                  <select
                    value={selectedStyle.animation}
                    onChange={(event) =>
                      updateSelectedComponentStyle('animation', event.target.value)
                    }
                  >
                    <option value="none">None</option>
                    <option value="float">Float</option>
                    <option value="pulse">Pulse</option>
                    <option value="fade">Fade In</option>
                  </select>
                </label>
              </div>
            </>
          ) : (
            <p className="panel-muted">Vyber komponentu v seznamu nebo klikni na blok v preview.</p>
          )}
        </aside>
      </section>
    </div>
  )
}
