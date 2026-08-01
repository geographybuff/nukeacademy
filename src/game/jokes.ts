/** Dumb variety pack. Country-aware when we can. Never explain the bit. */

import { gradeLabel } from '../i18n/copy'
import { esJokes } from '../i18n/jokes/es'
import { jaJokes } from '../i18n/jokes/ja'
import { ruJokes } from '../i18n/jokes/ru'
import type { JokePack } from '../i18n/jokes/types'
import { zhJokes } from '../i18n/jokes/zh'
import { getLocale } from '../i18n/locale'
import { composeShareTweet } from '../share/compose'

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''))
}

/** Grade bands for country-specific lines. */
type Band = 'hit' | 'close' | 'miss'

type CountryLines = {
  hit?: readonly string[]
  close?: readonly string[]
  miss?: readonly string[]
  any?: readonly string[]
}

const BULLSEYE = [
  '{place} has left the chat. Valedictorian energy.',
  'Perfect score. The faculty is briefly speechless.',
  'Surgical. Petty. Beautiful. NUKES salutes you.',
  '{place} just became a case study.',
  'Bullseye. Frame this. Hang it in Applied Oops.',
  'The capital sends its regards. Via smoke signal.',
  'Dean’s list. Detonation track.',
  'You hit the homework. On purpose. Suspiciously competent.',
  'Embassy row just filed a noise complaint. Against existence.',
  'UN emergency session scheduled. Topic: you.',
  'Diplomatic pouch returned to sender. Ash.',
  '{place}’s tourism board is rewriting the brochure in past tense.',
  'Sanctions incoming. Against mediocrity. You passed.',
  'Cable news: “historic.” Faculty: “expected.”',
  'The summit is canceled. The summit is the mushroom.',
]

const DIRECT = [
  'Extra credit. Send flowers. Or don’t.',
  'Close enough for government work. And we are not a government.',
  '{place} felt that. Emotionally. Structurally. Whatever.',
  'That’s a B+. In explosion.',
  'Nearly perfect. The academy lowered the curve anyway.',
  'Direct-ish. We’ll mark it as intentional.',
  'Good form. Bad for tourism.',
  'The mushroom says congratulations.',
  'Press secretary: “still assessing.” The crater disagrees.',
  'Treaty of {place} — unsigned, on fire, funny.',
  'NATO is typing…',
  'Ambassador requested the window seat. There is no window.',
  'Bilateral relations: unilaterally revised.',
  'Close enough that the capital’s group chat went silent.',
]

const CLOSE = [
  'You almost hit {place}. Almost is a major here.',
  'So close the suburbs filed a noise complaint.',
  'One more degree of honesty and you’d have graduated.',
  '{km} km — academically thrilling, diplomatically awkward.',
  'Close call. The fish in the harbor are nervous.',
  'Almost. The academy grades on a blast curve.',
  'Nearly famous. Still enrolled.',
  'You grazed destiny. Destiny ducked.',
  'Suburbs of {place} just learned geography the hard way.',
  'Demarche drafted. Spelling of your name: “oops.”',
  'Close enough for a strongly worded letter. And a crater.',
  'The capital was in the blast radius of your intentions.',
  '{km} km short of a career in diplomacy. Long enough for memes.',
  'Evacuation routes: improvisational jazz.',
]

const NEAR_CLOSE = [
  'The suburbs filed a complaint. Detention: more NUKES.',
  'Not the capital. Spiritually adjacent.',
  'Commuter belt curriculum. Very advanced.',
  'You hit “greater metropolitan vibes.”',
  '{place}’s cousins will remember this.',
  'Close enough to ruin brunch.',
  'Ring road got the curriculum. Downtown got anxiety.',
  'Airport is closed. For reasons. Related reasons.',
  'You nuked the outskirts. The outskirts had feelings.',
  'Diplomatic incident: suburban edition.',
]

const NEAR_FAR = [
  'Somewhere near {place}. Spiritually. Geographically: lol.',
  'You aimed with your heart. Hearts are bad at GPS.',
  'Regional vibes. National consequences: pending.',
  'The map is not the territory. You proved both wrong.',
  '{km} km of pure interpretive dance.',
  'Participation trophy inbound. It’s on fire.',
  'Wrong province. Correct energy. Faculty divided.',
  'You filed the warhead under “misc.”',
  '{place} felt a breeze. The breeze had a yield.',
  'Neighboring mayors are updating LinkedIn.',
]

const FAR = [
  'Geography department is laughing. Loudly.',
  'Bold strategy. Atlases disagree.',
  'You nuked the general idea of {place}.',
  'Fieldwork! …in the wrong field.',
  'That’s not a miss. That’s a gap year.',
  'Coordinates were more of a suggestion.',
  'Embassy called. They said “where?”',
  '{km} km away — still counts as foreign policy.',
  'You declared war on vibes. Vibes won.',
  'Sanctions on your aim. Effective immediately.',
  'The capital watched from a safe, judgmental distance.',
  'International incident deferred. Competence incident ongoing.',
]

const FAR_TZ = [
  'Different timezone. Still counts as fieldwork.',
  'You hit yesterday’s weather.',
  'Long-distance relationship with accuracy.',
  '{km} km — romantic, in a doomed way.',
  'Intercontinental oops. Very worldly.',
  'The Earth is big. You made it feel bigger.',
  'Jet lag for the warhead. Classic.',
  'You CC’d the wrong hemisphere.',
  'Passport stamps: none. Crater stamps: misplaced.',
  'UN map budget just went up because of you.',
]

const MISS = [
  'The Earth is round. You still missed. No curve. No mercy.',
  'Ocean Studies welcomes you with open fins.',
  'You invented a new capital: Nowhere.',
  'Miss. Legendary. Frame the splash.',
  'The academy respects the bit. The bit is missing.',
  'That wasn’t a drop. That was performance art.',
  'Peace talks succeeded. Accidentally. Against your will.',
  'Hard power? Soft aim.',
  '{place} remains unbothered. Rude of them.',
  'Demarche returned: address unknown.',
]

const MISS_OCEAN = [
  'Ocean Studies honor roll. The fish are enrolled now.',
  'You gave the Atlantic homework.',
  'Splash zone valedictorian.',
  'Poseidon transfers in. Brings NUKES.',
  'International waters: your strongest subject.',
  'Blueflies over bullseye. Character development.',
  'Naval treaty violated. By incompetence.',
  'You armed the tide. The tide is neutral.',
  'Submarines send their regards. And a F.',
  'Maritime law is laughing. Wetly.',
]

/** Wrong country: impact landed inside another nation’s territory. */
const TERRITORY_HIT = [
  'Assignment: {place}. Airspace: {rival}. International incident speedrun.',
  'You filed the warhead in {rival}. {place} was CC’d. Awkward.',
  'Wrong country. Correct mushroom. Faculty impressed / concerned.',
  '{rival} caught a stray. {place} caught a break.',
  'You invaded {rival}. The syllabus said {place}.',
  'Border violation major. Minor in reading the map.',
  'Proxy homework. {rival} did not consent. {place} sends thanks.',
  'Demarche from {rival}: “why us?” Faculty: “yes.”',
  'You dropped on {rival} soil. {place} remains theoretically assigned.',
  'Sovereignty mix-up. {rival} wants a word. {place} wants a nap.',
  'Geography pop quiz: {rival} is not {place}. Shocking, we know.',
  '{rival} just got your tourism. {place} kept its skyline. For now.',
  'You outsourced the blast to {rival}. {place} invoices HR.',
  'Stereotype of the day: you can’t aim. {rival} agrees. {place} shrugs.',
]

/** Same country territory, but not the capital grade — suburban / inland oops. */
const HOME_SOIL = [
  'You’re in {place}. Just not the homework pin.',
  'Correct country. Incorrect ambition.',
  '{place} territory: yes. Capital: emotionally distant.',
  'Domestic incident. Embassy still nervous.',
  'You hit the homeland. The capital files a noise complaint.',
  'Same flag. Wrong zip code. Faculty: “progress.”',
  'National soil: checked. Capital homework: see guidance counselor.',
  '{place} accepts you as a citizen of oops. Capital still ghosting.',
  'You bombed the provinces. Classic capital-city resentment fuel.',
]

const INTRO_LINES = [
  'Fully illegitimate orbital finishing school. Only subject: NUKE. Final exam: hit a capital. Oceans are mentors.',
  'We teach geography the hard way. Curriculum: NUKE. Nobody graduates. On purpose.',
  'Attendance optional. Detonation not optional. Major in impact. Minor in missing.',
  'Earth. Real consequences (emotional). Powered by NUKES. Alumni: mostly smoke.',
  'Illegitimate on purpose. The UN declined to comment. They were busy. NUKE is the syllabus.',
  'Pick a duck plane. Drop a curriculum. Post the transcript. Powered by NUKES.',
  'Diplomacy is elective. Yield is core curriculum. Powered by NUKES.',
  'We don’t do soft power. We do drop altitude. NUKES.',
]

const INTRO_KICKERS = ['ORBITAL FINISHING SCHOOL']

const LOADOUT_SUBS = [
  'Pick a morally flexible aircraft. Pick a curriculum. No refunds.',
  'Dignity is optional. Yield is not. Study hard. Drop harder.',
  'Flight school meets unfinished business. Powered by NUKES. Dignity optional.',
  'Select your midterm delivery vehicle. Dignity not included.',
  'Gear up like the academy has standards. (It doesn’t.)',
  'Choose your soft-power failure mode. Powered by NUKES.',
]

const SHARE_LINES = [
  'I just tried to nuke {place}’s capital in NUKE ACADEMY and landed {km} km away (grade: {grade}). Orbit Earth, drop a nuke — closer = more points. Think you can hit closer?',
  'Played NUKE ACADEMY: aimed at {place}, got a {grade} from {km} km out. It’s a ridiculous geography nuke game. Beat my drop:',
  'My NUKE ACADEMY exam over {place} came back {grade} — {km} km from the capital. Watch the replay and see if you can do better.',
  'Dropped a nuke toward {place} in this orbital finishing-school game. Result: {grade}, {km} km off. Closer drops score higher — your turn.',
  'I flunked (or almost did) geopolitics at NUKE ACADEMY: {place}, {grade}, {km} km from the capital. Open the link to replay the drop.',
]

const KICKERS_LIVE = [
  'FACULTY REPORT',
  'MIDTERM RESULTS',
  'DETONATION GPA',
  'ACADEMY TRANSCRIPT',
  'GRADING IN PROGRESS',
  'OFFICE HOURS AFTERMATH',
  'DEMARCHE DRAFT',
  'HOSTILE RELATIONS 101',
]

const KICKERS_SHARED = [
  'SHARED TRANSCRIPT',
  'SOMEONE’S HOMEWORK',
  'PEER REVIEW',
  'ALUMNI DROP',
  'LEAKED EXAM',
  'GROUP PROJECT (SOLO)',
  'CABLE LEAK',
  'DIPLOMATIC POUCH',
]

/**
 * Country-specific dark humor. Keys: Natural Earth ADM0_A3 + lowercase name aliases.
 * Keep it absurd academy / diplomatic — not ethnic hate.
 */
const BY_COUNTRY: Record<string, CountryLines> = {
  USA: {
    hit: [
      'Washington just learned what “executive action” means.',
      'Congress is forming a committee. On the mushroom.',
      'Red button was decorative. Yours wasn’t.',
      'State of the Union: briefly a cloud.',
      'First Amendment covers this roast. Barely.',
    ],
    close: [
      'Beltway traffic just got a yield. Historic.',
      'You almost hit the capital. Lobbyists almost noticed.',
      'Virginia felt that. Maryland filed paperwork.',
    ],
    miss: [
      'Missed the US capital. The oceans remain bipartisan.',
      'America’s aim coach is available. Rates in NUKES.',
      'You exported democracy to the wrong grid square.',
    ],
    any: [
      'Land of the free, home of the near-miss.',
      'Stars, stripes, and a very frank transcript.',
    ],
  },
  GBR: {
    hit: [
      'The Crown is briefly a weather event.',
      'Parliament is out. Permanently, for a bit.',
      'Keep calm and… no. Don’t.',
      'Tea is canceled. Diplomacy is canceled. Class is in session.',
      'Big Ben is now a sundial. For ash.',
    ],
    close: [
      'Close enough that the Tube delayed forever.',
      'Countryside got the curriculum. Very pastoral. Very wrong.',
      'Special relationship: specially loud.',
    ],
    miss: [
      'Missed London. The Channel sends a postcard.',
      'Stiff upper lip. Loose coordinates.',
      'God save the aim.',
    ],
  },
  FRA: {
    hit: [
      'Paris is burning. Fashionably.',
      'The Louvre is now open-air. Permanent exhibit: oops.',
      'Strike canceled — nothing left to withhold.',
      'Liberté, égalité, radioactive.',
      'Eiffel Tower practiced leave. Successfully.',
    ],
    close: [
      'Banlieue got the midterm. Paris got anxiety.',
      'Champagne region tasted notes of curriculum.',
      'Almost romantic. Tragically geometric.',
    ],
    miss: [
      'Missed France. The wine is safe. Your GPA isn’t.',
      'You surrendered… to the ocean.',
      'Sacré bleu. Literally blue. Splash.',
    ],
  },
  DEU: {
    hit: [
      'Berlin: efficiency achieved. Too achieved.',
      'Ordnung: revised.',
      'Autobahn clear. Capital less so.',
      'Engineering marvel: your aim. Briefly.',
    ],
    close: [
      'Close enough for a strongly worded EU memo.',
      'Brandenburg felt a draft. Historical irony pending.',
    ],
    miss: [
      'Missed Germany. Recalibrate with a ruler. A big one.',
      'Precision engineering. Applied to the wrong country.',
    ],
  },
  JPN: {
    hit: [
      'Tokyo just got a new skyline. Temporary.',
      'Bullet train: outrun unsuccessful.',
      'Salarymen filing emotional expense reports.',
      'Godzilla files a plagiarism complaint.',
    ],
    close: [
      'Close enough that vending machines blinked.',
      'Suburbs of the capital practiced drills. For real.',
    ],
    miss: [
      'Missed Japan. The Pacific enrolled you.',
      'You bowed to the wrong coordinates.',
    ],
  },
  CHN: {
    hit: [
      'Beijing noticed. The whole timezone noticed.',
      'Five-year plan: accelerated. Into a cloud.',
      'Great Firewall can’t block a mushroom.',
    ],
    close: [
      'Close enough for a carefully worded statement.',
      'Province vibes. Capital anxiety.',
    ],
    miss: [
      'Missed China. Ocean Studies: mandatory.',
      'You went wide. Very wide. Belt and road of wrong.',
    ],
  },
  RUS: {
    hit: [
      'Moscow: winter is coming from above.',
      'Red Square is briefly a color study.',
      'Oligarchs refreshing flight apps.',
    ],
    close: [
      'Close enough that the balalaikas went quiet.',
      'Near miss on Moscow. Far hit on vibes.',
    ],
    miss: [
      'Missed Russia. Siberia was never the assignment.',
      'You aimed for power. Hit water. Classic novel.',
    ],
  },
  IND: {
    hit: [
      'Delhi traffic solved. Permanently. Darkly.',
      'Monsoon, but make it curriculum.',
      'Bollywood would need a bigger budget.',
    ],
    close: [
      'NCR felt that. The acronym expanded to “oh no.”',
      'Close enough to ruin chai o’clock.',
    ],
    miss: [
      'Missed India. The Arabian Sea took notes.',
      'Wrong subcontinent energy.',
    ],
  },
  BRA: {
    hit: [
      'Brasília: carnival of consequences.',
      'Amazon is fine. The capital less so. Dark humor.',
      'Football canceled. Sky won.',
    ],
    close: [
      'Close enough that samba skipped a beat.',
      'Coastal vibes, capital anxiety.',
    ],
    miss: [
      'Missed Brazil. Atlantic enrollment confirmed.',
      'You aimed for samba. Hit splash.',
    ],
  },
  AUS: {
    hit: [
      'Canberra: finally interesting.',
      'Everything tried to kill you. You killed the capital.',
      'Drop bears send a thank-you note.',
    ],
    close: [
      'Close enough that the outback raised an eyebrow.',
      'Sydney felt a rumor. Canberra felt a draft.',
    ],
    miss: [
      'Missed Australia. The ocean is undefeated. Again.',
      'You nuked the general idea of down under.',
    ],
  },
  CAN: {
    hit: [
      'Ottawa: sorry… for the capital.',
      'Politeness protocol: suspended.',
      'Maple leaf, ash leaf.',
    ],
    close: [
      'Close enough that Tim Hortons filed a claim.',
      'Toronto felt a vibe. Ottawa felt curriculum.',
    ],
    miss: [
      'Missed Canada. International waters remain polite.',
      'You aimed north. Geography said “nice try.”',
    ],
  },
  MEX: {
    hit: [
      'Mexico City: altitude was never the problem.',
      'Diplomatic salsa: extra hot.',
      'Tourism board updating from “visit” to “visited.”',
    ],
    close: [
      'Close enough for a border incident. Academic edition.',
      'Suburbs got the midterm.',
    ],
    miss: [
      'Missed Mexico. Pacific took the transfer credit.',
      'Wrong side of the gulf. Correct energy.',
    ],
  },
  KOR: {
    hit: [
      'Seoul: K-pop briefly K-stop.',
      'Demilitarized? Demotivated.',
      'Han River considering a career change.',
    ],
    close: [
      'Close enough that the DMZ side-eyed you.',
      'Near miss. Maximum drama.',
    ],
    miss: [
      'Missed Seoul. The sea remains chaotic neutral.',
      'You dropped east of the joke.',
    ],
  },
  'korea, republic of': {},
  ITA: {
    hit: [
      'Rome wasn’t built in a day. Undone in one drop.',
      'Colosseum: finally a worthy encore.',
      'Pasta al dente. Capital al done.',
    ],
    close: [
      'Close enough that the Vatican raised an eyebrow.',
      'Tuscany felt a rumor. Rome felt heat.',
    ],
    miss: [
      'Missed Italy. Mediterranean Studies welcomes you.',
      'You aimed for empire. Hit tide.',
    ],
  },
  ESP: {
    hit: [
      'Madrid: siesta canceled.',
      'Running of the… curriculum.',
      'Ibiza is fine. The capital less so.',
    ],
    close: [
      'Close enough for a tapas-sized incident.',
      'Catalonia felt a draft. Diplomatically.',
    ],
    miss: [
      'Missed Spain. The sea remains undefeated.',
      'Olé… to the splash.',
    ],
  },
  TUR: {
    hit: [
      'Ankara: bridges burned. Literally adjacent.',
      'East meets west meets curriculum.',
      'Bazaar prices just went metaphysical.',
    ],
    close: [
      'Close enough that Istanbul felt a rumor.',
      'Near miss. Maximum geopolitics.',
    ],
    miss: [
      'Missed Turkey. Black Sea enrollment open.',
      'You aimed for crossroads. Hit water.',
    ],
  },
  SAU: {
    hit: [
      'Riyadh: oil money can’t buy a redo.',
      'Desert sun, academic moon, coral mushroom.',
      'Vision 2030: revised. Dramatically.',
    ],
    close: [
      'Close enough for a carefully priced statement.',
      'Near miss in the kingdom. Far hit on vibes.',
    ],
    miss: [
      'Missed Saudi Arabia. Sand and sea shrug.',
      'Wrong oasis. Correct yield envy.',
    ],
  },
  IRN: {
    hit: [
      'Tehran: sanctions couldn’t stop this homework.',
      'Persian Gulf watching. Nervously. Wetly.',
      'Poetry night canceled. Prose was too loud.',
    ],
    close: [
      'Close enough for a regional subplot.',
      'Near miss. Maximum cable news.',
    ],
    miss: [
      'Missed Iran. Ocean Studies: mandatory elective.',
      'You aimed for drama. Hit splash.',
    ],
  },
  ISR: {
    hit: [
      'Jerusalem / Tel Aviv vibes: complicated. Your aim: less so.',
      'Iron Dome filed a complaint with faculty.',
      'Holy land, unholy homework.',
    ],
    close: [
      'Close enough that the region refreshed Twitter.',
      'Near miss. International incident speedrun.',
    ],
    miss: [
      'Missed Israel. The Med took the credit.',
      'Wrong coordinates. Maximum opinions.',
    ],
  },
  EGY: {
    hit: [
      'Cairo: pyramids remain. Capital mood: temporary.',
      'Nile traffic advisory: avoid the sky.',
      'Sphinx still not talking. Wise.',
    ],
    close: [
      'Close enough that Alexandria felt a rumor.',
      'Desert got the midterm.',
    ],
    miss: [
      'Missed Egypt. Red Sea / Med rivalry continues.',
      'You aimed for pharaohs. Hit fish.',
    ],
  },
  ZAF: {
    hit: [
      'Pretoria / Cape vibes: curriculum delivered.',
      'Rainbow nation, coral mushroom.',
      'Safari canceled. Sky show sold out.',
    ],
    close: [
      'Close enough that Johannesburg felt a draft.',
      'Near miss. Long continent energy.',
    ],
    miss: [
      'Missed South Africa. Ocean both sides, judgment both sides.',
      'You aimed south. Geography said “pick a capital.”',
    ],
  },
  ARG: {
    hit: [
      'Buenos Aires: tango with consequences.',
      'Beef exports interrupted by coursework.',
      'Malvinas not the assignment. Capital was.',
    ],
    close: [
      'Close enough that the pampas side-eyed you.',
      'Near miss. Maximum drama, Spanish edition.',
    ],
    miss: [
      'Missed Argentina. South Atlantic enrollment.',
      'You aimed for passion. Hit tide.',
    ],
  },
  IDN: {
    hit: [
      'Jakarta: traffic solved the hard way.',
      'Archipelago, meet singularity.',
      'Komodo unimpressed. Capital less so.',
    ],
    close: [
      'Close enough that Bali felt a rumor and declined.',
      'Island hopping: wrong island.',
    ],
    miss: [
      'Missed Indonesia. Too many islands. Not enough aim.',
      'Pacific / Indian rivalry: you picked splash.',
    ],
  },
  PAK: {
    hit: [
      'Islamabad: quiet capital, loud homework.',
      'Regional subplot unlocked.',
      'Cricket delayed for academic reasons.',
    ],
    close: [
      'Close enough for a carefully tense presser.',
      'Near miss. Maximum neighbors.',
    ],
    miss: [
      'Missed Pakistan. Arabian Sea took attendance.',
      'Wrong grid. Correct geopolitical anxiety.',
    ],
  },
  UKR: {
    hit: [
      'Kyiv: dark humor major. You passed the midterm.',
      'Sunflower field, coral sky.',
      'Diplomacy elective failed. Yield core passed.',
    ],
    close: [
      'Close enough that the region held its breath. Again.',
      'Near miss. Far from funny to everyone except faculty.',
    ],
    miss: [
      'Missed Ukraine. Black Sea enrollment.',
      'You aimed for the capital. Hit curriculum ocean.',
    ],
  },
  POL: {
    hit: [
      'Warsaw: history called. It wants royalties.',
      'Pierogi delayed. Diplomacy delayed harder.',
      'Central Europe felt that in HD.',
    ],
    close: [
      'Close enough for an EU group chat meltdown.',
      'Near miss. Maximum neighbors.',
    ],
    miss: [
      'Missed Poland. Baltic shrugs.',
      'You aimed for solidarity. Hit splash.',
    ],
  },
  NLD: {
    hit: [
      'Amsterdam: bikes fled. Wisely.',
      'Below sea level was already a mood.',
      'Tulips, briefly autumn.',
    ],
    close: [
      'Close enough that Rotterdam felt a draft.',
      'Near miss. Maximum dikes anxiety.',
    ],
    miss: [
      'Missed the Netherlands. North Sea: undefeated.',
      'You aimed for flat land. Hit flat water.',
    ],
  },
  BEL: {
    hit: [
      'Brussels: EU summit relocated to orbit.',
      'Waffles: safe. Capital: coursework.',
      'NATO HQ felt a peer review.',
    ],
    close: [
      'Close enough that Luxembourg pretended not to notice.',
      'Near miss. Maximum bureaucracy.',
    ],
    miss: [
      'Missed Belgium. Channel / North Sea coalition wins.',
      'You aimed for chocolate. Hit salt.',
    ],
  },
  SWE: {
    hit: [
      'Stockholm: IKEA cannot assemble this.',
      'Neutral? Not today.',
      'Nordic noir, coral edition.',
    ],
    close: [
      'Close enough that Oslo felt a rumor.',
      'Near miss. Maximum lagom violated.',
    ],
    miss: [
      'Missed Sweden. Baltic enrollment.',
      'You aimed for cozy. Hit splash.',
    ],
  },
  NOR: {
    hit: [
      'Oslo: fjords watched. Judged.',
      'Oil money can’t buy aim.',
      'Northern lights: upgraded.',
    ],
    close: [
      'Close enough that Bergen felt a draft.',
      'Near miss. Maximum sweater anxiety.',
    ],
    miss: [
      'Missed Norway. North Sea takes the W.',
      'You aimed for fjords. Hit fish.',
    ],
  },
  CHE: {
    hit: [
      'Bern: neutrality has a blast radius now.',
      'Banks are fine. The capital less so.',
      'Alps: front-row seats.',
    ],
    close: [
      'Close enough that Geneva scheduled a meeting about meetings.',
      'Near miss. Maximum chocolate tension.',
    ],
    miss: [
      'Missed Switzerland. Lakes remain smug.',
      'You aimed for precision. Hit water. Ironic.',
    ],
  },
  AUT: {
    hit: [
      'Vienna: waltz canceled. Mushroom encore.',
      'Sound of music: percussion section.',
      'Empire vibes, temporary cloud.',
    ],
    close: [
      'Close enough that Bratislava felt a draft.',
      'Near miss. Maximum pastry anxiety.',
    ],
    miss: [
      'Missed Austria. Alps shrug in German.',
      'You aimed for opera. Hit splash.',
    ],
  },
  PRT: {
    hit: [
      'Lisbon: hills couldn’t save you.',
      'Age of discovery, age of curriculum.',
      'Pastel de nata: safe. Capital: coursework.',
    ],
    close: [
      'Close enough that Porto felt a rumor.',
      'Near miss. Maximum saudade.',
    ],
    miss: [
      'Missed Portugal. Atlantic: classic.',
      'You aimed for Europe’s edge. Fell off it.',
    ],
  },
  GRC: {
    hit: [
      'Athens: democracy felt a peer review.',
      'Gods declined comment. Faculty did not.',
      'Acropolis: still up. Capital mood: down.',
    ],
    close: [
      'Close enough that islands felt a rumor.',
      'Near miss. Maximum mythology.',
    ],
    miss: [
      'Missed Greece. Aegean enrollment open.',
      'You aimed for Olympus. Hit tide.',
    ],
  },
  THA: {
    hit: [
      'Bangkok: traffic solved. Spiritually.',
      'Smile diplomacy: interrupted.',
      'Temples remain. Capital got homework.',
    ],
    close: [
      'Close enough that Phuket declined the subplot.',
      'Near miss. Maximum street food anxiety.',
    ],
    miss: [
      'Missed Thailand. Andaman / Gulf coin flip.',
      'You aimed for spice. Hit splash.',
    ],
  },
  VNM: {
    hit: [
      'Hanoi: pho delayed for academic reasons.',
      'History called. It wants a word. Quietly.',
      'Motorbikes fled at Mach joke.',
    ],
    close: [
      'Close enough that Saigon felt a draft.',
      'Near miss. Maximum region.',
    ],
    miss: [
      'Missed Vietnam. South China Sea shrugs.',
      'You aimed for capital. Hit curriculum ocean.',
    ],
  },
  PHL: {
    hit: [
      'Manila: typhoon season, academic edition.',
      'Jeepneys rerouted to orbit.',
      'Archipelago, meet singularity.',
    ],
    close: [
      'Close enough that Cebu felt a rumor.',
      'Near miss. Too many islands for your aim.',
    ],
    miss: [
      'Missed Philippines. Pacific took attendance.',
      'You island-hopped into splash.',
    ],
  },
  NGA: {
    hit: [
      'Abuja: Nollywood needs a bigger CGI budget.',
      'Giant of Africa felt a homework assignment.',
      'Lagos felt a rumor. Capital felt curriculum.',
    ],
    close: [
      'Close enough for a regional group chat meltdown.',
      'Near miss. Maximum energy.',
    ],
    miss: [
      'Missed Nigeria. Gulf of Guinea enrollment.',
      'You aimed for power. Hit tide.',
    ],
  },
  COL: {
    hit: [
      'Bogotá: altitude wasn’t enough.',
      'Coffee exports interrupted by coursework.',
      'Escobar jokes banned. Faculty used one anyway.',
    ],
    close: [
      'Close enough that Medellín felt a draft.',
      'Near miss. Maximum mountains.',
    ],
    miss: [
      'Missed Colombia. Caribbean / Pacific rivalry.',
      'You aimed for gold. Hit blue.',
    ],
  },
  CHL: {
    hit: [
      'Santiago: long country, short fuse.',
      'Andes had aisle seats.',
      'Wine region: notes of curriculum.',
    ],
    close: [
      'Close enough that Valparaíso felt a rumor.',
      'Near miss. Maximum skinny-map energy.',
    ],
    miss: [
      'Missed Chile. Pacific was waiting.',
      'You aimed for a line on the map. Hit ocean.',
    ],
  },
  NZL: {
    hit: [
      'Wellington: wind wasn’t the problem.',
      'Middle-earth extras fled to real earth.',
      'Sheep unbothered. Capital bothered.',
    ],
    close: [
      'Close enough that Auckland felt a rumor.',
      'Near miss. Maximum sheep judgment.',
    ],
    miss: [
      'Missed New Zealand. Tasman / Pacific shrug.',
      'You aimed for hobbits. Hit fish.',
    ],
  },
  SGP: {
    hit: [
      'Singapore: chewing gum was never the real ban.',
      'Fine city. Fined by curriculum.',
      'Marina Bay: new water feature.',
    ],
    close: [
      'Close enough that Johor felt a draft.',
      'Near miss on a city-state. Impressive wrongness.',
    ],
    miss: [
      'Missed Singapore. Hard mode. You chose splash.',
      'Tiny target. Huge ocean. Classic.',
    ],
  },
  ARE: {
    hit: [
      'Abu Dhabi: skyline briefly abstract art.',
      'Dubai felt a rumor. Capital felt homework.',
      'Gold, glass, coral cloud.',
    ],
    close: [
      'Close enough that the Palm side-eyed you.',
      'Near miss. Maximum AC anxiety.',
    ],
    miss: [
      'Missed UAE. Gulf shrugs in luxury.',
      'You aimed for shine. Hit splash.',
    ],
  },
  QAT: {
    hit: [
      'Doha: air-conditioned doom.',
      'World Cup vibes, academic edition.',
      'Tiny country. Huge homework.',
    ],
    close: [
      'Close enough that the whole map felt it.',
      'Near miss on a postage stamp. Bold.',
    ],
    miss: [
      'Missed Qatar. Hard mode. Ocean easy mode.',
      'Small target. You selected water.',
    ],
  },
}

/** Name → ISO aliases for Natural Earth NAME_EN strings. */
const NAME_TO_ISO: Record<string, string> = {
  'united states of america': 'USA',
  'united states': 'USA',
  'united kingdom': 'GBR',
  france: 'FRA',
  germany: 'DEU',
  japan: 'JPN',
  china: 'CHN',
  russia: 'RUS',
  india: 'IND',
  brazil: 'BRA',
  australia: 'AUS',
  canada: 'CAN',
  mexico: 'MEX',
  'south korea': 'KOR',
  'korea, republic of': 'KOR',
  italy: 'ITA',
  spain: 'ESP',
  turkey: 'TUR',
  'saudi arabia': 'SAU',
  iran: 'IRN',
  israel: 'ISR',
  egypt: 'EGY',
  'south africa': 'ZAF',
  argentina: 'ARG',
  indonesia: 'IDN',
  pakistan: 'PAK',
  ukraine: 'UKR',
  poland: 'POL',
  netherlands: 'NLD',
  belgium: 'BEL',
  sweden: 'SWE',
  norway: 'NOR',
  switzerland: 'CHE',
  austria: 'AUT',
  portugal: 'PRT',
  greece: 'GRC',
  thailand: 'THA',
  vietnam: 'VNM',
  philippines: 'PHL',
  nigeria: 'NGA',
  colombia: 'COL',
  chile: 'CHL',
  'new zealand': 'NZL',
  singapore: 'SGP',
  'united arab emirates': 'ARE',
  qatar: 'QAT',
}

function enPack(): JokePack {
  return {
    bullseye: BULLSEYE,
    direct: DIRECT,
    close: CLOSE,
    nearClose: NEAR_CLOSE,
    nearFar: NEAR_FAR,
    far: FAR,
    farTz: FAR_TZ,
    miss: MISS,
    missOcean: MISS_OCEAN,
    territoryHit: TERRITORY_HIT,
    homeSoil: HOME_SOIL,
    introLines: INTRO_LINES,
    introKickers: INTRO_KICKERS,
    loadoutSubs: LOADOUT_SUBS,
    shareLines: SHARE_LINES,
    kickersLive: KICKERS_LIVE,
    kickersShared: KICKERS_SHARED,
  }
}

function activePack(): JokePack {
  switch (getLocale()) {
    case 'es':
      return esJokes
    case 'ru':
      return ruJokes
    case 'zh':
      return zhJokes
    case 'ja':
      return jaJokes
    default:
      return enPack()
  }
}

function bandForGrade(grade: string): Band {
  if (grade === 'BULLSEYE' || grade === 'DIRECT HIT') return 'hit'
  if (grade === 'CLOSE CALL' || grade === 'NEAR MISS') return 'close'
  return 'miss'
}

function countryPack(countryId: string | undefined, countryName: string): CountryLines | null {
  const id = (countryId || '').toUpperCase()
  if (id && BY_COUNTRY[id] && (BY_COUNTRY[id]!.hit || BY_COUNTRY[id]!.close || BY_COUNTRY[id]!.miss || BY_COUNTRY[id]!.any?.length)) {
    return BY_COUNTRY[id]!
  }
  const iso = NAME_TO_ISO[countryName.trim().toLowerCase()]
  if (iso && BY_COUNTRY[iso]) return BY_COUNTRY[iso]!
  return null
}

function linesForBand(pack: CountryLines, band: Band): string[] {
  const out: string[] = []
  const specific = pack[band]
  if (specific?.length) out.push(...specific)
  if (pack.any?.length) out.push(...pack.any)
  return out
}

export type RoastContext = {
  countryId?: string
  /** Nation whose land polygon contains the impact (if any). */
  landedCountryId?: string
  landedCountryName?: string
}

export function roastLine(
  grade: string,
  km: number,
  country: string,
  ctx: RoastContext = {},
): string {
  const place = country || 'the capital'
  const landedId = ctx.landedCountryId
  const landedName = ctx.landedCountryName || ''
  const wrongCountry =
    !!landedId && !!ctx.countryId && landedId !== ctx.countryId && !!landedName
  const homeSoil =
    !!landedId &&
    !!ctx.countryId &&
    landedId === ctx.countryId &&
    (grade === 'CLOSE CALL' || grade === 'NEAR MISS' || grade === 'FAR OFF')

  const jokes = activePack()
  const rival = wrongCountry ? landedName : ''
  const vars = { place, rival, km: Math.round(km), grade: gradeLabel(grade) }
  const band = bandForGrade(grade)

  const pools: string[][] = []

  // Landed in a different country's territory — strongest joke
  if (wrongCountry) {
    pools.push([...jokes.territoryHit])
  } else if (homeSoil) {
    pools.push([...jokes.homeSoil])
  }

  // Country-specific English bits only — keep other locales from mixing languages
  if (getLocale() === 'en') {
    const pack = countryPack(ctx.countryId, country)
    if (pack) {
      const local = linesForBand(pack, band)
      if (local.length) pools.push(local)
    }
    if (wrongCountry) {
      const victimPack = countryPack(landedId, landedName)
      if (victimPack) {
        const victimLines = linesForBand(victimPack, 'hit')
        if (victimLines.length) pools.push(victimLines)
      }
    }
  }

  // Grade pool
  let gradePool: readonly string[]
  switch (grade) {
    case 'BULLSEYE':
      gradePool = jokes.bullseye
      break
    case 'DIRECT HIT':
      gradePool = jokes.direct
      break
    case 'CLOSE CALL':
      gradePool = jokes.close
      break
    case 'NEAR MISS':
      gradePool = km < 400 ? jokes.nearClose : jokes.nearFar
      break
    case 'FAR OFF':
      gradePool = km > 2000 ? jokes.farTz : jokes.far
      break
    default:
      gradePool = km > 5000 ? jokes.missOcean : jokes.miss
      break
  }
  pools.push([...gradePool])

  // Weight: prefer territory / country flavor when present
  let chosenPool: readonly string[]
  if (pools.length === 1) {
    chosenPool = pools[0]!
  } else if (pools.length === 2) {
    chosenPool = Math.random() < 0.6 ? pools[0]! : pools[1]!
  } else if (pools.length === 3) {
    const r = Math.random()
    if (r < 0.4) chosenPool = pools[0]!
    else if (r < 0.75) chosenPool = pools[1]!
    else chosenPool = pools[2]!
  } else {
    const r = Math.random()
    if (r < 0.35) chosenPool = pools[0]!
    else if (r < 0.6) chosenPool = pools[1]!
    else if (r < 0.8) chosenPool = pools[2]!
    else chosenPool = pools[3]!
  }

  return fill(pick(chosenPool), vars)
}

export function introTagline(): string {
  return pick(activePack().introLines)
}

export function introKicker(): string {
  return pick(activePack().introKickers)
}

export function loadoutSub(): string {
  return pick(activePack().loadoutSubs)
}

export function reportKicker(shared: boolean): string {
  const pack = activePack()
  return pick(shared ? pack.kickersShared : pack.kickersLive)
}

export function shareJoke(grade: string, km: number, country: string): string {
  const somewhere =
    getLocale() === 'es'
      ? 'algún lado'
      : getLocale() === 'ru'
        ? 'где-то'
        : getLocale() === 'zh'
          ? '某处'
          : getLocale() === 'ja'
            ? 'どこか'
            : 'somewhere'
  return composeShareTweet(grade, km, country || somewhere)
}
