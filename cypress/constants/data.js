const helsinkiIpInfoResponse = {
  ip: '80.220.207.52',
  hostname: 'dsl-hkibng11-50dccf-52.dhcp.inet.fi',
  city: 'Helsinki',
  region: 'Uusimaa',
  country: 'FI',
  loc: '60.1695,24.9354',
  org: 'AS1759 Telia Finland Oyj',
  postal: '00100',
  timezone: 'Europe/Helsinki',
  readme: 'https://ipinfo.io/missingauth',
}
const helsinkiNativeLandsResponse = []
const torontoIpInfoResponse = {
  ip: '154.3.42.79',
  city: 'Toronto',
  region: 'Ontario',
  country: 'CA',
  loc: '43.6021,-79.5402',
  org: 'AS174 Cogent Communications',
  postal: 'M8W',
  timezone: 'America/Toronto',
}
const torontoNativeLandsResponse = [
  {
    type: 'Feature',
    properties: {
      Name: 'Ho-de-no-sau-nee-ga (Haudenosaunee)',
      FrenchName: 'Ho-de-no-sau-nee-ga (Haudenosaunee)',
      Slug: 'haudenosauneega-confederacy',
      description:
        'https://native-land.ca/maps/territories/haudenosauneega-confederacy/',
      FrenchDescription:
        'https://native-land.ca/maps/territories/haudenosauneega-confederacy/',
      color: '#fbff27',
    },
    geometry: {
      coordinates: [],
      type: 'Polygon',
    },
    id: '4237ea000a3c66f6ee3f7d984d18c3ea',
  },
  {
    type: 'Feature',
    properties: {
      Name: 'Anishinabewaki \u140a\u14c2\u1511\u14c8\u142f\u1417\u146d',
      FrenchName: 'Anishinabewaki \u140a\u14c2\u1511\u14c8\u142f\u1417\u146d',
      Slug: 'anishinabek',
      description:
        'https://native-land.ca/maps/territories/anishinabek-%e1%90%8a%e1%93%82%e1%94%91%e1%93%88%e1%90%af%e1%92%83/',
      FrenchDescription:
        'https://native-land.ca/maps/territories/anishinabek-%e1%90%8a%e1%93%82%e1%94%91%e1%93%88%e1%90%af%e1%92%83/',
      color: '#692299',
    },
    geometry: {
      coordinates: [],
      type: 'Polygon',
    },
    id: '5aa1caa27e95cf9e074131549effee43',
  },
  {
    type: 'Feature',
    properties: {
      Name: 'Mississaugas of the Credit First Nation',
      FrenchName: 'Mississaugas of the Credit First Nation',
      Slug: 'mississaugas-of-the-credit-first-nation',
      description:
        'https://native-land.ca/maps/territories/mississaugas-of-the-credit-first-nation/',
      FrenchDescription:
        'https://native-land.ca/maps/territories/mississaugas-of-the-credit-first-nation/',
      color: '#4311FF',
    },
    geometry: {
      coordinates: [],
      type: 'Polygon',
    },
    id: '8469987d4ff1030de9c548df74824340',
  },
  {
    type: 'Feature',
    properties: {
      Name: 'Mississauga',
      FrenchName: 'Mississauga',
      Slug: 'mississauga',
      description: 'https://native-land.ca/maps/territories/mississauga/',
      FrenchDescription: 'https://native-land.ca/maps/territories/mississauga/',
      color: '#750044',
    },
    geometry: {
      coordinates: [],
      type: 'Polygon',
    },
    id: 'c7a8b2f7d6ddaf20a17611554f0d4364',
  },
]

const perthIpInfoResponse = {
  ip: '43.250.205.188',
  city: 'Perth',
  region: 'Western Australia',
  country: 'AU',
  loc: '-31.9522,115.8614',
  org: 'AS45671 Wholesale Services Provider',
  postal: '6000',
  timezone: 'Australia/Perth',
}

const perthNativeLandsResponse = [
  {
    type: 'Feature',
    properties: {
      Name: 'Wajuk',
      description: 'https://native-land.ca/maps/territories/wajuk/',
      Slug: 'wajuk',
      FrenchName: 'Wajuk',
      color: '#3B1177',
      FrenchDescription: 'https://native-land.ca/maps/territories/wajuk/',
    },
    geometry: { coordinates: [], type: 'Polygon' },
    id: '3f607cefcdc8eb8781fbe271bcfffd68',
  },
]

module.exports = {
  perth: {
    ipInfoResponse: perthIpInfoResponse,
    nativeLandsResponse: perthNativeLandsResponse,
  },
  toronto: {
    ipInfoResponse: torontoIpInfoResponse,
    nativeLandsResponse: torontoNativeLandsResponse,
  },
  helsinki: {
    ipInfoResponse: helsinkiIpInfoResponse,
    nativeLandsResponse: helsinkiNativeLandsResponse,
  },
}
