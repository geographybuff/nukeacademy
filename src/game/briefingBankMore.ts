/** Specific intel questions for non-flagship playable countries.
 *  Culture, geography, stereotypes — adult-easy trivia, not capital templates.
 */

export type MoreBriefingQuestion = {
  prompt: string
  choices: [string, string, string]
  correct: 0 | 1 | 2
}

export const BRIEFING_BANK_MORE: Record<string, MoreBriefingQuestion[]> = {
  AFG: [
    {
      prompt: 'Which mountain range dominates Afghanistan?',
      choices: ['Hindu Kush', 'Andes', 'Alps'],
      correct: 0,
    },
    {
      prompt: 'Afghanistan is landlocked between Central and…',
      choices: ['South Asia', 'Southeast Asia', 'West Africa'],
      correct: 0,
    },
    {
      prompt: 'The famed Bamiyan Buddhas once stood in…',
      choices: ['Afghanistan', 'Nepal', 'Thailand'],
      correct: 0,
    },
  ],
  AGO: [
    {
      prompt: 'Angola\'s coast faces the…',
      choices: ['Atlantic Ocean', 'Indian Ocean', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Which desert reaches into southern Angola?',
      choices: ['Namib', 'Gobi', 'Atacama'],
      correct: 0,
    },
    {
      prompt: 'Angola was a long-time colony of…',
      choices: ['Portugal', 'Britain', 'Belgium'],
      correct: 0,
    },
  ],
  ALB: [
    {
      prompt: 'Albania sits on which sea?',
      choices: ['Adriatic / Ionian', 'Baltic', 'Black Sea'],
      correct: 0,
    },
    {
      prompt: 'Albania\'s language is…',
      choices: ['Albanian (a unique Indo-European branch)', 'a Slavic dialect of Russian', 'Turkish only'],
      correct: 0,
    },
    {
      prompt: 'During the Cold War, Albania was famously…',
      choices: ['isolated and bunker-studded', 'a NATO founder', 'part of Scandinavia'],
      correct: 0,
    },
  ],
  ARE: [
    {
      prompt: 'The Burj Khalifa rises in which emirate?',
      choices: ['Dubai', 'Abu Dhabi', 'Sharjah'],
      correct: 0,
    },
    {
      prompt: 'The UAE sits on the…',
      choices: ['Persian Gulf', 'Red Sea', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Palm Jumeirah is a famous man-made island in…',
      choices: ['Dubai', 'Qatar', 'Kuwait'],
      correct: 0,
    },
  ],
  ARM: [
    {
      prompt: 'Mount Ararat is a national symbol for…',
      choices: ['Armenians', 'Georgians', 'Azerbaijanis'],
      correct: 0,
    },
    {
      prompt: 'Armenia\'s traditional flatbread is…',
      choices: ['lavash', 'naan', 'tortilla'],
      correct: 0,
    },
    {
      prompt: 'Lake Sevan is a highland lake in…',
      choices: ['Armenia', 'Turkey', 'Iran'],
      correct: 0,
    },
  ],
  AUT: [
    {
      prompt: 'Mozart was born in which Austrian city?',
      choices: ['Salzburg', 'Vienna', 'Innsbruck'],
      correct: 0,
    },
    {
      prompt: 'The Alps dominate much of…',
      choices: ['Austria', 'Denmark', 'Netherlands'],
      correct: 0,
    },
    {
      prompt: 'Wiener schnitzel is classically associated with…',
      choices: ['Vienna', 'Berlin', 'Prague'],
      correct: 0,
    },
  ],
  AZE: [
    {
      prompt: 'Baku sits on which sea?',
      choices: ['Caspian Sea', 'Black Sea', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Azerbaijan\'s Flame Towers overlook…',
      choices: ['Baku', 'Tbilisi', 'Yerevan'],
      correct: 0,
    },
    {
      prompt: 'Azerbaijan shares the Caucasus region with…',
      choices: ['Georgia and Armenia', 'Poland and Slovakia', 'Greece and Albania'],
      correct: 0,
    },
  ],
  BDI: [
    {
      prompt: 'Burundi lies beside which great African lake?',
      choices: ['Lake Tanganyika', 'Lake Victoria only', 'Lake Chad'],
      correct: 0,
    },
    {
      prompt: 'Burundi is one of Africa\'s most…',
      choices: ['densely populated countries', 'arctic territories', 'island chains'],
      correct: 0,
    },
    {
      prompt: 'Burundi and Rwanda are often called…',
      choices: ['the Great Lakes twins', 'Sahel giants', 'Maghreb twins'],
      correct: 0,
    },
  ],
  BEL: [
    {
      prompt: 'Belgium is famous for which sweet export?',
      choices: ['chocolate and waffles', 'maple syrup', 'baklava'],
      correct: 0,
    },
    {
      prompt: 'EU institutions sit heavily in…',
      choices: ['Brussels', 'Antwerp', 'Bruges'],
      correct: 0,
    },
    {
      prompt: 'Flanders and Wallonia are regions of…',
      choices: ['Belgium', 'Switzerland', 'Austria'],
      correct: 0,
    },
  ],
  BEN: [
    {
      prompt: 'Benin was the heartland of which historic kingdom?',
      choices: ['Dahomey', 'Mali Empire only', 'Zulu Kingdom'],
      correct: 0,
    },
    {
      prompt: 'Benin\'s coast faces the…',
      choices: ['Gulf of Guinea', 'Red Sea', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Vodun (voodoo) traditions are strongly linked to…',
      choices: ['Benin', 'Kenya', 'Morocco'],
      correct: 0,
    },
  ],
  BFA: [
    {
      prompt: 'Burkina Faso\'s name roughly means…',
      choices: ['land of upright people', 'land of a thousand lakes', 'southern forest'],
      correct: 0,
    },
    {
      prompt: 'Burkina Faso sits in which African belt?',
      choices: ['the Sahel', 'the Cape', 'the Maghreb coast'],
      correct: 0,
    },
    {
      prompt: 'Ouagadougou is known as a hub of…',
      choices: ['African cinema (FESPACO)', 'Alpine skiing', 'deep-sea fishing'],
      correct: 0,
    },
  ],
  BGD: [
    {
      prompt: 'Bangladesh sits largely on the delta of which rivers?',
      choices: ['Ganges-Brahmaputra', 'Nile-Blue Nile', 'Amazon-Orinoco'],
      correct: 0,
    },
    {
      prompt: 'What fabric industry anchors Bangladesh\'s exports?',
      choices: ['garments / ready-made clothing', 'silk only from China', 'wool from New Zealand'],
      correct: 0,
    },
    {
      prompt: 'Cyclones regularly threaten the coast of…',
      choices: ['Bangladesh', 'Mongolia', 'Switzerland'],
      correct: 0,
    },
  ],
  BGR: [
    {
      prompt: 'Bulgaria\'s rose valleys are famous for…',
      choices: ['rose oil / perfume', 'coffee beans', 'tea leaves'],
      correct: 0,
    },
    {
      prompt: 'Bulgaria\'s coast faces the…',
      choices: ['Black Sea', 'Adriatic', 'Baltic'],
      correct: 0,
    },
    {
      prompt: 'Yogurt culture is a proud stereotype of…',
      choices: ['Bulgaria', 'Ireland', 'Chile'],
      correct: 0,
    },
  ],
  BHS: [
    {
      prompt: 'The Bahamas are an archipelago in the…',
      choices: ['Atlantic / Caribbean edge', 'Mediterranean', 'Indian Ocean'],
      correct: 0,
    },
    {
      prompt: 'Flamingos are an icon of which Bahamian island?',
      choices: ['Inagua (and others)', 'Iceland', 'Sicily'],
      correct: 0,
    },
    {
      prompt: 'Nassau sits on which island?',
      choices: ['New Providence', 'Cuba', 'Jamaica'],
      correct: 0,
    },
  ],
  BIH: [
    {
      prompt: 'Sarajevo hosted the Winter Olympics in…',
      choices: ['1984', '1994', '1968'],
      correct: 0,
    },
    {
      prompt: 'Bosnia and Herzegovina is known for…',
      choices: ['Ottoman-era bridges and coffee culture', 'fjords', 'rainforests'],
      correct: 0,
    },
    {
      prompt: 'Mostar\'s Old Bridge spans the…',
      choices: ['Neretva', 'Danube', 'Rhine'],
      correct: 0,
    },
  ],
  BLR: [
    {
      prompt: 'Belarus is largely…',
      choices: ['landlocked in Eastern Europe', 'a Pacific island', 'a Maghreb coast state'],
      correct: 0,
    },
    {
      prompt: 'Borscht and potato dishes are staples in…',
      choices: ['Belarusian cuisine', 'Ethiopian cuisine', 'Thai cuisine'],
      correct: 0,
    },
    {
      prompt: 'Belarus borders Poland, Ukraine, Russia, Latvia, and…',
      choices: ['Lithuania', 'Hungary', 'Romania'],
      correct: 0,
    },
  ],
  BLZ: [
    {
      prompt: 'The barrier reef off Belize is part of the…',
      choices: ['Mesoamerican Barrier Reef', 'Great Barrier Reef only', 'Red Sea reef'],
      correct: 0,
    },
    {
      prompt: 'Belize\'s official language is…',
      choices: ['English', 'Spanish only', 'Portuguese'],
      correct: 0,
    },
    {
      prompt: 'The Blue Hole is a dive icon of…',
      choices: ['Belize', 'Norway', 'Kenya'],
      correct: 0,
    },
  ],
  BOL: [
    {
      prompt: 'Lake Titicaca is shared by Bolivia and…',
      choices: ['Peru', 'Chile', 'Brazil'],
      correct: 0,
    },
    {
      prompt: 'Bolivia has two capital cities: La Paz and…',
      choices: ['Sucre', 'Santa Cruz', 'Cochabamba'],
      correct: 0,
    },
    {
      prompt: 'Salar de Uyuni is the world\'s largest…',
      choices: ['salt flat', 'active volcano', 'glacier'],
      correct: 0,
    },
  ],
  BRN: [
    {
      prompt: 'Brunei sits on the island of…',
      choices: ['Borneo', 'Sumatra', 'Java'],
      correct: 0,
    },
    {
      prompt: 'Brunei is known as a…',
      choices: ['small oil-rich sultanate', 'landlocked desert', 'Nordic republic'],
      correct: 0,
    },
    {
      prompt: 'Brunei shares Borneo with Malaysia and…',
      choices: ['Indonesia', 'Thailand', 'Philippines'],
      correct: 0,
    },
  ],
  BTN: [
    {
      prompt: 'Bhutan measures national success partly via…',
      choices: ['Gross National Happiness', 'GDP only', 'Olympic medals'],
      correct: 0,
    },
    {
      prompt: 'Bhutan sits in the…',
      choices: ['Eastern Himalayas', 'Andes', 'Alps'],
      correct: 0,
    },
    {
      prompt: 'Dzong fortress-monasteries define the skyline of…',
      choices: ['Bhutan', 'Mongolia', 'Finland'],
      correct: 0,
    },
  ],
  BWA: [
    {
      prompt: 'The Okavango Delta fans out in…',
      choices: ['Botswana', 'Egypt', 'Morocco'],
      correct: 0,
    },
    {
      prompt: 'Botswana is famed for which gem export?',
      choices: ['diamonds', 'emeralds only from Colombia', 'amber'],
      correct: 0,
    },
    {
      prompt: 'The Kalahari covers much of…',
      choices: ['Botswana', 'Nigeria', 'Tunisia'],
      correct: 0,
    },
  ],
  CAF: [
    {
      prompt: 'The Central African Republic is…',
      choices: ['landlocked in the heart of Africa', 'an Indian Ocean island', 'a Maghreb monarchy'],
      correct: 0,
    },
    {
      prompt: 'Sangha rainforest reaches into…',
      choices: ['the Central African Republic', 'Namibia', 'Libya'],
      correct: 0,
    },
    {
      prompt: 'The Ubangi River helps form the southern edge of…',
      choices: ['the Central African Republic', 'Egypt', 'South Africa'],
      correct: 0,
    },
  ],
  CHE: [
    {
      prompt: 'Swiss neutrality is a long-standing…',
      choices: ['foreign-policy hallmark', 'EU membership rule', 'NATO command role'],
      correct: 0,
    },
    {
      prompt: 'Fondue and raclette are cheese classics of…',
      choices: ['Switzerland', 'Spain', 'Greece'],
      correct: 0,
    },
    {
      prompt: 'Which mountains define Switzerland?',
      choices: ['the Alps', 'the Rockies', 'the Atlas'],
      correct: 0,
    },
  ],
  CHL: [
    {
      prompt: 'Chile is famously shaped like a…',
      choices: ['long thin strip along the Andes', 'perfect circle', 'peninsula like Italy'],
      correct: 0,
    },
    {
      prompt: 'Easter Island (Rapa Nui) belongs to…',
      choices: ['Chile', 'Peru', 'Australia'],
      correct: 0,
    },
    {
      prompt: 'The Atacama Desert is one of the driest places on Earth, in…',
      choices: ['Chile', 'India', 'Ireland'],
      correct: 0,
    },
  ],
  CIV: [
    {
      prompt: 'Ivory Coast is a top global grower of…',
      choices: ['cocoa', 'rice only', 'olives'],
      correct: 0,
    },
    {
      prompt: 'Abidjan is the economic hub of…',
      choices: ['Ivory Coast', 'Senegal', 'Mali'],
      correct: 0,
    },
    {
      prompt: 'Ivory Coast\'s coast faces the…',
      choices: ['Gulf of Guinea', 'Red Sea', 'Mediterranean'],
      correct: 0,
    },
  ],
  CMR: [
    {
      prompt: 'Cameroon is nicknamed…',
      choices: ['Africa in miniature', 'the Pearl of the Orient', 'the Land of Fire'],
      correct: 0,
    },
    {
      prompt: 'Mount Cameroon is an active volcano in…',
      choices: ['Cameroon', 'Kenya', 'Morocco'],
      correct: 0,
    },
    {
      prompt: 'Cameroon\'s official languages include…',
      choices: ['French and English', 'Arabic only', 'Portuguese only'],
      correct: 0,
    },
  ],
  COD: [
    {
      prompt: 'The Congo River is central to…',
      choices: ['the Democratic Republic of the Congo', 'Egypt', 'South Africa'],
      correct: 0,
    },
    {
      prompt: 'Kinshasa sits across the river from…',
      choices: ['Brazzaville', 'Nairobi', 'Lagos'],
      correct: 0,
    },
    {
      prompt: 'The DRC holds huge reserves of…',
      choices: ['cobalt and copper', 'oil only in the Gulf', 'Arctic nickel'],
      correct: 0,
    },
  ],
  COG: [
    {
      prompt: 'The Republic of the Congo\'s coast faces the…',
      choices: ['Atlantic', 'Indian Ocean', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Brazzaville faces Kinshasa across the…',
      choices: ['Congo River', 'Nile', 'Zambezi'],
      correct: 0,
    },
    {
      prompt: 'Much of the Republic of the Congo is…',
      choices: ['rainforest', 'desert', 'tundra'],
      correct: 0,
    },
  ],
  COL: [
    {
      prompt: 'Colombia is the world\'s top producer of…',
      choices: ['emeralds (by value/fame)', 'maple syrup', 'vodka'],
      correct: 0,
    },
    {
      prompt: 'Coffee culture is a national pride of…',
      choices: ['Colombia', 'Finland', 'Mongolia'],
      correct: 0,
    },
    {
      prompt: 'Colombia has coasts on both the Caribbean and the…',
      choices: ['Pacific', 'Atlantic only via Europe', 'Arctic'],
      correct: 0,
    },
  ],
  CRI: [
    {
      prompt: 'Costa Rica abolished its…',
      choices: ['standing army', 'national parks', 'coffee farms'],
      correct: 0,
    },
    {
      prompt: '"Pura vida" is a catchphrase of…',
      choices: ['Costa Rica', 'Chile', 'Cuba'],
      correct: 0,
    },
    {
      prompt: 'Costa Rica sits on the…',
      choices: ['Central American isthmus', 'Horn of Africa', 'Iberian Peninsula'],
      correct: 0,
    },
  ],
  CUB: [
    {
      prompt: 'Havana\'s classic cars and cigars are icons of…',
      choices: ['Cuba', 'Jamaica', 'Mexico'],
      correct: 0,
    },
    {
      prompt: 'The Cuban Revolution brought which leader to power?',
      choices: ['Fidel Castro', 'Che as president', 'Batista forever'],
      correct: 0,
    },
    {
      prompt: 'Cuba is the largest island in the…',
      choices: ['Caribbean', 'Mediterranean', 'Baltic'],
      correct: 0,
    },
  ],
  CYP: [
    {
      prompt: 'Cyprus is an island in the…',
      choices: ['eastern Mediterranean', 'Caribbean', 'North Sea'],
      correct: 0,
    },
    {
      prompt: 'Halloumi cheese is strongly associated with…',
      choices: ['Cyprus', 'France', 'Japan'],
      correct: 0,
    },
    {
      prompt: 'Cyprus has been divided since a conflict in…',
      choices: ['1974', '1914', '2004'],
      correct: 0,
    },
  ],
  CZE: [
    {
      prompt: 'Prague\'s Charles Bridge spans the…',
      choices: ['Vltava', 'Danube', 'Seine'],
      correct: 0,
    },
    {
      prompt: 'Bohemian crystal and beer are trademarks of…',
      choices: ['Czechia', 'Portugal', 'Greece'],
      correct: 0,
    },
    {
      prompt: 'The Velvet Revolution ended communism in…',
      choices: ['Czechoslovakia / Czech lands', 'Spain', 'Sweden'],
      correct: 0,
    },
  ],
  DJI: [
    {
      prompt: 'Djibouti sits at the mouth of the…',
      choices: ['Red Sea / Bab el-Mandeb', 'Persian Gulf only', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Djibouti hosts major foreign…',
      choices: ['military bases', 'ski resorts', 'tea plantations'],
      correct: 0,
    },
    {
      prompt: 'Lake Assal is one of Africa\'s saltiest lakes, in…',
      choices: ['Djibouti', 'Kenya', 'Nigeria'],
      correct: 0,
    },
  ],
  DNK: [
    {
      prompt: 'Denmark is famous for…',
      choices: ['hygge and design', 'samba', 'sumo'],
      correct: 0,
    },
    {
      prompt: 'Greenland is an autonomous territory of…',
      choices: ['Denmark', 'Norway', 'Canada'],
      correct: 0,
    },
    {
      prompt: 'Legos were invented in…',
      choices: ['Denmark', 'Sweden', 'Germany'],
      correct: 0,
    },
  ],
  DOM: [
    {
      prompt: 'Merengue and bachata music come from…',
      choices: ['the Dominican Republic', 'Cuba only', 'Brazil'],
      correct: 0,
    },
    {
      prompt: 'The Dominican Republic shares Hispaniola with…',
      choices: ['Haiti', 'Jamaica', 'Puerto Rico'],
      correct: 0,
    },
    {
      prompt: 'Punta Cana is a beach tourism hub in…',
      choices: ['the Dominican Republic', 'Belize', 'Panama'],
      correct: 0,
    },
  ],
  DZA: [
    {
      prompt: 'Most of Algeria is covered by the…',
      choices: ['Sahara Desert', 'Amazon', 'Gobi'],
      correct: 0,
    },
    {
      prompt: 'Couscous is a Maghreb staple strongly tied to…',
      choices: ['Algeria (among others)', 'Japan', 'Finland'],
      correct: 0,
    },
    {
      prompt: 'Algeria\'s Mediterranean coast was once home to…',
      choices: ['Roman / Phoenician cities', 'Inca temples', 'Viking longhouses'],
      correct: 0,
    },
  ],
  ECU: [
    {
      prompt: 'The Galápagos Islands belong to…',
      choices: ['Ecuador', 'Peru', 'Colombia'],
      correct: 0,
    },
    {
      prompt: 'Ecuador straddles the…',
      choices: ['equator', 'Arctic Circle', 'Tropic of Capricorn only'],
      correct: 0,
    },
    {
      prompt: 'Quito is one of the world\'s highest…',
      choices: ['capital cities', 'seaports', 'desert oases'],
      correct: 0,
    },
  ],
  ERI: [
    {
      prompt: 'Eritrea\'s coast faces the…',
      choices: ['Red Sea', 'Atlantic', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Eritrea gained independence from Ethiopia in…',
      choices: ['1993', '1960', '2011'],
      correct: 0,
    },
    {
      prompt: 'Asmara is famed for…',
      choices: ['Italian modernist architecture', 'skyscraper financial districts', 'igloo villages'],
      correct: 0,
    },
  ],
  EST: [
    {
      prompt: 'Estonia is one of the…',
      choices: ['Baltic states', 'Balkan states', 'Gulf states'],
      correct: 0,
    },
    {
      prompt: 'Skype was born in…',
      choices: ['Estonia', 'Finland only', 'Poland'],
      correct: 0,
    },
    {
      prompt: 'Tallinn\'s Old Town is a…',
      choices: ['UNESCO medieval gem', 'desert caravan stop', 'volcanic crater'],
      correct: 0,
    },
  ],
  ETH: [
    {
      prompt: 'Coffee is widely believed to have originated in…',
      choices: ['Ethiopia', 'Colombia only', 'Vietnam only'],
      correct: 0,
    },
    {
      prompt: 'Lalibela\'s rock-hewn churches are in…',
      choices: ['Ethiopia', 'Egypt', 'Morocco'],
      correct: 0,
    },
    {
      prompt: 'Ethiopia kept its own…',
      choices: ['ancient Christian calendar traditions', 'only Chinese zodiac', 'only Mayan Long Count'],
      correct: 0,
    },
  ],
  FIN: [
    {
      prompt: 'Finland is famous for…',
      choices: ['saunas and lakes', 'deserts and dunes', 'rainforest canopies'],
      correct: 0,
    },
    {
      prompt: 'Nokia began in…',
      choices: ['Finland', 'Sweden', 'Germany'],
      correct: 0,
    },
    {
      prompt: 'The Northern Lights are often seen in…',
      choices: ['Finnish Lapland', 'southern Spain', 'Kenya'],
      correct: 0,
    },
  ],
  FJI: [
    {
      prompt: 'Fiji is an archipelago in the…',
      choices: ['South Pacific', 'Caribbean', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Kava ceremonies are a cultural staple in…',
      choices: ['Fiji', 'Iceland', 'Morocco'],
      correct: 0,
    },
    {
      prompt: 'Rugby is a national passion in…',
      choices: ['Fiji', 'Switzerland', 'Mongolia'],
      correct: 0,
    },
  ],
  GAB: [
    {
      prompt: 'Gabon is largely covered by…',
      choices: ['Central African rainforest', 'Sahara dunes', 'steppe grassland'],
      correct: 0,
    },
    {
      prompt: 'Gabon\'s coast faces the…',
      choices: ['Atlantic', 'Indian Ocean', 'Red Sea'],
      correct: 0,
    },
    {
      prompt: 'Loango and other parks make Gabon a…',
      choices: ['wildlife / ecotourism destination', 'ski capital', 'desert rally hub'],
      correct: 0,
    },
  ],
  GEO: [
    {
      prompt: 'Georgia (the country) sits in the…',
      choices: ['Caucasus', 'Balkans only', 'Scandinavia'],
      correct: 0,
    },
    {
      prompt: 'Khachapuri is a cheese-bread icon of…',
      choices: ['Georgia', 'Greece', 'Italy'],
      correct: 0,
    },
    {
      prompt: 'Wine culture claims deep roots in…',
      choices: ['Georgia', 'Iceland', 'Singapore'],
      correct: 0,
    },
  ],
  GHA: [
    {
      prompt: 'Ghana was formerly known as the…',
      choices: ['Gold Coast', 'Ivory Coast', 'Slave Coast only as its name'],
      correct: 0,
    },
    {
      prompt: 'Ghana\'s flag famously includes a…',
      choices: ['black star', 'maple leaf', 'crescent only'],
      correct: 0,
    },
    {
      prompt: 'Lake Volta is a huge reservoir in…',
      choices: ['Ghana', 'Egypt', 'Kenya'],
      correct: 0,
    },
  ],
  GIN: [
    {
      prompt: 'Guinea\'s coast faces the…',
      choices: ['Atlantic', 'Indian Ocean', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Bauxite (aluminum ore) is a major export of…',
      choices: ['Guinea', 'Switzerland', 'New Zealand'],
      correct: 0,
    },
    {
      prompt: 'Guinea was a French colony in…',
      choices: ['West Africa', 'East Asia', 'the Andes'],
      correct: 0,
    },
  ],
  GMB: [
    {
      prompt: 'The Gambia is nearly surrounded by…',
      choices: ['Senegal', 'Mali', 'Guinea-Bissau only'],
      correct: 0,
    },
    {
      prompt: 'The Gambia follows which river to the coast?',
      choices: ['the Gambia River', 'the Nile', 'the Congo'],
      correct: 0,
    },
    {
      prompt: 'The Gambia is Africa\'s…',
      choices: ['smallest mainland country', 'largest desert', 'highest mountain state'],
      correct: 0,
    },
  ],
  GNB: [
    {
      prompt: 'Guinea-Bissau\'s official language is…',
      choices: ['Portuguese', 'French', 'English'],
      correct: 0,
    },
    {
      prompt: 'Guinea-Bissau includes the…',
      choices: ['Bijagós archipelago', 'Canary Islands', 'Azores'],
      correct: 0,
    },
    {
      prompt: 'Cashew nuts are a key export of…',
      choices: ['Guinea-Bissau', 'Norway', 'Austria'],
      correct: 0,
    },
  ],
  GNQ: [
    {
      prompt: 'Equatorial Guinea\'s mainland region is called…',
      choices: ['Río Muni', 'Cabinda', 'Darfur'],
      correct: 0,
    },
    {
      prompt: 'Malabo sits on Bioko island in…',
      choices: ['Equatorial Guinea', 'São Tomé', 'Cape Verde'],
      correct: 0,
    },
    {
      prompt: 'Equatorial Guinea\'s official languages include…',
      choices: ['Spanish (and others)', 'only Arabic', 'only Dutch'],
      correct: 0,
    },
  ],
  GRC: [
    {
      prompt: 'The Acropolis overlooks which city?',
      choices: ['Athens', 'Rome', 'Istanbul'],
      correct: 0,
    },
    {
      prompt: 'Feta cheese and olive oil are staples of…',
      choices: ['Greek cuisine', 'Mongolian cuisine', 'Finnish cuisine'],
      correct: 0,
    },
    {
      prompt: 'Which sea surrounds much of Greece?',
      choices: ['Aegean / Mediterranean', 'Baltic', 'Caribbean'],
      correct: 0,
    },
  ],
  GRL: [
    {
      prompt: 'Greenland is mostly covered by…',
      choices: ['an ice sheet', 'tropical forest', 'desert dunes'],
      correct: 0,
    },
    {
      prompt: 'Nuuk sits on Greenland\'s…',
      choices: ['southwest coast', 'equator', 'Black Sea shore'],
      correct: 0,
    },
    {
      prompt: 'Politically, Greenland is tied to…',
      choices: ['Denmark', 'Canada', 'Norway as a county'],
      correct: 0,
    },
  ],
  GTM: [
    {
      prompt: 'Tikal\'s Maya pyramids stand in…',
      choices: ['Guatemala', 'Mexico only', 'Belize only'],
      correct: 0,
    },
    {
      prompt: 'Guatemala\'s volcanic highlands grow famous…',
      choices: ['coffee', 'rice only', 'wheat for pasta'],
      correct: 0,
    },
    {
      prompt: 'Antigua Guatemala is famed for…',
      choices: ['colonial churches and volcano views', 'skyscrapers', 'fjords'],
      correct: 0,
    },
  ],
  GUY: [
    {
      prompt: 'Guyana\'s official language is…',
      choices: ['English', 'Spanish', 'Portuguese'],
      correct: 0,
    },
    {
      prompt: 'Kaieteur Falls is a landmark of…',
      choices: ['Guyana', 'Venezuela only', 'Suriname only'],
      correct: 0,
    },
    {
      prompt: 'Guyana sits on South America\'s…',
      choices: ['northeast shoulder', 'southern tip', 'Pacific coast'],
      correct: 0,
    },
  ],
  HND: [
    {
      prompt: 'Honduras has a Caribbean coast famed for…',
      choices: ['the Bay Islands / reefs', 'fjords', 'icebergs'],
      correct: 0,
    },
    {
      prompt: 'Copán\'s Maya ruins are in…',
      choices: ['Honduras', 'Peru', 'Chile'],
      correct: 0,
    },
    {
      prompt: 'Honduras sits in…',
      choices: ['Central America', 'South America', 'the Caribbean Antilles only'],
      correct: 0,
    },
  ],
  HRV: [
    {
      prompt: 'Croatia\'s Dalmatian coast faces the…',
      choices: ['Adriatic', 'Baltic', 'Black Sea'],
      correct: 0,
    },
    {
      prompt: 'Dubrovnik\'s walled old town is in…',
      choices: ['Croatia', 'Italy', 'Greece'],
      correct: 0,
    },
    {
      prompt: 'Game of Thrones filmed heavily in…',
      choices: ['Dubrovnik / Croatia', 'Warsaw', 'Oslo'],
      correct: 0,
    },
  ],
  HTI: [
    {
      prompt: 'Haiti shares Hispaniola with…',
      choices: ['the Dominican Republic', 'Cuba', 'Jamaica'],
      correct: 0,
    },
    {
      prompt: 'Haiti was the site of the first successful…',
      choices: ['large-scale slave revolt leading to independence', 'Olympic Games', 'transcontinental railroad'],
      correct: 0,
    },
    {
      prompt: 'Vodou is a cultural tradition associated with…',
      choices: ['Haiti', 'Japan', 'Sweden'],
      correct: 0,
    },
  ],
  HUN: [
    {
      prompt: 'Budapest is split by which river?',
      choices: ['the Danube', 'the Rhine', 'the Seine'],
      correct: 0,
    },
    {
      prompt: 'Goulash is a stew icon of…',
      choices: ['Hungary', 'Spain', 'Thailand'],
      correct: 0,
    },
    {
      prompt: 'Hungarian is related to…',
      choices: ['Finnish (Uralic family)', 'Spanish', 'Arabic'],
      correct: 0,
    },
  ],
  IRL: [
    {
      prompt: 'Ireland is nicknamed the…',
      choices: ['Emerald Isle', 'Land of the Rising Sun', 'Pearl of Africa'],
      correct: 0,
    },
    {
      prompt: 'Guinness stout originated in…',
      choices: ['Dublin', 'London', 'Edinburgh'],
      correct: 0,
    },
    {
      prompt: 'The Cliffs of Moher face the…',
      choices: ['Atlantic', 'Mediterranean', 'Baltic'],
      correct: 0,
    },
  ],
  IRQ: [
    {
      prompt: 'Mesopotamia - land between the rivers - is largely in…',
      choices: ['Iraq', 'Egypt', 'Iran only'],
      correct: 0,
    },
    {
      prompt: 'The Tigris and Euphrates flow through…',
      choices: ['Iraq', 'Libya', 'Yemen'],
      correct: 0,
    },
    {
      prompt: 'Babylon\'s ruins lie in modern…',
      choices: ['Iraq', 'Turkey', 'Jordan'],
      correct: 0,
    },
  ],
  ISL: [
    {
      prompt: 'Iceland sits on the…',
      choices: ['Mid-Atlantic Ridge', 'Pacific Ring only', 'Sahara plate'],
      correct: 0,
    },
    {
      prompt: 'Geysers and hot springs are everyday geography in…',
      choices: ['Iceland', 'Belgium', 'Jordan'],
      correct: 0,
    },
    {
      prompt: 'Iceland\'s language is closely related to…',
      choices: ['Old Norse roots', 'Arabic', 'Mandarin'],
      correct: 0,
    },
  ],
  ISR: [
    {
      prompt: 'The Dead Sea borders Israel and…',
      choices: ['Jordan', 'Egypt only', 'Lebanon only'],
      correct: 0,
    },
    {
      prompt: 'Hebrew was revived as a modern spoken language in…',
      choices: ['Israel', 'Iraq', 'Yemen'],
      correct: 0,
    },
    {
      prompt: 'Jerusalem\'s Old City holds holy sites for…',
      choices: ['Judaism, Christianity, and Islam', 'only Buddhism', 'only Hinduism'],
      correct: 0,
    },
  ],
  JAM: [
    {
      prompt: 'Reggae music and Bob Marley come from…',
      choices: ['Jamaica', 'Trinidad only', 'Cuba'],
      correct: 0,
    },
    {
      prompt: 'Jerk seasoning is a culinary trademark of…',
      choices: ['Jamaica', 'Mexico', 'Peru'],
      correct: 0,
    },
    {
      prompt: 'Jamaica is an island in the…',
      choices: ['Caribbean', 'Mediterranean', 'South Pacific'],
      correct: 0,
    },
  ],
  JOR: [
    {
      prompt: 'Petra\'s rose-red rock city is in…',
      choices: ['Jordan', 'Syria', 'Lebanon'],
      correct: 0,
    },
    {
      prompt: 'Jordan\'s only seaport is on the…',
      choices: ['Red Sea (Aqaba)', 'Mediterranean', 'Persian Gulf'],
      correct: 0,
    },
    {
      prompt: 'Wadi Rum\'s desert vistas are in…',
      choices: ['Jordan', 'Egypt only', 'Saudi Arabia only'],
      correct: 0,
    },
  ],
  KAZ: [
    {
      prompt: 'Kazakhstan is the world\'s largest…',
      choices: ['landlocked country', 'island nation', 'archipelago'],
      correct: 0,
    },
    {
      prompt: 'The Baikonur Cosmodrome is in…',
      choices: ['Kazakhstan', 'Russia only as territory', 'Mongolia'],
      correct: 0,
    },
    {
      prompt: 'Kazakhstan spans both…',
      choices: ['Europe and Asia (by some definitions)', 'Africa and Asia', 'North and South America'],
      correct: 0,
    },
  ],
  KEN: [
    {
      prompt: 'The Great Rift Valley cuts through…',
      choices: ['Kenya', 'Nigeria', 'Morocco'],
      correct: 0,
    },
    {
      prompt: 'The Maasai are an iconic people of…',
      choices: ['Kenya (and Tanzania)', 'Egypt', 'Ghana'],
      correct: 0,
    },
    {
      prompt: 'Nairobi National Park sits beside the city of…',
      choices: ['Nairobi', 'Lagos', 'Cairo'],
      correct: 0,
    },
  ],
  KGZ: [
    {
      prompt: 'Kyrgyzstan is dominated by which mountains?',
      choices: ['Tian Shan', 'Alps', 'Andes'],
      correct: 0,
    },
    {
      prompt: 'Lake Issyk-Kul is a vast highland lake in…',
      choices: ['Kyrgyzstan', 'Uzbekistan', 'Tajikistan'],
      correct: 0,
    },
    {
      prompt: 'Yurts and nomadic heritage are strong in…',
      choices: ['Kyrgyz culture', 'Belgian culture', 'Japanese culture'],
      correct: 0,
    },
  ],
  KHM: [
    {
      prompt: 'Angkor Wat is in…',
      choices: ['Cambodia', 'Thailand', 'Vietnam'],
      correct: 0,
    },
    {
      prompt: 'The Mekong and Tonlé Sap shape…',
      choices: ['Cambodia\'s heartland', 'Mongolia', 'Jordan'],
      correct: 0,
    },
    {
      prompt: 'Khmer is the main language of…',
      choices: ['Cambodia', 'Laos only', 'Myanmar'],
      correct: 0,
    },
  ],
  KOS: [
    {
      prompt: 'Kosovo is a landlocked territory in the…',
      choices: ['Balkans', 'Caucasus', 'Baltic'],
      correct: 0,
    },
    {
      prompt: 'Kosovo declared independence in…',
      choices: ['2008', '1991', '1945'],
      correct: 0,
    },
    {
      prompt: 'Pristina is the main city of…',
      choices: ['Kosovo', 'Montenegro', 'North Macedonia'],
      correct: 0,
    },
  ],
  KWT: [
    {
      prompt: 'Kuwait sits at the head of the…',
      choices: ['Persian Gulf', 'Red Sea', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Oil wealth transformed which small Gulf state?',
      choices: ['Kuwait', 'Jordan', 'Lebanon'],
      correct: 0,
    },
    {
      prompt: 'Kuwait\'s skyline is famed for the…',
      choices: ['Kuwait Towers', 'Eiffel Tower', 'Burj Khalifa'],
      correct: 0,
    },
  ],
  LAO: [
    {
      prompt: 'Laos is the only…',
      choices: ['landlocked country in Southeast Asia', 'island in the Mekong', 'EU member in Asia'],
      correct: 0,
    },
    {
      prompt: 'Luang Prabang\'s temples sit on the…',
      choices: ['Mekong', 'Yangtze', 'Ganges'],
      correct: 0,
    },
    {
      prompt: 'Sticky rice is a daily staple in…',
      choices: ['Laos', 'Ireland', 'Argentina'],
      correct: 0,
    },
  ],
  LBN: [
    {
      prompt: 'Beirut was long called the…',
      choices: ['Paris of the Middle East', 'Venice of the North', 'Pearl of Africa'],
      correct: 0,
    },
    {
      prompt: 'Lebanon\'s mountains rise quickly from the…',
      choices: ['Mediterranean', 'Red Sea', 'Persian Gulf'],
      correct: 0,
    },
    {
      prompt: 'Tabbouleh and hummus are Levantine staples tied to…',
      choices: ['Lebanon (among others)', 'Japan', 'Finland'],
      correct: 0,
    },
  ],
  LBR: [
    {
      prompt: 'Liberia was founded with ties to…',
      choices: ['freed American settlers', 'French missionaries only', 'Dutch traders only'],
      correct: 0,
    },
    {
      prompt: 'Liberia\'s flag resembles a…',
      choices: ['U.S.-style star-and-stripes variant', 'Union Jack', 'rising sun'],
      correct: 0,
    },
    {
      prompt: 'Rubber plantations shaped the economy of…',
      choices: ['Liberia', 'Norway', 'Nepal'],
      correct: 0,
    },
  ],
  LBY: [
    {
      prompt: 'Most of Libya is covered by the…',
      choices: ['Sahara', 'Amazon', 'Congo rainforest'],
      correct: 0,
    },
    {
      prompt: 'Ancient Roman ruins at Leptis Magna are in…',
      choices: ['Libya', 'Tunisia only', 'Egypt only'],
      correct: 0,
    },
    {
      prompt: 'Libya\'s coast faces the…',
      choices: ['Mediterranean', 'Red Sea', 'Atlantic'],
      correct: 0,
    },
  ],
  LKA: [
    {
      prompt: 'Sri Lanka was formerly called…',
      choices: ['Ceylon', 'Formosa', 'Siam'],
      correct: 0,
    },
    {
      prompt: 'Ceylon tea is a classic export of…',
      choices: ['Sri Lanka', 'Kenya only', 'India only'],
      correct: 0,
    },
    {
      prompt: 'Sri Lanka is an island off the tip of…',
      choices: ['India', 'Africa', 'Australia'],
      correct: 0,
    },
  ],
  LSO: [
    {
      prompt: 'Lesotho is entirely surrounded by…',
      choices: ['South Africa', 'Namibia', 'Botswana'],
      correct: 0,
    },
    {
      prompt: 'Lesotho is nicknamed the…',
      choices: ['Kingdom in the Sky', 'Land of Lakes', 'Coconut Isle'],
      correct: 0,
    },
    {
      prompt: 'High-altitude blankets and pony treks are icons of…',
      choices: ['Lesotho', 'Gambia', 'Qatar'],
      correct: 0,
    },
  ],
  LTU: [
    {
      prompt: 'Lithuania is one of the…',
      choices: ['Baltic states', 'Balkan states', 'Nordic islands'],
      correct: 0,
    },
    {
      prompt: 'Vilnius\'s baroque old town is the heart of…',
      choices: ['Lithuania', 'Latvia only', 'Estonia only'],
      correct: 0,
    },
    {
      prompt: 'Basketball is a national obsession in…',
      choices: ['Lithuania', 'Iceland', 'Malta'],
      correct: 0,
    },
  ],
  LUX: [
    {
      prompt: 'Luxembourg is a…',
      choices: ['small wealthy Grand Duchy', 'large desert republic', 'Pacific archipelago'],
      correct: 0,
    },
    {
      prompt: 'Luxembourg City sits on dramatic…',
      choices: ['cliffs and valleys', 'beaches only', 'tundra'],
      correct: 0,
    },
    {
      prompt: 'Luxembourg is a founding member of…',
      choices: ['the EU / Benelux story', 'ASEAN', 'Mercosur only'],
      correct: 0,
    },
  ],
  LVA: [
    {
      prompt: 'Latvia is one of the…',
      choices: ['Baltic states', 'Caucasus states', 'Gulf states'],
      correct: 0,
    },
    {
      prompt: 'Art Nouveau architecture fills much of…',
      choices: ['Riga', 'Tallinn only', 'Vilnius only'],
      correct: 0,
    },
    {
      prompt: 'Latvia\'s coast faces the…',
      choices: ['Baltic Sea', 'Black Sea', 'Adriatic'],
      correct: 0,
    },
  ],
  MAR: [
    {
      prompt: 'Morocco sits at Africa\'s…',
      choices: ['northwest corner', 'southeast tip', 'Horn'],
      correct: 0,
    },
    {
      prompt: 'Marrakech\'s medina and souks are icons of…',
      choices: ['Morocco', 'Egypt only', 'Turkey only'],
      correct: 0,
    },
    {
      prompt: 'The Atlas Mountains run through…',
      choices: ['Morocco', 'Kenya', 'Nigeria'],
      correct: 0,
    },
  ],
  MDA: [
    {
      prompt: 'Moldova is…',
      choices: ['landlocked between Romania and Ukraine', 'a Black Sea island', 'a Baltic republic'],
      correct: 0,
    },
    {
      prompt: 'Wine cellars at Cricova are a pride of…',
      choices: ['Moldova', 'Portugal only', 'Chile only'],
      correct: 0,
    },
    {
      prompt: 'Moldovan language is closely related to…',
      choices: ['Romanian', 'Polish', 'Turkish'],
      correct: 0,
    },
  ],
  MDG: [
    {
      prompt: 'Madagascar is famous for…',
      choices: ['lemurs found nowhere else', 'penguins', 'kangaroos'],
      correct: 0,
    },
    {
      prompt: 'Madagascar is the world\'s…',
      choices: ['fourth-largest island', 'smallest continent', 'largest desert'],
      correct: 0,
    },
    {
      prompt: 'Vanilla is a major export of…',
      choices: ['Madagascar', 'Canada', 'Finland'],
      correct: 0,
    },
  ],
  MKD: [
    {
      prompt: 'North Macedonia\'s Lake Ohrid is…',
      choices: ['an ancient deep lake shared with Albania', 'a desert oasis', 'an Arctic fjord'],
      correct: 0,
    },
    {
      prompt: 'Skopje sits on the…',
      choices: ['Vardar River', 'Danube only', 'Rhine'],
      correct: 0,
    },
    {
      prompt: 'North Macedonia is in the…',
      choices: ['Balkans', 'Scandinavia', 'Maghreb'],
      correct: 0,
    },
  ],
  MLI: [
    {
      prompt: 'Timbuktu was a historic trade & learning city in…',
      choices: ['Mali', 'Egypt', 'Morocco only'],
      correct: 0,
    },
    {
      prompt: 'Mali sits in the…',
      choices: ['West African Sahel', 'Horn of Africa', 'Cape region'],
      correct: 0,
    },
    {
      prompt: 'The Niger River curves through…',
      choices: ['Mali', 'Kenya', 'South Africa'],
      correct: 0,
    },
  ],
  MMR: [
    {
      prompt: 'Myanmar was formerly called…',
      choices: ['Burma', 'Siam', 'Ceylon'],
      correct: 0,
    },
    {
      prompt: 'The golden Shwedagon Pagoda is in…',
      choices: ['Yangon', 'Bangkok', 'Hanoi'],
      correct: 0,
    },
    {
      prompt: 'Myanmar\'s coast faces the…',
      choices: ['Bay of Bengal / Andaman Sea', 'Mediterranean', 'Caribbean'],
      correct: 0,
    },
  ],
  MNE: [
    {
      prompt: 'Montenegro\'s coast faces the…',
      choices: ['Adriatic', 'Baltic', 'Black Sea'],
      correct: 0,
    },
    {
      prompt: 'Kotor\'s bay and old town are jewels of…',
      choices: ['Montenegro', 'Croatia only', 'Albania only'],
      correct: 0,
    },
    {
      prompt: 'Montenegro\'s name literally means…',
      choices: ['Black Mountain', 'White River', 'Green Valley'],
      correct: 0,
    },
  ],
  MNG: [
    {
      prompt: 'Mongolia is known for…',
      choices: ['steppe and nomadic heritage', 'tropical reefs', 'rainforests'],
      correct: 0,
    },
    {
      prompt: 'Genghis Khan\'s empire rose from…',
      choices: ['the Mongolian steppe', 'Persia', 'Rome'],
      correct: 0,
    },
    {
      prompt: 'The Gobi Desert spans southern…',
      choices: ['Mongolia (and northern China)', 'India', 'Turkey'],
      correct: 0,
    },
  ],
  MOZ: [
    {
      prompt: 'Mozambique\'s coast faces the…',
      choices: ['Indian Ocean', 'Atlantic', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Portuguese is the official language of…',
      choices: ['Mozambique', 'Kenya', 'Ghana'],
      correct: 0,
    },
    {
      prompt: 'The Zambezi reaches the sea through…',
      choices: ['Mozambique', 'Namibia', 'Botswana'],
      correct: 0,
    },
  ],
  MRT: [
    {
      prompt: 'Mauritania is mostly…',
      choices: ['Sahara Desert', 'rainforest', 'alpine'],
      correct: 0,
    },
    {
      prompt: 'Mauritania\'s coast faces the…',
      choices: ['Atlantic', 'Red Sea', 'Mediterranean only'],
      correct: 0,
    },
    {
      prompt: 'Nouakchott sits near the edge of the…',
      choices: ['Sahara and the Atlantic', 'Alps', 'Amazon'],
      correct: 0,
    },
  ],
  MWI: [
    {
      prompt: 'Lake Malawi dominates the geography of…',
      choices: ['Malawi', 'Mali', 'Gabon'],
      correct: 0,
    },
    {
      prompt: 'Malawi is nicknamed the…',
      choices: ['Warm Heart of Africa', 'Pearl of the Orient', 'Land of Fire'],
      correct: 0,
    },
    {
      prompt: 'Malawi is…',
      choices: ['landlocked in southeastern Africa', 'an Indian Ocean atoll', 'a Maghreb coast state'],
      correct: 0,
    },
  ],
  MYS: [
    {
      prompt: 'Petronas Towers once held the world\'s tallest title in…',
      choices: ['Kuala Lumpur', 'Singapore', 'Jakarta'],
      correct: 0,
    },
    {
      prompt: 'Malaysia shares Borneo with Indonesia and…',
      choices: ['Brunei', 'Thailand', 'Philippines'],
      correct: 0,
    },
    {
      prompt: 'Nasi lemak is a national breakfast icon of…',
      choices: ['Malaysia', 'Japan', 'Korea'],
      correct: 0,
    },
  ],
  NAM: [
    {
      prompt: 'The Namib is often called the world\'s…',
      choices: ['oldest desert', 'wettest rainforest', 'tallest mountain'],
      correct: 0,
    },
    {
      prompt: 'Namibia\'s Skeleton Coast faces the…',
      choices: ['Atlantic', 'Indian Ocean', 'Red Sea'],
      correct: 0,
    },
    {
      prompt: 'Etosha Pan is a wildlife magnet in…',
      choices: ['Namibia', 'Kenya only', 'Botswana only'],
      correct: 0,
    },
  ],
  NER: [
    {
      prompt: 'Niger sits mostly in the…',
      choices: ['Sahara / Sahel', 'Congo Basin rainforest', 'Cape fold belt'],
      correct: 0,
    },
    {
      prompt: 'The Niger River gives its name to…',
      choices: ['Niger (and Nigeria)', 'Egypt', 'Sudan only'],
      correct: 0,
    },
    {
      prompt: 'Uranium mining has been important in…',
      choices: ['Niger', 'Iceland', 'Costa Rica'],
      correct: 0,
    },
  ],
  NIC: [
    {
      prompt: 'Nicaragua has coasts on both the…',
      choices: ['Pacific and Caribbean', 'Atlantic and Arctic', 'Red and Black Seas'],
      correct: 0,
    },
    {
      prompt: 'Lake Nicaragua is one of Central America\'s…',
      choices: ['largest lakes', 'highest peaks', 'only deserts'],
      correct: 0,
    },
    {
      prompt: 'Colonial Granada sits in…',
      choices: ['Nicaragua', 'Honduras only', 'Panama'],
      correct: 0,
    },
  ],
  NLD: [
    {
      prompt: 'Much of the Netherlands is…',
      choices: ['below sea level / reclaimed polders', 'high alpine plateau', 'tropical jungle'],
      correct: 0,
    },
    {
      prompt: 'Tulips and windmills are stereotypes of…',
      choices: ['the Netherlands', 'Spain', 'Greece'],
      correct: 0,
    },
    {
      prompt: 'Dutch masters like Rembrandt painted in…',
      choices: ['the Netherlands', 'Austria', 'Poland'],
      correct: 0,
    },
  ],
  NOR: [
    {
      prompt: 'Norway is famous for…',
      choices: ['fjords', 'saharas', 'mangroves'],
      correct: 0,
    },
    {
      prompt: 'The Nobel Peace Prize is awarded in…',
      choices: ['Oslo', 'Stockholm', 'Copenhagen'],
      correct: 0,
    },
    {
      prompt: 'Oil wealth from the North Sea shaped modern…',
      choices: ['Norway', 'Finland', 'Estonia'],
      correct: 0,
    },
  ],
  NPL: [
    {
      prompt: 'Mount Everest sits on the border of Nepal and…',
      choices: ['China (Tibet)', 'India only', 'Bhutan only'],
      correct: 0,
    },
    {
      prompt: 'Sherpa culture is strongly tied to…',
      choices: ['Nepal\'s Himalaya', 'Mongolia\'s steppe', 'Kenya\'s savanna'],
      correct: 0,
    },
    {
      prompt: 'Kathmandu Valley\'s temples are the heart of…',
      choices: ['Nepal', 'Bangladesh', 'Sri Lanka'],
      correct: 0,
    },
  ],
  NZL: [
    {
      prompt: 'The Māori are indigenous to…',
      choices: ['New Zealand', 'Australia', 'Hawaii only'],
      correct: 0,
    },
    {
      prompt: 'New Zealand\'s islands are mainly…',
      choices: ['North and South Island', 'one desert plateau', 'a single atoll'],
      correct: 0,
    },
    {
      prompt: 'Kiwi birds (and the nickname) belong to…',
      choices: ['New Zealand', 'South Africa', 'Ireland'],
      correct: 0,
    },
  ],
  OMN: [
    {
      prompt: 'Oman sits on the southeast of the…',
      choices: ['Arabian Peninsula', 'Anatolian plateau', 'Horn of Africa'],
      correct: 0,
    },
    {
      prompt: 'Muscat\'s forts overlook the…',
      choices: ['Gulf of Oman / Arabian Sea', 'Mediterranean', 'Red Sea only'],
      correct: 0,
    },
    {
      prompt: 'Frankincense trade historically enriched…',
      choices: ['Oman', 'Iceland', 'Finland'],
      correct: 0,
    },
  ],
  PAK: [
    {
      prompt: 'The Indus River is the lifeline of…',
      choices: ['Pakistan', 'Iran', 'Turkey'],
      correct: 0,
    },
    {
      prompt: 'K2, the world\'s second-highest peak, lies in…',
      choices: ['Pakistan\'s Karakoram', 'Nepal only', 'India\'s south'],
      correct: 0,
    },
    {
      prompt: 'Pakistan was created in…',
      choices: ['1947', '1857', '1971 as its only date'],
      correct: 0,
    },
  ],
  PAN: [
    {
      prompt: 'The Panama Canal links the…',
      choices: ['Atlantic/Caribbean and Pacific', 'Mediterranean and Red Sea', 'Baltic and Black Sea'],
      correct: 0,
    },
    {
      prompt: 'Panama sits on the…',
      choices: ['isthmus of Central America', 'Horn of Africa', 'Cape of Good Hope'],
      correct: 0,
    },
    {
      prompt: 'The U.S. formerly controlled the…',
      choices: ['Panama Canal Zone', 'Suez Canal', 'Kiel Canal'],
      correct: 0,
    },
  ],
  PER: [
    {
      prompt: 'Machu Picchu is in…',
      choices: ['Peru', 'Bolivia', 'Ecuador'],
      correct: 0,
    },
    {
      prompt: 'Ceviche is a coastal culinary icon of…',
      choices: ['Peru', 'Argentina', 'Chile only'],
      correct: 0,
    },
    {
      prompt: 'The Inca Empire was centered in…',
      choices: ['Peru', 'Mexico', 'Brazil'],
      correct: 0,
    },
  ],
  PHL: [
    {
      prompt: 'The Philippines is an…',
      choices: ['archipelago of thousands of islands', 'landlocked plateau', 'single desert'],
      correct: 0,
    },
    {
      prompt: 'Jeepneys are colorful transport icons of…',
      choices: ['the Philippines', 'Thailand', 'Vietnam'],
      correct: 0,
    },
    {
      prompt: 'The Philippines was a long-time colony of…',
      choices: ['Spain (then the U.S.)', 'France only', 'Portugal only'],
      correct: 0,
    },
  ],
  PNG: [
    {
      prompt: 'Papua New Guinea occupies the eastern half of…',
      choices: ['New Guinea island', 'Borneo', 'Australia'],
      correct: 0,
    },
    {
      prompt: 'Papua New Guinea is famed for…',
      choices: ['extreme linguistic diversity', 'one single language', 'no mountains'],
      correct: 0,
    },
    {
      prompt: 'PNG sits just north of…',
      choices: ['Australia', 'Japan', 'India'],
      correct: 0,
    },
  ],
  PRK: [
    {
      prompt: 'North Korea\'s ideology is often labeled…',
      choices: ['Juche', 'Perestroika', 'Glasnost'],
      correct: 0,
    },
    {
      prompt: 'The Korean Demilitarized Zone separates North Korea from…',
      choices: ['South Korea', 'China only', 'Japan'],
      correct: 0,
    },
    {
      prompt: 'Pyongyang\'s monumental avenues define the seat of…',
      choices: ['North Korea', 'South Korea', 'Mongolia'],
      correct: 0,
    },
  ],
  PRT: [
    {
      prompt: 'Portugal\'s explorers led the Age of…',
      choices: ['Discovery', 'Industrialization only', 'Enlightenment only'],
      correct: 0,
    },
    {
      prompt: 'Port wine takes its name from…',
      choices: ['Porto', 'Lisbon', 'Madrid'],
      correct: 0,
    },
    {
      prompt: 'Portugal\'s coast faces the…',
      choices: ['Atlantic', 'Mediterranean only', 'Baltic'],
      correct: 0,
    },
  ],
  PRY: [
    {
      prompt: 'Paraguay is…',
      choices: ['landlocked in South America', 'an Andean coastal state', 'a Caribbean island'],
      correct: 0,
    },
    {
      prompt: 'The Guaraní language is widely spoken in…',
      choices: ['Paraguay', 'Chile', 'Uruguay only'],
      correct: 0,
    },
    {
      prompt: 'Itaipu Dam is shared by Paraguay and…',
      choices: ['Brazil', 'Argentina only', 'Bolivia'],
      correct: 0,
    },
  ],
  QAT: [
    {
      prompt: 'Qatar hosted the FIFA World Cup in…',
      choices: ['2022', '2018', '2014'],
      correct: 0,
    },
    {
      prompt: 'Qatar is a peninsula on the…',
      choices: ['Persian Gulf', 'Red Sea', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Liquefied natural gas wealth transformed…',
      choices: ['Qatar', 'Jordan', 'Yemen'],
      correct: 0,
    },
  ],
  ROU: [
    {
      prompt: 'Romania\'s Transylvania is tied to…',
      choices: ['Dracula lore and Carpathian castles', 'samba', 'samurai'],
      correct: 0,
    },
    {
      prompt: 'The Danube reaches the Black Sea via…',
      choices: ['Romania\'s delta', 'Poland', 'Greece'],
      correct: 0,
    },
    {
      prompt: 'Bucharest was once nicknamed…',
      choices: ['Little Paris', 'Venice of the North', 'Pearl of the Orient'],
      correct: 0,
    },
  ],
  RWA: [
    {
      prompt: 'Rwanda is nicknamed the…',
      choices: ['Land of a Thousand Hills', 'Land of Lakes only', 'Desert Kingdom'],
      correct: 0,
    },
    {
      prompt: 'Mountain gorillas draw visitors to…',
      choices: ['Rwanda (and neighbors)', 'Egypt', 'Morocco'],
      correct: 0,
    },
    {
      prompt: 'Kinyarwanda is the main language of…',
      choices: ['Rwanda', 'Kenya', 'Nigeria'],
      correct: 0,
    },
  ],
  SAU: [
    {
      prompt: 'Saudi Arabia holds Islam\'s two holiest cities…',
      choices: ['Mecca and Medina', 'Jerusalem and Damascus', 'Cairo and Baghdad'],
      correct: 0,
    },
    {
      prompt: 'Most of Saudi Arabia is…',
      choices: ['desert', 'rainforest', 'tundra'],
      correct: 0,
    },
    {
      prompt: 'Riyadh sits in the…',
      choices: ['Najd interior', 'Red Sea coast only', 'Persian Gulf islands only'],
      correct: 0,
    },
  ],
  SDN: [
    {
      prompt: 'Sudan sits along which great river?',
      choices: ['the Nile', 'the Congo', 'the Niger only'],
      correct: 0,
    },
    {
      prompt: 'Sudan\'s pyramids of Meroë belonged to the…',
      choices: ['Kingdom of Kush', 'Ottoman navy', 'Roman Britain'],
      correct: 0,
    },
    {
      prompt: 'Khartoum sits at the confluence of the…',
      choices: ['Blue and White Nile', 'Tigris and Euphrates', 'Rhine and Moselle'],
      correct: 0,
    },
  ],
  SDS: [
    {
      prompt: 'South Sudan gained independence in…',
      choices: ['2011', '1960', '1994'],
      correct: 0,
    },
    {
      prompt: 'South Sudan is…',
      choices: ['Africa\'s newest widely recognized country', 'an island nation', 'a Maghreb monarchy'],
      correct: 0,
    },
    {
      prompt: 'The White Nile flows through…',
      choices: ['South Sudan', 'Morocco', 'Namibia'],
      correct: 0,
    },
  ],
  SEN: [
    {
      prompt: 'Dakar sits on the…',
      choices: ['westernmost bulge of Africa', 'Horn of Africa', 'Cape of Good Hope'],
      correct: 0,
    },
    {
      prompt: 'Senegal is famed for…',
      choices: ['teranga hospitality and music', 'alpine skiing', 'samurai tradition'],
      correct: 0,
    },
    {
      prompt: 'Gorée Island is a historic slave-trade site off…',
      choices: ['Senegal', 'Kenya', 'Egypt'],
      correct: 0,
    },
  ],
  SLB: [
    {
      prompt: 'The Solomon Islands were a major WWII…',
      choices: ['Pacific battleground (Guadalcanal)', 'Arctic front', 'Saharan front'],
      correct: 0,
    },
    {
      prompt: 'The Solomons are an archipelago in the…',
      choices: ['South Pacific', 'Caribbean', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Honiara sits on which island?',
      choices: ['Guadalcanal', 'Viti Levu', 'Honshu'],
      correct: 0,
    },
  ],
  SLE: [
    {
      prompt: 'Sierra Leone\'s name means…',
      choices: ['Lion Mountains', 'White Coast', 'Gold River'],
      correct: 0,
    },
    {
      prompt: 'Blood diamonds scarred the history of…',
      choices: ['Sierra Leone', 'Botswana only', 'Canada'],
      correct: 0,
    },
    {
      prompt: 'Sierra Leone\'s coast faces the…',
      choices: ['Atlantic', 'Indian Ocean', 'Red Sea'],
      correct: 0,
    },
  ],
  SLV: [
    {
      prompt: 'El Salvador is…',
      choices: ['Central America\'s smallest country', 'South America\'s largest', 'a Caribbean island chain'],
      correct: 0,
    },
    {
      prompt: 'Pupusas are a national dish of…',
      choices: ['El Salvador', 'Mexico only', 'Peru'],
      correct: 0,
    },
    {
      prompt: 'El Salvador\'s coast faces the…',
      choices: ['Pacific', 'Caribbean only', 'Atlantic north'],
      correct: 0,
    },
  ],
  SOL: [
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
    {
      prompt: 'Hargeisa is the main city of…',
      choices: ['Somaliland', 'Djibouti', 'Eritrea'],
      correct: 0,
    },
  ],
  SOM: [
    {
      prompt: 'Somalia sits on the…',
      choices: ['Horn of Africa', 'Cape of Good Hope', 'Maghreb'],
      correct: 0,
    },
    {
      prompt: 'Somalia has one of Africa\'s longest…',
      choices: ['Indian Ocean coastlines', 'ski seasons', 'canal networks'],
      correct: 0,
    },
    {
      prompt: 'Somali is a Cushitic language of the…',
      choices: ['Horn of Africa', 'Balkans', 'Andes'],
      correct: 0,
    },
  ],
  SRB: [
    {
      prompt: 'Belgrade sits at the meeting of the…',
      choices: ['Sava and Danube', 'Rhine and Moselle', 'Seine and Marne'],
      correct: 0,
    },
    {
      prompt: 'Serbia is…',
      choices: ['landlocked in the Balkans', 'an Adriatic island', 'in Scandinavia'],
      correct: 0,
    },
    {
      prompt: 'Rakija fruit brandy is a social staple in…',
      choices: ['Serbia (and neighbors)', 'Japan', 'Chile'],
      correct: 0,
    },
  ],
  SUR: [
    {
      prompt: 'Suriname\'s official language is…',
      choices: ['Dutch', 'English', 'Spanish'],
      correct: 0,
    },
    {
      prompt: 'Suriname was formerly…',
      choices: ['Dutch Guiana', 'British Honduras', 'Spanish Sahara'],
      correct: 0,
    },
    {
      prompt: 'Suriname sits on South America\'s…',
      choices: ['northeast coast', 'Pacific coast', 'southern cone'],
      correct: 0,
    },
  ],
  SVK: [
    {
      prompt: 'Slovakia separated from Czechia in the…',
      choices: ['Velvet Divorce (1993)', '1970s', '2010s'],
      correct: 0,
    },
    {
      prompt: 'The High Tatras are mountains in…',
      choices: ['Slovakia (and Poland)', 'Netherlands', 'Denmark'],
      correct: 0,
    },
    {
      prompt: 'Bratislava sits on the…',
      choices: ['Danube', 'Rhine', 'Vistula'],
      correct: 0,
    },
  ],
  SVN: [
    {
      prompt: 'Slovenia has a short coast on the…',
      choices: ['Adriatic', 'Baltic', 'Black Sea'],
      correct: 0,
    },
    {
      prompt: 'Lake Bled is a postcard spot in…',
      choices: ['Slovenia', 'Hungary', 'Poland'],
      correct: 0,
    },
    {
      prompt: 'Slovenia sits at the crossroads of…',
      choices: ['the Alps, Balkans, and Mediterranean', 'the Sahara and Sahel', 'Scandinavia and the Arctic'],
      correct: 0,
    },
  ],
  SWE: [
    {
      prompt: 'IKEA originated in…',
      choices: ['Sweden', 'Denmark', 'Germany'],
      correct: 0,
    },
    {
      prompt: 'Sweden is part of…',
      choices: ['Scandinavia', 'the Balkans', 'the Maghreb'],
      correct: 0,
    },
    {
      prompt: 'ABBA and Spotify both come from…',
      choices: ['Sweden', 'Norway', 'Finland'],
      correct: 0,
    },
  ],
  SWZ: [
    {
      prompt: 'Eswatini was formerly called…',
      choices: ['Swaziland', 'Basutoland', 'Bechuanaland'],
      correct: 0,
    },
    {
      prompt: 'Eswatini is nearly surrounded by…',
      choices: ['South Africa', 'Namibia', 'Mozambique only'],
      correct: 0,
    },
    {
      prompt: 'Eswatini is one of Africa\'s last…',
      choices: ['absolute monarchies (in traditional form)', 'communist states', 'island empires'],
      correct: 0,
    },
  ],
  SYR: [
    {
      prompt: 'Aleppo was a historic Silk Road trade city in…',
      choices: ['Syria', 'Iraq only', 'Turkey only'],
      correct: 0,
    },
    {
      prompt: 'Syria\'s coast is on the…',
      choices: ['Mediterranean', 'Red Sea', 'Persian Gulf'],
      correct: 0,
    },
    {
      prompt: 'Damascus claims to be among the world\'s…',
      choices: ['oldest continuously inhabited cities', 'newest capitals', 'highest ski towns'],
      correct: 0,
    },
  ],
  TCD: [
    {
      prompt: 'Lake Chad gives the country…',
      choices: ['its name', 'its only mountain', 'its navy'],
      correct: 0,
    },
    {
      prompt: 'Chad is mostly…',
      choices: ['Sahara and Sahel', 'rainforest coast', 'alpine'],
      correct: 0,
    },
    {
      prompt: 'Chad is…',
      choices: ['landlocked in north-central Africa', 'an Indian Ocean island', 'a Maghreb peninsula'],
      correct: 0,
    },
  ],
  TGO: [
    {
      prompt: 'Togo is a narrow country on the…',
      choices: ['Gulf of Guinea', 'Red Sea', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Togo was once a…',
      choices: ['German then French colony', 'British raj province', 'Dutch cape'],
      correct: 0,
    },
    {
      prompt: 'Phosphate mining shaped the economy of…',
      choices: ['Togo', 'Switzerland', 'Nepal'],
      correct: 0,
    },
  ],
  TJK: [
    {
      prompt: 'Tajikistan is the most mountainous of the…',
      choices: ['Central Asian stans', 'Baltic states', 'Gulf states'],
      correct: 0,
    },
    {
      prompt: 'Pamir mountains dominate…',
      choices: ['Tajikistan', 'Kuwait', 'Belgium'],
      correct: 0,
    },
    {
      prompt: 'Tajik is closely related to…',
      choices: ['Persian / Farsi', 'Turkish only', 'Russian only'],
      correct: 0,
    },
  ],
  TKM: [
    {
      prompt: 'The Karakum Desert covers much of…',
      choices: ['Turkmenistan', 'Georgia', 'Azerbaijan'],
      correct: 0,
    },
    {
      prompt: 'Turkmenistan borders the…',
      choices: ['Caspian Sea', 'Black Sea', 'Baltic'],
      correct: 0,
    },
    {
      prompt: 'The Door to Hell gas crater burns in…',
      choices: ['Turkmenistan', 'Uzbekistan', 'Kazakhstan'],
      correct: 0,
    },
  ],
  TLS: [
    {
      prompt: 'Timor-Leste occupies the east of…',
      choices: ['Timor island', 'Java', 'Sumatra'],
      correct: 0,
    },
    {
      prompt: 'Timor-Leste gained independence in…',
      choices: ['2002', '1975', '1991'],
      correct: 0,
    },
    {
      prompt: 'Portuguese and Tetum are official in…',
      choices: ['Timor-Leste', 'Indonesia', 'Malaysia'],
      correct: 0,
    },
  ],
  TTO: [
    {
      prompt: 'Trinidad and Tobago is known for…',
      choices: ['Carnival and calypso / soca', 'fjords', 'tea ceremony'],
      correct: 0,
    },
    {
      prompt: 'Trinidad lies just off…',
      choices: ['Venezuela', 'Florida', 'West Africa'],
      correct: 0,
    },
    {
      prompt: 'Pitch Lake, a natural asphalt lake, is in…',
      choices: ['Trinidad', 'Jamaica', 'Cuba'],
      correct: 0,
    },
  ],
  TUN: [
    {
      prompt: 'Ancient Carthage was near…',
      choices: ['Tunis', 'Cairo', 'Rome'],
      correct: 0,
    },
    {
      prompt: 'Tunisia\'s coast is on the…',
      choices: ['Mediterranean', 'Red Sea', 'Atlantic'],
      correct: 0,
    },
    {
      prompt: 'Tunisia sparked the…',
      choices: ['Arab Spring wave (2010-11)', 'Velvet Revolution', 'Meiji Restoration'],
      correct: 0,
    },
  ],
  TWN: [
    {
      prompt: 'Taiwan is an island off…',
      choices: ['southeast China', 'Japan\'s north', 'India'],
      correct: 0,
    },
    {
      prompt: 'Night markets are a food culture staple in…',
      choices: ['Taiwan', 'Mongolia', 'Iceland'],
      correct: 0,
    },
    {
      prompt: 'Taiwan is a global leader in…',
      choices: ['semiconductor manufacturing', 'oil drilling only', 'diamond mining'],
      correct: 0,
    },
  ],
  TZA: [
    {
      prompt: 'Mount Kilimanjaro is in…',
      choices: ['Tanzania', 'Kenya', 'Ethiopia'],
      correct: 0,
    },
    {
      prompt: 'Zanzibar is part of…',
      choices: ['Tanzania', 'Kenya', 'Mozambique'],
      correct: 0,
    },
    {
      prompt: 'The Serengeti migration crosses…',
      choices: ['Tanzania (and Kenya)', 'South Africa only', 'Egypt'],
      correct: 0,
    },
  ],
  UGA: [
    {
      prompt: 'Uganda is often called the…',
      choices: ['Pearl of Africa', 'Land of Fire', 'Emerald Isle'],
      correct: 0,
    },
    {
      prompt: 'Lake Victoria borders…',
      choices: ['Uganda (among others)', 'Egypt', 'Morocco'],
      correct: 0,
    },
    {
      prompt: 'Mountain gorillas also live in…',
      choices: ['Uganda\'s southwest', 'the Sahara', 'the Namib'],
      correct: 0,
    },
  ],
  UKR: [
    {
      prompt: 'Ukraine\'s rich farmland earned it the nickname…',
      choices: ['breadbasket of Europe', 'rust belt of Asia', 'oil gulf'],
      correct: 0,
    },
    {
      prompt: 'Odesa is a major port on the…',
      choices: ['Black Sea', 'Baltic', 'Adriatic'],
      correct: 0,
    },
    {
      prompt: 'Chernobyl lies in…',
      choices: ['northern Ukraine', 'western Poland', 'southern Romania'],
      correct: 0,
    },
  ],
  URY: [
    {
      prompt: 'Uruguay sits between…',
      choices: ['Argentina and Brazil', 'Chile and Peru', 'Colombia and Venezuela'],
      correct: 0,
    },
    {
      prompt: 'Uruguay\'s coast faces the…',
      choices: ['Atlantic / Río de la Plata', 'Pacific', 'Caribbean only'],
      correct: 0,
    },
    {
      prompt: 'Mate tea culture is huge in…',
      choices: ['Uruguay (and neighbors)', 'Japan', 'Egypt'],
      correct: 0,
    },
  ],
  UZB: [
    {
      prompt: 'Samarkand was a Silk Road jewel in…',
      choices: ['Uzbekistan', 'Iran only', 'Turkey only'],
      correct: 0,
    },
    {
      prompt: 'Uzbekistan is…',
      choices: ['one of two double-landlocked countries', 'an island', 'a peninsula'],
      correct: 0,
    },
    {
      prompt: 'Registan Square\'s madrasas stand in…',
      choices: ['Samarkand', 'Baku', 'Tbilisi'],
      correct: 0,
    },
  ],
  VEN: [
    {
      prompt: 'Angel Falls, the world\'s tallest waterfall, is in…',
      choices: ['Venezuela', 'Brazil', 'Peru'],
      correct: 0,
    },
    {
      prompt: 'Venezuela\'s oil belt is around…',
      choices: ['Lake Maracaibo', 'Lake Titicaca', 'Lake Victoria'],
      correct: 0,
    },
    {
      prompt: 'Arepa corn cakes are a staple of…',
      choices: ['Venezuela (and Colombia)', 'Chile', 'Argentina only'],
      correct: 0,
    },
  ],
  VUT: [
    {
      prompt: 'Vanuatu is an archipelago in the…',
      choices: ['South Pacific', 'Caribbean', 'Indian Ocean'],
      correct: 0,
    },
    {
      prompt: 'Vanuatu sits on the…',
      choices: ['Pacific Ring of Fire', 'Mid-Atlantic Ridge only', 'Sahara plate'],
      correct: 0,
    },
    {
      prompt: 'Bungee\'s ritual ancestor, land diving, comes from…',
      choices: ['Vanuatu', 'New Zealand', 'Fiji only'],
      correct: 0,
    },
  ],
  YEM: [
    {
      prompt: 'Yemen sits at the southern end of the…',
      choices: ['Arabian Peninsula', 'Sinai', 'Anatolia'],
      correct: 0,
    },
    {
      prompt: 'Socotra\'s alien-looking flora is part of…',
      choices: ['Yemen', 'Somalia', 'Eritrea'],
      correct: 0,
    },
    {
      prompt: 'Mocha coffee takes its name from a port in…',
      choices: ['Yemen', 'Ethiopia only', 'Italy'],
      correct: 0,
    },
  ],
  ZMB: [
    {
      prompt: 'Victoria Falls is shared by Zambia and…',
      choices: ['Zimbabwe', 'Botswana only', 'Angola only'],
      correct: 0,
    },
    {
      prompt: 'Zambia is…',
      choices: ['landlocked in southern Africa', 'a coastal West African state', 'an island'],
      correct: 0,
    },
    {
      prompt: 'Copper mining built the economy of the…',
      choices: ['Zambian Copperbelt', 'Namib coast only', 'Sahara'],
      correct: 0,
    },
  ],
  ZWE: [
    {
      prompt: 'Victoria Falls is shared by Zimbabwe and…',
      choices: ['Zambia', 'South Africa', 'Mozambique'],
      correct: 0,
    },
    {
      prompt: 'Great Zimbabwe is a medieval stone city in…',
      choices: ['Zimbabwe', 'Kenya', 'Ghana'],
      correct: 0,
    },
    {
      prompt: 'Zimbabwe was formerly called…',
      choices: ['Rhodesia', 'Bechuanaland', 'South West Africa'],
      correct: 0,
    },
  ],
}
