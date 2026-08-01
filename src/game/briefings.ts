/** Academy intel briefings — specific facts, not capital/flag trivia templates. */

import { getLocale } from '../i18n/locale'
import { BRIEFING_BANK_DISPUTED } from './briefingBankDisputed'
import { BRIEFING_BANK_MORE } from './briefingBankMore'
import type { Country } from './countries'

export type BriefingQuestion = {
  prompt: string
  choices: [string, string, string]
  correct: 0 | 1 | 2
}

export const BRIEFING_CORRECT_PTS = 150
export const BRIEFING_WRONG_PTS = -75
/** Fire a briefing after every N completed exams. */
export const BRIEFING_EVERY = 3

export const BRIEFING_BANK: Record<string, BriefingQuestion[]> = {
  USA: [
    {
      prompt: 'Which canyon system cuts through northern Arizona?',
      choices: ['Grand Canyon', 'Yosemite Valley', 'Death Valley'],
      correct: 0,
    },
    {
      prompt: 'Jazz took root in which Gulf Coast city?',
      choices: ['New Orleans', 'Miami', 'Houston'],
      correct: 0,
    },
    {
      prompt: 'About how many states make up the United States?',
      choices: ['50', '52', '48'],
      correct: 0,
    },
    {
      prompt: 'Which mountain range runs along the eastern U.S.?',
      choices: ['Appalachians', 'Cascades', 'Andes'],
      correct: 0,
    },
  ],
  GBR: [
    {
      prompt: 'Which river runs through London?',
      choices: ['Thames', 'Seine', 'Rhine'],
      correct: 0,
    },
    {
      prompt: 'Scotland, Wales, Northern Ireland, and England form…',
      choices: ['the United Kingdom', 'Great Britain only', 'the Commonwealth'],
      correct: 0,
    },
    {
      prompt: 'Which stone circle sits on Salisbury Plain?',
      choices: ['Stonehenge', 'Carnac', 'Newgrange'],
      correct: 0,
    },
    {
      prompt: 'Afternoon tea culture is most associated with…',
      choices: ['Britain', 'Belgium', 'Austria'],
      correct: 0,
    },
  ],
  FRA: [
    {
      prompt: 'Which river runs through Paris?',
      choices: ['Seine', 'Loire', 'Rhône'],
      correct: 0,
    },
    {
      prompt: 'Bastille Day falls on which date?',
      choices: ['14 July', '4 July', '1 May'],
      correct: 0,
    },
    {
      prompt: 'Champagne can legally come only from…',
      choices: ['a region in northeast France', 'any French vineyard', 'Belgium'],
      correct: 0,
    },
    {
      prompt: 'Which mountain range separates France from Spain?',
      choices: ['Pyrenees', 'Alps', 'Carpathians'],
      correct: 0,
    },
  ],
  DEU: [
    {
      prompt: 'Which river is Germany’s busiest inland waterway?',
      choices: ['Rhine', 'Danube', 'Elbe'],
      correct: 0,
    },
    {
      prompt: 'Oktoberfest is hosted in which city?',
      choices: ['Munich', 'Berlin', 'Hamburg'],
      correct: 0,
    },
    {
      prompt: 'Germany’s reunification year was…',
      choices: ['1990', '1989', '1991'],
      correct: 0,
    },
    {
      prompt: 'The Black Forest is famous for…',
      choices: ['dense fir woods & cuckoo clocks', 'active volcanoes', 'coral reefs'],
      correct: 0,
    },
  ],
  JPN: [
    {
      prompt: 'What is Japan’s highest peak?',
      choices: ['Mount Fuji', 'Mount Kita', 'Mount Everest'],
      correct: 0,
    },
    {
      prompt: 'Sushi began as a way to…',
      choices: ['preserve fish with fermented rice', 'grill whale meat', 'serve only tuna'],
      correct: 0,
    },
    {
      prompt: 'Japan is an archipelago of roughly how many islands?',
      choices: ['over 6,000', 'about 50', 'exactly 4'],
      correct: 0,
    },
    {
      prompt: 'Which bullet-train network links major Japanese cities?',
      choices: ['Shinkansen', 'TGV', 'ICE'],
      correct: 0,
    },
  ],
  CHN: [
    {
      prompt: 'The Yangtze is notable as…',
      choices: ['Asia’s longest river', 'Europe’s deepest lake', 'Africa’s widest delta'],
      correct: 0,
    },
    {
      prompt: 'Which wall’s best-known sections date mostly to the Ming era?',
      choices: ['Great Wall of China', 'Hadrian’s Wall', 'Berlin Wall'],
      correct: 0,
    },
    {
      prompt: 'China’s population is roughly…',
      choices: ['over 1.4 billion', 'under 500 million', 'about 80 million'],
      correct: 0,
    },
    {
      prompt: 'Which desert sits mainly in northern China / southern Mongolia?',
      choices: ['Gobi', 'Sahara', 'Atacama'],
      correct: 0,
    },
  ],
  RUS: [
    {
      prompt: 'Which mountain range is often treated as Europe–Asia’s divide?',
      choices: ['Urals', 'Alps', 'Andes'],
      correct: 0,
    },
    {
      prompt: 'Lake Baikal is famous for being…',
      choices: ['the world’s deepest freshwater lake', 'saltier than the Dead Sea', 'entirely artificial'],
      correct: 0,
    },
    {
      prompt: 'Russia spans how many time zones?',
      choices: ['11', '3', '24'],
      correct: 0,
    },
    {
      prompt: 'Which ballet company is based in Moscow?',
      choices: ['Bolshoi', 'La Scala', 'Paris Opera Ballet'],
      correct: 0,
    },
  ],
  IND: [
    {
      prompt: 'Which river is sacred in Hindu tradition and flows past Varanasi?',
      choices: ['Ganges', 'Indus', 'Mekong'],
      correct: 0,
    },
    {
      prompt: 'India’s festival of colors is…',
      choices: ['Holi', 'Diwali', 'Eid'],
      correct: 0,
    },
    {
      prompt: 'The Himalayas form India’s border mainly with…',
      choices: ['China / Nepal / Bhutan', 'Iran', 'Australia'],
      correct: 0,
    },
    {
      prompt: 'About how many official scheduled languages does India recognize?',
      choices: ['22', '2', '50'],
      correct: 0,
    },
  ],
  BRA: [
    {
      prompt: 'Which river system dominates northern Brazil?',
      choices: ['Amazon', 'Paraná', 'Nile'],
      correct: 0,
    },
    {
      prompt: 'Carnival in Rio is best known for…',
      choices: ['samba schools & street parades', 'silent meditation retreats', 'ski competitions'],
      correct: 0,
    },
    {
      prompt: 'Brazil is the world’s largest producer of…',
      choices: ['coffee', 'olive oil', 'maple syrup'],
      correct: 0,
    },
    {
      prompt: 'Brasília was built in the interior mainly to…',
      choices: ['shift the capital inland from the coast', 'host the Olympics forever', 'replace São Paulo'],
      correct: 0,
    },
  ],
  AUS: [
    {
      prompt: 'Uluru is…',
      choices: ['a massive sandstone monolith in the Red Centre', 'Australia’s tallest skyscraper', 'a coral atoll'],
      correct: 0,
    },
    {
      prompt: 'The Great Barrier Reef lies off which coast?',
      choices: ['Queensland', 'Western Australia', 'Tasmania'],
      correct: 0,
    },
    {
      prompt: 'Which animal is both a national symbol and a marsupial?',
      choices: ['kangaroo', 'emu only', 'dingo'],
      correct: 0,
    },
    {
      prompt: 'Australia’s seasons are flipped vs Europe because it is in the…',
      choices: ['Southern Hemisphere', 'Arctic Circle', 'tropics only'],
      correct: 0,
    },
  ],
  CAN: [
    {
      prompt: 'Which bay freezes enough for a famous winter ice road culture up north?',
      choices: ['Hudson Bay region', 'Bay of Biscay', 'Tokyo Bay'],
      correct: 0,
    },
    {
      prompt: 'Canada has two official federal languages:',
      choices: ['English and French', 'English and Spanish', 'French and German'],
      correct: 0,
    },
    {
      prompt: 'Niagara Falls sits on the border of…',
      choices: ['Ontario and New York', 'Alaska and Yukon', 'Quebec and Maine'],
      correct: 0,
    },
    {
      prompt: 'Maple syrup production is culturally tied especially to…',
      choices: ['Quebec', 'Nunavut', 'British Columbia only'],
      correct: 0,
    },
  ],
  MEX: [
    {
      prompt: 'Day of the Dead (Día de Muertos) traditionally honors…',
      choices: ['deceased family with ofrendas', 'independence from Spain only', 'the spring equinox'],
      correct: 0,
    },
    {
      prompt: 'Which ancient city near Mexico City has the Pyramid of the Sun?',
      choices: ['Teotihuacan', 'Machu Picchu', 'Chichen only'],
      correct: 0,
    },
    {
      prompt: 'Mexico’s longest shared land border is with…',
      choices: ['the United States', 'Guatemala', 'Belize'],
      correct: 0,
    },
    {
      prompt: 'Corn (maize) was first domesticated in the region of…',
      choices: ['Mesoamerica', 'Scandinavia', 'Siberia'],
      correct: 0,
    },
  ],
  ITA: [
    {
      prompt: 'Which volcano looms over the Bay of Naples?',
      choices: ['Vesuvius', 'Etna only', 'Stromboli only'],
      correct: 0,
    },
    {
      prompt: 'Pasta shapes numbering in the hundreds are a hallmark of…',
      choices: ['Italian regional cooking', 'Swiss alpine stews', 'Dutch street food'],
      correct: 0,
    },
    {
      prompt: 'The Colosseum stands in…',
      choices: ['Rome', 'Milan', 'Venice'],
      correct: 0,
    },
    {
      prompt: 'Italy is a peninsula jutting into which sea?',
      choices: ['Mediterranean', 'Baltic', 'Caribbean'],
      correct: 0,
    },
  ],
  ESP: [
    {
      prompt: 'La Tomatina is a festival famous for…',
      choices: ['a giant tomato fight', 'running with bulls only', 'silent book fairs'],
      correct: 0,
    },
    {
      prompt: 'Which mountain range forms a wall between Spain and France?',
      choices: ['Pyrenees', 'Apennines', 'Atlas'],
      correct: 0,
    },
    {
      prompt: 'Flamenco music and dance grew mainly in…',
      choices: ['Andalusia', 'Galicia only', 'the Canary Islands only'],
      correct: 0,
    },
    {
      prompt: 'Spain shares the Iberian Peninsula with…',
      choices: ['Portugal', 'Italy', 'Greece'],
      correct: 0,
    },
  ],
  KOR: [
    {
      prompt: 'Kimchi is traditionally…',
      choices: ['fermented seasoned vegetables', 'grilled beef only', 'a rice dessert'],
      correct: 0,
    },
    {
      prompt: 'South Korea sits on which kind of landform?',
      choices: ['a peninsula', 'an archipelago of 4 main islands', 'a landlocked plateau'],
      correct: 0,
    },
    {
      prompt: 'Hangul is…',
      choices: ['the Korean alphabet', 'a martial art', 'a mountain range'],
      correct: 0,
    },
    {
      prompt: 'Which parallel roughly divides the Korean Peninsula?',
      choices: ['38th', '49th', 'Equator'],
      correct: 0,
    },
  ],
  EGY: [
    {
      prompt: 'Which river made Egyptian civilization possible?',
      choices: ['Nile', 'Tigris', 'Congo'],
      correct: 0,
    },
    {
      prompt: 'The Great Pyramid stands on the plateau of…',
      choices: ['Giza', 'Luxor only', 'Alexandria'],
      correct: 0,
    },
    {
      prompt: 'Most of Egypt’s land is…',
      choices: ['desert', 'rainforest', 'tundra'],
      correct: 0,
    },
    {
      prompt: 'The Suez Canal links the Mediterranean to the…',
      choices: ['Red Sea', 'Black Sea', 'Caspian Sea'],
      correct: 0,
    },
  ],
  TUR: [
    {
      prompt: 'Istanbul uniquely straddles which two continents?',
      choices: ['Europe and Asia', 'Africa and Europe', 'Asia and Australia'],
      correct: 0,
    },
    {
      prompt: 'Turkish coffee is traditionally served…',
      choices: ['unfiltered, in a small cup', 'iced with cream only', 'as espresso shots only'],
      correct: 0,
    },
    {
      prompt: 'Cappadocia is known for…',
      choices: ['fairy chimneys & cave dwellings', 'coral atolls', 'glaciers'],
      correct: 0,
    },
    {
      prompt: 'Which sea lies north of Turkey?',
      choices: ['Black Sea', 'Caribbean', 'North Sea'],
      correct: 0,
    },
  ],
  ARG: [
    {
      prompt: 'Tango emerged mainly in…',
      choices: ['Buenos Aires / Río de la Plata', 'Patagonia only', 'the Andes peaks'],
      correct: 0,
    },
    {
      prompt: 'Patagonia is shared mainly by Argentina and…',
      choices: ['Chile', 'Brazil', 'Peru'],
      correct: 0,
    },
    {
      prompt: 'Asado refers to…',
      choices: ['a barbecue tradition', 'a mountain pass', 'a river delta'],
      correct: 0,
    },
    {
      prompt: 'The Andes run along Argentina’s…',
      choices: ['western border', 'Atlantic coast', 'northern jungle only'],
      correct: 0,
    },
  ],
  ZAF: [
    {
      prompt: 'Table Mountain overlooks which city?',
      choices: ['Cape Town', 'Johannesburg', 'Durban'],
      correct: 0,
    },
    {
      prompt: 'South Africa has how many capital cities for different branches of government?',
      choices: ['three', 'one', 'five'],
      correct: 0,
    },
    {
      prompt: 'Which ocean meets the Atlantic at the Cape region?',
      choices: ['Indian Ocean', 'Pacific', 'Arctic'],
      correct: 0,
    },
    {
      prompt: 'Apartheid formally ended in the early…',
      choices: ['1990s', '1960s', '2000s'],
      correct: 0,
    },
  ],
  IDN: [
    {
      prompt: 'Indonesia is the world’s largest…',
      choices: ['archipelagic country', 'landlocked country', 'desert nation'],
      correct: 0,
    },
    {
      prompt: 'Komodo dragons are native to…',
      choices: ['eastern Indonesia', 'mainland China', 'Madagascar'],
      correct: 0,
    },
    {
      prompt: 'Bali is especially known for…',
      choices: ['Hindu temples & tourism', 'Arctic research bases', 'maple forests'],
      correct: 0,
    },
    {
      prompt: 'Which tectonic zone makes Indonesia very volcanic?',
      choices: ['Pacific Ring of Fire', 'Mid-Atlantic Ridge only', 'East African Rift only'],
      correct: 0,
    },
  ],
  THA: [
    {
      prompt: 'Thailand was formerly widely known in English as…',
      choices: ['Siam', 'Burma', 'Ceylon'],
      correct: 0,
    },
    {
      prompt: 'Pad Thai is…',
      choices: ['a stir-fried noodle dish', 'a martial art', 'a river'],
      correct: 0,
    },
    {
      prompt: 'Which gulf borders much of Thailand’s south?',
      choices: ['Gulf of Thailand', 'Gulf of Mexico', 'Persian Gulf'],
      correct: 0,
    },
    {
      prompt: 'Theravada Buddhism is the majority religion in…',
      choices: ['Thailand', 'Saudi Arabia', 'Argentina'],
      correct: 0,
    },
  ],
  VNM: [
    {
      prompt: 'Which river’s delta fans out in southern Vietnam?',
      choices: ['Mekong', 'Yangtze', 'Ganges'],
      correct: 0,
    },
    {
      prompt: 'Phở is…',
      choices: ['a noodle soup', 'a fermented fish sauce only', 'a mountain'],
      correct: 0,
    },
    {
      prompt: 'Ha Long Bay is famous for…',
      choices: ['limestone karst islets', 'sand dunes only', 'icebergs'],
      correct: 0,
    },
    {
      prompt: 'Vietnam’s long coastline faces mainly the…',
      choices: ['South China Sea', 'Mediterranean', 'Baltic'],
      correct: 0,
    },
  ],
  IRN: [
    {
      prompt: 'Iran was historically known in the West as…',
      choices: ['Persia', 'Mesopotamia', 'Anatolia'],
      correct: 0,
    },
    {
      prompt: 'Nowruz marks…',
      choices: ['the Persian New Year at spring equinox', 'midwinter only', 'monsoon arrival'],
      correct: 0,
    },
    {
      prompt: 'Which plateau covers much of Iran?',
      choices: ['Iranian Plateau', 'Deccan Plateau', 'Tibetan Plateau'],
      correct: 0,
    },
    {
      prompt: 'Persian carpets are traditionally prized for…',
      choices: ['intricate knotting & patterns', 'being disposable', 'only silk from China'],
      correct: 0,
    },
  ],
  NGA: [
    {
      prompt: 'Nigeria is Africa’s most…',
      choices: ['populous country', 'largest by area', 'northernmost state'],
      correct: 0,
    },
    {
      prompt: 'Nollywood refers to…',
      choices: ['Nigeria’s huge film industry', 'a desert', 'a mountain range'],
      correct: 0,
    },
    {
      prompt: 'Which river is central to Nigeria’s geography?',
      choices: ['Niger', 'Nile', 'Congo only'],
      correct: 0,
    },
    {
      prompt: 'Lagos is…',
      choices: ['a megacity on the coast', 'the Sahara’s capital', 'a landlocked village'],
      correct: 0,
    },
  ],
  POL: [
    {
      prompt: 'Which sea borders Poland to the north?',
      choices: ['Baltic Sea', 'Black Sea', 'Adriatic'],
      correct: 0,
    },
    {
      prompt: 'Pierogi are…',
      choices: ['filled dumplings', 'a vodka brand', 'mountain goats'],
      correct: 0,
    },
    {
      prompt: 'Auschwitz memorial sites lie in…',
      choices: ['southern Poland', 'northern Finland', 'eastern France'],
      correct: 0,
    },
    {
      prompt: 'Chopin is the national composer pride of…',
      choices: ['Poland', 'Austria', 'Sweden'],
      correct: 0,
    },
  ],
}

/** Every playable country can be quizzed — handmade bank and/or generated facts. */
export function hasBriefings(_countryId: string): boolean {
  return true
}

function approxPopLabel(n: number): string {
  if (n >= 1_000_000_000) {
    const v = Math.round(n / 1_000_000_000)
    return `about ${v} billion`
  }
  if (n >= 1_000_000) {
    const v = Math.round(n / 1_000_000)
    return `about ${v} million`
  }
  if (n >= 1_000) {
    const v = Math.round(n / 1_000)
    return `about ${v} thousand`
  }
  return 'under a thousand'
}

function distractorPopLabels(pop: number): [string, string] | null {
  const correct = approxPopLabel(pop)
  const candidates = [
    approxPopLabel(Math.max(500, pop * 6)),
    approxPopLabel(Math.max(500, pop / 7)),
    approxPopLabel(Math.max(500, pop * 2.5)),
    approxPopLabel(Math.max(500, pop / 3)),
    'about 2 million',
    'about 50 million',
    'about 200 million',
  ].filter((label) => label !== correct)
  const unique = [...new Set(candidates)]
  if (unique.length < 2) return null
  // shuffle first two distinct
  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[unique[i], unique[j]] = [unique[j]!, unique[i]!]
  }
  return [unique[0]!, unique[1]!]
}

function pickTwo<T>(items: T[]): [T, T] | null {
  if (items.length < 2) return null
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j]!, copy[i]!]
  }
  return [copy[0]!, copy[1]!]
}

/** Procedural questions from capital / continent / population — covers all targets. */
export function generateBriefings(country: Country, pool: Country[]): BriefingQuestion[] {
  const out: BriefingQuestion[] = []
  const others = pool.filter((c) => c.id !== country.id)

  if (country.continent) {
    const continents = [
      ...new Set(others.map((c) => c.continent).filter((c) => c && c !== country.continent)),
    ]
    const wrong = pickTwo(continents)
    if (wrong) {
      out.push({
        prompt: `${country.name} is on which continent?`,
        choices: [country.continent, wrong[0], wrong[1]],
        correct: 0,
      })
    }
  }

  if (country.population > 50_000) {
    const wrong = distractorPopLabels(country.population)
    if (wrong) {
      out.push({
        prompt: `About how many people live in ${country.name}?`,
        choices: [approxPopLabel(country.population), wrong[0], wrong[1]],
        correct: 0,
      })
    }
  }

  const north = country.lat >= 0
  out.push({
    prompt: `${country.name} sits mainly in the…`,
    choices: [
      north ? 'Northern Hemisphere' : 'Southern Hemisphere',
      north ? 'Southern Hemisphere' : 'Northern Hemisphere',
      'Pacific Void',
    ],
    correct: 0,
  })

  return out
}

export function questionsForCountry(country: Country, pool: Country[]): BriefingQuestion[] {
  const locale = getLocale()
  const disputed =
    BRIEFING_BANK_DISPUTED[country.id]?.[locale] ??
    BRIEFING_BANK_DISPUTED[country.id]?.en
  if (disputed && disputed.length > 0) return disputed

  const handmade = BRIEFING_BANK[country.id] ?? BRIEFING_BANK_MORE[country.id] ?? []
  // Prefer specific intel; fall back to generated facts only if somehow uncatalogued
  if (handmade.length > 0) return handmade
  return generateBriefings(country, pool)
}

export function pickBriefingQuestion(
  country: Country,
  pool: Country[],
  usedKeys: Set<string>,
): { question: BriefingQuestion; key: string } | null {
  const bank = questionsForCountry(country, pool)
  if (bank.length === 0) return null

  const fresh = bank
    .map((question, index) => ({ question, key: `${country.id}:${index}` }))
    .filter((entry) => !usedKeys.has(entry.key))

  const choices =
    fresh.length > 0
      ? fresh
      : bank.map((question, index) => ({ question, key: `${country.id}:${index}` }))

  return choices[Math.floor(Math.random() * choices.length)] ?? null
}

/** Shuffle choices; return display order + correct answer text. */
export function shuffleBriefingChoices(question: BriefingQuestion): {
  choices: string[]
  answer: string
} {
  const answer = question.choices[question.correct]!
  const choices = [...question.choices]
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = choices[i]!
    choices[i] = choices[j]!
    choices[j] = tmp
  }
  return { choices, answer }
}
