import type { Locale } from './locale'
import { getLocale } from './locale'

/** UI + brand strings. Grades stay English keys internally; labels are display-only. */
export type Copy = {
  metaDescription: string
  ogDescription: string
  /** Share / OG headline */
  ogShareTitle: string
  /** Share / OG one-liner under the headline */
  ogShareDescription: string
  /** Full tweet body (headline + blank line + sentence). URL added separately. */
  shareTweet: string
  shareOutcomeHit: string
  shareOutcomeClose: string
  shareOutcomeMiss: string
  motto: string
  accreditation: string
  tagline: string
  loadoutKicker: string
  loadoutTitle: string
  loadoutPlaneLabel: string
  loadoutNukeLabel: string
  loadoutCursed: string
  loadoutControls: string
  shareSuffix: string
  loading: string
  nukeIt: string
  takeOff: string
  target: string
  rival: string
  score: string
  /** Suffix on result overlay, e.g. "+658 POINTS". */
  points: string
  hint: string
  todaysExam: string
  copyCa: string
  copied: string
  /** Toast after copying a challenge link on desktop. */
  linkCopied: string
  caPending: string
  copyCaPrompt: string
  nextExam: string
  beatThis: string
  newExam: string
  shareOnX: string
  challengeFriend: string
  /** Country picker headline. */
  challengePickTitle: string
  /** Country picker one-liner. */
  challengePickSub: string
  challengeSearch: string
  challengeBack: string
  /** Intro label when opened via /nuke/{country-slug}. */
  assignedExam: string
  /** Share text for a country challenge link (URL added separately). */
  challengeShare: string
  /** OG title for country challenge links. */
  ogChallengeTitle: string
  /** OG description for country challenge links. */
  ogChallengeDescription: string
  impact: string
  bullseyeStamp: string
  muteOn: string
  muteOff: string
  unmuteAria: string
  muteAria: string
  soundOn: string
  soundOff: string
  capitalOf: string
  kmFromCapital: string
  kmFromNamedCapital: string
  rangeCap: string
  toCapital: string
  youWin: string
  theyWin: string
  draw: string
  onDex: string
  buyNukes: string
  openAcademy: string
  skip: string
  skipAria: string
  briefingKicker: string
  briefingAboutNext: string
  briefingAboutPrev: string
  briefingCorrect: string
  briefingWrong: string
  briefingContinue: string
  capitalUnknown: string
  people: string
  estCasualties: string
  noCasualties: string
  /** Result hit clause (roast follows). */
  hitWrongCountry: string
  hitHomeSoil: string
  hitOcean: string
  hitNearCity: string
  grades: Record<string, string>
  planes: Record<string, { name: string; blurb: string }>
  nukes: Record<string, { name: string; blurb: string }>
}

const en: Copy = {
  metaDescription:
    'NUKE ACADEMY — illegitimate orbital finishing school. Only subject: NUKES. Drop on a capital. Closer = more points.',
  ogDescription:
    'Only subject: NUKES. Orbit the Earth. Drop on a capital. Oceans are mentors. Nobody graduates.',
  ogShareTitle: 'BREAKING NEWS: NUCLEAR EXPLOSION at {km} km from {place}',
  ogShareDescription:
    'Someone aimed a nuke at {place}’s capital and {outcome}.',
  shareTweet:
    'BREAKING NEWS: NUCLEAR EXPLOSION at {km} km from {place}\n\nSomeone aimed a nuke at {place}’s capital and {outcome}.',
  shareOutcomeHit: 'hit it',
  shareOutcomeClose: 'almost hit it',
  shareOutcomeMiss: 'missed',
  motto: 'CLOSER = MORE POINTS',
  accreditation: 'ORBITAL FINISHING SCHOOL',
  tagline:
    'Sketchy orbital finishing school. Only subject: NUKE. Final exam: hit a capital. Oceans are mentors.',
  loadoutKicker: 'ENROLLMENT IN PROGRESS',
  loadoutTitle: 'GEAR UP',
  loadoutPlaneLabel: 'SELECT AIRCRAFT',
  loadoutNukeLabel: 'SELECT NUKE',
  loadoutCursed: 'CURSED',
  loadoutControls: 'SWIPE FLY · NUKE IT NOW / SPACE DROP · WASD · NO REFUNDS',
  shareSuffix: '— NUKE ACADEMY · powered by NUKES',
  loading: 'LOADING…',
  nukeIt: 'NUKE IT NOW',
  takeOff: 'TAKE OFF',
  target: 'TARGET',
  rival: 'RIVAL',
  score: 'SCORE',
  points: 'POINTS',
  hint: 'WASD / swipe fly · SPACE drop',
  todaysExam: "TODAY'S EXAM",
  copyCa: 'COPY CA',
  copied: 'COPIED',
  linkCopied: 'LINK COPIED',
  caPending: 'CA dropping soon',
  copyCaPrompt: 'Copy CA',
  nextExam: 'NEXT EXAM',
  beatThis: 'BEAT THIS',
  newExam: 'NEW EXAM',
  shareOnX: 'SHARE ON X',
  challengeFriend: 'CHALLENGE A FRIEND',
  challengePickTitle: 'PICK A COUNTRY',
  challengePickSub: 'Send a friend their final exam. Closer = more points.',
  challengeSearch: 'Search…',
  challengeBack: 'BACK',
  assignedExam: 'ASSIGNED EXAM',
  challengeShare: 'Your final exam: {place}. Hit the capital. Closer = more points.',
  ogChallengeTitle: 'CHALLENGE · {place}',
  ogChallengeDescription:
    'Your final exam: hit {place}’s capital. Closer = more points. Nobody graduates.',
  impact: 'IMPACT',
  bullseyeStamp: 'BULLSEYE',
  muteOn: 'SND',
  muteOff: 'OFF',
  unmuteAria: 'Unmute sound',
  muteAria: 'Mute sound',
  soundOn: 'Sound on',
  soundOff: 'Sound off',
  capitalOf: '{place} capital',
  kmFromCapital: '{km} km from {place} capital',
  kmFromNamedCapital: '{km} km from {capital} ({place})',
  rangeCap: '{place} capital',
  toCapital: 'to capital',
  youWin: 'YOU WIN · {yours} km vs their {theirs} km',
  theyWin: 'THEY WIN · {yours} km vs their {theirs} km · {rival} laughs',
  draw: 'DRAW · both {yours} km · rematch mandatory',
  onDex: '{ticker} on Dexscreener',
  buyNukes: 'BUY NUKES',
  openAcademy: 'Open NUKE ACADEMY',
  skip: 'SKIP',
  skipAria: 'Skip cinematic',
  briefingKicker: 'INTEL BRIEFING',
  briefingAboutNext: 'NEXT TARGET · {place}',
  briefingAboutPrev: 'AFTER-ACTION · {place}',
  briefingCorrect: 'CORRECT · +{points} POINTS',
  briefingWrong: 'WRONG · {points} POINTS · {answer}',
  briefingContinue: 'CONTINUE',
  capitalUnknown: 'unlisted capital',
  people: 'PEOPLE',
  estCasualties: 'EST. CASUALTIES',
  noCasualties: 'NO CASUALTIES',
  hitWrongCountry: 'You hit {place} ({pop} people), wrong country.',
  hitHomeSoil: 'You hit {place} — missed the capital.',
  hitOcean: 'You hit open ocean.',
  hitNearCity: 'You hit near {city}.',
  grades: {
    BULLSEYE: 'BULLSEYE',
    'DIRECT HIT': 'DIRECT HIT',
    'CLOSE CALL': 'CLOSE CALL',
    'NEAR MISS': 'NEAR MISS',
    'FAR OFF': 'FAR OFF',
    MISS: 'MISS',
  },
  planes: {
    sparrow: { name: 'Sparrow', blurb: 'Light · snappy turns' },
    hammer: { name: 'Office Chair', blurb: 'Heavy · somehow airborne' },
    comet: { name: 'Party Balloon', blurb: 'Fast · dignity optional' },
    duck: { name: 'Rubber Duck', blurb: 'Quacks under pressure · snappy turns' },
    paper: { name: 'Paper Plane', blurb: 'Folded in a rush · turns like guilt' },
    pigeon: { name: 'City Pigeon', blurb: 'Judges you · steals fries mid-mission' },
    stapler: { name: 'Red Stapler', blurb: 'Bureaucratic lift · forms in triplicate' },
    cart: { name: 'Shopping Cart', blurb: 'One wonky wheel · still cleared for takeoff' },
    broom: { name: "Witch's Broom", blurb: 'Unlicensed · excellent cornering' },
    couch: { name: 'Sectional Sofa', blurb: 'Needs two adults · still takes the runway' },
    hotdog: { name: 'Hot Dog Cart', blurb: 'Mustard vapor trail · dignity refunded' },
    toaster: { name: 'Toasted Goose', blurb: 'Pops at altitude · slightly burnt' },
    unicorn: { name: 'Pool Unicorn', blurb: 'Inflatable · emotionally available' },
    drone: { name: 'Suspicious Drone', blurb: 'Buzzes politely · maps your lunch' },
    taxi: { name: 'Yellow Cab', blurb: 'Meter running · destination optional' },
    skate: { name: 'Flying Deck', blurb: 'No brakes · only vibes' },
    fridge: { name: 'Mini Fridge', blurb: 'Cold storage · warmer diplomacy' },
    swan: { name: 'Angry Swan', blurb: 'Hisses at air traffic · lethal grace' },
    blimp: { name: 'Parade Blimp', blurb: 'Nearly stationary · waves at the crater' },
    needle: { name: 'Hypersonic Needle', blurb: 'Leaves before you aim · turns are a rumor' },
    flea: { name: 'Orbital Flea', blurb: 'Tiny · turns like a lawsuit' },
    meeting: { name: 'Calendar Invite', blurb: 'This could’ve been a flyby · still in the lobby' },
    replyall: { name: 'Reply-All', blurb: 'Hits every continent except the one you meant' },
    uncle: { name: 'Thanksgiving Uncle', blurb: 'Spins in place · has thoughts about the target' },
    tos: { name: 'Terms of Service', blurb: 'You scrolled past the turn radius · good luck' },
  },
  nukes: {
    firefly: { name: 'Diplomatic Option', blurb: 'Quick fall · “we regret nothing”' },
    thunder: { name: 'Oops', blurb: 'Balanced yield · unbalanced decisions' },
    goliath: { name: 'Family Size', blurb: 'Slow fall · feeds the whole hemisphere' },
    sneeze: { name: 'Polite Cough', blurb: 'Tiny yield · still clears a room' },
    hr: { name: 'Performance Review', blurb: 'Precise · permanently on your record' },
    brunch: { name: 'Unlimited Mimosas', blurb: 'Bottomless · so is the crater' },
    spam: { name: 'Newsletter', blurb: 'Unsubscribes nothing · drifts everywhere' },
    karaoke: { name: 'Final Chorus', blurb: 'Everyone sings · nobody survives the key change' },
    apology: { name: 'Thoughts & Prayers', blurb: 'Symbolic yield · chaotic aim' },
    divorce: { name: 'Mutual Agreement', blurb: 'Splits the difference · and the coastline' },
    wifi: { name: 'Free Public Wi‑Fi', blurb: 'Connects instantly · locates poorly' },
    birthday: { name: 'Surprise Party', blurb: 'They knew · they still walked in' },
    budget: { name: 'Midyear Adjustment', blurb: 'Cuts deep · lands on schedule' },
    sequel: { name: 'Trilogy Pack', blurb: 'Part three of three · somehow worse' },
    coupon: { name: 'Expires Today', blurb: 'Rushed drop · BOGO crater' },
    lullaby: { name: 'White Noise', blurb: 'Soft descent · rude awakening' },
    continent: { name: 'Continental Breakfast', blurb: 'Feeds a tectonic plate · tip optional' },
    pin: { name: 'Exact Change', blurb: 'Surgical · insultingly precise' },
    meteor: { name: 'Same-Day Delivery', blurb: 'Drops like a rock · tracking not included' },
    cc: { name: 'CC’d Everyone', blurb: 'Yield for the group chat · aim for the void' },
    nda: { name: 'NDA Violation', blurb: 'Huge · nowhere near · legally binding crater' },
    readreceipt: { name: 'Read Receipt', blurb: 'Arrives instantly · awkward silence follows' },
    unsubscribe: { name: 'One-Click Unsubscribe', blurb: 'Never quite lands · somehow still subscribed' },
    shareholder: { name: 'Shareholder Value', blurb: 'Eats the map · stock up 0.3%' },
  },
}

/** Spanish — informal LatAm-friendly, not brochure Spanish. */
const es: Copy = {
  metaDescription:
    'NUKE ACADEMY — academia orbital ilegítima. Única materia: NUKES. Bombardea una capital. Más cerca = más puntos.',
  ogDescription:
    'Única materia: NUKES. Orbita la Tierra. Bombardea una capital. Los océanos son tus mentores. Nadie se gradúa.',
  ogShareTitle: 'ÚLTIMA HORA: EXPLOSIÓN NUCLEAR a {km} km de {place}',
  ogShareDescription:
    'Alguien apuntó una nuke a la capital de {place} y {outcome}.',
  shareTweet:
    'ÚLTIMA HORA: EXPLOSIÓN NUCLEAR a {km} km de {place}\n\nAlguien apuntó una nuke a la capital de {place} y {outcome}.',
  shareOutcomeHit: 'la acertó',
  shareOutcomeClose: 'casi la acierta',
  shareOutcomeMiss: 'falló',
  motto: 'MÁS CERCA = MÁS PUNTOS',
  accreditation: 'ESCUELA ORBITAL DE ACABADO',
  tagline:
    'Academia orbital ilegítima. Única materia: NUKE. Examen final: darle a una capital. Los océanos te dan clase.',
  loadoutKicker: 'MATRÍCULA EN CURSO',
  loadoutTitle: 'EQUÍPATE',
  loadoutPlaneLabel: 'ELIGE AVIÓN',
  loadoutNukeLabel: 'ELIGE NUKE',
  loadoutCursed: 'MALDITO',
  loadoutControls: 'DESLIZA PARA VOLAR · BOMBARDEALO / ESPACIO · WASD · SIN DEVOLUCIONES',
  shareSuffix: '— NUKE ACADEMY · con NUKES',
  loading: 'CARGANDO…',
  nukeIt: 'BOMBARDEALO',
  takeOff: 'DESPEGAR',
  target: 'OBJETIVO',
  rival: 'RIVAL',
  score: 'PUNTOS',
  points: 'PUNTOS',
  hint: 'WASD / desliza · ESPACIO suelta',
  todaysExam: 'EXAMEN DE HOY',
  copyCa: 'COPIAR CA',
  copied: 'COPIADO',
  linkCopied: 'ENLACE COPIADO',
  caPending: 'El CA cae pronto',
  copyCaPrompt: 'Copiar CA',
  nextExam: 'SIGUIENTE EXAMEN',
  beatThis: 'SUPÉRALO',
  newExam: 'NUEVO EXAMEN',
  shareOnX: 'COMPARTIR EN X',
  challengeFriend: 'RETA A UN AMIGO',
  challengePickTitle: 'ELIGE UN PAÍS',
  challengePickSub: 'Mándale a un amigo su examen final. Más cerca = más puntos.',
  challengeSearch: 'Buscar…',
  challengeBack: 'ATRÁS',
  assignedExam: 'EXAMEN ASIGNADO',
  challengeShare: 'Tu examen final: {place}. Dale a la capital. Más cerca = más puntos.',
  ogChallengeTitle: 'RETO · {place}',
  ogChallengeDescription:
    'Tu examen final: dale a la capital de {place}. Más cerca = más puntos. Nadie se gradúa.',
  impact: 'IMPACTO',
  bullseyeStamp: 'EN EL CLAVO',
  muteOn: 'SND',
  muteOff: 'OFF',
  unmuteAria: 'Activar sonido',
  muteAria: 'Silenciar',
  soundOn: 'Sonido activado',
  soundOff: 'Sonido apagado',
  capitalOf: 'capital de {place}',
  kmFromCapital: '{km} km de la capital de {place}',
  kmFromNamedCapital: '{km} km de {capital} ({place})',
  rangeCap: 'capital de {place}',
  toCapital: 'a la capital',
  youWin: 'GANAS TÚ · {yours} km vs sus {theirs} km',
  theyWin: 'GANAN ELLOS · {yours} km vs sus {theirs} km · {rival} se ríe',
  draw: 'EMPATE · ambos {yours} km · revancha obligatoria',
  onDex: '{ticker} en Dexscreener',
  buyNukes: 'COMPRAR NUKES',
  openAcademy: 'Abrir NUKE ACADEMY',
  skip: 'SALTAR',
  skipAria: 'Saltar cinemática',
  briefingKicker: 'INFORME DE INTELIGENCIA',
  briefingAboutNext: 'PRÓXIMO OBJETIVO · {place}',
  briefingAboutPrev: 'DESPUÉS DEL IMPACTO · {place}',
  briefingCorrect: 'CORRECTO · +{points} PUNTOS',
  briefingWrong: 'INCORRECTO · {points} PUNTOS · {answer}',
  briefingContinue: 'CONTINUAR',
  capitalUnknown: 'capital sin ficha',
  people: 'PERSONAS',
  estCasualties: 'BAJAS EST.',
  noCasualties: 'SIN BAJAS',
  hitWrongCountry: 'Caíste en {place} ({pop} personas), país equivocado.',
  hitHomeSoil: 'Caíste en {place} — fallaste la capital.',
  hitOcean: 'Caíste en mar abierto.',
  hitNearCity: 'Caíste cerca de {city}.',
  grades: {
    BULLSEYE: 'EN EL CLAVO',
    'DIRECT HIT': 'IMPACTO DIRECTO',
    'CLOSE CALL': 'POR POQUITO',
    'NEAR MISS': 'CASI',
    'FAR OFF': 'LEJÍSIMOS',
    MISS: 'FALLO',
  },
  planes: {
    sparrow: { name: 'Gorrión', blurb: 'Ligero · giros rápidos' },
    hammer: { name: 'Silla de oficina', blurb: 'Pesado · y sin embargo vuela' },
    comet: { name: 'Globo de fiesta', blurb: 'Rápido · dignidad opcional' },
    duck: { name: 'Patito de goma', blurb: 'Hace cuac bajo presión · giros rápidos' },
    paper: { name: 'Avión de papel', blurb: 'Doblado a las apuradas · gira como la culpa' },
    pigeon: { name: 'Paloma urbana', blurb: 'Te juzga · te roba las papas en pleno vuelo' },
    stapler: { name: 'Engrapadora roja', blurb: 'Ascenso burocrático · formularios por triplicado' },
    cart: { name: 'Carrito del súper', blurb: 'Una rueda chueca · igual despega' },
    broom: { name: 'Escoba de bruja', blurb: 'Sin licencia · esquinas de lujo' },
    couch: { name: 'Sofá modular', blurb: 'Necesita dos adultos · igual usa la pista' },
    hotdog: { name: 'Carrito de hot dogs', blurb: 'Estela de mostaza · dignidad reembolsada' },
    toaster: { name: 'Ganso tostado', blurb: 'Salta en altitud · un poco quemado' },
    unicorn: { name: 'Unicornio de alberca', blurb: 'Inflable · emocionalmente disponible' },
    drone: { name: 'Dron sospechoso', blurb: 'Zumba con educación · mapea tu almuerzo' },
    taxi: { name: 'Taxi amarillo', blurb: 'Taxímetro corriendo · destino opcional' },
    skate: { name: 'Tabla voladora', blurb: 'Sin frenos · solo vibes' },
    fridge: { name: 'Mini refrigerador', blurb: 'Almacenamiento frío · diplomacia tibia' },
    swan: { name: 'Cisne enojado', blurb: 'Sisea al tráfico aéreo · gracia letal' },
    blimp: { name: 'Dirigible del desfile', blurb: 'Casi quieto · saluda al cráter' },
    needle: { name: 'Aguja hipersónica', blurb: 'Se va antes de apuntar · girar es un rumor' },
    flea: { name: 'Pulga orbital', blurb: 'Chiquita · gira como un juicio' },
    meeting: { name: 'Invitación de calendario', blurb: 'Pudo ser un sobrevuelo · sigue en el lobby' },
    replyall: { name: 'Responder a todos', blurb: 'Pega en todo continente menos el correcto' },
    uncle: { name: 'Tío de Acción de Gracias', blurb: 'Gira en el sitio · tiene opiniones del objetivo' },
    tos: { name: 'Términos de servicio', blurb: 'Te saltaste el radio de giro · suerte' },
  },
  nukes: {
    firefly: { name: 'Opción diplomática', blurb: 'Cae rápido · “no nos arrepentimos”' },
    thunder: { name: 'Ups', blurb: 'Potencia equilibrada · decisiones no' },
    goliath: { name: 'Tamaño familiar', blurb: 'Cae lento · alcanza todo el hemisferio' },
    sneeze: { name: 'Tos educada', blurb: 'Carga chica · igual vacía el salón' },
    hr: { name: 'Evaluación de desempeño', blurb: 'Precisa · queda en tu expediente' },
    brunch: { name: 'Mimosas sin límite', blurb: 'Sin fondo · el cráter tampoco' },
    spam: { name: 'Newsletter', blurb: 'Nadie se da de baja · deriva a todos lados' },
    karaoke: { name: 'Coro final', blurb: 'Todos cantan · nadie sobrevive el cambio de tono' },
    apology: { name: 'Pensamientos y oraciones', blurb: 'Carga simbólica · puntería caótica' },
    divorce: { name: 'Acuerdo mutuo', blurb: 'Parte la diferencia · y la costa' },
    wifi: { name: 'Wi‑Fi público gratis', blurb: 'Conecta al toque · ubica fatal' },
    birthday: { name: 'Fiesta sorpresa', blurb: 'Ya sabían · igual entraron' },
    budget: { name: 'Ajuste de mitad de año', blurb: 'Corta hondo · aterriza a tiempo' },
    sequel: { name: 'Pack trilogía', blurb: 'Parte tres de tres · peor de alguna forma' },
    coupon: { name: 'Vence hoy', blurb: 'Caída apresurada · cráter 2x1' },
    lullaby: { name: 'Ruido blanco', blurb: 'Descenso suave · despertar grosero' },
    continent: { name: 'Desayuno continental', blurb: 'Alimenta una placa tectónica · propina opcional' },
    pin: { name: 'Cambio exacto', blurb: 'Quirúrgico · insultantemente preciso' },
    meteor: { name: 'Entrega el mismo día', blurb: 'Cae como piedra · sin rastreo' },
    cc: { name: 'CC a todos', blurb: 'Potencia para el grupo · puntería al vacío' },
    nda: { name: 'Violación de NDA', blurb: 'Enorme · ni cerca · cráter legalmente vinculante' },
    readreceipt: { name: 'Confirmación de lectura', blurb: 'Llega al toque · silencio incómodo' },
    unsubscribe: { name: 'Cancelar suscripción', blurb: 'Nunca aterriza · sigues suscrito' },
    shareholder: { name: 'Valor para el accionista', blurb: 'Se come el mapa · la acción +0.3%' },
  },
}

/** Russian — conversational internet voice, not перевод с английского. */
const ru: Copy = {
  metaDescription:
    'NUKE ACADEMY — левая орбитальная школа. Единственный предмет: NUKES. Попасть в столицу. Ближе = больше очков.',
  ogDescription:
    'Единственный предмет: NUKES. Летай вокруг Земли. Роняй на столицу. Океаны — твои кураторы. Дипломов нет.',
  ogShareTitle: 'СРОЧНО: ЯДЕРНЫЙ ВЗРЫВ в {km} км от {place}',
  ogShareDescription:
    'Кто-то целился nuke в столицу {place} и {outcome}.',
  shareTweet:
    'СРОЧНО: ЯДЕРНЫЙ ВЗРЫВ в {km} км от {place}\n\nКто-то целился nuke в столицу {place} и {outcome}.',
  shareOutcomeHit: 'попал',
  shareOutcomeClose: 'почти попал',
  shareOutcomeMiss: 'промахнулся',
  motto: 'БЛИЖЕ = БОЛЬШЕ ОЧКОВ',
  accreditation: 'ОРБИТАЛЬНАЯ ШКОЛА ДУРНОГО ТОНА',
  tagline:
    'Левая орбитальная школа. Единственный предмет: NUKE. Экзамен: попасть в столицу. Океаны тебя научат.',
  loadoutKicker: 'ЗАЧИСЛЕНИЕ ИДЁТ',
  loadoutTitle: 'СНАРЯЖАЙСЯ',
  loadoutPlaneLabel: 'ВЫБЕРИ САМОЛЁТ',
  loadoutNukeLabel: 'ВЫБЕРИ NUKE',
  loadoutCursed: 'ПРОКЛЯТО',
  loadoutControls: 'СВАЙП — ЛЁТ · ЖАХНУТЬ / ПРОБЕЛ · WASD · ВОЗВРАТОВ НЕТ',
  shareSuffix: '— NUKE ACADEMY · на NUKES',
  loading: 'ГРУЗИМ…',
  nukeIt: 'ЖАХНУТЬ',
  takeOff: 'ВЗЛЁТ',
  target: 'ЦЕЛЬ',
  rival: 'СОПЕРНИК',
  score: 'ОЧКИ',
  points: 'ОЧКОВ',
  hint: 'WASD / свайп · ПРОБЕЛ сброс',
  todaysExam: 'ЭКЗАМЕН НА СЕГОДНЯ',
  copyCa: 'СКОПИРОВАТЬ CA',
  copied: 'СКОПИРОВАНО',
  linkCopied: 'ССЫЛКА СКОПИРОВАНА',
  caPending: 'CA скоро упадёт',
  copyCaPrompt: 'Скопировать CA',
  nextExam: 'СЛЕДУЮЩИЙ ЭКЗАМЕН',
  beatThis: 'ПОБЕЙ',
  newExam: 'НОВЫЙ ЭКЗАМЕН',
  shareOnX: 'В X',
  challengeFriend: 'ВЫЗОВИ ДРУГА',
  challengePickTitle: 'ВЫБЕРИ СТРАНУ',
  challengePickSub: 'Отправь другу экзамен. Ближе = больше очков.',
  challengeSearch: 'Поиск…',
  challengeBack: 'НАЗАД',
  assignedExam: 'НАЗНАЧЕННЫЙ ЭКЗАМЕН',
  challengeShare: 'Твой экзамен: {place}. Попасть в столицу. Ближе = больше очков.',
  ogChallengeTitle: 'ВЫЗОВ · {place}',
  ogChallengeDescription:
    'Твой экзамен: попасть в столицу {place}. Ближе = больше очков. Дипломов нет.',
  impact: 'УДАР',
  bullseyeStamp: 'В ЯБЛОЧКО',
  muteOn: 'SND',
  muteOff: 'OFF',
  unmuteAria: 'Включить звук',
  muteAria: 'Выключить звук',
  soundOn: 'Звук вкл',
  soundOff: 'Звук выкл',
  capitalOf: 'столица: {place}',
  kmFromCapital: '{km} км от столицы {place}',
  kmFromNamedCapital: '{km} км от {capital} ({place})',
  rangeCap: 'столица {place}',
  toCapital: 'до столицы',
  youWin: 'ТЫ ВЫИГРАЛ · {yours} км против их {theirs} км',
  theyWin: 'ОНИ ВЫИГРАЛИ · {yours} км против их {theirs} км · {rival} ржёт',
  draw: 'НИЧЬЯ · оба {yours} км · реванш обязателен',
  onDex: '{ticker} на Dexscreener',
  buyNukes: 'КУПИТЬ NUKES',
  openAcademy: 'Открыть NUKE ACADEMY',
  skip: 'ПРОПУСТИТЬ',
  skipAria: 'Пропустить катсцену',
  briefingKicker: 'РАЗВЕДБРИФИНГ',
  briefingAboutNext: 'СЛЕДУЮЩАЯ ЦЕЛЬ · {place}',
  briefingAboutPrev: 'ПОСЛЕ УДАРА · {place}',
  briefingCorrect: 'ВЕРНО · +{points} ОЧКОВ',
  briefingWrong: 'НЕВЕРНО · {points} ОЧКОВ · {answer}',
  briefingContinue: 'ДАЛЬШЕ',
  capitalUnknown: 'столица без карточки',
  people: 'ЧЕЛОВЕК',
  estCasualties: 'ОЦЕН. ПОТЕРИ',
  noCasualties: 'БЕЗ ПОТЕРЬ',
  hitWrongCountry: 'Ты попал в {place} ({pop} человек), не та страна.',
  hitHomeSoil: 'Ты попал в {place} — мимо столицы.',
  hitOcean: 'Ты попал в открытый океан.',
  hitNearCity: 'Ты попал рядом с {city}.',
  grades: {
    BULLSEYE: 'В ЯБЛОЧКО',
    'DIRECT HIT': 'ПРЯМОЕ ПОПАДАНИЕ',
    'CLOSE CALL': 'ЧУТЬ-ЧУТЬ',
    'NEAR MISS': 'ПОЧТИ',
    'FAR OFF': 'ДАЛЕКО',
    MISS: 'МИМО',
  },
  planes: {
    sparrow: { name: 'Воробей', blurb: 'Лёгкий · крутые виражи' },
    hammer: { name: 'Офисный стул', blurb: 'Тяжёлый · но как-то летает' },
    comet: { name: 'Шарик с праздника', blurb: 'Быстрый · достоинство опционально' },
    duck: { name: 'Резиновая утка', blurb: 'Крякает под давлением · крутые виражи' },
    paper: { name: 'Бумажный самолётик', blurb: 'Сложен наспех · виражит как совесть' },
    pigeon: { name: 'Городской голубь', blurb: 'Осуждает · крадёт картошку в полёте' },
    stapler: { name: 'Красный степлер', blurb: 'Бюрократический взлёт · формы в трёх экземплярах' },
    cart: { name: 'Тележка из магазина', blurb: 'Одно кривое колесо · всё равно взлетает' },
    broom: { name: 'Метла ведьмы', blurb: 'Без лицензии · отличные повороты' },
    couch: { name: 'Модульный диван', blurb: 'Нужны двое взрослых · всё равно на полосу' },
    hotdog: { name: 'Тележка с хот-догами', blurb: 'Горчичный след · достоинство возвращено' },
    toaster: { name: 'Поджаренный гусь', blurb: 'Выпрыгивает на высоте · чуть подгорел' },
    unicorn: { name: 'Надувной единорог', blurb: 'Надувной · эмоционально доступный' },
    drone: { name: 'Подозрительный дрон', blurb: 'Жужжит вежливо · снимает твой обед' },
    taxi: { name: 'Жёлтое такси', blurb: 'Счётчик тикает · пункт назначения опционален' },
    skate: { name: 'Летающая доска', blurb: 'Без тормозов · только вайб' },
    fridge: { name: 'Мини-холодильник', blurb: 'Холодное хранение · тёплая дипломатия' },
    swan: { name: 'Злой лебедь', blurb: 'Шипит на диспетчеров · смертельная грация' },
    blimp: { name: 'Парадный дирижабль', blurb: 'Почти стоит · машет кратеру' },
    needle: { name: 'Гиперзвуковая игла', blurb: 'Улетает до прицела · повороты — слух' },
    flea: { name: 'Орбитальная блоха', blurb: 'Крошечная · виражит как иск' },
    meeting: { name: 'Приглашение в календарь', blurb: 'Могло быть пролётом · всё ещё в лобби' },
    replyall: { name: 'Ответить всем', blurb: 'Попадает во все континенты кроме нужного' },
    uncle: { name: 'Дядя на День благодарения', blurb: 'Крутится на месте · есть мнение о цели' },
    tos: { name: 'Условия использования', blurb: 'Пролистал радиус разворота · удачи' },
  },
  nukes: {
    firefly: { name: 'Дипломатический вариант', blurb: 'Быстро падает · «ни о чём не жалеем»' },
    thunder: { name: 'Упс', blurb: 'Нормальный заряд · ненормальные решения' },
    goliath: { name: 'Семейная упаковка', blurb: 'Медленно падает · на всё полушарие' },
    sneeze: { name: 'Вежливый кашель', blurb: 'Крошечный заряд · комнату всё равно чистит' },
    hr: { name: 'Оценка эффективности', blurb: 'Точная · навсегда в личном деле' },
    brunch: { name: 'Безлимитные мимозы', blurb: 'Без дна · кратер тоже' },
    spam: { name: 'Рассылка', blurb: 'Отписаться нельзя · сносит куда угодно' },
    karaoke: { name: 'Финальный припев', blurb: 'Все поют · никто не переживает модуляцию' },
    apology: { name: 'Соболезнования', blurb: 'Символический заряд · хаотичный прицел' },
    divorce: { name: 'Обоюдное согласие', blurb: 'Делит разницу · и береговую линию' },
    wifi: { name: 'Бесплатный Wi‑Fi', blurb: 'Подключается мгновенно · целится кое-как' },
    birthday: { name: 'Сюрприз-вечеринка', blurb: 'Они знали · всё равно зашли' },
    budget: { name: 'Полугодовая корректировка', blurb: 'Режет глубоко · садится вовремя' },
    sequel: { name: 'Трилогия', blurb: 'Часть три из трёх · почему-то хуже' },
    coupon: { name: 'Истекает сегодня', blurb: 'Спешный сброс · кратер 1+1' },
    lullaby: { name: 'Белый шум', blurb: 'Мягкий спуск · грубое пробуждение' },
    continent: { name: 'Континентальный завтрак', blurb: 'Кормит тектоническую плиту · чаевые по желанию' },
    pin: { name: 'Без сдачи', blurb: 'Хирургически · оскорбительно точно' },
    meteor: { name: 'Доставка в тот же день', blurb: 'Падает как камень · трекинг не включён' },
    cc: { name: 'В копию всем', blurb: 'Заряд для чата · прицел в пустоту' },
    nda: { name: 'Нарушение NDA', blurb: 'Огромный · мимо · юридически обязывающий кратер' },
    readreceipt: { name: 'Прочитано', blurb: 'Приходит мгновенно · потом неловкая тишина' },
    unsubscribe: { name: 'Отписаться в один клик', blurb: 'Никак не приземлится · подписка жива' },
    shareholder: { name: 'Ценность для акционеров', blurb: 'Съедает карту · акции +0.3%' },
  },
}

/** Chinese (simplified) — casual, not 尊贵的用户. */
const zh: Copy = {
  metaDescription: 'NUKE ACADEMY — 不正经的轨道进修学校。唯一科目：NUKES。砸首都。越近分越高。',
  ogDescription: '唯一科目：NUKES。绕地球飞。砸首都。海洋是你的导师。没人能毕业。',
  ogShareTitle: '突发新闻：核爆炸 · 距 {place} {km} 公里',
  ogShareDescription: '有人瞄准 {place} 的首都扔了核弹，{outcome}。',
  shareTweet: '突发新闻：核爆炸 · 距 {place} {km} 公里\n\n有人瞄准 {place} 的首都扔了核弹，{outcome}。',
  shareOutcomeHit: '命中了',
  shareOutcomeClose: '几乎命中',
  shareOutcomeMiss: '没打中',
  motto: '越近 = 分越高',
  accreditation: '轨道进修学校',
  tagline: '不正经的轨道进修学校。唯一科目：NUKE。期末考：砸中首都。海洋会教你做人。',
  loadoutKicker: '报名进行中',
  loadoutTitle: '整装备战',
  loadoutPlaneLabel: '选飞机',
  loadoutNukeLabel: '选 NUKE',
  loadoutCursed: '诅咒',
  loadoutControls: '滑动飞行 · 开炸 / 空格投下 · WASD · 概不退款',
  shareSuffix: '— NUKE ACADEMY · 由 NUKES 驱动',
  loading: '加载中…',
  nukeIt: '开炸',
  takeOff: '起飞',
  target: '目标',
  rival: '对手',
  score: '分数',
  points: '分',
  hint: 'WASD / 滑动飞 · 空格投下',
  todaysExam: '今日考题',
  copyCa: '复制 CA',
  copied: '已复制',
  linkCopied: '链接已复制',
  caPending: 'CA 马上掉下来',
  copyCaPrompt: '复制 CA',
  nextExam: '下一场',
  beatThis: '干翻他',
  newExam: '新考试',
  shareOnX: '分享到 X',
  challengeFriend: '挑战好友',
  challengePickTitle: '选一个国家',
  challengePickSub: '把期末考发给朋友。越近分越高。',
  challengeSearch: '搜索…',
  challengeBack: '返回',
  assignedExam: '指定考题',
  challengeShare: '你的期末考：{place}。砸中首都。越近分越高。',
  ogChallengeTitle: '挑战 · {place}',
  ogChallengeDescription: '你的期末考：砸中 {place} 的首都。越近分越高。没人能毕业。',
  impact: '命中报告',
  bullseyeStamp: '正中靶心',
  muteOn: 'SND',
  muteOff: 'OFF',
  unmuteAria: '打开声音',
  muteAria: '静音',
  soundOn: '声音开',
  soundOff: '声音关',
  capitalOf: '{place} 首都',
  kmFromCapital: '距 {place} 首都 {km} 公里',
  kmFromNamedCapital: '距 {capital}（{place}）{km} 公里',
  rangeCap: '{place} 首都',
  toCapital: '到首都',
  youWin: '你赢了 · {yours} 公里 vs 对方 {theirs} 公里',
  theyWin: '对面赢了 · {yours} 公里 vs 对方 {theirs} 公里 · {rival} 在笑',
  draw: '平局 · 都是 {yours} 公里 · 必须再来',
  onDex: '{ticker} 在 Dexscreener',
  buyNukes: '买 NUKES',
  openAcademy: '打开 NUKE ACADEMY',
  skip: '跳过',
  skipAria: '跳过过场',
  briefingKicker: '情报简报',
  briefingAboutNext: '下一目标 · {place}',
  briefingAboutPrev: '打击复盘 · {place}',
  briefingCorrect: '正确 · +{points} 分',
  briefingWrong: '错误 · {points} 分 · {answer}',
  briefingContinue: '继续',
  capitalUnknown: '未登记首都',
  people: '人',
  estCasualties: '预估伤亡',
  noCasualties: '无伤亡',
  hitWrongCountry: '你砸中了 {place}（{pop} 人），国家错了。',
  hitHomeSoil: '你砸中了 {place}——没砸中首都。',
  hitOcean: '你砸进了开阔洋面。',
  hitNearCity: '你砸在 {city} 附近。',
  grades: {
    BULLSEYE: '正中靶心',
    'DIRECT HIT': '直接命中',
    'CLOSE CALL': '擦边',
    'NEAR MISS': '差一点',
    'FAR OFF': '差远了',
    MISS: '歪了',
  },
  planes: {
    sparrow: { name: '麻雀', blurb: '轻巧 · 转弯狠' },
    hammer: { name: '办公椅', blurb: '沉重 · 居然能飞' },
    comet: { name: '派对气球', blurb: '快 · 尊严可选' },
    duck: { name: '橡皮鸭', blurb: '压力下会叫 · 转弯狠' },
    paper: { name: '纸飞机', blurb: '匆忙折的 · 转弯像愧疚' },
    pigeon: { name: '城市鸽子', blurb: '审判你 · 飞行途中偷薯条' },
    stapler: { name: '红色订书机', blurb: '官僚升力 · 表格一式三份' },
    cart: { name: '购物车', blurb: '一轮歪的 · 照样起飞' },
    broom: { name: '女巫扫帚', blurb: '无牌驾驶 · 弯道专家' },
    couch: { name: '组合沙发', blurb: '需两名成人 · 照样上跑道' },
    hotdog: { name: '热狗车', blurb: '芥末尾迹 · 尊严已退款' },
    toaster: { name: '烤鹅', blurb: '高空弹出 · 略微焦了' },
    unicorn: { name: '泳池独角兽', blurb: '充气的 · 情感上很有空' },
    drone: { name: '可疑无人机', blurb: '礼貌嗡嗡 · 测绘你的午餐' },
    taxi: { name: '黄色出租车', blurb: '计价器在跑 · 目的地可选' },
    skate: { name: '飞行滑板', blurb: '没有刹车 · 只有氛围' },
    fridge: { name: '迷你冰箱', blurb: '冷藏 · 外交偏温' },
    swan: { name: '愤怒天鹅', blurb: '对空管嘶叫 · 致命优雅' },
  },
  nukes: {
    firefly: { name: '外交选项', blurb: '落得快 · “我们毫无悔意”' },
    thunder: { name: '哎呀', blurb: '当量正常 · 决策不正常' },
    goliath: { name: '家庭装', blurb: '落得慢 · 喂饱整个半球' },
    sneeze: { name: '礼貌咳嗽', blurb: '当量很小 · 照样清场' },
    hr: { name: '绩效面谈', blurb: '精准 · 永久记入档案' },
    brunch: { name: '无限含羞草', blurb: '见底不了 · 坑也是' },
    spam: { name: '电子报', blurb: '退订无效 · 到处飘' },
    karaoke: { name: '最终副歌', blurb: '全员开唱 · 没人扛过转调' },
    apology: { name: '慰问与祈祷', blurb: '象征性当量 · 混乱瞄准' },
    divorce: { name: '双方协议', blurb: '对半分 · 海岸线也是' },
    wifi: { name: '免费公共 Wi‑Fi', blurb: '秒连 · 定位离谱' },
    birthday: { name: '惊喜派对', blurb: '他们知道 · 还是走进去了' },
    budget: { name: '年中调整', blurb: '砍得深 · 准时落地' },
    sequel: { name: '三部曲套装', blurb: '第三部 · 莫名更糟' },
    coupon: { name: '今日到期', blurb: '匆忙投放 · 买一送一坑' },
    lullaby: { name: '白噪音', blurb: '温柔下落 · 粗鲁叫醒' },
    continent: { name: '欧陆早餐', blurb: '喂饱一块板块 · 小费自愿' },
    pin: { name: '正好不用找零', blurb: '外科级 · 精确到侮辱人' },
    meteor: { name: '当日达', blurb: '落得像石头 · 不含轨迹追踪' },
    cc: { name: '抄送所有人', blurb: '当量给群聊 · 瞄准给虚空' },
    nda: { name: '违反保密协议', blurb: '巨大 · 偏到离谱 · 有法律效力的坑' },
    readreceipt: { name: '已读回执', blurb: '秒到 · 尴尬沉默跟上' },
    unsubscribe: { name: '一键退订', blurb: '永远落不准 · 居然还在订阅' },
    shareholder: { name: '股东价值', blurb: '吃掉地图 · 股价 +0.3%' },
  },
}

/** Japanese — casual game voice, not stiff keigo. */
const ja: Copy = {
  metaDescription:
    'NUKE ACADEMY — いかがわしい軌道フィニッシングスクール。科目はNUKESだけ。首都に落とせ。近いほど高得点。',
  ogDescription:
    '科目はNUKESだけ。地球を周回。首都にドロップ。海がメンター。卒業者ゼロ。',
  ogShareTitle: '速報：核爆発 · {place}から {km} km',
  ogShareDescription: '誰かが{place}の首都にnukeを狙って{outcome}。',
  shareTweet: '速報：核爆発 · {place}から {km} km\n\n誰かが{place}の首都にnukeを狙って{outcome}。',
  shareOutcomeHit: '命中した',
  shareOutcomeClose: 'あと一歩だった',
  shareOutcomeMiss: '外した',
  motto: '近いほど高得点',
  accreditation: '軌道フィニッシングスクール',
  tagline:
    'いかがわしい軌道スクール。科目はNUKEだけ。期末：首都に当てろ。海がメンター。誰も卒業しない。',
  loadoutKicker: '入学手続き中',
  loadoutTitle: '装備しろ',
  loadoutPlaneLabel: '機体を選べ',
  loadoutNukeLabel: 'NUKEを選べ',
  loadoutCursed: '呪い',
  loadoutControls: 'スワイプで飛行 · ぶっ放せ / スペース投下 · WASD · 返金なし',
  shareSuffix: '— NUKE ACADEMY · NUKES搭載',
  loading: '読み込み中…',
  nukeIt: 'ぶっ放せ',
  takeOff: '離陸',
  target: '目標',
  rival: 'ライバル',
  score: 'スコア',
  points: 'ポイント',
  hint: 'WASD / スワイプ飛行 · スペース投下',
  todaysExam: '本日の試験',
  copyCa: 'CAをコピー',
  copied: 'コピーした',
  linkCopied: 'リンクをコピーした',
  caPending: 'CA、もうすぐ落ちる',
  copyCaPrompt: 'CAをコピー',
  nextExam: '次の試験',
  beatThis: 'これ超えろ',
  newExam: '新しい試験',
  shareOnX: 'Xでシェア',
  challengeFriend: '友だちに挑戦',
  challengePickTitle: '国を選べ',
  challengePickSub: '友だちに期末試験を送れ。近いほど高得点。',
  challengeSearch: '検索…',
  challengeBack: '戻る',
  assignedExam: '指定試験',
  challengeShare: '期末試験：{place}。首都に落とせ。近いほど高得点。',
  ogChallengeTitle: '挑戦 · {place}',
  ogChallengeDescription: '期末試験：{place}の首都に落とせ。近いほど高得点。卒業者ゼロ。',
  impact: '着弾',
  bullseyeStamp: 'ど真ん中',
  muteOn: 'SND',
  muteOff: 'OFF',
  unmuteAria: 'ミュート解除',
  muteAria: 'ミュート',
  soundOn: '音オン',
  soundOff: '音オフ',
  capitalOf: '{place}の首都',
  kmFromCapital: '{place}の首都まで {km} km',
  kmFromNamedCapital: '{capital}（{place}）まで {km} km',
  rangeCap: '{place}の首都',
  toCapital: '首都まで',
  youWin: '勝ち · {yours} km vs 相手 {theirs} km',
  theyWin: '負け · {yours} km vs 相手 {theirs} km · {rival}が笑ってる',
  draw: '引き分け · どっちも {yours} km · 再戦マスト',
  onDex: 'Dexscreenerの{ticker}',
  buyNukes: 'NUKESを買う',
  openAcademy: 'NUKE ACADEMYを開く',
  skip: 'スキップ',
  skipAria: '演出をスキップ',
  briefingKicker: 'インテル・ブリーフィング',
  briefingAboutNext: '次の標的 · {place}',
  briefingAboutPrev: '着弾後レビュー · {place}',
  briefingCorrect: '正解 · +{points} POINTS',
  briefingWrong: '不正解 · {points} POINTS · {answer}',
  briefingContinue: '続ける',
  capitalUnknown: '未登録の首都',
  people: '人',
  estCasualties: '推定被害',
  noCasualties: '被害なし',
  hitWrongCountry: '{place}に着弾（{pop}人）、国が違う。',
  hitHomeSoil: '{place}に着弾——首都は外した。',
  hitOcean: '外洋に着弾。',
  hitNearCity: '{city}の近くに着弾。',
  grades: {
    BULLSEYE: 'ど真ん中',
    'DIRECT HIT': '直撃',
    'CLOSE CALL': '惜しい',
    'NEAR MISS': 'あと一歩',
    'FAR OFF': '遠い',
    MISS: 'ハズレ',
  },
  planes: {
    sparrow: { name: 'スズメ', blurb: '軽い · 切れ味ある旋回' },
    hammer: { name: 'オフィスチェア', blurb: '重い · なぜか飛ぶ' },
    comet: { name: 'パーティー風船', blurb: '速い · 尊厳はオプション' },
    duck: { name: 'ゴムのアヒル', blurb: 'プレッシャーで鳴く · 切れ味ある旋回' },
    paper: { name: '紙飛行機', blurb: '急いで折った · 罪悪感みたいに曲がる' },
    pigeon: { name: '街のハト', blurb: 'あなたを審判 · 飛行中にフライを盗む' },
    stapler: { name: '赤いホッチキス', blurb: '官僚的揚力 · 書類は三部提出' },
    cart: { name: '買い物カート', blurb: '片輪ぐらぐら · それでも離陸' },
    broom: { name: '魔女のほうき', blurb: '無免許 · コーナリング神' },
    couch: { name: 'セクショナルソファ', blurb: '大人二人が必要 · それでも滑走路へ' },
    hotdog: { name: 'ホットドッグカート', blurb: 'マスタードの航跡 · 尊厳は返金済み' },
    toaster: { name: 'トーストされたガチョウ', blurb: '高度でポップ · ちょっと焦げてる' },
    unicorn: { name: 'プールのユニコーン', blurb: '空気入り · 感情的には空いてる' },
    drone: { name: '怪しいドローン', blurb: '丁寧にブンブン · 昼ごはんを測量' },
    taxi: { name: '黄色いタクシー', blurb: 'メーター稼働中 · 行き先はオプション' },
    skate: { name: '空飛ぶデッキ', blurb: 'ブレーキなし · バイブスだけ' },
    fridge: { name: 'ミニ冷蔵庫', blurb: '冷蔵保管 · 外交はぬるめ' },
    swan: { name: '怒りの白鳥', blurb: '管制にシャー · 致死的エレガンス' },
    blimp: { name: 'パレード飛行船', blurb: 'ほぼ静止 · クレーターに手を振る' },
    needle: { name: '極超音速ニードル', blurb: '照準前に出発 · 旋回は噂' },
    flea: { name: '軌道ノミ', blurb: '極小 · 訴訟みたいに曲がる' },
    meeting: { name: 'カレンダー招待', blurb: 'フライバイでよかった · まだロビー' },
    replyall: { name: '全員に返信', blurb: '全大陸に当たる · 狙ったとこ以外' },
    uncle: { name: 'サンクスギビングの叔父', blurb: 'その場で回転 · 目標について意見あり' },
    tos: { name: '利用規約', blurb: '旋回半径をスルーした · がんばれ' },
  },
  nukes: {
    firefly: { name: '外交オプション', blurb: '速い落下 · 「後悔などない」' },
    thunder: { name: 'おっと', blurb: 'バランス良い威力 · バランス悪い判断' },
    goliath: { name: 'ファミリーサイズ', blurb: '遅い落下 · 半球まるごとごちそう' },
    sneeze: { name: '上品な咳', blurb: '小さな威力 · それでも場を清める' },
    hr: { name: '人事評価', blurb: '精密 · 永久に記録される' },
    brunch: { name: '飲み放題ミモザ', blurb: '底なし · クレーターも' },
    spam: { name: 'ニュースレター', blurb: '解除できない · どこへでも流れる' },
    karaoke: { name: 'ファイナルコーラス', blurb: '全員歌う · 転調で誰も生き残れない' },
    apology: { name: 'お祈りしています', blurb: '象徴的威力 · 狙いカオス' },
    divorce: { name: '合意の上で', blurb: '差を折半 · 海岸線も' },
    wifi: { name: '無料公衆Wi‑Fi', blurb: '即接続 · 測位は絶望' },
    birthday: { name: 'サプライズパーティー', blurb: 'バレてた · それでも入ってきた' },
    budget: { name: '年央調整', blurb: '深く切る · 定時着弾' },
    sequel: { name: '三部作パック', blurb: '三部の三 · なぜか最悪' },
    coupon: { name: '本日限り', blurb: '急ぎ投下 · クレーター1+1' },
    lullaby: { name: 'ホワイトノイズ', blurb: 'やさしい落下 · 乱暴な目覚め' },
    continent: { name: 'コンチネンタル朝食', blurb: 'プレート丸ごとごちそう · チップ任意' },
    pin: { name: 'ぴったり釣りなし', blurb: '外科級 · 侮辱的な精度' },
    meteor: { name: '当日配送', blurb: '石みたいに落ちる · 追跡なし' },
    cc: { name: '全員CC', blurb: '威力はグループ用 · 狙いは虚空' },
    nda: { name: 'NDA違反', blurb: '巨大 · 全然違う場所 · 法的拘束力あるクレーター' },
    readreceipt: { name: '既読', blurb: '即着 · 気まずい沈黙が続く' },
    unsubscribe: { name: 'ワンクリック配信停止', blurb: '着弾しない · なぜか配信中' },
    shareholder: { name: '株主価値', blurb: '地図を食う · 株+0.3%' },
  },
}

const ALL: Record<Locale, Copy> = { en, es, ru, zh, ja }

export function copy(locale: Locale = getLocale()): Copy {
  return ALL[locale] ?? en
}

export function t(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''))
}

export function gradeLabel(grade: string, locale: Locale = getLocale()): string {
  return copy(locale).grades[grade] ?? grade
}
