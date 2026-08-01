/** Contested / awkward map units — quizzes in every UI locale. Controversy is curriculum. */

import type { Locale } from '../i18n/locale'

export type DisputedBriefingQuestion = {
  prompt: string
  choices: [string, string, string]
  correct: 0 | 1 | 2
}

type LocalizedBank = Record<Locale, DisputedBriefingQuestion[]>

export const BRIEFING_BANK_DISPUTED: Record<string, LocalizedBank> = {
  PSX: {
    en: [
      {
        prompt: 'Olive groves and olive oil are staples of…',
        choices: ['Palestinian / Levantine cuisine', 'Icelandic cuisine', 'Mongolian cuisine'],
        correct: 0,
      },
      {
        prompt: 'The Gaza Strip gives Palestine a coast on the…',
        choices: ['Mediterranean', 'Red Sea', 'Persian Gulf'],
        correct: 0,
      },
      {
        prompt: 'The West Bank and Gaza are the core territories of…',
        choices: ['Palestine', 'Kuwait', 'Oman'],
        correct: 0,
      },
    ],
    es: [
      {
        prompt: 'Los olivos y el aceite de oliva son básicos en la cocina…',
        choices: ['palestina / levantina', 'islandesa', 'mongola'],
        correct: 0,
      },
      {
        prompt: 'La Franja de Gaza da a Palestina costa en el…',
        choices: ['Mediterráneo', 'Mar Rojo', 'Golfo Pérsico'],
        correct: 0,
      },
      {
        prompt: 'Cisjordania y Gaza son los territorios centrales de…',
        choices: ['Palestina', 'Kuwait', 'Omán'],
        correct: 0,
      },
    ],
    ru: [
      {
        prompt: 'Оливки и оливковое масло — основа кухни…',
        choices: ['палестинской / левантийской', 'исландской', 'монгольской'],
        correct: 0,
      },
      {
        prompt: 'Сектор Газа даёт Палестине выход к…',
        choices: ['Средиземному морю', 'Красному морю', 'Персидскому заливу'],
        correct: 0,
      },
      {
        prompt: 'Западный берег и Газа — основные территории…',
        choices: ['Палестины', 'Кувейта', 'Омана'],
        correct: 0,
      },
    ],
    zh: [
      {
        prompt: '橄榄与橄榄油是…饮食的主食',
        choices: ['巴勒斯坦 / 黎凡特', '冰岛', '蒙古'],
        correct: 0,
      },
      {
        prompt: '加沙地带使巴勒斯坦濒临…',
        choices: ['地中海', '红海', '波斯湾'],
        correct: 0,
      },
      {
        prompt: '约旦河西岸与加沙是…的核心领土',
        choices: ['巴勒斯坦', '科威特', '阿曼'],
        correct: 0,
      },
    ],
    ja: [
      {
        prompt: 'オリーブとオリーブオイルが食の基本なのは…',
        choices: ['パレスチナ／レバント', 'アイスランド', 'モンゴル'],
        correct: 0,
      },
      {
        prompt: 'ガザ地区によりパレスチナは…に面する',
        choices: ['地中海', '紅海', 'ペルシャ湾'],
        correct: 0,
      },
      {
        prompt: 'ヨルダン川西岸とガザは…の中核地域',
        choices: ['パレスチナ', 'クウェート', 'オマーン'],
        correct: 0,
      },
    ],
  },

  SAH: {
    en: [
      {
        prompt: 'Laayoune (El Aaiún) is the largest city in…',
        choices: ['Western Sahara', 'Mauritania', 'Mali'],
        correct: 0,
      },
      {
        prompt: 'Western Sahara’s long coast faces the…',
        choices: ['Atlantic', 'Red Sea', 'Caspian'],
        correct: 0,
      },
      {
        prompt: 'The Polisario Front campaigns for independence of…',
        choices: ['Western Sahara', 'Chad', 'Libya'],
        correct: 0,
      },
    ],
    es: [
      {
        prompt: 'El Aaiún es la ciudad más grande del…',
        choices: ['Sáhara Occidental', 'Mauritania', 'Malí'],
        correct: 0,
      },
      {
        prompt: 'La costa del Sáhara Occidental da al…',
        choices: ['Atlántico', 'Mar Rojo', 'Caspio'],
        correct: 0,
      },
      {
        prompt: 'El Frente Polisario busca la independencia del…',
        choices: ['Sáhara Occidental', 'Chad', 'Libia'],
        correct: 0,
      },
    ],
    ru: [
      {
        prompt: 'Эль-Аюн — крупнейший город…',
        choices: ['Западной Сахары', 'Мавритании', 'Мали'],
        correct: 0,
      },
      {
        prompt: 'Долгое побережье Западной Сахары выходит к…',
        choices: ['Атлантике', 'Красному морю', 'Каспию'],
        correct: 0,
      },
      {
        prompt: 'Фронт Полисарио борется за независимость…',
        choices: ['Западной Сахары', 'Чада', 'Ливии'],
        correct: 0,
      },
    ],
    zh: [
      {
        prompt: '阿尤恩是…最大的城市',
        choices: ['西撒哈拉', '毛里塔尼亚', '马里'],
        correct: 0,
      },
      {
        prompt: '西撒哈拉漫长的海岸面向…',
        choices: ['大西洋', '红海', '里海'],
        correct: 0,
      },
      {
        prompt: '波利萨里奥阵线争取独立的是…',
        choices: ['西撒哈拉', '乍得', '利比亚'],
        correct: 0,
      },
    ],
    ja: [
      {
        prompt: 'エルアイウンは…最大の都市',
        choices: ['西サハラ', 'モーリタニア', 'マリ'],
        correct: 0,
      },
      {
        prompt: '西サハラの長い海岸は…に面する',
        choices: ['大西洋', '紅海', 'カスピ海'],
        correct: 0,
      },
      {
        prompt: 'ポリサリオ戦線が独立を求めるのは…',
        choices: ['西サハラ', 'チャド', 'リビア'],
        correct: 0,
      },
    ],
  },

  CYN: {
    en: [
      {
        prompt: 'Northern Cyprus mainly uses which currency?',
        choices: ['Turkish lira', 'euro only', 'pound sterling only'],
        correct: 0,
      },
      {
        prompt: 'Northern Cyprus is recognized mainly by…',
        choices: ['Turkey', 'France', 'Japan'],
        correct: 0,
      },
      {
        prompt: 'Northern Cyprus occupies the north of which island?',
        choices: ['Cyprus', 'Crete', 'Sicily'],
        correct: 0,
      },
    ],
    es: [
      {
        prompt: 'Chipre del Norte usa principalmente…',
        choices: ['la lira turca', 'solo el euro', 'solo la libra'],
        correct: 0,
      },
      {
        prompt: 'Chipre del Norte es reconocido principalmente por…',
        choices: ['Turquía', 'Francia', 'Japón'],
        correct: 0,
      },
      {
        prompt: 'Chipre del Norte ocupa el norte de la isla de…',
        choices: ['Chipre', 'Creta', 'Sicilia'],
        correct: 0,
      },
    ],
    ru: [
      {
        prompt: 'В Северном Кипре в основном в ходу…',
        choices: ['турецкая лира', 'только евро', 'только фунт'],
        correct: 0,
      },
      {
        prompt: 'Северный Кипр признаёт в основном…',
        choices: ['Турция', 'Франция', 'Япония'],
        correct: 0,
      },
      {
        prompt: 'Северный Кипр занимает север острова…',
        choices: ['Кипр', 'Крит', 'Сицилия'],
        correct: 0,
      },
    ],
    zh: [
      {
        prompt: '北塞浦路斯主要使用哪种货币？',
        choices: ['土耳其里拉', '仅欧元', '仅英镑'],
        correct: 0,
      },
      {
        prompt: '北塞浦路斯主要由…承认',
        choices: ['土耳其', '法国', '日本'],
        correct: 0,
      },
      {
        prompt: '北塞浦路斯占据哪座岛的北部？',
        choices: ['塞浦路斯', '克里特', '西西里'],
        correct: 0,
      },
    ],
    ja: [
      {
        prompt: '北キプロスで主に使われる通貨は…',
        choices: ['トルコリラ', 'ユーロのみ', 'ポンドのみ'],
        correct: 0,
      },
      {
        prompt: '北キプロスを主に承認しているのは…',
        choices: ['トルコ', 'フランス', '日本'],
        correct: 0,
      },
      {
        prompt: '北キプロスがある島は…',
        choices: ['キプロス', 'クレタ', 'シチリア'],
        correct: 0,
      },
    ],
  },

  FLK: {
    en: [
      {
        prompt: 'The Falklands sit in the…',
        choices: ['South Atlantic', 'Caribbean', 'North Sea'],
        correct: 0,
      },
      {
        prompt: 'Argentina calls these islands the…',
        choices: ['Malvinas', 'Antilles', 'Balearics'],
        correct: 0,
      },
      {
        prompt: 'The 1982 war over the islands was between…',
        choices: ['the UK and Argentina', 'Spain and Portugal', 'Chile and Peru'],
        correct: 0,
      },
    ],
    es: [
      {
        prompt: 'Las Malvinas están en el…',
        choices: ['Atlántico Sur', 'Caribe', 'Mar del Norte'],
        correct: 0,
      },
      {
        prompt: 'En Argentina estas islas se llaman…',
        choices: ['Malvinas', 'Antillas', 'Baleares'],
        correct: 0,
      },
      {
        prompt: 'La guerra de 1982 por las islas fue entre…',
        choices: ['el Reino Unido y Argentina', 'España y Portugal', 'Chile y Perú'],
        correct: 0,
      },
    ],
    ru: [
      {
        prompt: 'Фолкленды лежат в…',
        choices: ['южной Атлантике', 'Карибском море', 'Северном море'],
        correct: 0,
      },
      {
        prompt: 'В Аргентине эти острова называют…',
        choices: ['Мальвинами', 'Антильскими', 'Балеарскими'],
        correct: 0,
      },
      {
        prompt: 'Война 1982 года за острова была между…',
        choices: ['Великобританией и Аргентиной', 'Испанией и Португалией', 'Чили и Перу'],
        correct: 0,
      },
    ],
    zh: [
      {
        prompt: '福克兰／马尔维纳斯群岛位于…',
        choices: ['南大西洋', '加勒比海', '北海'],
        correct: 0,
      },
      {
        prompt: '阿根廷称这些岛屿为…',
        choices: ['马尔维纳斯', '安的列斯', '巴利阿里'],
        correct: 0,
      },
      {
        prompt: '1982年争夺这些岛屿的战争发生在…之间',
        choices: ['英国与阿根廷', '西班牙与葡萄牙', '智利与秘鲁'],
        correct: 0,
      },
    ],
    ja: [
      {
        prompt: 'フォークランド／マルビナス諸島があるのは…',
        choices: ['南大西洋', 'カリブ海', '北海'],
        correct: 0,
      },
      {
        prompt: 'アルゼンチンではこれらの島を…と呼ぶ',
        choices: ['マルビナス', 'アンティル', 'バレアレス'],
        correct: 0,
      },
      {
        prompt: '1982年の島をめぐる戦争は…の間で起きた',
        choices: ['英国とアルゼンチン', 'スペインとポルトガル', 'チリとペルー'],
        correct: 0,
      },
    ],
  },

  PRI: {
    en: [
      {
        prompt: 'Puerto Rico is a…',
        choices: ['U.S. territory in the Caribbean', 'sovereign Andean republic', 'Pacific French collectivity'],
        correct: 0,
      },
      {
        prompt: 'Puerto Rico is a territory of…',
        choices: ['the United States', 'Spain', 'Mexico'],
        correct: 0,
      },
      {
        prompt: 'Puerto Rico sits in the…',
        choices: ['Caribbean', 'Pacific', 'Mediterranean'],
        correct: 0,
      },
    ],
    es: [
      {
        prompt: 'Puerto Rico es…',
        choices: ['un territorio de EE. UU. en el Caribe', 'una república andina soberana', 'una colectividad francesa del Pacífico'],
        correct: 0,
      },
      {
        prompt: 'Puerto Rico es un territorio de…',
        choices: ['Estados Unidos', 'España', 'México'],
        correct: 0,
      },
      {
        prompt: 'Puerto Rico se encuentra en el…',
        choices: ['Caribe', 'Pacífico', 'Mediterráneo'],
        correct: 0,
      },
    ],
    ru: [
      {
        prompt: 'Пуэрто-Рико — это…',
        choices: ['территория США в Карибском море', 'суверенная андская республика', 'французская тихоокеанская территория'],
        correct: 0,
      },
      {
        prompt: 'Пуэрто-Рико — территория…',
        choices: ['США', 'Испании', 'Мексики'],
        correct: 0,
      },
      {
        prompt: 'Пуэрто-Рико находится в…',
        choices: ['Карибском бассейне', 'Тихом океане', 'Средиземном море'],
        correct: 0,
      },
    ],
    zh: [
      {
        prompt: '波多黎各是…',
        choices: ['加勒比海的美国领地', '主权安第斯共和国', '太平洋法属领地'],
        correct: 0,
      },
      {
        prompt: '波多黎各是…的领土',
        choices: ['美国', '西班牙', '墨西哥'],
        correct: 0,
      },
      {
        prompt: '波多黎各位于…',
        choices: ['加勒比海', '太平洋', '地中海'],
        correct: 0,
      },
    ],
    ja: [
      {
        prompt: 'プエルトリコは…',
        choices: ['カリブ海の米国領', '主権を持つアンデス共和国', '太平洋のフランス領'],
        correct: 0,
      },
      {
        prompt: 'プエルトリコは…の領土',
        choices: ['アメリカ合衆国', 'スペイン', 'メキシコ'],
        correct: 0,
      },
      {
        prompt: 'プエルトリコがあるのは…',
        choices: ['カリブ海', '太平洋', '地中海'],
        correct: 0,
      },
    ],
  },

  NCL: {
    en: [
      {
        prompt: 'New Caledonia is a major world source of…',
        choices: ['nickel', 'maple syrup', 'cork'],
        correct: 0,
      },
      {
        prompt: 'New Caledonia is a territory of…',
        choices: ['France', 'Australia', 'the United Kingdom'],
        correct: 0,
      },
      {
        prompt: 'New Caledonia lies in the…',
        choices: ['Southwest Pacific', 'North Atlantic', 'Mediterranean'],
        correct: 0,
      },
    ],
    es: [
      {
        prompt: 'Nueva Caledonia es una gran fuente mundial de…',
        choices: ['níquel', 'jarabe de arce', 'corcho'],
        correct: 0,
      },
      {
        prompt: 'Nueva Caledonia es un territorio de…',
        choices: ['Francia', 'Australia', 'el Reino Unido'],
        correct: 0,
      },
      {
        prompt: 'Nueva Caledonia está en el…',
        choices: ['Pacífico suroeste', 'Atlántico norte', 'Mediterráneo'],
        correct: 0,
      },
    ],
    ru: [
      {
        prompt: 'Новая Каледония — крупный мировой источник…',
        choices: ['никеля', 'кленового сиропа', 'пробки'],
        correct: 0,
      },
      {
        prompt: 'Новая Каледония — территория…',
        choices: ['Франции', 'Австралии', 'Великобритании'],
        correct: 0,
      },
      {
        prompt: 'Новая Каледония находится в…',
        choices: ['юго-западной части Тихого океана', 'северной Атлантике', 'Средиземном море'],
        correct: 0,
      },
    ],
    zh: [
      {
        prompt: '新喀里多尼亚是世界重要的…产地',
        choices: ['镍', '枫糖浆', '软木'],
        correct: 0,
      },
      {
        prompt: '新喀里多尼亚是…的领地',
        choices: ['法国', '澳大利亚', '英国'],
        correct: 0,
      },
      {
        prompt: '新喀里多尼亚位于…',
        choices: ['西南太平洋', '北大西洋', '地中海'],
        correct: 0,
      },
    ],
    ja: [
      {
        prompt: 'ニューカレドニアは世界有数の…産地',
        choices: ['ニッケル', 'メープルシロップ', 'コルク'],
        correct: 0,
      },
      {
        prompt: 'ニューカレドニアは…の領土',
        choices: ['フランス', 'オーストラリア', 'イギリス'],
        correct: 0,
      },
      {
        prompt: 'ニューカレドニアがあるのは…',
        choices: ['南西太平洋', '北大西洋', '地中海'],
        correct: 0,
      },
    ],
  },

  KOS: {
    en: [
      {
        prompt: 'Kosovo is a landlocked territory in the…',
        choices: ['Balkans', 'Caucasus', 'Baltic'],
        correct: 0,
      },
      {
        prompt: 'Kosovo is a landlocked territory in the…',
        choices: ['Balkans', 'Caucasus', 'Maghreb'],
        correct: 0,
      },
      {
        prompt: 'Kosovo declared independence in…',
        choices: ['2008', '1991', '2014'],
        correct: 0,
      },
    ],
    es: [
      {
        prompt: 'Kosovo es un territorio sin litoral en los…',
        choices: ['Balcanes', 'Cáucaso', 'Bálticos'],
        correct: 0,
      },
      {
        prompt: 'Kosovo es un territorio sin litoral en los…',
        choices: ['Balcanes', 'Cáucaso', 'Magreb'],
        correct: 0,
      },
      {
        prompt: 'Kosovo declaró la independencia en…',
        choices: ['2008', '1991', '2014'],
        correct: 0,
      },
    ],
    ru: [
      {
        prompt: 'Косово — не имеющая выхода к морю территория на…',
        choices: ['Балканах', 'Кавказе', 'Балтике'],
        correct: 0,
      },
      {
        prompt: 'Косово — не имеющая выхода к морю территория на…',
        choices: ['Балканах', 'Кавказе', 'Магрибе'],
        correct: 0,
      },
      {
        prompt: 'Косово провозгласило независимость в…',
        choices: ['2008', '1991', '2014'],
        correct: 0,
      },
    ],
    zh: [
      {
        prompt: '科索沃是…的内陆地区',
        choices: ['巴尔干', '高加索', '波罗的海'],
        correct: 0,
      },
      {
        prompt: '科索沃是…的内陆地区',
        choices: ['巴尔干', '高加索', '马格里布'],
        correct: 0,
      },
      {
        prompt: '科索沃宣布独立是在…年',
        choices: ['2008', '1991', '2014'],
        correct: 0,
      },
    ],
    ja: [
      {
        prompt: 'コソボは…の内陸地域',
        choices: ['バルカン', 'コーカサス', 'バルト'],
        correct: 0,
      },
      {
        prompt: 'コソボは海なしの地域で、位置するのは…',
        choices: ['バルカン', 'コーカサス', 'マグレブ'],
        correct: 0,
      },
      {
        prompt: 'コソボが独立を宣言した年は…',
        choices: ['2008', '1991', '2014'],
        correct: 0,
      },
    ],
  },

  SOL: {
    en: [
      {
        prompt: 'Somaliland sits on the…',
        choices: ['Gulf of Aden / Horn of Africa', 'Cape of Good Hope', 'Maghreb coast'],
        correct: 0,
      },
      {
        prompt: 'Somaliland sits on the…',
        choices: ['Gulf of Aden / Horn of Africa', 'Cape of Good Hope', 'Maghreb coast'],
        correct: 0,
      },
      {
        prompt: 'Somaliland declared independence from Somalia in…',
        choices: ['1991', '1960', '2011'],
        correct: 0,
      },
    ],
    es: [
      {
        prompt: 'Somalilandia se sitúa en el…',
        choices: ['golfo de Adén / Cuerno de África', 'Cabo de Buena Esperanza', 'litoral magrebí'],
        correct: 0,
      },
      {
        prompt: 'Somalilandia se encuentra en el…',
        choices: ['golfo de Adén / Cuerno de África', 'Cabo de Buena Esperanza', 'litoral del Magreb'],
        correct: 0,
      },
      {
        prompt: 'Somalilandia declaró la independencia de Somalia en…',
        choices: ['1991', '1960', '2011'],
        correct: 0,
      },
    ],
    ru: [
      {
        prompt: 'Сомалиленд лежит у…',
        choices: ['Аденского залива / Африканского Рога', 'Мыса Доброй Надежды', 'магрибского побережья'],
        correct: 0,
      },
      {
        prompt: 'Сомалиленд расположен у…',
        choices: ['Аденского залива / Африканского Рога', 'Мыса Доброй Надежды', 'побережья Магриба'],
        correct: 0,
      },
      {
        prompt: 'Сомалиленд провозгласил независимость от Сомали в…',
        choices: ['1991', '1960', '2011'],
        correct: 0,
      },
    ],
    zh: [
      {
        prompt: '索马里兰位于…',
        choices: ['亚丁湾／非洲之角', '好望角', '马格里布沿岸'],
        correct: 0,
      },
      {
        prompt: '索马里兰位于…',
        choices: ['亚丁湾／非洲之角', '好望角', '马格里布海岸'],
        correct: 0,
      },
      {
        prompt: '索马里兰脱离索马里独立是在…年',
        choices: ['1991', '1960', '2011'],
        correct: 0,
      },
    ],
    ja: [
      {
        prompt: 'ソマリランドがあるのは…',
        choices: ['アデン湾／アフリカの角', '喜望峰', 'マグリブ沿岸'],
        correct: 0,
      },
      {
        prompt: 'ソマリランドがあるのは…',
        choices: ['アデン湾／アフリカの角', '喜望峰', 'マグレブ沿岸'],
        correct: 0,
      },
      {
        prompt: 'ソマリランドがソマリアから独立を宣言した年は…',
        choices: ['1991', '1960', '2011'],
        correct: 0,
      },
    ],
  },

  TWN: {
    en: [
      {
        prompt: 'Taiwan is a global leader in…',
        choices: ['semiconductor manufacturing', 'oil drilling only', 'diamond mining'],
        correct: 0,
      },
      {
        prompt: 'Taiwan is an island off…',
        choices: ['southeast China', 'Japan’s north', 'India'],
        correct: 0,
      },
      {
        prompt: 'Night markets are a food culture staple in…',
        choices: ['Taiwan', 'Mongolia', 'Iceland'],
        correct: 0,
      },
    ],
    es: [
      {
        prompt: 'Taiwán es líder mundial en…',
        choices: ['fabricación de semiconductores', 'solo perforación petrolera', 'minería de diamantes'],
        correct: 0,
      },
      {
        prompt: 'Taiwán es una isla frente a…',
        choices: ['el sureste de China', 'el norte de Japón', 'la India'],
        correct: 0,
      },
      {
        prompt: 'Los mercados nocturnos son típicos de la gastronomía de…',
        choices: ['Taiwán', 'Mongolia', 'Islandia'],
        correct: 0,
      },
    ],
    ru: [
      {
        prompt: 'Тайвань — мировой лидер в…',
        choices: ['производстве полупроводников', 'только нефтедобыче', 'добыче алмазов'],
        correct: 0,
      },
      {
        prompt: 'Тайвань — остров у…',
        choices: ['юго-восточного Китая', 'севера Японии', 'Индии'],
        correct: 0,
      },
      {
        prompt: 'Ночные рынки — гастрономическая визитная карточка…',
        choices: ['Тайваня', 'Монголии', 'Исландии'],
        correct: 0,
      },
    ],
    zh: [
      {
        prompt: '台湾是全球…的领先者',
        choices: ['半导体制造', '仅石油钻探', '钻石开采'],
        correct: 0,
      },
      {
        prompt: '台湾是靠近…的岛屿',
        choices: ['中国东南沿海', '日本北部', '印度'],
        correct: 0,
      },
      {
        prompt: '夜市是…饮食文化的标志',
        choices: ['台湾', '蒙古', '冰岛'],
        correct: 0,
      },
    ],
    ja: [
      {
        prompt: '台湾が世界をリードしているのは…',
        choices: ['半導体製造', '石油掘削のみ', 'ダイヤモンド採掘'],
        correct: 0,
      },
      {
        prompt: '台湾は…沖の島',
        choices: ['中国南東部', '日本北部', 'インド'],
        correct: 0,
      },
      {
        prompt: '夜市が食文化の定番なのは…',
        choices: ['台湾', 'モンゴル', 'アイスランド'],
        correct: 0,
      },
    ],
  },

  CYP: {
    en: [
      {
        prompt: 'Halloumi cheese is strongly associated with…',
        choices: ['Cyprus', 'France', 'Japan'],
        correct: 0,
      },
      {
        prompt: 'Cyprus is an island in the…',
        choices: ['eastern Mediterranean', 'Caribbean', 'South China Sea'],
        correct: 0,
      },
      {
        prompt: 'Cyprus is divided between…',
        choices: ['Greek and Turkish communities', 'France and Spain', 'India and Pakistan'],
        correct: 0,
      },
    ],
    es: [
      {
        prompt: 'El queso halloumi se asocia sobre todo con…',
        choices: ['Chipre', 'Francia', 'Japón'],
        correct: 0,
      },
      {
        prompt: 'Chipre es una isla en el…',
        choices: ['Mediterráneo oriental', 'Caribe', 'mar de China Meridional'],
        correct: 0,
      },
      {
        prompt: 'Chipre está dividido entre…',
        choices: ['comunidades griega y turca', 'Francia y España', 'India y Pakistán'],
        correct: 0,
      },
    ],
    ru: [
      {
        prompt: 'Сыр халлуми тесно связан с…',
        choices: ['Кипром', 'Францией', 'Японией'],
        correct: 0,
      },
      {
        prompt: 'Кипр — остров в…',
        choices: ['восточном Средиземноморье', 'Карибском море', 'Южно-Китайском море'],
        correct: 0,
      },
      {
        prompt: 'Кипр разделён между…',
        choices: ['греческой и турецкой общинами', 'Францией и Испанией', 'Индией и Пакистаном'],
        correct: 0,
      },
    ],
    zh: [
      {
        prompt: '哈鲁米奶酪最常与…联系在一起',
        choices: ['塞浦路斯', '法国', '日本'],
        correct: 0,
      },
      {
        prompt: '塞浦路斯是…的岛屿',
        choices: ['东地中海', '加勒比海', '南中国海'],
        correct: 0,
      },
      {
        prompt: '塞浦路斯分裂于…之间',
        choices: ['希族与土族社群', '法国与西班牙', '印度与巴基斯坦'],
        correct: 0,
      },
    ],
    ja: [
      {
        prompt: 'ハルミチーズといえば…',
        choices: ['キプロス', 'フランス', '日本'],
        correct: 0,
      },
      {
        prompt: 'キプロスがあるのは…',
        choices: ['東地中海', 'カリブ海', '南シナ海'],
        correct: 0,
      },
      {
        prompt: 'キプロスは…の間で分断されている',
        choices: ['ギリシャ系とトルコ系の共同体', 'フランスとスペイン', 'インドとパキスタン'],
        correct: 0,
      },
    ],
  },

  GRL: {
    en: [
      {
        prompt: 'Greenland is mostly covered by…',
        choices: ['an ice sheet', 'tropical forest', 'desert dunes'],
        correct: 0,
      },
      {
        prompt: 'Greenland is an autonomous territory of…',
        choices: ['Denmark', 'Canada', 'USA'],
        correct: 0,
      },
      {
        prompt: 'Most of Greenland is covered by…',
        choices: ['ice sheet', 'rainforest', 'savanna'],
        correct: 0,
      },
    ],
    es: [
      {
        prompt: 'Groenlandia está cubierta en su mayor parte por…',
        choices: ['un casquete de hielo', 'selva tropical', 'dunas del desierto'],
        correct: 0,
      },
      {
        prompt: 'Groenlandia es un territorio autónomo de…',
        choices: ['Dinamarca', 'Canadá', 'EE. UU.'],
        correct: 0,
      },
      {
        prompt: 'La mayor parte de Groenlandia está cubierta por…',
        choices: ['casquete de hielo', 'selva', 'sabana'],
        correct: 0,
      },
    ],
    ru: [
      {
        prompt: 'Гренландия в основном покрыта…',
        choices: ['ледниковым щитом', 'тропическим лесом', 'пустынными дюнами'],
        correct: 0,
      },
      {
        prompt: 'Гренландия — автономная территория…',
        choices: ['Дании', 'Канады', 'США'],
        correct: 0,
      },
      {
        prompt: 'Большую часть Гренландии покрывает…',
        choices: ['ледниковый щит', 'тропический лес', 'саванна'],
        correct: 0,
      },
    ],
    zh: [
      {
        prompt: '格陵兰大部分被…覆盖',
        choices: ['冰盖', '热带森林', '沙漠沙丘'],
        correct: 0,
      },
      {
        prompt: '格陵兰是…的自治领地',
        choices: ['丹麦', '加拿大', '美国'],
        correct: 0,
      },
      {
        prompt: '格陵兰大部分被…覆盖',
        choices: ['冰盖', '雨林', '草原'],
        correct: 0,
      },
    ],
    ja: [
      {
        prompt: 'グリーンランドの大部分を覆うのは…',
        choices: ['氷床', '熱帯林', '砂漠の砂丘'],
        correct: 0,
      },
      {
        prompt: 'グリーンランドは…の自治領',
        choices: ['デンマーク', 'カナダ', 'アメリカ'],
        correct: 0,
      },
      {
        prompt: 'グリーンランドの大部分を覆うのは…',
        choices: ['氷床', '熱帯雨林', 'サバンナ'],
        correct: 0,
      },
    ],
  },

  ISR: {
    en: [
      {
        prompt: 'Jerusalem is Israel’s declared capital; Tel Aviv is its…',
        choices: ['tech and coastal hub', 'only desert', 'oil field'],
        correct: 0,
      },
      {
        prompt: 'The Dead Sea borders…',
        choices: ['Israel and Jordan', 'Egypt and Libya', 'Turkey and Greece'],
        correct: 0,
      },
      {
        prompt: 'Hebrew is an official language of…',
        choices: ['Israel', 'Lebanon', 'Iran'],
        correct: 0,
      },
    ],
    es: [
      {
        prompt: 'Jerusalén es la capital declarada de Israel; Tel Aviv es su…',
        choices: ['centro tecnológico y costero', 'único desierto', 'yacimiento petrolero'],
        correct: 0,
      },
      {
        prompt: 'El Mar Muerto limita con…',
        choices: ['Israel y Jordania', 'Egipto y Libia', 'Turquía y Grecia'],
        correct: 0,
      },
      {
        prompt: 'El hebreo es lengua oficial de…',
        choices: ['Israel', 'Líbano', 'Irán'],
        correct: 0,
      },
    ],
    ru: [
      {
        prompt: 'Иерусалим — заявленная столица Израиля; Тель-Авив — его…',
        choices: ['технологический и прибрежный центр', 'единственная пустыня', 'нефтяное месторождение'],
        correct: 0,
      },
      {
        prompt: 'Мёртвое море граничит с…',
        choices: ['Израилем и Иорданией', 'Египтом и Ливией', 'Турцией и Грецией'],
        correct: 0,
      },
      {
        prompt: 'Иврит — официальный язык…',
        choices: ['Израиля', 'Ливана', 'Ирана'],
        correct: 0,
      },
    ],
    zh: [
      {
        prompt: '耶路撒冷是以色列宣称的首都；特拉维夫是其…',
        choices: ['科技与沿海枢纽', '唯一沙漠', '油田'],
        correct: 0,
      },
      {
        prompt: '死海毗邻…',
        choices: ['以色列与约旦', '埃及与利比亚', '土耳其与希腊'],
        correct: 0,
      },
      {
        prompt: '希伯来语是…的官方语言',
        choices: ['以色列', '黎巴嫩', '伊朗'],
        correct: 0,
      },
    ],
    ja: [
      {
        prompt: 'エルサレムはイスラエルの宣言上の首都；テルアビブは…',
        choices: ['テックと沿岸の拠点', '唯一の砂漠', '油田'],
        correct: 0,
      },
      {
        prompt: '死海が接するのは…',
        choices: ['イスラエルとヨルダン', 'エジプトとリビア', 'トルコとギリシャ'],
        correct: 0,
      },
      {
        prompt: 'ヘブライ語が公用語なのは…',
        choices: ['イスラエル', 'レバノン', 'イラン'],
        correct: 0,
      },
    ],
  },
}
