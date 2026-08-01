import type { Locale } from '../i18n/locale'

/** Localized country names by ADM0_A3 — for share OG / bots. */
const NAMES: Record<string, Record<Locale, string>> = {
  AFG: { en: 'Afghanistan', es: 'Afganistán', ru: 'Афганистан', zh: '阿富汗', ja: 'アフガニスタン' },
  AGO: { en: 'Angola', es: 'Angola', ru: 'Ангола', zh: '安哥拉', ja: 'アンゴラ' },
  ALB: { en: 'Albania', es: 'Albania', ru: 'Албания', zh: '阿尔巴尼亚', ja: 'アルバニア' },
  ARE: { en: 'United Arab Emirates', es: 'Emiratos Árabes Unidos', ru: 'Объединённые Арабские Эмираты', zh: '阿拉伯联合酋长国', ja: 'アラブ首長国連邦' },
  ARG: { en: 'Argentina', es: 'Argentina', ru: 'Аргентина', zh: '阿根廷', ja: 'アルゼンチン' },
  ARM: { en: 'Armenia', es: 'Armenia', ru: 'Армения', zh: '亚美尼亚', ja: 'アルメニア' },
  ATA: { en: 'Antarctica', es: 'Antártida', ru: 'Антарктида', zh: '南极洲', ja: '南極大陸' },
  ATF: { en: 'French Southern and Antarctic Lands', es: 'Tierras Australes y Antárticas Francesas', ru: 'Французские Южные и Антарктические территории', zh: '法属南部和南极领地', ja: 'フランス領南方・南極地域' },
  AUS: { en: 'Australia', es: 'Australia', ru: 'Австралия', zh: '澳大利亚', ja: 'オーストラリア' },
  AUT: { en: 'Austria', es: 'Austria', ru: 'Австрия', zh: '奥地利', ja: 'オーストリア' },
  AZE: { en: 'Azerbaijan', es: 'Azerbaiyán', ru: 'Азербайджан', zh: '阿塞拜疆', ja: 'アゼルバイジャン' },
  BDI: { en: 'Burundi', es: 'Burundi', ru: 'Бурунди', zh: '布隆迪', ja: 'ブルンジ' },
  BEL: { en: 'Belgium', es: 'Bélgica', ru: 'Бельгия', zh: '比利时', ja: 'ベルギー' },
  BEN: { en: 'Benin', es: 'Benín', ru: 'Бенин', zh: '贝宁', ja: 'ベナン' },
  BFA: { en: 'Burkina Faso', es: 'Burkina Faso', ru: 'Буркина-Фасо', zh: '布基纳法索', ja: 'ブルキナファソ' },
  BGD: { en: 'Bangladesh', es: 'Bangladés', ru: 'Бангладеш', zh: '孟加拉国', ja: 'バングラデシュ' },
  BGR: { en: 'Bulgaria', es: 'Bulgaria', ru: 'Болгария', zh: '保加利亚', ja: 'ブルガリア' },
  BHS: { en: 'The Bahamas', es: 'Bahamas', ru: 'Багамские Острова', zh: '巴哈马', ja: 'バハマ' },
  BIH: { en: 'Bosnia and Herzegovina', es: 'Bosnia y Herzegovina', ru: 'Босния и Герцеговина', zh: '波斯尼亚和黑塞哥维那', ja: 'ボスニア・ヘルツェゴビナ' },
  BLR: { en: 'Belarus', es: 'Bielorrusia', ru: 'Белоруссия', zh: '白俄罗斯', ja: 'ベラルーシ' },
  BLZ: { en: 'Belize', es: 'Belice', ru: 'Белиз', zh: '伯利兹', ja: 'ベリーズ' },
  BOL: { en: 'Bolivia', es: 'Bolivia', ru: 'Боливия', zh: '玻利维亚', ja: 'ボリビア' },
  BRA: { en: 'Brazil', es: 'Brasil', ru: 'Бразилия', zh: '巴西', ja: 'ブラジル' },
  BRN: { en: 'Brunei', es: 'Brunéi', ru: 'Бруней', zh: '文莱', ja: 'ブルネイ' },
  BTN: { en: 'Bhutan', es: 'Bután', ru: 'Бутан', zh: '不丹', ja: 'ブータン' },
  BWA: { en: 'Botswana', es: 'Botsuana', ru: 'Ботсвана', zh: '博茨瓦纳', ja: 'ボツワナ' },
  CAF: { en: 'Central African Republic', es: 'República Centroafricana', ru: 'Центральноафриканская Республика', zh: '中非共和国', ja: '中央アフリカ共和国' },
  CAN: { en: 'Canada', es: 'Canadá', ru: 'Канада', zh: '加拿大', ja: 'カナダ' },
  CHE: { en: 'Switzerland', es: 'Suiza', ru: 'Швейцария', zh: '瑞士', ja: 'スイス' },
  CHL: { en: 'Chile', es: 'Chile', ru: 'Чили', zh: '智利', ja: 'チリ' },
  CHN: { en: 'China', es: 'China', ru: 'Китай', zh: '中国', ja: '中国' },
  CIV: { en: 'Ivory Coast', es: 'Costa de Marfil', ru: 'Кот-д’Ивуар', zh: '科特迪瓦', ja: 'コートジボワール' },
  CMR: { en: 'Cameroon', es: 'Camerún', ru: 'Камерун', zh: '喀麦隆', ja: 'カメルーン' },
  COD: { en: 'Democratic Republic of the Congo', es: 'República Democrática del Congo', ru: 'Демократическая Республика Конго', zh: '刚果民主共和国', ja: 'コンゴ民主共和国' },
  COG: { en: 'Republic of the Congo', es: 'República del Congo', ru: 'Республика Конго', zh: '刚果共和国', ja: 'コンゴ共和国' },
  COL: { en: 'Colombia', es: 'Colombia', ru: 'Колумбия', zh: '哥伦比亚', ja: 'コロンビア' },
  CRI: { en: 'Costa Rica', es: 'Costa Rica', ru: 'Коста-Рика', zh: '哥斯达黎加', ja: 'コスタリカ' },
  CUB: { en: 'Cuba', es: 'Cuba', ru: 'Куба', zh: '古巴', ja: 'キューバ' },
  CYN: { en: 'Northern Cyprus', es: 'Chipre del Norte', ru: 'Северный Кипр', zh: '北塞浦路斯', ja: '北キプロス' },
  CYP: { en: 'Cyprus', es: 'Chipre', ru: 'Кипр', zh: '塞浦路斯', ja: 'キプロス' },
  CZE: { en: 'Czech Republic', es: 'República Checa', ru: 'Чехия', zh: '捷克', ja: 'チェコ' },
  DEU: { en: 'Germany', es: 'Alemania', ru: 'Германия', zh: '德国', ja: 'ドイツ' },
  DJI: { en: 'Djibouti', es: 'Yibuti', ru: 'Джибути', zh: '吉布提', ja: 'ジブチ' },
  DNK: { en: 'Denmark', es: 'Dinamarca', ru: 'Дания', zh: '丹麦', ja: 'デンマーク' },
  DOM: { en: 'Dominican Republic', es: 'República Dominicana', ru: 'Доминиканская Республика', zh: '多米尼加', ja: 'ドミニカ共和国' },
  DZA: { en: 'Algeria', es: 'Argelia', ru: 'Алжир', zh: '阿尔及利亚', ja: 'アルジェリア' },
  ECU: { en: 'Ecuador', es: 'Ecuador', ru: 'Эквадор', zh: '厄瓜多尔', ja: 'エクアドル' },
  EGY: { en: 'Egypt', es: 'Egipto', ru: 'Египет', zh: '埃及', ja: 'エジプト' },
  ERI: { en: 'Eritrea', es: 'Eritrea', ru: 'Эритрея', zh: '厄立特里亚', ja: 'エリトリア' },
  ESP: { en: 'Spain', es: 'España', ru: 'Испания', zh: '西班牙', ja: 'スペイン' },
  EST: { en: 'Estonia', es: 'Estonia', ru: 'Эстония', zh: '爱沙尼亚', ja: 'エストニア' },
  ETH: { en: 'Ethiopia', es: 'Etiopía', ru: 'Эфиопия', zh: '埃塞俄比亚', ja: 'エチオピア' },
  FIN: { en: 'Finland', es: 'Finlandia', ru: 'Финляндия', zh: '芬兰', ja: 'フィンランド' },
  FJI: { en: 'Fiji', es: 'Fiyi', ru: 'Фиджи', zh: '斐济', ja: 'フィジー' },
  FLK: { en: 'Falklands', es: 'Malvinas', ru: 'Фолкленды', zh: '福克兰', ja: 'フォークランド' },
  FRA: { en: 'France', es: 'Francia', ru: 'Франция', zh: '法国', ja: 'フランス' },
  GAB: { en: 'Gabon', es: 'Gabón', ru: 'Габон', zh: '加蓬', ja: 'ガボン' },
  GBR: { en: 'United Kingdom', es: 'Reino Unido', ru: 'Британия', zh: '英国', ja: 'イギリス' },
  GEO: { en: 'Georgia', es: 'Georgia', ru: 'Грузия', zh: '格鲁吉亚', ja: 'ジョージア' },
  GHA: { en: 'Ghana', es: 'Ghana', ru: 'Гана', zh: '加纳', ja: 'ガーナ' },
  GIN: { en: 'Guinea', es: 'Guinea', ru: 'Гвинея', zh: '几内亚', ja: 'ギニア' },
  GMB: { en: 'The Gambia', es: 'Gambia', ru: 'Гамбия', zh: '冈比亚', ja: 'ガンビア' },
  GNB: { en: 'Guinea-Bissau', es: 'Guinea-Bisáu', ru: 'Гвинея-Бисау', zh: '几内亚比绍', ja: 'ギニアビサウ' },
  GNQ: { en: 'Equatorial Guinea', es: 'Guinea Ecuatorial', ru: 'Экваториальная Гвинея', zh: '赤道几内亚', ja: '赤道ギニア' },
  GRC: { en: 'Greece', es: 'Grecia', ru: 'Греция', zh: '希腊', ja: 'ギリシャ' },
  GRL: { en: 'Greenland', es: 'Groenlandia', ru: 'Гренландия', zh: '格陵兰', ja: 'グリーンランド' },
  GTM: { en: 'Guatemala', es: 'Guatemala', ru: 'Гватемала', zh: '危地马拉', ja: 'グアテマラ' },
  GUY: { en: 'Guyana', es: 'Guyana', ru: 'Гайана', zh: '圭亚那', ja: 'ガイアナ' },
  HND: { en: 'Honduras', es: 'Honduras', ru: 'Гондурас', zh: '洪都拉斯', ja: 'ホンジュラス' },
  HRV: { en: 'Croatia', es: 'Croacia', ru: 'Хорватия', zh: '克罗地亚', ja: 'クロアチア' },
  HTI: { en: 'Haiti', es: 'Haití', ru: 'Республика Гаити', zh: '海地', ja: 'ハイチ' },
  HUN: { en: 'Hungary', es: 'Hungría', ru: 'Венгрия', zh: '匈牙利', ja: 'ハンガリー' },
  IDN: { en: 'Indonesia', es: 'Indonesia', ru: 'Индонезия', zh: '印度尼西亚', ja: 'インドネシア' },
  IND: { en: 'India', es: 'India', ru: 'Индия', zh: '印度', ja: 'インド' },
  IRL: { en: 'Ireland', es: 'Irlanda', ru: 'Ирландия', zh: '爱尔兰', ja: 'アイルランド' },
  IRN: { en: 'Iran', es: 'Irán', ru: 'Иран', zh: '伊朗', ja: 'イラン' },
  IRQ: { en: 'Iraq', es: 'Irak', ru: 'Ирак', zh: '伊拉克', ja: 'イラク' },
  ISL: { en: 'Iceland', es: 'Islandia', ru: 'Исландия', zh: '冰岛', ja: 'アイスランド' },
  ISR: { en: 'Israel', es: 'Israel', ru: 'Израиль', zh: '以色列', ja: 'イスラエル' },
  ITA: { en: 'Italy', es: 'Italia', ru: 'Италия', zh: '意大利', ja: 'イタリア' },
  JAM: { en: 'Jamaica', es: 'Jamaica', ru: 'Ямайка', zh: '牙买加', ja: 'ジャマイカ' },
  JOR: { en: 'Jordan', es: 'Jordania', ru: 'Иордания', zh: '约旦', ja: 'ヨルダン' },
  JPN: { en: 'Japan', es: 'Japón', ru: 'Япония', zh: '日本', ja: '日本' },
  KAZ: { en: 'Kazakhstan', es: 'Kazajistán', ru: 'Казахстан', zh: '哈萨克斯坦', ja: 'カザフスタン' },
  KEN: { en: 'Kenya', es: 'Kenia', ru: 'Кения', zh: '肯尼亚', ja: 'ケニア' },
  KGZ: { en: 'Kyrgyzstan', es: 'Kirguistán', ru: 'Киргизия', zh: '吉尔吉斯斯坦', ja: 'キルギス' },
  KHM: { en: 'Cambodia', es: 'Camboya', ru: 'Камбоджа', zh: '柬埔寨', ja: 'カンボジア' },
  KOR: { en: 'South Korea', es: 'Corea del Sur', ru: 'Южная Корея', zh: '韩国', ja: '韓国' },
  KOS: { en: 'Kosovo', es: 'Kosovo', ru: 'Республика Косово', zh: '科索沃', ja: 'コソボ共和国' },
  KWT: { en: 'Kuwait', es: 'Kuwait', ru: 'Кувейт', zh: '科威特', ja: 'クウェート' },
  LAO: { en: 'Laos', es: 'Laos', ru: 'Лаос', zh: '老挝', ja: 'ラオス' },
  LBN: { en: 'Lebanon', es: 'Líbano', ru: 'Ливан', zh: '黎巴嫩', ja: 'レバノン' },
  LBR: { en: 'Liberia', es: 'Liberia', ru: 'Либерия', zh: '利比里亚', ja: 'リベリア' },
  LBY: { en: 'Libya', es: 'Libia', ru: 'Ливия', zh: '利比亚', ja: 'リビア' },
  LKA: { en: 'Sri Lanka', es: 'Sri Lanka', ru: 'Шри-Ланка', zh: '斯里兰卡', ja: 'スリランカ' },
  LSO: { en: 'Lesotho', es: 'Lesoto', ru: 'Лесото', zh: '莱索托', ja: 'レソト' },
  LTU: { en: 'Lithuania', es: 'Lituania', ru: 'Литва', zh: '立陶宛', ja: 'リトアニア' },
  LUX: { en: 'Luxembourg', es: 'Luxemburgo', ru: 'Люксембург', zh: '卢森堡', ja: 'ルクセンブルク' },
  LVA: { en: 'Latvia', es: 'Letonia', ru: 'Латвия', zh: '拉脱维亚', ja: 'ラトビア' },
  MAR: { en: 'Morocco', es: 'Marruecos', ru: 'Марокко', zh: '摩洛哥', ja: 'モロッコ' },
  MDA: { en: 'Moldova', es: 'Moldavia', ru: 'Молдавия', zh: '摩尔多瓦', ja: 'モルドバ' },
  MDG: { en: 'Madagascar', es: 'Madagascar', ru: 'Мадагаскар', zh: '马达加斯加', ja: 'マダガスカル' },
  MEX: { en: 'Mexico', es: 'México', ru: 'Мексика', zh: '墨西哥', ja: 'メキシコ' },
  MKD: { en: 'North Macedonia', es: 'Macedonia del Norte', ru: 'Северная Македония', zh: '北马其顿', ja: '北マケドニア' },
  MLI: { en: 'Mali', es: 'Malí', ru: 'Мали', zh: '马里', ja: 'マリ共和国' },
  MMR: { en: 'Myanmar', es: 'Birmania', ru: 'Мьянма', zh: '缅甸', ja: 'ミャンマー' },
  MNE: { en: 'Montenegro', es: 'Montenegro', ru: 'Черногория', zh: '黑山', ja: 'モンテネグロ' },
  MNG: { en: 'Mongolia', es: 'Mongolia', ru: 'Монголия', zh: '蒙古国', ja: 'モンゴル国' },
  MOZ: { en: 'Mozambique', es: 'Mozambique', ru: 'Мозамбик', zh: '莫桑比克', ja: 'モザンビーク' },
  MRT: { en: 'Mauritania', es: 'Mauritania', ru: 'Мавритания', zh: '毛里塔尼亚', ja: 'モーリタニア' },
  MWI: { en: 'Malawi', es: 'Malaui', ru: 'Малави', zh: '马拉维', ja: 'マラウイ' },
  MYS: { en: 'Malaysia', es: 'Malasia', ru: 'Малайзия', zh: '马来西亚', ja: 'マレーシア' },
  NAM: { en: 'Namibia', es: 'Namibia', ru: 'Намибия', zh: '纳米比亚', ja: 'ナミビア' },
  NCL: { en: 'New Caledonia', es: 'Nueva Caledonia', ru: 'Новая Каледония', zh: '新喀里多尼亚', ja: 'ニューカレドニア' },
  NER: { en: 'Niger', es: 'Níger', ru: 'Нигер', zh: '尼日尔', ja: 'ニジェール' },
  NGA: { en: 'Nigeria', es: 'Nigeria', ru: 'Нигерия', zh: '尼日利亚', ja: 'ナイジェリア' },
  NIC: { en: 'Nicaragua', es: 'Nicaragua', ru: 'Никарагуа', zh: '尼加拉瓜', ja: 'ニカラグア' },
  NLD: { en: 'Netherlands', es: 'Países Bajos', ru: 'Нидерланды', zh: '荷兰', ja: 'オランダ' },
  NOR: { en: 'Norway', es: 'Noruega', ru: 'Норвегия', zh: '挪威', ja: 'ノルウェー' },
  NPL: { en: 'Nepal', es: 'Nepal', ru: 'Непал', zh: '尼泊尔', ja: 'ネパール' },
  NZL: { en: 'New Zealand', es: 'Nueva Zelanda', ru: 'Новая Зеландия', zh: '新西兰', ja: 'ニュージーランド' },
  OMN: { en: 'Oman', es: 'Omán', ru: 'Оман', zh: '阿曼', ja: 'オマーン' },
  PAK: { en: 'Pakistan', es: 'Pakistán', ru: 'Пакистан', zh: '巴基斯坦', ja: 'パキスタン' },
  PAN: { en: 'Panama', es: 'Panamá', ru: 'Панама', zh: '巴拿马', ja: 'パナマ' },
  PER: { en: 'Peru', es: 'Perú', ru: 'Перу', zh: '秘鲁', ja: 'ペルー' },
  PHL: { en: 'Philippines', es: 'Filipinas', ru: 'Филиппины', zh: '菲律宾', ja: 'フィリピン' },
  PNG: { en: 'Papua New Guinea', es: 'Papúa Nueva Guinea', ru: 'Папуа — Новая Гвинея', zh: '巴布亚新几内亚', ja: 'パプアニューギニア' },
  POL: { en: 'Poland', es: 'Polonia', ru: 'Польша', zh: '波兰', ja: 'ポーランド' },
  PRI: { en: 'Puerto Rico', es: 'Puerto Rico', ru: 'Пуэрто-Рико', zh: '波多黎各', ja: 'プエルトリコ' },
  PRK: { en: 'North Korea', es: 'Corea del Norte', ru: 'КНДР', zh: '朝鲜民主主义人民共和国', ja: '朝鮮民主主義人民共和国' },
  PRT: { en: 'Portugal', es: 'Portugal', ru: 'Португалия', zh: '葡萄牙', ja: 'ポルトガル' },
  PRY: { en: 'Paraguay', es: 'Paraguay', ru: 'Парагвай', zh: '巴拉圭', ja: 'パラグアイ' },
  PSX: { en: 'Palestine', es: 'Palestina', ru: 'Палестина', zh: '巴勒斯坦', ja: '巴勒斯坦' },
  QAT: { en: 'Qatar', es: 'Catar', ru: 'Катар', zh: '卡塔尔', ja: 'カタール' },
  ROU: { en: 'Romania', es: 'Rumania', ru: 'Румыния', zh: '罗马尼亚', ja: 'ルーマニア' },
  RUS: { en: 'Russia', es: 'Rusia', ru: 'Россия', zh: '俄罗斯', ja: 'ロシア' },
  RWA: { en: 'Rwanda', es: 'Ruanda', ru: 'Руанда', zh: '卢旺达', ja: 'ルワンダ' },
  SAH: { en: 'Western Sahara', es: 'Sáhara Occidental', ru: 'Западная Сахара', zh: '西撒哈拉', ja: '西サハラ' },
  SAU: { en: 'Saudi Arabia', es: 'Arabia Saudita', ru: 'Саудовская Аравия', zh: '沙特阿拉伯', ja: 'サウジアラビア' },
  SDN: { en: 'Sudan', es: 'Sudán', ru: 'Судан', zh: '苏丹', ja: 'スーダン' },
  SDS: { en: 'South Sudan', es: 'Sudán del Sur', ru: 'Южный Судан', zh: '南苏丹', ja: '南スーダン' },
  SEN: { en: 'Senegal', es: 'Senegal', ru: 'Сенегал', zh: '塞内加尔', ja: 'セネガル' },
  SLB: { en: 'Solomon Islands', es: 'Islas Salomón', ru: 'Соломоновы Острова', zh: '所罗门群岛', ja: 'ソロモン諸島' },
  SLE: { en: 'Sierra Leone', es: 'Sierra Leona', ru: 'Сьерра-Леоне', zh: '塞拉利昂', ja: 'シエラレオネ' },
  SLV: { en: 'El Salvador', es: 'El Salvador', ru: 'Сальвадор', zh: '萨尔瓦多', ja: 'エルサルバドル' },
  SOL: { en: 'Somaliland', es: 'Somalilandia', ru: 'Сомалиленд', zh: '索马里兰', ja: 'ソマリランド' },
  SOM: { en: 'Somalia', es: 'Somalia', ru: 'Сомали', zh: '索马里', ja: 'ソマリア' },
  SRB: { en: 'Serbia', es: 'Serbia', ru: 'Сербия', zh: '塞尔维亚', ja: 'セルビア' },
  SUR: { en: 'Suriname', es: 'Surinam', ru: 'Суринам', zh: '苏里南', ja: 'スリナム' },
  SVK: { en: 'Slovakia', es: 'Eslovaquia', ru: 'Словакия', zh: '斯洛伐克', ja: 'スロバキア' },
  SVN: { en: 'Slovenia', es: 'Eslovenia', ru: 'Словения', zh: '斯洛文尼亚', ja: 'スロベニア' },
  SWE: { en: 'Sweden', es: 'Suecia', ru: 'Швеция', zh: '瑞典', ja: 'スウェーデン' },
  SWZ: { en: 'Eswatini', es: 'Suazilandia', ru: 'Эсватини', zh: '斯威士兰', ja: 'エスワティニ' },
  SYR: { en: 'Syria', es: 'Siria', ru: 'Сирия', zh: '叙利亚', ja: 'シリア' },
  TCD: { en: 'Chad', es: 'Chad', ru: 'Чад', zh: '乍得', ja: 'チャド' },
  TGO: { en: 'Togo', es: 'Togo', ru: 'Того', zh: '多哥', ja: 'トーゴ' },
  THA: { en: 'Thailand', es: 'Tailandia', ru: 'Таиланд', zh: '泰国', ja: 'タイ王国' },
  TJK: { en: 'Tajikistan', es: 'Tayikistán', ru: 'Таджикистан', zh: '塔吉克斯坦', ja: 'タジキスタン' },
  TKM: { en: 'Turkmenistan', es: 'Turkmenistán', ru: 'Туркмения', zh: '土库曼斯坦', ja: 'トルクメニスタン' },
  TLS: { en: 'East Timor', es: 'Timor Oriental', ru: 'Восточный Тимор', zh: '东帝汶', ja: '東ティモール' },
  TTO: { en: 'Trinidad and Tobago', es: 'Trinidad y Tobago', ru: 'Тринидад и Тобаго', zh: '特立尼达和多巴哥', ja: 'トリニダード・トバゴ' },
  TUN: { en: 'Tunisia', es: 'Túnez', ru: 'Тунис', zh: '突尼斯', ja: 'チュニジア' },
  TUR: { en: 'Turkey', es: 'Turquía', ru: 'Турция', zh: '土耳其', ja: 'トルコ' },
  TWN: { en: 'Taiwan', es: 'Taiwán', ru: 'Тайвань', zh: '台湾', ja: '台湾' },
  TZA: { en: 'Tanzania', es: 'Tanzania', ru: 'Танзания', zh: '坦桑尼亚', ja: 'タンザニア' },
  UGA: { en: 'Uganda', es: 'Uganda', ru: 'Уганда', zh: '乌干达', ja: 'ウガンダ' },
  UKR: { en: 'Ukraine', es: 'Ucrania', ru: 'Украина', zh: '乌克兰', ja: 'ウクライナ' },
  URY: { en: 'Uruguay', es: 'Uruguay', ru: 'Уругвай', zh: '乌拉圭', ja: 'ウルグアイ' },
  USA: { en: 'United States', es: 'EE. UU.', ru: 'США', zh: '美国', ja: 'アメリカ' },
  UZB: { en: 'Uzbekistan', es: 'Uzbekistán', ru: 'Узбекистан', zh: '乌兹别克斯坦', ja: 'ウズベキスタン' },
  VEN: { en: 'Venezuela', es: 'Venezuela', ru: 'Венесуэла', zh: '委内瑞拉', ja: 'ベネズエラ' },
  VNM: { en: 'Vietnam', es: 'Vietnam', ru: 'Вьетнам', zh: '越南', ja: 'ベトナム' },
  VUT: { en: 'Vanuatu', es: 'Vanuatu', ru: 'Вануату', zh: '瓦努阿图', ja: 'バヌアツ' },
  YEM: { en: 'Yemen', es: 'Yemen', ru: 'Йемен', zh: '也门', ja: 'イエメン' },
  ZAF: { en: 'South Africa', es: 'Sudáfrica', ru: 'ЮАР', zh: '南非', ja: '南アフリカ共和国' },
  ZMB: { en: 'Zambia', es: 'Zambia', ru: 'Замбия', zh: '赞比亚', ja: 'ザンビア' },
  ZWE: { en: 'Zimbabwe', es: 'Zimbabue', ru: 'Зимбабве', zh: '津巴布韦', ja: 'ジンバブエ' },
}

export function countryDisplayName(id: string, locale: Locale = 'en'): string {
  const row = NAMES[id]
  if (!row) return id
  return row[locale] || row.en || id
}

/** URL slug from English country name — e.g. Argentina → argentina. */
export function slugifyCountryName(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const SLUG_TO_ID: Record<string, string> = {}
const ID_TO_SLUG: Record<string, string> = {}

for (const [id, row] of Object.entries(NAMES)) {
  const slug = slugifyCountryName(row.en)
  if (!slug || SLUG_TO_ID[slug]) continue
  SLUG_TO_ID[slug] = id
  ID_TO_SLUG[id] = slug
}

/** Short aliases people actually type. */
const SLUG_ALIASES: Record<string, string> = {
  usa: 'USA',
  us: 'USA',
  uk: 'GBR',
  uae: 'ARE',
  drc: 'COD',
}

for (const [alias, id] of Object.entries(SLUG_ALIASES)) {
  if (!SLUG_TO_ID[alias] && ID_TO_SLUG[id]) SLUG_TO_ID[alias] = id
}

export function countryIdFromSlug(slug: string): string | null {
  const key = slug.trim().toLowerCase()
  return SLUG_TO_ID[key] ?? null
}

export function countrySlug(id: string): string | null {
  return ID_TO_SLUG[id] ?? null
}

export function countryChallengeUrl(id: string, origin = ''): string | null {
  const slug = countrySlug(id)
  if (!slug) return null
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}/nuke/${slug}`
}

