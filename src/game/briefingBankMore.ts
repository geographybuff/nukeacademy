/** Specific intel questions for non-flagship playable countries. */

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
      prompt: 'Kabul is the capital of…',
      choices: ['Afghanistan', 'Pakistan', 'Uzbekistan'],
      correct: 0,
    },
    {
      prompt: 'Afghanistan shares a long border with…',
      choices: ['Pakistan', 'Turkey', 'Egypt'],
      correct: 0,
    },
  ],
  AGO: [
    {
      prompt: 'Luanda is the capital of…',
      choices: ['Angola', 'Namibia', 'Zambia'],
      correct: 0,
    },
    {
      prompt: 'Angola’s coast faces the…',
      choices: ['Atlantic Ocean', 'Indian Ocean', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Which desert reaches into southern Angola?',
      choices: ['Namib', 'Gobi', 'Atacama'],
      correct: 0,
    },
  ],
  ALB: [
    {
      prompt: 'Tirana is the capital of…',
      choices: ['Albania', 'Kosovo', 'Montenegro'],
      correct: 0,
    },
    {
      prompt: 'Albania sits on which sea?',
      choices: ['Adriatic', 'Baltic', 'Caspian'],
      correct: 0,
    },
    {
      prompt: 'Albania is across the Adriatic from…',
      choices: ['Italy', 'Spain', 'Portugal'],
      correct: 0,
    },
  ],
  ARE: [
    {
      prompt: 'Abu Dhabi is the capital of…',
      choices: ['the UAE', 'Qatar', 'Bahrain'],
      correct: 0,
    },
    {
      prompt: 'Dubai is famous for…',
      choices: ['Burj Khalifa', 'Petronas Towers', 'Eiffel Tower'],
      correct: 0,
    },
    {
      prompt: 'The UAE sits on the…',
      choices: ['Persian Gulf', 'Red Sea', 'Black Sea'],
      correct: 0,
    },
  ],
  ARM: [
    {
      prompt: 'Yerevan is the capital of…',
      choices: ['Armenia', 'Georgia', 'Azerbaijan'],
      correct: 0,
    },
    {
      prompt: 'Mount Ararat is iconic in…',
      choices: ['Armenian tradition', 'Finnish myth', 'Inuit lore'],
      correct: 0,
    },
    {
      prompt: 'Armenia was an early adopter of…',
      choices: ['Christianity', 'Buddhism', 'Shinto'],
      correct: 0,
    },
  ],
  AUT: [
    {
      prompt: 'Vienna is the capital of…',
      choices: ['Austria', 'Hungary', 'Czechia'],
      correct: 0,
    },
    {
      prompt: 'Much of Austria lies in the…',
      choices: ['Alps', 'Pyrenees', 'Carpathians'],
      correct: 0,
    },
    {
      prompt: 'Mozart was born in…',
      choices: ['Salzburg', 'Vienna', 'Innsbruck'],
      correct: 0,
    },
  ],
  AZE: [
    {
      prompt: 'Baku is the capital of…',
      choices: ['Azerbaijan', 'Armenia', 'Turkmenistan'],
      correct: 0,
    },
    {
      prompt: 'Baku sits on which body of water?',
      choices: ['Caspian Sea', 'Black Sea', 'Aral Sea'],
      correct: 0,
    },
    {
      prompt: 'Azerbaijan’s modern wealth is tied to…',
      choices: ['oil and gas', 'coffee', 'timber'],
      correct: 0,
    },
  ],
  BDI: [
    {
      prompt: 'Gitega is the political capital of…',
      choices: ['Burundi', 'Rwanda', 'Uganda'],
      correct: 0,
    },
    {
      prompt: 'Burundi lies along…',
      choices: ['Lake Tanganyika', 'Lake Victoria', 'Lake Chad'],
      correct: 0,
    },
    {
      prompt: 'Burundi is a small country in…',
      choices: ['East Africa', 'West Africa', 'Southern Cone'],
      correct: 0,
    },
  ],
  BEL: [
    {
      prompt: 'Brussels is the capital of…',
      choices: ['Belgium', 'Netherlands', 'Luxembourg'],
      correct: 0,
    },
    {
      prompt: 'Belgium is famous for…',
      choices: ['chocolate and waffles', 'pizza', 'sushi'],
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
      prompt: 'Porto-Novo is the capital of…',
      choices: ['Benin', 'Togo', 'Ghana'],
      correct: 0,
    },
    {
      prompt: 'Benin sits on the…',
      choices: ['Gulf of Guinea', 'Red Sea', 'Persian Gulf'],
      correct: 0,
    },
    {
      prompt: 'The former kingdom of Dahomey was in today’s…',
      choices: ['Benin', 'Mali', 'Chad'],
      correct: 0,
    },
  ],
  BFA: [
    {
      prompt: 'Ouagadougou is the capital of…',
      choices: ['Burkina Faso', 'Mali', 'Niger'],
      correct: 0,
    },
    {
      prompt: 'Burkina Faso is a…',
      choices: ['landlocked Sahel country', 'island nation', 'Andean state'],
      correct: 0,
    },
    {
      prompt: 'Burkina Faso’s name roughly means…',
      choices: ['land of upright people', 'land of lakes', 'great forest'],
      correct: 0,
    },
  ],
  BGD: [
    {
      prompt: 'Dhaka is the capital of…',
      choices: ['Bangladesh', 'Nepal', 'Myanmar'],
      correct: 0,
    },
    {
      prompt: 'Bangladesh sits mostly on the…',
      choices: ['Ganges–Brahmaputra delta', 'Nile delta', 'Amazon basin'],
      correct: 0,
    },
    {
      prompt: 'Bangladesh’s main language is…',
      choices: ['Bengali', 'Urdu', 'Thai'],
      correct: 0,
    },
  ],
  BGR: [
    {
      prompt: 'Sofia is the capital of…',
      choices: ['Bulgaria', 'Romania', 'Serbia'],
      correct: 0,
    },
    {
      prompt: 'Bulgaria’s coast is on the…',
      choices: ['Black Sea', 'Adriatic', 'Baltic'],
      correct: 0,
    },
    {
      prompt: 'Rose oil is a classic export of…',
      choices: ['Bulgaria', 'Iceland', 'Mongolia'],
      correct: 0,
    },
  ],
  BHS: [
    {
      prompt: 'Nassau is the capital of…',
      choices: ['the Bahamas', 'Jamaica', 'Barbados'],
      correct: 0,
    },
    {
      prompt: 'The Bahamas are an island chain in the…',
      choices: ['Atlantic / Caribbean', 'Pacific', 'Indian Ocean'],
      correct: 0,
    },
    {
      prompt: 'The Bahamas lie near…',
      choices: ['Florida', 'Brazil', 'West Africa'],
      correct: 0,
    },
  ],
  BIH: [
    {
      prompt: 'Sarajevo is the capital of…',
      choices: ['Bosnia and Herzegovina', 'Croatia', 'Serbia'],
      correct: 0,
    },
    {
      prompt: 'Sarajevo hosted the Winter Olympics in…',
      choices: ['1984', '1964', '2002'],
      correct: 0,
    },
    {
      prompt: 'Bosnia and Herzegovina is in the…',
      choices: ['Balkans', 'Caucasus', 'Maghreb'],
      correct: 0,
    },
  ],
  BLR: [
    {
      prompt: 'Minsk is the capital of…',
      choices: ['Belarus', 'Ukraine', 'Lithuania'],
      correct: 0,
    },
    {
      prompt: 'Belarus is…',
      choices: ['landlocked in Eastern Europe', 'an island state', 'in Central America'],
      correct: 0,
    },
    {
      prompt: 'Belarus borders…',
      choices: ['Poland and Russia', 'Spain and France', 'China and India'],
      correct: 0,
    },
  ],
  BLZ: [
    {
      prompt: 'Belmopan is the capital of…',
      choices: ['Belize', 'Guatemala', 'Honduras'],
      correct: 0,
    },
    {
      prompt: 'Belize’s barrier reef is in the…',
      choices: ['Caribbean', 'Pacific', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'English is an official language of…',
      choices: ['Belize', 'Mexico', 'El Salvador'],
      correct: 0,
    },
  ],
  BOL: [
    {
      prompt: 'La Paz is a seat of government in…',
      choices: ['Bolivia', 'Peru', 'Chile'],
      correct: 0,
    },
    {
      prompt: 'Bolivia’s famous salt flat is…',
      choices: ['Salar de Uyuni', 'Atacama', 'Death Valley'],
      correct: 0,
    },
    {
      prompt: 'Lake Titicaca is shared by Bolivia and…',
      choices: ['Peru', 'Brazil', 'Argentina'],
      correct: 0,
    },
  ],
  BRN: [
    {
      prompt: 'Bandar Seri Begawan is the capital of…',
      choices: ['Brunei', 'Malaysia', 'Singapore'],
      correct: 0,
    },
    {
      prompt: 'Brunei sits on the island of…',
      choices: ['Borneo', 'Java', 'Sumatra'],
      correct: 0,
    },
    {
      prompt: 'Brunei is known for…',
      choices: ['oil wealth', 'coffee plantations', 'copper mines'],
      correct: 0,
    },
  ],
  BTN: [
    {
      prompt: 'Thimphu is the capital of…',
      choices: ['Bhutan', 'Nepal', 'Tibet'],
      correct: 0,
    },
    {
      prompt: 'Bhutan measures progress with…',
      choices: ['Gross National Happiness', 'GDP only', 'tourist visas'],
      correct: 0,
    },
    {
      prompt: 'Bhutan lies in the…',
      choices: ['Himalayas', 'Alps', 'Andes'],
      correct: 0,
    },
  ],
  BWA: [
    {
      prompt: 'Gaborone is the capital of…',
      choices: ['Botswana', 'Namibia', 'Zimbabwe'],
      correct: 0,
    },
    {
      prompt: 'The Okavango Delta is in…',
      choices: ['Botswana', 'Kenya', 'Egypt'],
      correct: 0,
    },
    {
      prompt: 'Botswana is famed for…',
      choices: ['diamond mining and safaris', 'fjords', 'tea estates'],
      correct: 0,
    },
  ],
  CAF: [
    {
      prompt: 'Bangui is the capital of…',
      choices: ['Central African Republic', 'Cameroon', 'Chad'],
      correct: 0,
    },
    {
      prompt: 'The Central African Republic is…',
      choices: ['landlocked', 'an island', 'peninsular'],
      correct: 0,
    },
    {
      prompt: 'Bangui sits on the…',
      choices: ['Ubangi River', 'Nile', 'Congo estuary only'],
      correct: 0,
    },
  ],
  CHE: [
    {
      prompt: 'Bern is the capital of…',
      choices: ['Switzerland', 'Austria', 'Liechtenstein'],
      correct: 0,
    },
    {
      prompt: 'Switzerland is famous for…',
      choices: ['Alps, banks, and chocolate', 'rainforests', 'deserts'],
      correct: 0,
    },
    {
      prompt: 'Swiss neutrality is a long-standing…',
      choices: ['foreign policy', 'language law', 'currency peg only'],
      correct: 0,
    },
  ],
  CHL: [
    {
      prompt: 'Santiago is the capital of…',
      choices: ['Chile', 'Peru', 'Argentina'],
      correct: 0,
    },
    {
      prompt: 'Chile’s long coast faces the…',
      choices: ['Pacific', 'Atlantic', 'Indian Ocean'],
      correct: 0,
    },
    {
      prompt: 'Easter Island is a territory of…',
      choices: ['Chile', 'France', 'New Zealand'],
      correct: 0,
    },
  ],
  CIV: [
    {
      prompt: 'Yamoussoukro is the official capital of…',
      choices: ['Côte d’Ivoire', 'Ghana', 'Liberia'],
      correct: 0,
    },
    {
      prompt: 'Abidjan is the economic hub of…',
      choices: ['Côte d’Ivoire', 'Senegal', 'Guinea'],
      correct: 0,
    },
    {
      prompt: 'Côte d’Ivoire is a top exporter of…',
      choices: ['cocoa', 'rice', 'wheat'],
      correct: 0,
    },
  ],
  CMR: [
    {
      prompt: 'Yaoundé is the capital of…',
      choices: ['Cameroon', 'Gabon', 'Congo'],
      correct: 0,
    },
    {
      prompt: 'Mount Cameroon is an active…',
      choices: ['volcano', 'glacier', 'coral atoll'],
      correct: 0,
    },
    {
      prompt: 'Cameroon sits on the…',
      choices: ['Gulf of Guinea', 'Red Sea', 'Persian Gulf'],
      correct: 0,
    },
  ],
  COD: [
    {
      prompt: 'Kinshasa is the capital of…',
      choices: ['DR Congo', 'Congo-Brazzaville', 'Gabon'],
      correct: 0,
    },
    {
      prompt: 'The Congo River is central to…',
      choices: ['DR Congo', 'Egypt', 'Morocco'],
      correct: 0,
    },
    {
      prompt: 'DR Congo is one of Africa’s…',
      choices: ['largest countries by area', 'smallest islands', 'arctic states'],
      correct: 0,
    },
  ],
  COG: [
    {
      prompt: 'Brazzaville is the capital of…',
      choices: ['Republic of the Congo', 'DR Congo', 'Gabon'],
      correct: 0,
    },
    {
      prompt: 'Brazzaville faces Kinshasa across the…',
      choices: ['Congo River', 'Nile', 'Zambezi'],
      correct: 0,
    },
    {
      prompt: 'The Republic of the Congo is often called…',
      choices: ['Congo-Brazzaville', 'Congo-Kinshasa', 'Equatorial Sudan'],
      correct: 0,
    },
  ],
  COL: [
    {
      prompt: 'Bogotá is the capital of…',
      choices: ['Colombia', 'Venezuela', 'Ecuador'],
      correct: 0,
    },
    {
      prompt: 'Colombia’s coffee region is world-famous for…',
      choices: ['arabica beans', 'tea', 'olive oil'],
      correct: 0,
    },
    {
      prompt: 'Cartagena is a Caribbean port in…',
      choices: ['Colombia', 'Mexico', 'Cuba'],
      correct: 0,
    },
  ],
  CRI: [
    {
      prompt: 'San José is the capital of…',
      choices: ['Costa Rica', 'Panama', 'Nicaragua'],
      correct: 0,
    },
    {
      prompt: 'Costa Rica is known for…',
      choices: ['eco-tourism and biodiversity', 'oil deserts', 'tundra'],
      correct: 0,
    },
    {
      prompt: 'Costa Rica has coasts on…',
      choices: ['both Pacific and Caribbean', 'only the Atlantic', 'only the Mediterranean'],
      correct: 0,
    },
  ],
  CUB: [
    {
      prompt: 'Havana is the capital of…',
      choices: ['Cuba', 'Dominican Republic', 'Haiti'],
      correct: 0,
    },
    {
      prompt: 'Cuba is the largest island in the…',
      choices: ['Caribbean', 'Mediterranean', 'Baltic'],
      correct: 0,
    },
    {
      prompt: 'Cuban music helped spread…',
      choices: ['salsa and son', 'opera', 'gamelan'],
      correct: 0,
    },
  ],
  CYP: [
    {
      prompt: 'Nicosia is the capital of…',
      choices: ['Cyprus', 'Malta', 'Crete'],
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
  CZE: [
    {
      prompt: 'Prague is the capital of…',
      choices: ['Czechia', 'Slovakia', 'Poland'],
      correct: 0,
    },
    {
      prompt: 'Bohemia is a historic region of…',
      choices: ['Czechia', 'Hungary', 'Romania'],
      correct: 0,
    },
    {
      prompt: 'Czechia is famous for…',
      choices: ['beer and castles', 'fjords', 'pyramids'],
      correct: 0,
    },
  ],
  DJI: [
    {
      prompt: 'Djibouti City is the capital of…',
      choices: ['Djibouti', 'Eritrea', 'Somalia'],
      correct: 0,
    },
    {
      prompt: 'Djibouti sits at the mouth of the…',
      choices: ['Red Sea / Bab el-Mandeb', 'Persian Gulf', 'Gulf of Mexico'],
      correct: 0,
    },
    {
      prompt: 'Djibouti is strategically important for…',
      choices: ['shipping lanes', 'ski resorts', 'wine'],
      correct: 0,
    },
  ],
  DNK: [
    {
      prompt: 'Copenhagen is the capital of…',
      choices: ['Denmark', 'Norway', 'Sweden'],
      correct: 0,
    },
    {
      prompt: 'Denmark includes which large northern island?',
      choices: ['Greenland', 'Iceland', 'Sardinia'],
      correct: 0,
    },
    {
      prompt: 'The Little Mermaid statue is in…',
      choices: ['Copenhagen', 'Oslo', 'Stockholm'],
      correct: 0,
    },
  ],
  DOM: [
    {
      prompt: 'Santo Domingo is the capital of…',
      choices: ['Dominican Republic', 'Haiti', 'Cuba'],
      correct: 0,
    },
    {
      prompt: 'The Dominican Republic shares Hispaniola with…',
      choices: ['Haiti', 'Jamaica', 'Puerto Rico'],
      correct: 0,
    },
    {
      prompt: 'Merengue is strongly associated with…',
      choices: ['the Dominican Republic', 'Mexico', 'Brazil'],
      correct: 0,
    },
  ],
  DZA: [
    {
      prompt: 'Algiers is the capital of…',
      choices: ['Algeria', 'Tunisia', 'Morocco'],
      correct: 0,
    },
    {
      prompt: 'Much of Algeria is covered by the…',
      choices: ['Sahara', 'Amazon', 'Gobi'],
      correct: 0,
    },
    {
      prompt: 'Algeria’s Mediterranean coast was once…',
      choices: ['French colonial territory', 'a Japanese prefecture', 'a Dutch colony only'],
      correct: 0,
    },
  ],
  ECU: [
    {
      prompt: 'Quito is the capital of…',
      choices: ['Ecuador', 'Peru', 'Colombia'],
      correct: 0,
    },
    {
      prompt: 'The Galápagos Islands belong to…',
      choices: ['Ecuador', 'Chile', 'Panama'],
      correct: 0,
    },
    {
      prompt: 'Ecuador is named for the…',
      choices: ['equator', 'Andes only', 'Amazon only'],
      correct: 0,
    },
  ],
  ERI: [
    {
      prompt: 'Asmara is the capital of…',
      choices: ['Eritrea', 'Ethiopia', 'Djibouti'],
      correct: 0,
    },
    {
      prompt: 'Eritrea’s coast is on the…',
      choices: ['Red Sea', 'Mediterranean', 'Atlantic'],
      correct: 0,
    },
    {
      prompt: 'Eritrea gained independence from Ethiopia in the…',
      choices: ['1990s', '1960s', '2010s'],
      correct: 0,
    },
  ],
  EST: [
    {
      prompt: 'Tallinn is the capital of…',
      choices: ['Estonia', 'Latvia', 'Finland'],
      correct: 0,
    },
    {
      prompt: 'Estonia is one of the…',
      choices: ['Baltic states', 'Balkan states', 'Gulf states'],
      correct: 0,
    },
    {
      prompt: 'Estonia is known for…',
      choices: ['digital government', 'desert tourism', 'coffee origins'],
      correct: 0,
    },
  ],
  ETH: [
    {
      prompt: 'Addis Ababa is the capital of…',
      choices: ['Ethiopia', 'Kenya', 'Sudan'],
      correct: 0,
    },
    {
      prompt: 'Ethiopia’s highlands are famed for…',
      choices: ['coffee origins', 'oil palms', 'maple syrup'],
      correct: 0,
    },
    {
      prompt: 'Lucy the fossil was found in…',
      choices: ['Ethiopia', 'Egypt', 'South Africa'],
      correct: 0,
    },
  ],
  FIN: [
    {
      prompt: 'Helsinki is the capital of…',
      choices: ['Finland', 'Sweden', 'Norway'],
      correct: 0,
    },
    {
      prompt: 'Finland is famous for…',
      choices: ['saunas and lakes', 'deserts', 'rainforests'],
      correct: 0,
    },
    {
      prompt: 'Finnish and Hungarian are…',
      choices: ['related language families (Uralic)', 'Romance languages', 'Semitic languages'],
      correct: 0,
    },
  ],
  FJI: [
    {
      prompt: 'Suva is the capital of…',
      choices: ['Fiji', 'Samoa', 'Tonga'],
      correct: 0,
    },
    {
      prompt: 'Fiji is an island nation in the…',
      choices: ['South Pacific', 'Caribbean', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Fiji’s main islands include…',
      choices: ['Viti Levu', 'Honshu', 'Java'],
      correct: 0,
    },
  ],
  GAB: [
    {
      prompt: 'Libreville is the capital of…',
      choices: ['Gabon', 'Cameroon', 'Congo'],
      correct: 0,
    },
    {
      prompt: 'Gabon sits on the…',
      choices: ['Atlantic / Gulf of Guinea', 'Indian Ocean', 'Red Sea'],
      correct: 0,
    },
    {
      prompt: 'Much of Gabon is covered by…',
      choices: ['rainforest', 'tundra', 'desert dunes'],
      correct: 0,
    },
  ],
  GEO: [
    {
      prompt: 'Tbilisi is the capital of…',
      choices: ['Georgia', 'Armenia', 'Azerbaijan'],
      correct: 0,
    },
    {
      prompt: 'Georgia lies in the…',
      choices: ['Caucasus', 'Balkans', 'Maghreb'],
      correct: 0,
    },
    {
      prompt: 'Khinkali and khachapuri are foods of…',
      choices: ['Georgia', 'Greece', 'Germany'],
      correct: 0,
    },
  ],
  GHA: [
    {
      prompt: 'Accra is the capital of…',
      choices: ['Ghana', 'Nigeria', 'Togo'],
      correct: 0,
    },
    {
      prompt: 'Ghana was formerly called the…',
      choices: ['Gold Coast', 'Ivory Coast', 'Slave Coast only'],
      correct: 0,
    },
    {
      prompt: 'Lake Volta is a major reservoir in…',
      choices: ['Ghana', 'Kenya', 'Morocco'],
      correct: 0,
    },
  ],
  GIN: [
    {
      prompt: 'Conakry is the capital of…',
      choices: ['Guinea', 'Guinea-Bissau', 'Equatorial Guinea'],
      correct: 0,
    },
    {
      prompt: 'Guinea’s coast faces the…',
      choices: ['Atlantic', 'Indian Ocean', 'Pacific'],
      correct: 0,
    },
    {
      prompt: 'Bauxite is a key export of…',
      choices: ['Guinea', 'Switzerland', 'Iceland'],
      correct: 0,
    },
  ],
  GMB: [
    {
      prompt: 'Banjul is the capital of…',
      choices: ['the Gambia', 'Senegal', 'Guinea'],
      correct: 0,
    },
    {
      prompt: 'The Gambia is a narrow country along the…',
      choices: ['Gambia River', 'Nile', 'Congo'],
      correct: 0,
    },
    {
      prompt: 'The Gambia is nearly surrounded by…',
      choices: ['Senegal', 'Mali', 'Ghana'],
      correct: 0,
    },
  ],
  GNB: [
    {
      prompt: 'Bissau is the capital of…',
      choices: ['Guinea-Bissau', 'Guinea', 'Senegal'],
      correct: 0,
    },
    {
      prompt: 'Guinea-Bissau includes the…',
      choices: ['Bijagós Islands', 'Canary Islands', 'Azores'],
      correct: 0,
    },
    {
      prompt: 'Portuguese is an official language of…',
      choices: ['Guinea-Bissau', 'Ghana', 'Liberia'],
      correct: 0,
    },
  ],
  GNQ: [
    {
      prompt: 'Malabo is a capital of…',
      choices: ['Equatorial Guinea', 'Gabon', 'Cameroon'],
      correct: 0,
    },
    {
      prompt: 'Equatorial Guinea includes mainland Río Muni and…',
      choices: ['Bioko Island', 'Zanzibar', 'Madagascar'],
      correct: 0,
    },
    {
      prompt: 'Spanish is an official language of…',
      choices: ['Equatorial Guinea', 'Angola', 'Mozambique'],
      correct: 0,
    },
  ],
  GRC: [
    {
      prompt: 'Athens is the capital of…',
      choices: ['Greece', 'Cyprus', 'Turkey'],
      correct: 0,
    },
    {
      prompt: 'The Acropolis overlooks…',
      choices: ['Athens', 'Rome', 'Cairo'],
      correct: 0,
    },
    {
      prompt: 'Greece has thousands of…',
      choices: ['islands in the Aegean and beyond', 'deserts', 'fjords'],
      correct: 0,
    },
  ],
  GRL: [
    {
      prompt: 'Nuuk is the capital of…',
      choices: ['Greenland', 'Iceland', 'Norway'],
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
  GTM: [
    {
      prompt: 'Guatemala City is the capital of…',
      choices: ['Guatemala', 'Honduras', 'El Salvador'],
      correct: 0,
    },
    {
      prompt: 'Tikal is an ancient Maya city in…',
      choices: ['Guatemala', 'Mexico only', 'Belize only'],
      correct: 0,
    },
    {
      prompt: 'Guatemala’s highlands include…',
      choices: ['volcanic peaks', 'fjords', 'coral deserts'],
      correct: 0,
    },
  ],
  GUY: [
    {
      prompt: 'Georgetown is the capital of…',
      choices: ['Guyana', 'Suriname', 'Trinidad'],
      correct: 0,
    },
    {
      prompt: 'Guyana’s official language is…',
      choices: ['English', 'Dutch', 'Spanish'],
      correct: 0,
    },
    {
      prompt: 'Guyana lies on South America’s…',
      choices: ['Atlantic coast', 'Pacific coast', 'Mediterranean coast'],
      correct: 0,
    },
  ],
  HND: [
    {
      prompt: 'Tegucigalpa is the capital of…',
      choices: ['Honduras', 'Nicaragua', 'Guatemala'],
      correct: 0,
    },
    {
      prompt: 'The Bay Islands of Honduras are in the…',
      choices: ['Caribbean', 'Pacific', 'Gulf of Mexico only'],
      correct: 0,
    },
    {
      prompt: 'Honduras was part of Spanish…',
      choices: ['Central America', 'Patagonia', 'Iberia'],
      correct: 0,
    },
  ],
  HRV: [
    {
      prompt: 'Zagreb is the capital of…',
      choices: ['Croatia', 'Slovenia', 'Serbia'],
      correct: 0,
    },
    {
      prompt: 'Croatia’s Dalmatian coast faces the…',
      choices: ['Adriatic', 'Baltic', 'Black Sea'],
      correct: 0,
    },
    {
      prompt: 'Dubrovnik is a walled city in…',
      choices: ['Croatia', 'Italy', 'Greece'],
      correct: 0,
    },
  ],
  HTI: [
    {
      prompt: 'Port-au-Prince is the capital of…',
      choices: ['Haiti', 'Dominican Republic', 'Cuba'],
      correct: 0,
    },
    {
      prompt: 'Haiti shares Hispaniola with…',
      choices: ['the Dominican Republic', 'Jamaica', 'Bahamas'],
      correct: 0,
    },
    {
      prompt: 'Haiti was the first Black republic after a…',
      choices: ['slave revolution', 'gold rush', 'tea tax'],
      correct: 0,
    },
  ],
  HUN: [
    {
      prompt: 'Budapest is the capital of…',
      choices: ['Hungary', 'Austria', 'Romania'],
      correct: 0,
    },
    {
      prompt: 'Budapest straddles the…',
      choices: ['Danube', 'Rhine', 'Seine'],
      correct: 0,
    },
    {
      prompt: 'Hungarian cuisine often features…',
      choices: ['paprika', 'wasabi', 'maple syrup'],
      correct: 0,
    },
  ],
  IRL: [
    {
      prompt: 'Dublin is the capital of…',
      choices: ['Ireland', 'Northern Ireland', 'Scotland'],
      correct: 0,
    },
    {
      prompt: 'Ireland is nicknamed the…',
      choices: ['Emerald Isle', 'Pearl of the Orient', 'Land of Fire'],
      correct: 0,
    },
    {
      prompt: 'The Cliffs of Moher are in…',
      choices: ['Ireland', 'Wales', 'Cornwall'],
      correct: 0,
    },
  ],
  IRQ: [
    {
      prompt: 'Baghdad is the capital of…',
      choices: ['Iraq', 'Syria', 'Jordan'],
      correct: 0,
    },
    {
      prompt: 'Iraq lies largely in…',
      choices: ['Mesopotamia', 'Patagonia', 'Scandinavia'],
      correct: 0,
    },
    {
      prompt: 'The Tigris and Euphrates flow through…',
      choices: ['Iraq', 'Egypt', 'India'],
      correct: 0,
    },
  ],
  ISL: [
    {
      prompt: 'Reykjavík is the capital of…',
      choices: ['Iceland', 'Norway', 'Greenland'],
      correct: 0,
    },
    {
      prompt: 'Iceland sits on the…',
      choices: ['Mid-Atlantic Ridge', 'San Andreas Fault', 'Great Rift only'],
      correct: 0,
    },
    {
      prompt: 'Iceland is famous for…',
      choices: ['geysers and volcanic landscapes', 'rainforests', 'sand dunes'],
      correct: 0,
    },
  ],
  ISR: [
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
  JAM: [
    {
      prompt: 'Kingston is the capital of…',
      choices: ['Jamaica', 'Trinidad', 'Barbados'],
      correct: 0,
    },
    {
      prompt: 'Reggae music originated in…',
      choices: ['Jamaica', 'Cuba', 'Brazil'],
      correct: 0,
    },
    {
      prompt: 'Jamaica is an island in the…',
      choices: ['Caribbean', 'Pacific', 'Mediterranean'],
      correct: 0,
    },
  ],
  JOR: [
    {
      prompt: 'Amman is the capital of…',
      choices: ['Jordan', 'Syria', 'Lebanon'],
      correct: 0,
    },
    {
      prompt: 'Petra’s rock-cut city is in…',
      choices: ['Jordan', 'Egypt', 'Saudi Arabia'],
      correct: 0,
    },
    {
      prompt: 'Jordan’s only coastline is on the…',
      choices: ['Red Sea (Gulf of Aqaba)', 'Mediterranean', 'Persian Gulf'],
      correct: 0,
    },
  ],
  KAZ: [
    {
      prompt: 'Astana (Nur-Sultan) is the capital of…',
      choices: ['Kazakhstan', 'Uzbekistan', 'Kyrgyzstan'],
      correct: 0,
    },
    {
      prompt: 'Kazakhstan is the world’s largest…',
      choices: ['landlocked country', 'island nation', 'city-state'],
      correct: 0,
    },
    {
      prompt: 'Much of Kazakhstan is…',
      choices: ['steppe', 'jungle', 'tundra ice only'],
      correct: 0,
    },
  ],
  KEN: [
    {
      prompt: 'Nairobi is the capital of…',
      choices: ['Kenya', 'Uganda', 'Tanzania'],
      correct: 0,
    },
    {
      prompt: 'Mount Kenya is in…',
      choices: ['Kenya', 'Ethiopia', 'Rwanda'],
      correct: 0,
    },
    {
      prompt: 'The Maasai Mara is a famed reserve in…',
      choices: ['Kenya', 'Egypt', 'Morocco'],
      correct: 0,
    },
  ],
  KGZ: [
    {
      prompt: 'Bishkek is the capital of…',
      choices: ['Kyrgyzstan', 'Tajikistan', 'Kazakhstan'],
      correct: 0,
    },
    {
      prompt: 'Kyrgyzstan is dominated by the…',
      choices: ['Tian Shan mountains', 'Alps', 'Andes'],
      correct: 0,
    },
    {
      prompt: 'Issyk-Kul is a great lake in…',
      choices: ['Kyrgyzstan', 'Mongolia', 'Iran'],
      correct: 0,
    },
  ],
  KHM: [
    {
      prompt: 'Phnom Penh is the capital of…',
      choices: ['Cambodia', 'Laos', 'Vietnam'],
      correct: 0,
    },
    {
      prompt: 'Angkor Wat is in…',
      choices: ['Cambodia', 'Thailand', 'Myanmar'],
      correct: 0,
    },
    {
      prompt: 'Cambodia’s great lake is…',
      choices: ['Tonlé Sap', 'Lake Victoria', 'Lake Baikal'],
      correct: 0,
    },
  ],
  KOS: [
    {
      prompt: 'Pristina is the capital of…',
      choices: ['Kosovo', 'Albania', 'Serbia'],
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
  KWT: [
    {
      prompt: 'Kuwait City is the capital of…',
      choices: ['Kuwait', 'Bahrain', 'Qatar'],
      correct: 0,
    },
    {
      prompt: 'Kuwait sits at the head of the…',
      choices: ['Persian Gulf', 'Red Sea', 'Black Sea'],
      correct: 0,
    },
    {
      prompt: 'Kuwait’s modern wealth comes mainly from…',
      choices: ['oil', 'tourism beaches only', 'timber'],
      correct: 0,
    },
  ],
  LAO: [
    {
      prompt: 'Vientiane is the capital of…',
      choices: ['Laos', 'Cambodia', 'Thailand'],
      correct: 0,
    },
    {
      prompt: 'Laos is…',
      choices: ['landlocked in Southeast Asia', 'an island chain', 'in Europe'],
      correct: 0,
    },
    {
      prompt: 'The Mekong River runs along…',
      choices: ['Laos', 'Japan', 'Chile'],
      correct: 0,
    },
  ],
  LBN: [
    {
      prompt: 'Beirut is the capital of…',
      choices: ['Lebanon', 'Syria', 'Jordan'],
      correct: 0,
    },
    {
      prompt: 'Lebanon’s coast faces the…',
      choices: ['Mediterranean', 'Red Sea', 'Persian Gulf'],
      correct: 0,
    },
    {
      prompt: 'Cedar trees are a national symbol of…',
      choices: ['Lebanon', 'Egypt', 'Yemen'],
      correct: 0,
    },
  ],
  LBR: [
    {
      prompt: 'Monrovia is the capital of…',
      choices: ['Liberia', 'Sierra Leone', 'Ghana'],
      correct: 0,
    },
    {
      prompt: 'Liberia was founded with ties to…',
      choices: ['freed American slaves', 'French colonists only', 'Dutch traders only'],
      correct: 0,
    },
    {
      prompt: 'Liberia’s coast faces the…',
      choices: ['Atlantic', 'Indian Ocean', 'Pacific'],
      correct: 0,
    },
  ],
  LBY: [
    {
      prompt: 'Tripoli is the capital of…',
      choices: ['Libya', 'Tunisia', 'Algeria'],
      correct: 0,
    },
    {
      prompt: 'Most of Libya is…',
      choices: ['Sahara desert', 'rainforest', 'tundra'],
      correct: 0,
    },
    {
      prompt: 'Libya’s coast is on the…',
      choices: ['Mediterranean', 'Red Sea', 'Atlantic'],
      correct: 0,
    },
  ],
  LKA: [
    {
      prompt: 'Sri Jayawardenepura Kotte / Colombo serve…',
      choices: ['Sri Lanka', 'Maldives', 'India'],
      correct: 0,
    },
    {
      prompt: 'Sri Lanka is an island south of…',
      choices: ['India', 'Australia', 'China'],
      correct: 0,
    },
    {
      prompt: 'Ceylon was the former name of…',
      choices: ['Sri Lanka', 'Myanmar', 'Thailand'],
      correct: 0,
    },
  ],
  LSO: [
    {
      prompt: 'Maseru is the capital of…',
      choices: ['Lesotho', 'Eswatini', 'Botswana'],
      correct: 0,
    },
    {
      prompt: 'Lesotho is entirely surrounded by…',
      choices: ['South Africa', 'Namibia', 'Zimbabwe'],
      correct: 0,
    },
    {
      prompt: 'Lesotho is known as the…',
      choices: ['Kingdom in the Sky', 'Pearl of Africa only', 'Land of Lakes'],
      correct: 0,
    },
  ],
  LTU: [
    {
      prompt: 'Vilnius is the capital of…',
      choices: ['Lithuania', 'Latvia', 'Estonia'],
      correct: 0,
    },
    {
      prompt: 'Lithuania is one of the…',
      choices: ['Baltic states', 'Nordic oil states', 'Gulf emirates'],
      correct: 0,
    },
    {
      prompt: 'Lithuania’s coast is on the…',
      choices: ['Baltic Sea', 'Black Sea', 'Adriatic'],
      correct: 0,
    },
  ],
  LUX: [
    {
      prompt: 'Luxembourg City is the capital of…',
      choices: ['Luxembourg', 'Belgium', 'Liechtenstein'],
      correct: 0,
    },
    {
      prompt: 'Luxembourg is a…',
      choices: ['small wealthy European country', 'Pacific island', 'African desert state'],
      correct: 0,
    },
    {
      prompt: 'Luxembourg is a founding member of…',
      choices: ['the EU project', 'ASEAN', 'Mercosur'],
      correct: 0,
    },
  ],
  LVA: [
    {
      prompt: 'Riga is the capital of…',
      choices: ['Latvia', 'Estonia', 'Lithuania'],
      correct: 0,
    },
    {
      prompt: 'Latvia is one of the…',
      choices: ['Baltic states', 'Balkan states', 'Andean states'],
      correct: 0,
    },
    {
      prompt: 'Art Nouveau architecture is famed in…',
      choices: ['Riga', 'Madrid', 'Cairo'],
      correct: 0,
    },
  ],
  MAR: [
    {
      prompt: 'Rabat is the capital of…',
      choices: ['Morocco', 'Algeria', 'Tunisia'],
      correct: 0,
    },
    {
      prompt: 'Marrakech is a famed city in…',
      choices: ['Morocco', 'Egypt', 'Spain'],
      correct: 0,
    },
    {
      prompt: 'The Atlas Mountains run through…',
      choices: ['Morocco', 'Kenya', 'Vietnam'],
      correct: 0,
    },
  ],
  MDA: [
    {
      prompt: 'Chișinău is the capital of…',
      choices: ['Moldova', 'Romania', 'Ukraine'],
      correct: 0,
    },
    {
      prompt: 'Moldova is…',
      choices: ['landlocked in Eastern Europe', 'a Caribbean island', 'in Southeast Asia'],
      correct: 0,
    },
    {
      prompt: 'Moldova is known for…',
      choices: ['wine', 'oil sands', 'teak forests'],
      correct: 0,
    },
  ],
  MDG: [
    {
      prompt: 'Antananarivo is the capital of…',
      choices: ['Madagascar', 'Mauritius', 'Comoros'],
      correct: 0,
    },
    {
      prompt: 'Madagascar is famed for…',
      choices: ['lemurs and unique wildlife', 'penguins only', 'polar bears'],
      correct: 0,
    },
    {
      prompt: 'Madagascar is a large island off…',
      choices: ['East Africa', 'West Africa', 'South America'],
      correct: 0,
    },
  ],
  MKD: [
    {
      prompt: 'Skopje is the capital of…',
      choices: ['North Macedonia', 'Albania', 'Bulgaria'],
      correct: 0,
    },
    {
      prompt: 'North Macedonia is…',
      choices: ['landlocked in the Balkans', 'an island', 'in Scandinavia'],
      correct: 0,
    },
    {
      prompt: 'Lake Ohrid is shared by North Macedonia and…',
      choices: ['Albania', 'Greece only', 'Serbia only'],
      correct: 0,
    },
  ],
  MLI: [
    {
      prompt: 'Bamako is the capital of…',
      choices: ['Mali', 'Niger', 'Burkina Faso'],
      correct: 0,
    },
    {
      prompt: 'Timbuktu is a historic city in…',
      choices: ['Mali', 'Egypt', 'Sudan'],
      correct: 0,
    },
    {
      prompt: 'Mali was home to a great medieval…',
      choices: ['West African empire', 'Inca empire', 'Roman province only'],
      correct: 0,
    },
  ],
  MMR: [
    {
      prompt: 'Naypyidaw is the capital of…',
      choices: ['Myanmar', 'Thailand', 'Laos'],
      correct: 0,
    },
    {
      prompt: 'Yangon (Rangoon) was the former capital of…',
      choices: ['Myanmar', 'Vietnam', 'Malaysia'],
      correct: 0,
    },
    {
      prompt: 'Myanmar’s coast includes the…',
      choices: ['Bay of Bengal / Andaman Sea', 'Mediterranean', 'Baltic'],
      correct: 0,
    },
  ],
  MNE: [
    {
      prompt: 'Podgorica is the capital of…',
      choices: ['Montenegro', 'Serbia', 'Bosnia'],
      correct: 0,
    },
    {
      prompt: 'Montenegro’s Adriatic coast includes…',
      choices: ['Kotor Bay', 'Bay of Naples', 'Hudson Bay'],
      correct: 0,
    },
    {
      prompt: 'Montenegro means…',
      choices: ['Black Mountain', 'White River', 'Green Valley'],
      correct: 0,
    },
  ],
  MNG: [
    {
      prompt: 'Ulaanbaatar is the capital of…',
      choices: ['Mongolia', 'China', 'Kazakhstan'],
      correct: 0,
    },
    {
      prompt: 'Mongolia is known for…',
      choices: ['steppe and nomadic heritage', 'tropical reefs', 'rainforests'],
      correct: 0,
    },
    {
      prompt: 'Genghis Khan’s empire rose from…',
      choices: ['Mongolia', 'Persia', 'Rome'],
      correct: 0,
    },
  ],
  MOZ: [
    {
      prompt: 'Maputo is the capital of…',
      choices: ['Mozambique', 'Angola', 'Tanzania'],
      correct: 0,
    },
    {
      prompt: 'Mozambique’s long coast faces the…',
      choices: ['Indian Ocean', 'Atlantic', 'Pacific'],
      correct: 0,
    },
    {
      prompt: 'Portuguese is official in…',
      choices: ['Mozambique', 'Kenya', 'Ethiopia'],
      correct: 0,
    },
  ],
  MRT: [
    {
      prompt: 'Nouakchott is the capital of…',
      choices: ['Mauritania', 'Mali', 'Senegal'],
      correct: 0,
    },
    {
      prompt: 'Much of Mauritania is…',
      choices: ['Sahara desert', 'rainforest', 'tundra'],
      correct: 0,
    },
    {
      prompt: 'Mauritania’s coast is on the…',
      choices: ['Atlantic', 'Red Sea', 'Persian Gulf'],
      correct: 0,
    },
  ],
  MWI: [
    {
      prompt: 'Lilongwe is the capital of…',
      choices: ['Malawi', 'Zambia', 'Mozambique'],
      correct: 0,
    },
    {
      prompt: 'Lake Malawi dominates…',
      choices: ['Malawi', 'Kenya', 'Botswana'],
      correct: 0,
    },
    {
      prompt: 'Malawi is a…',
      choices: ['landlocked East African country', 'West African island', 'Gulf state'],
      correct: 0,
    },
  ],
  MYS: [
    {
      prompt: 'Kuala Lumpur is the capital of…',
      choices: ['Malaysia', 'Indonesia', 'Singapore'],
      correct: 0,
    },
    {
      prompt: 'The Petronas Towers are in…',
      choices: ['Kuala Lumpur', 'Jakarta', 'Bangkok'],
      correct: 0,
    },
    {
      prompt: 'Malaysia includes peninsular land and part of…',
      choices: ['Borneo', 'New Guinea', 'Honshu'],
      correct: 0,
    },
  ],
  NAM: [
    {
      prompt: 'Windhoek is the capital of…',
      choices: ['Namibia', 'Botswana', 'South Africa'],
      correct: 0,
    },
    {
      prompt: 'The Namib Desert runs along…',
      choices: ['Namibia’s Atlantic coast', 'Kenya’s lakes', 'Egypt’s Nile'],
      correct: 0,
    },
    {
      prompt: 'Namibia’s Skeleton Coast is known for…',
      choices: ['shipwrecks and dunes', 'coral cities', 'tea hills'],
      correct: 0,
    },
  ],
  NER: [
    {
      prompt: 'Niamey is the capital of…',
      choices: ['Niger', 'Nigeria', 'Chad'],
      correct: 0,
    },
    {
      prompt: 'Niger is largely…',
      choices: ['Sahara / Sahel', 'Amazon rainforest', 'Alpine'],
      correct: 0,
    },
    {
      prompt: 'Niger is…',
      choices: ['landlocked', 'an island', 'a peninsula'],
      correct: 0,
    },
  ],
  NIC: [
    {
      prompt: 'Managua is the capital of…',
      choices: ['Nicaragua', 'Honduras', 'Costa Rica'],
      correct: 0,
    },
    {
      prompt: 'Nicaragua has coasts on…',
      choices: ['Pacific and Caribbean', 'only the Atlantic', 'only the Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Lake Nicaragua is one of Central America’s…',
      choices: ['largest lakes', 'highest peaks', 'only deserts'],
      correct: 0,
    },
  ],
  NLD: [
    {
      prompt: 'Amsterdam is the capital of…',
      choices: ['the Netherlands', 'Belgium', 'Germany'],
      correct: 0,
    },
    {
      prompt: 'The Netherlands is famous for…',
      choices: ['canals, bikes, and tulips', 'deserts', 'fjords'],
      correct: 0,
    },
    {
      prompt: 'Much of the Netherlands is…',
      choices: ['below or near sea level', 'high plateau', 'volcanic ridge'],
      correct: 0,
    },
  ],
  NOR: [
    {
      prompt: 'Oslo is the capital of…',
      choices: ['Norway', 'Sweden', 'Denmark'],
      correct: 0,
    },
    {
      prompt: 'Norway is famous for…',
      choices: ['fjords', 'rainforests', 'savannas'],
      correct: 0,
    },
    {
      prompt: 'Norway’s oil wealth comes from the…',
      choices: ['North Sea', 'Caspian', 'Gulf of Mexico'],
      correct: 0,
    },
  ],
  NPL: [
    {
      prompt: 'Kathmandu is the capital of…',
      choices: ['Nepal', 'Bhutan', 'Tibet'],
      correct: 0,
    },
    {
      prompt: 'Mount Everest sits on the border of Nepal and…',
      choices: ['China (Tibet)', 'India only', 'Pakistan'],
      correct: 0,
    },
    {
      prompt: 'Nepal is…',
      choices: ['landlocked in the Himalayas', 'a Pacific island', 'in West Africa'],
      correct: 0,
    },
  ],
  NZL: [
    {
      prompt: 'Wellington is the capital of…',
      choices: ['New Zealand', 'Australia', 'Fiji'],
      correct: 0,
    },
    {
      prompt: 'New Zealand’s islands are mainly…',
      choices: ['North and South Island', 'Java and Bali', 'Honshu and Hokkaido'],
      correct: 0,
    },
    {
      prompt: 'The Māori are indigenous to…',
      choices: ['New Zealand', 'Hawaii only', 'Tasmania only'],
      correct: 0,
    },
  ],
  OMN: [
    {
      prompt: 'Muscat is the capital of…',
      choices: ['Oman', 'Yemen', 'UAE'],
      correct: 0,
    },
    {
      prompt: 'Oman sits on the…',
      choices: ['Arabian Sea / Gulf of Oman', 'Black Sea', 'Baltic'],
      correct: 0,
    },
    {
      prompt: 'Oman’s landscape includes…',
      choices: ['desert and rugged mountains', 'tundra', 'rainforest canopy'],
      correct: 0,
    },
  ],
  PAK: [
    {
      prompt: 'Islamabad is the capital of…',
      choices: ['Pakistan', 'India', 'Afghanistan'],
      correct: 0,
    },
    {
      prompt: 'Pakistan’s longest border is with…',
      choices: ['India', 'Iran only', 'China only'],
      correct: 0,
    },
    {
      prompt: 'The Indus River is central to…',
      choices: ['Pakistan', 'Thailand', 'Nigeria'],
      correct: 0,
    },
  ],
  PAN: [
    {
      prompt: 'Panama City is the capital of…',
      choices: ['Panama', 'Costa Rica', 'Colombia'],
      correct: 0,
    },
    {
      prompt: 'The Panama Canal links the…',
      choices: ['Atlantic and Pacific', 'Red Sea and Mediterranean only', 'Black Sea and Caspian'],
      correct: 0,
    },
    {
      prompt: 'Panama is a…',
      choices: ['narrow isthmus country', 'landlocked plateau', 'arctic island'],
      correct: 0,
    },
  ],
  PER: [
    {
      prompt: 'Lima is the capital of…',
      choices: ['Peru', 'Bolivia', 'Chile'],
      correct: 0,
    },
    {
      prompt: 'Machu Picchu is in…',
      choices: ['Peru', 'Mexico', 'Guatemala'],
      correct: 0,
    },
    {
      prompt: 'The Inca Empire’s heartland was in…',
      choices: ['Peru', 'Brazil', 'Argentina'],
      correct: 0,
    },
  ],
  PHL: [
    {
      prompt: 'Manila is the capital region of…',
      choices: ['the Philippines', 'Indonesia', 'Malaysia'],
      correct: 0,
    },
    {
      prompt: 'The Philippines is an…',
      choices: ['archipelago', 'landlocked state', 'desert plateau'],
      correct: 0,
    },
    {
      prompt: 'Tagalog / Filipino is widely spoken in…',
      choices: ['the Philippines', 'Thailand', 'Vietnam'],
      correct: 0,
    },
  ],
  PNG: [
    {
      prompt: 'Port Moresby is the capital of…',
      choices: ['Papua New Guinea', 'Fiji', 'Solomon Islands'],
      correct: 0,
    },
    {
      prompt: 'Papua New Guinea shares New Guinea with…',
      choices: ['Indonesia', 'Australia', 'Philippines'],
      correct: 0,
    },
    {
      prompt: 'Papua New Guinea is known for…',
      choices: ['extreme linguistic diversity', 'fjords only', 'sahara dunes'],
      correct: 0,
    },
  ],
  PRK: [
    {
      prompt: 'Pyongyang is the capital of…',
      choices: ['North Korea', 'South Korea', 'China'],
      correct: 0,
    },
    {
      prompt: 'North Korea’s peninsula neighbor to the south is…',
      choices: ['South Korea', 'Japan', 'Taiwan'],
      correct: 0,
    },
    {
      prompt: 'The DMZ separates…',
      choices: ['North and South Korea', 'China and Mongolia', 'Russia and Ukraine'],
      correct: 0,
    },
  ],
  PRT: [
    {
      prompt: 'Lisbon is the capital of…',
      choices: ['Portugal', 'Spain', 'Morocco'],
      correct: 0,
    },
    {
      prompt: 'Portugal shares the Iberian Peninsula with…',
      choices: ['Spain', 'France', 'Italy'],
      correct: 0,
    },
    {
      prompt: 'Port wine is associated with…',
      choices: ['Portugal', 'Germany', 'Greece'],
      correct: 0,
    },
  ],
  PRY: [
    {
      prompt: 'Asunción is the capital of…',
      choices: ['Paraguay', 'Uruguay', 'Bolivia'],
      correct: 0,
    },
    {
      prompt: 'Paraguay is…',
      choices: ['landlocked in South America', 'an Andean coast state', 'a Caribbean island'],
      correct: 0,
    },
    {
      prompt: 'Guaraní is widely spoken in…',
      choices: ['Paraguay', 'Chile', 'Peru'],
      correct: 0,
    },
  ],
  QAT: [
    {
      prompt: 'Doha is the capital of…',
      choices: ['Qatar', 'Bahrain', 'Kuwait'],
      correct: 0,
    },
    {
      prompt: 'Qatar is a peninsula on the…',
      choices: ['Persian Gulf', 'Red Sea', 'Black Sea'],
      correct: 0,
    },
    {
      prompt: 'Qatar hosted the FIFA World Cup in…',
      choices: ['2022', '2010', '2018'],
      correct: 0,
    },
  ],
  ROU: [
    {
      prompt: 'Bucharest is the capital of…',
      choices: ['Romania', 'Bulgaria', 'Hungary'],
      correct: 0,
    },
    {
      prompt: 'Transylvania is a region of…',
      choices: ['Romania', 'Ukraine', 'Serbia'],
      correct: 0,
    },
    {
      prompt: 'Romania’s coast is on the…',
      choices: ['Black Sea', 'Adriatic', 'Baltic'],
      correct: 0,
    },
  ],
  RWA: [
    {
      prompt: 'Kigali is the capital of…',
      choices: ['Rwanda', 'Burundi', 'Uganda'],
      correct: 0,
    },
    {
      prompt: 'Rwanda is called the…',
      choices: ['Land of a Thousand Hills', 'Land of Lakes only', 'Coast of Ivory'],
      correct: 0,
    },
    {
      prompt: 'Mountain gorillas are a draw in…',
      choices: ['Rwanda', 'Egypt', 'Namibia'],
      correct: 0,
    },
  ],
  SAU: [
    {
      prompt: 'Riyadh is the capital of…',
      choices: ['Saudi Arabia', 'UAE', 'Yemen'],
      correct: 0,
    },
    {
      prompt: 'Mecca and Medina are holy cities in…',
      choices: ['Saudi Arabia', 'Jordan', 'Egypt'],
      correct: 0,
    },
    {
      prompt: 'Saudi Arabia’s wealth is tied to…',
      choices: ['oil', 'coffee only', 'timber'],
      correct: 0,
    },
  ],
  SDN: [
    {
      prompt: 'Khartoum is the capital of…',
      choices: ['Sudan', 'South Sudan', 'Chad'],
      correct: 0,
    },
    {
      prompt: 'The Blue and White Nile meet at…',
      choices: ['Khartoum', 'Cairo', 'Alexandria'],
      correct: 0,
    },
    {
      prompt: 'Sudan was once Africa’s…',
      choices: ['largest country before South Sudan’s split', 'only island', 'smallest state'],
      correct: 0,
    },
  ],
  SDS: [
    {
      prompt: 'Juba is the capital of…',
      choices: ['South Sudan', 'Sudan', 'Uganda'],
      correct: 0,
    },
    {
      prompt: 'South Sudan gained independence in…',
      choices: ['2011', '1991', '2001'],
      correct: 0,
    },
    {
      prompt: 'South Sudan is…',
      choices: ['landlocked', 'an island', 'a gulf peninsula'],
      correct: 0,
    },
  ],
  SEN: [
    {
      prompt: 'Dakar is the capital of…',
      choices: ['Senegal', 'Gambia', 'Mali'],
      correct: 0,
    },
    {
      prompt: 'Dakar sits on the…',
      choices: ['Atlantic bulge of West Africa', 'Red Sea', 'Persian Gulf'],
      correct: 0,
    },
    {
      prompt: 'Gorée Island near Dakar is tied to…',
      choices: ['the Atlantic slave trade memory', 'silk roads', 'polar exploration'],
      correct: 0,
    },
  ],
  SLB: [
    {
      prompt: 'Honiara is the capital of…',
      choices: ['Solomon Islands', 'Fiji', 'Vanuatu'],
      correct: 0,
    },
    {
      prompt: 'The Solomon Islands are in the…',
      choices: ['South Pacific', 'Caribbean', 'Mediterranean'],
      correct: 0,
    },
    {
      prompt: 'Guadalcanal is an island of the…',
      choices: ['Solomon Islands', 'Philippines', 'Indonesia'],
      correct: 0,
    },
  ],
  SLE: [
    {
      prompt: 'Freetown is the capital of…',
      choices: ['Sierra Leone', 'Liberia', 'Guinea'],
      correct: 0,
    },
    {
      prompt: 'Sierra Leone’s coast faces the…',
      choices: ['Atlantic', 'Indian Ocean', 'Pacific'],
      correct: 0,
    },
    {
      prompt: 'Sierra Leone is known historically for…',
      choices: ['diamonds and a traumatic civil war', 'fjords', 'tea ceremony'],
      correct: 0,
    },
  ],
  SLV: [
    {
      prompt: 'San Salvador is the capital of…',
      choices: ['El Salvador', 'Honduras', 'Guatemala'],
      correct: 0,
    },
    {
      prompt: 'El Salvador is the smallest country in…',
      choices: ['Central America', 'South America', 'Europe'],
      correct: 0,
    },
    {
      prompt: 'El Salvador’s coast is on the…',
      choices: ['Pacific', 'Atlantic only', 'Caribbean only'],
      correct: 0,
    },
  ],
  SOL: [
    {
      prompt: 'Hargeisa is the capital of…',
      choices: ['Somaliland', 'Somalia (Mogadishu)', 'Djibouti'],
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
  SOM: [
    {
      prompt: 'Mogadishu is the capital of…',
      choices: ['Somalia', 'Ethiopia', 'Kenya'],
      correct: 0,
    },
    {
      prompt: 'Somalia has Africa’s longest…',
      choices: ['Indian Ocean coastline (among the longest)', 'ski season', 'canal'],
      correct: 0,
    },
    {
      prompt: 'Somalia sits on the…',
      choices: ['Horn of Africa', 'Cape of Good Hope', 'Maghreb'],
      correct: 0,
    },
  ],
  SRB: [
    {
      prompt: 'Belgrade is the capital of…',
      choices: ['Serbia', 'Croatia', 'Bosnia'],
      correct: 0,
    },
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
  ],
  SUR: [
    {
      prompt: 'Paramaribo is the capital of…',
      choices: ['Suriname', 'Guyana', 'French Guiana'],
      correct: 0,
    },
    {
      prompt: 'Suriname’s official language is…',
      choices: ['Dutch', 'English', 'Spanish'],
      correct: 0,
    },
    {
      prompt: 'Suriname was formerly…',
      choices: ['Dutch Guiana', 'British Honduras', 'Spanish Sahara'],
      correct: 0,
    },
  ],
  SVK: [
    {
      prompt: 'Bratislava is the capital of…',
      choices: ['Slovakia', 'Slovenia', 'Czechia'],
      correct: 0,
    },
    {
      prompt: 'Slovakia separated from Czechia in the…',
      choices: ['Velvet Divorce (1993)', '1970s', '2010s'],
      correct: 0,
    },
    {
      prompt: 'The High Tatras are mountains in…',
      choices: ['Slovakia', 'Netherlands', 'Denmark'],
      correct: 0,
    },
  ],
  SVN: [
    {
      prompt: 'Ljubljana is the capital of…',
      choices: ['Slovenia', 'Slovakia', 'Croatia'],
      correct: 0,
    },
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
  ],
  SWE: [
    {
      prompt: 'Stockholm is the capital of…',
      choices: ['Sweden', 'Norway', 'Finland'],
      correct: 0,
    },
    {
      prompt: 'Sweden is part of…',
      choices: ['Scandinavia', 'the Balkans', 'the Maghreb'],
      correct: 0,
    },
    {
      prompt: 'IKEA originated in…',
      choices: ['Sweden', 'Denmark', 'Germany'],
      correct: 0,
    },
  ],
  SWZ: [
    {
      prompt: 'Mbabane / Lobamba serve…',
      choices: ['Eswatini', 'Lesotho', 'Botswana'],
      correct: 0,
    },
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
  ],
  SYR: [
    {
      prompt: 'Damascus is the capital of…',
      choices: ['Syria', 'Lebanon', 'Jordan'],
      correct: 0,
    },
    {
      prompt: 'Aleppo was a historic trade city in…',
      choices: ['Syria', 'Iraq only', 'Turkey only'],
      correct: 0,
    },
    {
      prompt: 'Syria’s coast is on the…',
      choices: ['Mediterranean', 'Red Sea', 'Persian Gulf'],
      correct: 0,
    },
  ],
  TCD: [
    {
      prompt: 'N’Djamena is the capital of…',
      choices: ['Chad', 'Niger', 'Sudan'],
      correct: 0,
    },
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
  ],
  TGO: [
    {
      prompt: 'Lomé is the capital of…',
      choices: ['Togo', 'Benin', 'Ghana'],
      correct: 0,
    },
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
  ],
  TJK: [
    {
      prompt: 'Dushanbe is the capital of…',
      choices: ['Tajikistan', 'Uzbekistan', 'Kyrgyzstan'],
      correct: 0,
    },
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
  ],
  TKM: [
    {
      prompt: 'Ashgabat is the capital of…',
      choices: ['Turkmenistan', 'Uzbekistan', 'Kazakhstan'],
      correct: 0,
    },
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
  ],
  TLS: [
    {
      prompt: 'Dili is the capital of…',
      choices: ['Timor-Leste', 'Indonesia', 'Papua New Guinea'],
      correct: 0,
    },
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
  ],
  TTO: [
    {
      prompt: 'Port of Spain is the capital of…',
      choices: ['Trinidad and Tobago', 'Jamaica', 'Barbados'],
      correct: 0,
    },
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
  ],
  TUN: [
    {
      prompt: 'Tunis is the capital of…',
      choices: ['Tunisia', 'Algeria', 'Libya'],
      correct: 0,
    },
    {
      prompt: 'Ancient Carthage was near…',
      choices: ['Tunis', 'Cairo', 'Rome'],
      correct: 0,
    },
    {
      prompt: 'Tunisia’s coast is on the…',
      choices: ['Mediterranean', 'Red Sea', 'Atlantic'],
      correct: 0,
    },
  ],
  TWN: [
    {
      prompt: 'Taipei is the capital of…',
      choices: ['Taiwan', 'China', 'Philippines'],
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
  TZA: [
    {
      prompt: 'Dodoma is the official capital of…',
      choices: ['Tanzania', 'Kenya', 'Uganda'],
      correct: 0,
    },
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
  ],
  UGA: [
    {
      prompt: 'Kampala is the capital of…',
      choices: ['Uganda', 'Kenya', 'Rwanda'],
      correct: 0,
    },
    {
      prompt: 'Uganda is often called the…',
      choices: ['Pearl of Africa', 'Land of Fire', 'Emerald Isle'],
      correct: 0,
    },
    {
      prompt: 'Lake Victoria borders…',
      choices: ['Uganda', 'Egypt', 'Morocco'],
      correct: 0,
    },
  ],
  UKR: [
    {
      prompt: 'Kyiv is the capital of…',
      choices: ['Ukraine', 'Belarus', 'Poland'],
      correct: 0,
    },
    {
      prompt: 'Ukraine’s rich farmland is called the…',
      choices: ['breadbasket', 'rust belt only', 'sun belt'],
      correct: 0,
    },
    {
      prompt: 'Odesa is a major port on the…',
      choices: ['Black Sea', 'Baltic', 'Adriatic'],
      correct: 0,
    },
  ],
  URY: [
    {
      prompt: 'Montevideo is the capital of…',
      choices: ['Uruguay', 'Paraguay', 'Argentina'],
      correct: 0,
    },
    {
      prompt: 'Uruguay sits between…',
      choices: ['Argentina and Brazil', 'Chile and Peru', 'Colombia and Venezuela'],
      correct: 0,
    },
    {
      prompt: 'Uruguay’s coast faces the…',
      choices: ['Atlantic / Río de la Plata', 'Pacific', 'Caribbean only'],
      correct: 0,
    },
  ],
  UZB: [
    {
      prompt: 'Tashkent is the capital of…',
      choices: ['Uzbekistan', 'Kazakhstan', 'Turkmenistan'],
      correct: 0,
    },
    {
      prompt: 'Samarkand was a Silk Road jewel in…',
      choices: ['Uzbekistan', 'Iran', 'Turkey'],
      correct: 0,
    },
    {
      prompt: 'Uzbekistan is…',
      choices: ['one of two double-landlocked countries', 'an island', 'a peninsula'],
      correct: 0,
    },
  ],
  VEN: [
    {
      prompt: 'Caracas is the capital of…',
      choices: ['Venezuela', 'Colombia', 'Guyana'],
      correct: 0,
    },
    {
      prompt: 'Angel Falls is in…',
      choices: ['Venezuela', 'Brazil', 'Peru'],
      correct: 0,
    },
    {
      prompt: 'Venezuela’s oil belt is around…',
      choices: ['Lake Maracaibo', 'Lake Titicaca', 'Lake Victoria'],
      correct: 0,
    },
  ],
  VUT: [
    {
      prompt: 'Port Vila is the capital of…',
      choices: ['Vanuatu', 'Fiji', 'New Caledonia'],
      correct: 0,
    },
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
  ],
  YEM: [
    {
      prompt: 'Sana’a is the capital of…',
      choices: ['Yemen', 'Oman', 'Saudi Arabia'],
      correct: 0,
    },
    {
      prompt: 'Yemen sits at the southern end of the…',
      choices: ['Arabian Peninsula', 'Sinai', 'Anatolia'],
      correct: 0,
    },
    {
      prompt: 'Socotra’s unique flora is part of…',
      choices: ['Yemen', 'Somalia', 'Eritrea'],
      correct: 0,
    },
  ],
  ZMB: [
    {
      prompt: 'Lusaka is the capital of…',
      choices: ['Zambia', 'Zimbabwe', 'Malawi'],
      correct: 0,
    },
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
  ],
  ZWE: [
    {
      prompt: 'Harare is the capital of…',
      choices: ['Zimbabwe', 'Zambia', 'Botswana'],
      correct: 0,
    },
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
  ],
}
