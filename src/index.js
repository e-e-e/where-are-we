import 'whatwg-fetch'
import 'promise-polyfill/src/polyfill'

import closeSvg from './baseline-close-24px.svg'
import styles from './styles.css'

const IP_API = 'https://ipinfo.io/json'
const NATIVE_LAND_API = 'https://native-land.ca/api/index.php'

function extractLngLat(data) {
  if (!data) return
  if (!data.loc || typeof data.loc !== 'string') return
  const locArray = data.loc.split(',')
  if (locArray.length !== 2) return
  return {
    lat: parseFloat(locArray[0]),
    lng: parseFloat(locArray[1])
  }
}

function extractLocationString(data) {
  if (!data) return
  if (!data.city && !data.region) return
  const strings = []
  data.city && strings.push(data.city)
  data.region && strings.push(data.region)
  data.country && strings.push(data.country)
  return strings.join(', ')
}

function extractTerritories(data) {
  console.log(data)
  if (!data || data.length === 0) return []
  return data.map(t => t.properties && t.properties.Name).filter(t => !!t)
}

function getLocationDataFromIp() {
  return fetch(IP_API)
    .then(res => res.json())
    .then(data => ({
      ...extractLngLat(data),
      commonName: extractLocationString(data)
    }))
}

function getTerritoriesFromLngLat(loc) {
  if (!loc) return
  if (typeof loc.lng !== 'number') return
  if (typeof loc.lat !== 'number') return
  return fetch(
    `${NATIVE_LAND_API}?maps=territories&position=${loc.lat},${loc.lng}`
  )
    .then(res => res.json())
    .then(extractTerritories)
    .catch(e => {
      console.log(e)
      return []
    })
}

function getPotentialLocations() {
  return getLocationDataFromIp()
    .then(location =>
      Promise.all([location, getTerritoriesFromLngLat(location)])
    )
    .then(([location, territories]) => ({
      territories,
      commonName: location.commonName
    }))
    .catch(e => {
      console.log('Something when wrong', e)
    })
}

function territoriesToString(territories) {
  if (territories.length === 0) return
  if (territories.length === 1) return `${territories[0]} country`
  return `${territories.slice(0, -1).join(', ')} and/or ${
    territories[territories.length - 1]
  } country`
}

function renderLocationString(data) {
  const indigenousCountries = territoriesToString(data.territories)
  const preface = 'Your IP indicates that you may be'
  if (!data.commonName && indigenousCountries)
    return `${preface} on ${indigenousCountries}.`
  if (data.commonName && !indigenousCountries)
    return `${preface} in ${data.commonName}.`
  return `${preface} on ${indigenousCountries}, other wise known as ${
    data.commonName
  }.`
}

function createLink(text, href) {
  const link = document.createElement('a')
  link.href = href
  link.innerText = text
  link.target = '__blank'
  link.className = styles.link
  return link
}

function appendDisclaimerNodesTo(node) {
  const items = [
    document.createTextNode(
      'The information presented here is derived from the maps at '
    ),
    createLink('native-land.ca', 'https://native-land.ca/'),
    document.createTextNode(' cross-referenced by data from '),
    createLink('ipinfo.io', 'https://ipinfo.io/'),
    document.createTextNode(
      `. This is not authoritative or representative and should be approached critically. 
      Do you know who the traditional custodians are of the land on which you stand?`
    )
  ]
  items.forEach(item => node.appendChild(item))
}

function removeContainer(container) {
  if (container && container.style.opacity !== 0) {
    container.style.opacity = 0
    setTimeout(() => {
      if (container && container.parentElement) {
        container.parentElement.removeChild(container)
      }
    }, 220)
  }
}

function display(data) {
  if (!data) return
  if (!data.territories.length && !data.commonName) return
  // create contianer
  const container = document.createElement('div')
  container.className = styles.container

  const header = document.createElement('div')
  header.className = styles.header

  const headerTitle = document.createElement('div')
  headerTitle.className = styles.headerTitle
  headerTitle.innerText = 'Where are we?'

  // create close button
  const closeButton = document.createElement('button')
  closeButton.className = styles.closeButton
  closeButton.innerHTML = closeSvg
  closeButton.addEventListener('click', () => removeContainer(container))
  header.appendChild(headerTitle)
  header.appendChild(closeButton)

  const content = document.createElement('div')
  content.className = styles.content
  const primaryText = document.createElement('p')
  primaryText.className = styles.text
  primaryText.innerText = renderLocationString(data)
  content.appendChild(primaryText)
  if (data.territories.length >= 0) {
    const disclaimer = document.createElement('p')
    disclaimer.className = styles.disclaimer
    appendDisclaimerNodesTo(disclaimer)
    content.appendChild(disclaimer)
  }
  container.appendChild(header)
  container.appendChild(content)
  document.body.appendChild(container)
  // fade in
  setTimeout(() => {
    container.style.opacity = 1
  }, 0)
}

function init() {
  getPotentialLocations().then(display)
}

init()
