(function(){
/* Poortland — Nederlandse website. Content en data.
   Alle teksten in premium Nederlands. Geen koppelteken, geen slashconstructies. */

/* ----------------------------- Realisaties ----------------------------- */
const PROJECTEN = [{
  id: 'duinhof',
  naam: 'Villa Duinhof',
  regio: 'Knokke Heist',
  materiaal: 'Cortenstaal',
  poorttype: 'Schuifpoort',
  woningtype: 'Moderne villa',
  stijl: 'Strak',
  automatisatie: 'Ja',
  span: '4,2 m',
  jaar: '2025',
  tone: 'corten',
  uitgelicht: true,
  vraag: 'Een ruime oprit aan de kust met zicht op de duinen vroeg om een poort die privacy geeft zonder de woning af te sluiten van het landschap.',
  oplossing: 'Een schuifpoort in cortenstaal met een rustig verticaal ritme. De levende roestlaag verdiept met het zeeklimaat en sluit warm aan bij de gevel in lichte steen.',
  afwerking: 'Natuurlijke cortenpatina, geborstelde randen, verdoken loopwiel.'
}, {
  id: 'lievens',
  naam: 'Maison Lievens',
  regio: 'Gent',
  materiaal: 'Aluminium',
  poorttype: 'Draaipoort',
  woningtype: 'Herenhuis',
  stijl: 'Klassiek verfijnd',
  automatisatie: 'Ja',
  span: '1,2 m',
  jaar: '2025',
  tone: 'morning',
  vraag: 'Een statig herenhuis in het centrum van Gent wenste een voetgangerspoort die discreet en duurzaam was, in lijn met de historische gevel.',
  oplossing: 'Een draaipoort in aluminium met fijne verticale spijlen en een mat gepoederlakte afwerking in dieptegroen. Onderhoudsarm en bestand tegen het stadsklimaat.',
  afwerking: 'Gepoederlakt in fijnstructuur, ingewerkt slot, zachte demping.'
}, {
  id: 'brael',
  naam: 'Hofstede Brael',
  regio: 'Sint Martens Latem',
  materiaal: 'Staal en hout',
  poorttype: 'Schuifpoort',
  woningtype: 'Landelijke woning',
  stijl: 'Landelijk warm',
  automatisatie: 'Ja',
  span: '5,0 m',
  jaar: '2024',
  tone: 'dusk',
  uitgelicht: true,
  vraag: 'Een gerenoveerde hofstede met een lange dreef vroeg om een brede toegang die robuust aanvoelt en toch warmte uitstraalt.',
  oplossing: 'Een schuifpoort met een gelakt stalen frame en een invulling in massieve eik. Het hout brengt warmte, het staal draagt de breedte en de automatisatie.',
  afwerking: 'Geolied eik, mat zwart staal, verdoken automatisatie in de fundering.'
}, {
  id: 'noordkaai',
  naam: 'Huis Noordkaai',
  regio: 'Antwerpen',
  materiaal: 'Aluminium',
  poorttype: 'Draaipoort',
  woningtype: 'Nieuwbouw',
  stijl: 'Strak',
  automatisatie: 'Ja',
  span: '3,6 m',
  jaar: '2024',
  tone: 'stone',
  vraag: 'Een moderne nieuwbouw aan de rand van Antwerpen zocht een dubbele oprijpoort die naadloos aansluit bij de horizontale lijnen van de architectuur.',
  oplossing: 'Een dubbele draaipoort in aluminium met brede horizontale lamellen. De poort volgt de gevelritmiek en sluit vlak af met de carport.',
  afwerking: 'Geborsteld aluminium, gepoederlakt antraciet, lineaire lamellen.'
}, {
  id: 'velden',
  naam: 'Domein Velden',
  regio: 'Leuven',
  materiaal: 'Smeedijzer',
  poorttype: 'Draaipoort',
  woningtype: 'Kasteelhoeve',
  stijl: 'Klassiek',
  automatisatie: 'Ja',
  span: '6,4 m',
  jaar: '2023',
  tone: 'dusk',
  vraag: 'Een historische kasteelhoeve vroeg om een statige toegang die het erfgoed eert en toch dagelijks comfortabel in gebruik is.',
  oplossing: 'Een brede draaipoort in handgesmeed staal met een sober klassiek profiel. Elk onderdeel werd met de hand geforceerd en gesmeed in het atelier.',
  afwerking: 'Handgesmeed staal, mat gelakt, smeedwerk per stuk afgewerkt.'
}, {
  id: 'strandvilla',
  naam: 'Strandvilla Negen',
  regio: 'Oostduinkerke',
  materiaal: 'Cortenstaal',
  poorttype: 'Schuifpoort',
  woningtype: 'Kustvilla',
  stijl: 'Strak',
  automatisatie: 'Ja',
  span: '2,8 m',
  jaar: '2023',
  tone: 'corten',
  vraag: 'Een kustvilla wenste maximale privacy aan de straatzijde zonder de woning gesloten te laten ogen.',
  oplossing: 'Een schuifpoort in cortenstaal met dichte privacylamellen die het zicht breken maar lucht doorlaten. De patina sluit aan bij het duinlandschap.',
  afwerking: 'Cortenstaal met privacylamellen, geborstelde geleiding.'
}, {
  id: 'eiksteen',
  naam: 'Eik en Steen',
  regio: 'Brasschaat',
  materiaal: 'Hout',
  poorttype: 'Draaipoort',
  woningtype: 'Villa',
  stijl: 'Tijdloos warm',
  automatisatie: 'Ja',
  span: '3,2 m',
  jaar: '2025',
  tone: 'dusk',
  uitgelicht: true,
  vraag: 'Een villa in het groen van Brasschaat zocht een warme houten poort die de woning verankert in haar bosrijke omgeving.',
  oplossing: 'Een draaipoort in massieve eik met een verticaal ritme dat de bomen weerspiegelt. Een verdoken stalen kader draagt de bewegende delen onzichtbaar.',
  afwerking: 'Massieve eik, natuurlijk geolied, verdoken stalen kern.'
}, {
  id: 'park',
  naam: 'Park Mechelen',
  regio: 'Mechelen',
  materiaal: 'Aluminium',
  poorttype: 'Hekwerk',
  woningtype: 'Moderne woning',
  stijl: 'Strak',
  automatisatie: 'Deels',
  span: '24 m hekwerk',
  jaar: '2024',
  tone: 'morning',
  vraag: 'Een ruime tuin vroeg om een doorlopend hekwerk met een geïntegreerde poort, in één rustig beeld.',
  oplossing: 'Een hekwerk op maat in aluminium met een geïntegreerde schuifpoort. Hek en poort delen hetzelfde lamelprofiel, zodat de toegang opgaat in het geheel.',
  afwerking: 'Gepoederlakt aluminium, doorlopend lamelprofiel, lijnverlichting.'
}];

/* ----------------------------- Producten ----------------------------- */
/* De productwisselaar toont de poortpagina voor elk type. Houten poorten is uitgewerkt
   als voorbeeldpagina; de andere types delen dezelfde rijke structuur. */
const PRODUCTEN = {
  houten: {
    key: 'houten',
    naam: 'Houten poorten',
    kicker: 'Hout',
    tone: 'dusk',
    materiaalFilter: 'Hout',
    intro: 'Warm, levend en tijdloos. Een houten poort verankert uw woning in haar omgeving en wordt mooier met de jaren.',
    lead: 'Hout is het meest tactiele materiaal dat wij verwerken. Wij kiezen voor duurzame eik en thermisch behandelde houtsoorten, gedragen door een verdoken stalen kern die de poort jarenlang recht en stil houdt.',
    voorWie: ['Villa\u2019s en landelijke woningen die warmte en natuurlijkheid zoeken.', 'Renovaties waar hout aansluit bij gevel, schrijnwerk of omgeving.', 'Woningen in het groen waar de poort moet opgaan in het landschap.'],
    voordelen: [['Warme uitstraling', 'Hout brengt diepte en karakter die geen ander materiaal evenaart.'], ['Levende materie', 'De nerf en de toon verdiepen met de jaren tot een eigen patina.'], ['Stabiele kern', 'Een verdoken stalen kader houdt de poort recht en draagt de automatisatie.'], ['Volledig op maat', 'Elke lat, verhouding en afwerking wordt voor uw opening getekend.']],
    materialen: ['Massieve eik', 'Thermisch verduurzaamd hout', 'Afromezi en hardhout', 'Verdoken stalen kern'],
    afwerking: ['Natuurlijk geolied', 'Mat gelakt op kleur', 'Geborsteld en geloogd', 'Combinatie met staal of inox'],
    stijlen: [['Verticaal ritme', 'Smalle latten in een rustig verticaal patroon. Tijdloos en discreet.'], ['Vlak en dicht', 'Brede planken vlak naast elkaar voor maximale privacy en rust.'], ['Hout en metaal', 'Een houten invulling in een fijn stalen of aluminium kader.']],
    faq: [['Hoeveel onderhoud vraagt een houten poort?', 'Een houten poort vraagt periodiek een onderhoudsbeurt met olie of lak, afhankelijk van houtsoort en oriëntatie. Wij adviseren bij oplevering een ritme en blijven beschikbaar voor de opvolging.'], ['Blijft een houten poort recht?', 'Ja. Wij bouwen elke houten poort op een verdoken stalen kern. Die draagt het gewicht en de beweging, zodat het hout enkel zichtbaar werk doet en stabiel blijft.'], ['Welke houtsoort past het best?', 'Dat hangt af van uw woning, de oriëntatie en het gewenste onderhoud. Eik straalt warmte uit, thermisch hout is bijzonder stabiel. Tijdens het adviesgesprek bekijken wij samen wat past.']]
  },
  metalen: {
    key: 'metalen',
    naam: 'Metalen poorten',
    kicker: 'Staal',
    tone: 'stone',
    materiaalFilter: 'Smeedijzer',
    intro: 'Sterk, strak en bestand tegen de tijd. Een stalen poort geeft uw toegang gewicht en precisie.',
    lead: 'Staal laat ons de fijnste lijnen en de breedste overspanningen maken. Van strak plaatwerk tot handgesmeed profiel, elke poort wordt gelast en afgewerkt als één geheel in ons atelier.',
    voorWie: ['Woningen die kracht, precisie en een lange levensduur zoeken.', 'Brede opritten waar staal de overspanning moeielloos draagt.', 'Klassieke en eigentijdse architectuur die strakke lijnen vraagt.'],
    voordelen: [['Maximale sterkte', 'Staal draagt grote breedtes en blijft strak over de jaren.'], ['Fijne lijnen', 'Dunne profielen en scherpe details die enkel in staal kunnen.'], ['Handgesmeed mogelijk', 'Klassiek smeedwerk per stuk geforceerd en afgewerkt.'], ['Duurzame lak', 'Een gepoederlakte of natte laklaag beschermt jarenlang.']],
    materialen: ['Geborsteld plaatstaal', 'Handgesmeed staal', 'Buisprofielen op maat', 'Inox accenten'],
    afwerking: ['Gepoederlakt op kleur', 'Mat of zijdeglans', 'Gegalvaniseerd als basis', 'Smeedwerk met de hand'],
    stijlen: [['Strak plaatwerk', 'Gesloten of geperforeerde panelen voor een rustig modern beeld.'], ['Verticale spijlen', 'Een klassiek ritme van fijne verticale staven.'], ['Smeedwerk', 'Handgesmede details voor erfgoed en klassieke villa\u2019s.']],
    faq: [['Roest een stalen poort?', 'Niet wanneer hij correct is voorbehandeld en afgewerkt. Wij galvaniseren of gronden elke stalen poort en brengen daarna een duurzame laklaag aan.'], ['Hoe breed kan een stalen poort?', 'Staal draagt ruime overspanningen. Voor brede opritten kiezen wij vaak een schuifpoort in staal, die ook bij grote breedtes stil en stabiel beweegt.'], ['Kan smeedwerk modern ogen?', 'Zeker. Wij vertalen klassiek smeedwerk naar rustige, eigentijdse profielen die passen bij zowel erfgoed als nieuwbouw.']]
  },
  aluminium: {
    key: 'aluminium',
    naam: 'Aluminium poorten',
    kicker: 'Aluminium',
    tone: 'morning',
    materiaalFilter: 'Aluminium',
    intro: 'Onderhoudsarm, licht en strak. Aluminium is de keuze voor wie rust en gemak voorop stelt.',
    lead: 'Aluminium roest niet en vraagt nauwelijks onderhoud. Het materiaal laat strakke lamellen en grote vlakken toe, gepoederlakt in elke gewenste kleur en structuur.',
    voorWie: ['Moderne woningen en nieuwbouw met horizontale lijnen.', 'Wie een onderhoudsarme poort wenst zonder in te boeten op uitstraling.', 'Kustwoningen waar het zeeklimaat extra weerstand vraagt.'],
    voordelen: [['Onderhoudsarm', 'Aluminium roest niet en blijft jarenlang strak en kleurvast.'], ['Licht in gewicht', 'Soepele beweging en minder belasting voor de automatisatie.'], ['Strakke lamellen', 'Horizontale of verticale lamellen voor een rustig modern beeld.'], ['Vrije kleurkeuze', 'Gepoederlakt in elke kleur en structuur die de gevel vraagt.']],
    materialen: ['Geëxtrudeerde lamellen', 'Vlakke panelen', 'Geperforeerd aluminium', 'Inox accenten'],
    afwerking: ['Gepoederlakt fijnstructuur', 'Mat of zijdeglans', 'Houtlook coating', 'Tweekleurig op aanvraag'],
    stijlen: [['Horizontale lamellen', 'Brede lamellen die de horizon van de architectuur volgen.'], ['Vlak en gesloten', 'Een rustig dicht paneel voor maximale privacy.'], ['Lamel en glas', 'Aluminium gecombineerd met glas of een groene invulling.']],
    faq: [['Verkleurt aluminium in de zon?', 'Een kwalitatieve poederlak is uv bestendig en blijft jarenlang kleurvast. Wij werken enkel met coatings die geschikt zijn voor buitengebruik aan zee en in de stad.'], ['Is aluminium sterk genoeg?', 'Voor de meeste woningpoorten zeker. Voor zeer brede overspanningen versterken wij het profiel of kiezen wij voor een schuifuitvoering.'], ['Kan aluminium op hout lijken?', 'Ja. Een houtlook coating geeft de warmte van hout met het gemak van aluminium, zonder periodiek onderhoud.']]
  },
  staalhout: {
    key: 'staalhout',
    naam: 'Combinatie staal en hout',
    kicker: 'Staal en hout',
    tone: 'dusk',
    materiaalFilter: 'Staal en hout',
    intro: 'Het beste van twee materialen. Een stalen kader draagt, een houten invulling verwarmt.',
    lead: 'De combinatie van staal en hout verenigt kracht en warmte. Het staal geeft fijne lijnen en draagt de breedte en de beweging, het hout brengt karakter en tactiliteit.',
    voorWie: ['Woningen die warmte willen zonder de strakheid los te laten.', 'Brede opritten waar staal draagt en hout verzacht.', 'Renovaties die oud en nieuw met elkaar willen verbinden.'],
    voordelen: [['Kracht en warmte', 'Staal draagt en lijnt, hout verzacht en verwarmt.'], ['Brede overspanning', 'Het stalen kader maakt grote breedtes mogelijk.'], ['Contrastrijk', 'Mat staal naast warm hout geeft diepte en karakter.'], ['Volledig op maat', 'Verhouding, ritme en toon worden samen bepaald.']],
    materialen: ['Stalen kader op maat', 'Massieve eik', 'Thermisch hout', 'Inox bevestiging'],
    afwerking: ['Mat zwart staal', 'Geolied hout', 'Tweekleurige combinatie', 'Verdoken bevestiging'],
    stijlen: [['Kader en invulling', 'Een strak stalen kader met een warme houten invulling.'], ['Horizontaal banden', 'Afwisselende banden in staal en hout.'], ['Vlak contrast', 'Een gesloten houten vlak in een fijne stalen lijst.']],
    faq: [['Werkt hout en staal goed samen?', 'Ja, mits correct opgebouwd. Wij scheiden de materialen technisch zodat ze onafhankelijk kunnen werken, en houden het beeld strak en stabiel.'], ['Wat draagt de poort?', 'Het stalen kader draagt het gewicht en de beweging. Het hout is de zichtbare invulling en blijft daardoor stabiel.'], ['Hoeveel onderhoud?', 'Het hout vraagt periodiek olie of lak, het staal nauwelijks. Wij adviseren een ritme bij oplevering.']]
  },
  schuif: {
    key: 'schuif',
    naam: 'Schuifpoorten',
    kicker: 'Poorttype',
    tone: 'corten',
    materiaalFilter: null,
    intro: 'De keuze voor brede opritten en beperkte ruimte. Een schuifpoort beweegt zijwaarts en vraagt geen zwenkruimte.',
    lead: 'Een schuifpoort glijdt opzij in plaats van open te draaien. Ideaal voor hellende opritten, beperkte diepte of grote breedtes. Wij maken hem in hout, aluminium, staal of cortenstaal.',
    voorWie: ['Brede opritten die geen zwenkruimte voor een draaipoort hebben.', 'Hellende terreinen waar een draaipoort niet vlot opent.', 'Wie een rustige, horizontale beweging verkiest.'],
    voordelen: [['Geen zwenkruimte', 'De poort schuift opzij en wint kostbare opritruimte.'], ['Geschikt voor breed', 'Grote overspanningen bewegen stil en stabiel.'], ['Werkt op een helling', 'Ook op hellend terrein blijft de beweging vlot.'], ['Robuuste geleiding', 'Een verdoken loopwerk draagt de poort jarenlang.']],
    materialen: ['Cortenstaal', 'Aluminium lamellen', 'Staal en hout', 'Massieve eik'],
    afwerking: ['Vrijdragend of op rail', 'Verdoken loopwiel', 'Privacylamellen', 'Geïntegreerde verlichting'],
    stijlen: [['Vrijdragend', 'Zonder rail op de grond, voor een vlakke en strakke oprit.'], ['Lamellen', 'Een rustig horizontaal ritme dat privacy met lucht combineert.'], ['Dicht paneel', 'Een gesloten vlak voor maximale beslotenheid.']],
    faq: [['Wat is een vrijdragende schuifpoort?', 'Een vrijdragende poort heeft geen rail in de grond. Hij wordt gedragen door een verdoken loopwerk naast de oprit, zodat de doorgang vlak en obstakelvrij blijft.'], ['Schuifpoort of draaipoort?', 'Een schuifpoort wint ruimte en werkt goed op hellingen en brede opritten. Een draaipoort is rustiger en klassieker bij voldoende plaats. Wij adviseren op basis van uw terrein.'], ['Hoe stil is de beweging?', 'Een correct geplaatste schuifpoort beweegt nagenoeg geruisloos dankzij een kwalitatief loopwerk en een zachte demping bij begin en einde.']]
  },
  draai: {
    key: 'draai',
    naam: 'Draaipoorten',
    kicker: 'Poorttype',
    tone: 'morning',
    materiaalFilter: null,
    intro: 'De klassieke en meest verfijnde beweging. Een draaipoort opent statig naar binnen of buiten.',
    lead: 'Een draaipoort draait op verdoken scharnieren en geeft uw toegang een rustige, klassieke beweging. In één of twee vleugels, in elk materiaal dat bij uw woning past.',
    voorWie: ['Woningen met voldoende oprijdiepte voor de zwenkbeweging.', 'Wie de klassieke, statige opening van een draaipoort verkiest.', 'Smalle voetgangerstoegangen naast een grotere oprijpoort.'],
    voordelen: [['Klassieke beweging', 'Een rustige, statige opening die tijdloos aanvoelt.'], ['Eén of twee vleugels', 'Enkel of dubbel, afgestemd op de breedte van de opening.'], ['Verfijnde details', 'Verdoken scharnieren en een vlakke aansluiting.'], ['Elk materiaal', 'Hout, aluminium, staal of een combinatie naar keuze.']],
    materialen: ['Aluminium', 'Massieve eik', 'Handgesmeed staal', 'Staal en hout'],
    afwerking: ['Verdoken scharnieren', 'Zachte demping', 'Ingewerkt slot', 'Geïntegreerde voetgangerspoort'],
    stijlen: [['Enkele vleugel', 'Eén rustige vleugel voor smallere toegangen.'], ['Dubbele vleugel', 'Twee vleugels die symmetrisch openen voor brede opritten.'], ['Met loopdeur', 'Een geïntegreerde voetgangerspoort in hetzelfde beeld.']],
    faq: [['Hoeveel ruimte vraagt een draaipoort?', 'Een draaipoort heeft zwenkruimte nodig voor de vleugels. Bij beperkte diepte adviseren wij een schuifpoort of een opening naar binnen.'], ['Eén of twee vleugels?', 'Dat hangt af van de breedte. Tot ongeveer drie meter volstaat vaak één vleugel, daarboven kiezen wij meestal voor twee.'], ['Kan er een loopdeur in?', 'Ja. Wij integreren een voetgangerspoort in dezelfde lijn, zodat het beeld rustig en samenhangend blijft.']]
  },
  hekwerk: {
    key: 'hekwerk',
    naam: 'Hekwerken op maat',
    kicker: 'Hekwerk',
    tone: 'stone',
    materiaalFilter: null,
    intro: 'Eén doorlopend beeld rond uw eigendom. Een hekwerk dat naadloos aansluit bij de poort.',
    lead: 'Een hekwerk op maat omkadert uw woning in hetzelfde profiel en dezelfde toon als de poort. Zo wordt de volledige afsluiting één rustig, samenhangend geheel.',
    voorWie: ['Eigendommen die poort en omheining in één beeld willen.', 'Tuinen die afgeschermd worden zonder zwaar of gesloten te ogen.', 'Projecten waar de afsluiting de architectuur moet versterken.'],
    voordelen: [['Eén geheel', 'Hek en poort delen hetzelfde profiel en dezelfde toon.'], ['Op maat van het terrein', 'Volgt hoogteverschillen en hoeken nauwkeurig.'], ['Open of besloten', 'Van transparant tot volledig privacygericht.'], ['Duurzame materialen', 'Aluminium, staal of cortenstaal, naar keuze.']],
    materialen: ['Aluminium lamellen', 'Cortenstaal', 'Verticale spijlen', 'Gecombineerd met groen'],
    afwerking: ['Doorlopend lamelprofiel', 'Lijnverlichting', 'Geïntegreerde poort', 'Op maat van de helling'],
    stijlen: [['Lamellen', 'Een doorlopend horizontaal ritme rond het volledige terrein.'], ['Spijlen', 'Fijne verticale staven voor een open, klassiek beeld.'], ['Vol en groen', 'Dichte panelen afgewisseld met beplanting.']],
    faq: [['Sluit het hekwerk aan op de poort?', 'Ja, dat is net het uitgangspunt. Wij tekenen hek en poort in hetzelfde profiel, zodat de toegang opgaat in de volledige afsluiting.'], ['Volgt het hekwerk een helling?', 'Zeker. Wij meten het terrein nauwkeurig op en laten het hekwerk de hoogteverschillen en hoeken rustig volgen.'], ['Hoe transparant kan een hekwerk?', 'Van volledig open met fijne spijlen tot volledig besloten met dichte panelen. Wij stemmen de mate van privacy af op uw wens en ligging.']]
  },
  automatisatie: {
    key: 'automatisatie',
    naam: 'Automatisatie',
    kicker: 'Techniek',
    tone: 'dusk',
    materiaalFilter: null,
    intro: 'Comfort dat u dagelijks voelt. Een poort die stil, veilig en betrouwbaar opent.',
    lead: 'Automatisatie is techniek die onzichtbaar hoort te zijn. Wij integreren betrouwbare aandrijving, veilige detectie en eenvoudige bediening, en blijven beschikbaar voor onderhoud en herstelling.',
    voorWie: ['Wie comfort en veiligheid bij de dagelijkse toegang verwacht.', 'Bestaande poorten die toe zijn aan een betrouwbare aandrijving.', 'Nieuwe poorten waar de techniek van bij het ontwerp wordt ingepast.'],
    voordelen: [['Verdoken techniek', 'Aandrijving in de fundering of discreet weggewerkt.'], ['Veilige detectie', 'Sensoren en beveiliging tegen klem en obstakels.'], ['Eenvoudige bediening', 'Afstandsbediening, codeklavier of bediening via uw telefoon.'], ['Sterke opvolging', 'Wij blijven bereikbaar voor onderhoud en herstelling.']],
    materialen: ['Ondergrondse aandrijving', 'Zijdelingse motor', 'Schuifpoortmotor', 'Back up batterij'],
    afwerking: ['Codeklavier', 'Afstandsbediening', 'Bediening via telefoon', 'Veiligheidssensoren'],
    stijlen: [['Ondergronds', 'Een verdoken motor in de fundering, volledig uit het zicht.'], ['Verdoken zijwaarts', 'Een discrete motor weggewerkt in de paal of de muur.'], ['Schuifaandrijving', 'Een robuuste, stille aandrijving voor schuifpoorten.']],
    faq: [['Werkt automatisatie ook op mijn bestaande poort?', 'Vaak wel. Wij beoordelen tijdens een plaatsbezoek of de poort en de constructie geschikt zijn en welke aandrijving past.'], ['Wat gebeurt er bij stroomuitval?', 'Wij voorzien waar gewenst een back up batterij en een handmatige ontgrendeling, zodat de poort altijd te openen blijft.'], ['Is automatisatie veilig?', 'Ja. Wij plaatsen veiligheidssensoren die detecteren wanneer iets of iemand zich in de baan bevindt, en stemmen de kracht zorgvuldig af.']]
  }
};
const PRODUCT_VOLGORDE = ['houten', 'metalen', 'aluminium', 'staalhout', 'schuif', 'draai', 'hekwerk', 'automatisatie'];

/* ----------------------------- Werkwijze ----------------------------- */
const WERKWIJZE = [['01', 'Eerste contact en adviesgesprek', 'Alles begint met een gesprek. Wij luisteren naar uw woning, uw oprit en het gevoel dat u zoekt. Geen catalogus, maar een eerlijk advies over wat past.'], ['02', 'Plaatsbezoek en opmeting', 'Wij komen ter plaatse, lezen de architectuur en de toegang, en meten nauwkeurig op. Zo houdt het ontwerp rekening met helling, breedte en gebruik.'], ['03', 'Ontwerp en voorstel', 'U ontvangt een ontwerp op maat met materiaal, ritme, afwerking en automatisatie. Wij verfijnen samen tot elk detail klopt.'], ['04', 'Productie en afwerking', 'In ons atelier wordt uw poort gesneden, gelast en met de hand afgewerkt. Eén object, geen samengesteld pakket.'], ['05', 'Plaatsing en automatisatie', 'Onze eigen plaatsers monteren de poort en stellen de verdoken automatisatie nauwkeurig af. Wij leveren proper en stil op.'], ['06', 'Oplevering en service na verkoop', 'Wij overlopen het gebruik en het onderhoud, en blijven daarna bereikbaar. Service is voor ons een onderdeel van kwaliteit.']];

/* ----------------------------- Vertrouwensclaims ----------------------------- */
const CLAIMS = ['Handgemaakt in België', 'Duurzame materialen', 'Advies, opmeting en plaatsing door specialisten', 'Sterke service na verkoop'];

/* ----------------------------- Homepage FAQ ----------------------------- */
const HOME_FAQ = [['Hoe lang duurt het maken en plaatsen van een poort?', 'Een traject van eerste contact tot plaatsing duurt gemiddeld zes tot acht weken. De exacte termijn hangt af van materiaal, ontwerp en automatisatie. Wij bevestigen een realistische planning bij het voorstel.'], ['Waarom is een Belgische poort op maat duurder dan import?', 'U investeert in Belgisch handwerk, duurzame materialen, een correcte plaatsing en een sterke service na verkoop. Geen importproduct uit een doos, maar een poort die voor uw woning is getekend en jarenlang vertrouwen geeft.'], ['Komen jullie altijd ter plaatse?', 'Ja. Er is altijd een plaatsbezoek en een adviesgesprek met opmeting. Zo houdt het ontwerp rekening met uw terrein, uw architectuur en uw dagelijks gebruik.'], ['Welk materiaal past het best bij mijn woning?', 'Dat bepalen wij samen. Hout brengt warmte, aluminium is onderhoudsarm, staal geeft kracht en cortenstaal verkleurt mee met het landschap. Tijdens het adviesgesprek bekijken wij wat bij uw woning past.']];

/* ----------------------------- Advies ----------------------------- */
const ADVIES = [['Welke poort past bij een moderne woning?', 'Materialen', 'Strakke lijnen, lamellen en aluminium voor een rustige, eigentijdse toegang.'], ['Welke poort past bij een landelijke woning?', 'Inspiratie', 'Hout en staal die warmte en robuustheid verenigen in een landelijke omgeving.'], ['Schuifpoort of draaipoort kiezen?', 'Poorttypes', 'Hoe ruimte, helling en uitstraling uw keuze tussen schuiven en draaien bepalen.'], ['Aluminium, staal of hout voor uw poort?', 'Materialen', 'Een nuchtere vergelijking van de drie materialen die wij het vaakst verwerken.'], ['Wat bepaalt de prijs van een poort op maat?', 'Prijs en investering', 'Welke keuzes de investering sturen, en waarom maatwerk meer waarde biedt dan import.'], ['Hoe verloopt een plaatsbezoek?', 'Proces', 'Wat u mag verwachten van het adviesgesprek, de opmeting en het voorstel.']];
Object.assign(window, {
  PROJECTEN,
  PRODUCTEN,
  PRODUCT_VOLGORDE,
  WERKWIJZE,
  CLAIMS,
  HOME_FAQ,
  ADVIES
});
})();