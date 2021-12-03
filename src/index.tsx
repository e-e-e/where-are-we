import 'whatwg-fetch'
import 'promise-polyfill/src/polyfill'
import Inactive from 'inactive'

import closeSvg from './baseline-close-24px.svg'
import styles from './styles.css'

type IpInfoResponseData = {
  ip: string
  city: string
  region: string
  country: string
  loc: string
  org: string
  postal: string
  timezone: string
}

type LatLng = {
  lat: number
  lng: number
}

type IpInfo = LatLng & { commonName: string }

type NativeLandsFeatureProperties = {
  FrenchDescription: string
  FrenchName: string
  Name: string
  Slug: string
  color: string
  description: string
}

type PolygonGeometry = {
  type: 'Polygon'
  coordinates: [number, number][]
}

type NativeLandsFeature = {
  type: 'Feature'
  id: string
  properties: NativeLandsFeatureProperties
  geometry: PolygonGeometry
}

type NativeLandsResponseData = NativeLandsFeature[]

const IP_API = 'https://ipinfo.io/json'
const NATIVE_LAND_API = 'https://native-land.ca/api/index.php'

function extractLngLat(data: IpInfoResponseData): LatLng | null {
  if (!data) return null
  if (!data.loc || typeof data.loc !== 'string') return null
  const locArray = data.loc.split(',')
  if (locArray.length !== 2) return null
  const lat = parseFloat(locArray[0])
  const lng = parseFloat(locArray[1])
  if (lat == null || lng == null) return null
  return {
    lat,
    lng,
  }
}

function extractLocationString(data: IpInfoResponseData): string | null {
  if (!data) return null
  if (!data.city && !data.region) return null
  const strings = []
  data.city && strings.push(data.city)
  data.region && strings.push(data.region)
  data.country && strings.push(data.country)
  return strings.join(', ')
}

function getLocationDataFromIp(): Promise<IpInfo | null> {
  return fetch(IP_API)
    .then((res) => res.json())
    .then((data) => {
      const latLng = extractLngLat(data)
      return latLng
        ? {
            ...latLng,
            commonName: extractLocationString(data) ?? '',
          }
        : null
    })
}

function getTerritoriesFromLngLat(
  loc: LatLng
): Promise<NativeLandsResponseData> {
  return fetch(
    `${NATIVE_LAND_API}?maps=territories&position=${loc.lat},${loc.lng}`
  )
    .then((res) => res.json())
    .catch((e) => {
      console.error(e)
      return []
    })
}

type TerritoryInfo = {
  name: string
  link?: string
}

function isDefined<T>(v: T): v is Exclude<T, undefined | null> {
  return v != null
}

function toTerritoryInfo(features: NativeLandsFeature[]): TerritoryInfo[] {
  return features
    .map((feature) => {
      const name = feature.properties.Name
      const link = feature.properties.description
      return name
        ? {
            name,
            link,
          }
        : undefined
    })
    .filter(isDefined)
}

type LocationInformation = {
  territories: TerritoryInfo[]
  commonName: string
}

async function getPotentialLocations(): Promise<LocationInformation | null> {
  const ipData = await getLocationDataFromIp()
  if (!ipData) return null
  const territories = await getTerritoriesFromLngLat(ipData)
  return {
    territories: toTerritoryInfo(territories),
    commonName: ipData.commonName,
  }
}

function TerritoryLink({ territoryInfo }: { territoryInfo: TerritoryInfo }) {
  return territoryInfo.link ? (
    <a href={territoryInfo.link} target="_blank">
      {territoryInfo.name}
    </a>
  ) : (
    <>{territoryInfo.name}</>
  )
}

function Territories({ territories }: { territories: TerritoryInfo[] }) {
  if (!territories.length) return null
  if (territories.length === 1) {
    return (
      <>
        <TerritoryLink territoryInfo={territories[0]} /> country
      </>
    )
  }
  const most = territories.slice(0, -1)
  return (
    <>
      {most.map((t) => (
        <>
          <TerritoryLink territoryInfo={t} />,{' '}
        </>
      ))}
      and/or{' '}
      <TerritoryLink territoryInfo={territories[territories.length - 1]} />{' '}
      country
    </>
  )
}

function LocationDescription({ territories, commonName }: LocationInformation) {
  if (territories.length === 0) {
    return (
      <p className={styles.text}>
        Your IP suggests that you may be in {commonName}. We cannot find
        information about indigenous nations at this location, this does not
        mean that there are not any.*
      </p>
    )
  }
  return (
    <p className={styles.text}>
      Your IP suggests that you may be on{' '}
      <Territories territories={territories} />, otherwise known as {commonName}
      .*
    </p>
  )
}

function WhereAreWePopup({ data }: { data: LocationInformation }) {
  const ref = Inactive.createRef<HTMLDivElement>()
  const remove = () => {
    if (!ref.current) return
    ref.current.style.opacity = '0'
    setTimeout(() => {
      ref.current?.parentElement?.removeChild(ref.current)
    }, 220)
  }
  const fadeIn = (element: Element) => {
    if (!(element instanceof HTMLDivElement)) return
    element.style.opacity = '1'
  }
  return (
    <div ref={ref} onEnter={fadeIn} className={styles.container}>
      <div className={styles.header}>
        <div className={styles.content}>
          <LocationDescription {...data} />
        </div>
        <div className={styles.buttons}>
          <button
            onClick={remove}
            className={styles.closeButton}
            innerHTML={closeSvg}
          />
        </div>
      </div>
      <div className={styles.secondaryContent}>
        <p className={styles.disclaimer}>
          <span className={styles.astrix}>*</span>
          The information presented here is derived from the maps at{' '}
          <a href="https://native-land.ca/" target="_blank">
            native-land.ca
          </a>{' '}
          cross-referenced by data from{' '}
          <a href="https://ipinfo.io/" target="_blank">
            ipinfo.io
          </a>
          . Note that this is based on your internet service providers location,
          and may not be incorrect for your actual physical location. This is
          not authoritative or representative and should be approached
          critically. Learn more about this project on{' '}
          <a href="https://github.com/e-e-e/where-are-we" target="_blank">
            github
          </a>
          .
        </p>
        <p className={styles.disclaimer}>
          Do you know who the traditional custodians are of the land on which
          you stand?
        </p>
      </div>
    </div>
  )
}

function display(data: LocationInformation | null) {
  if (!data) return
  if (!data.territories.length && !data.commonName) return

  const container = document.createElement('div')
  document.body.append(container)
  Inactive.mount(container, <WhereAreWePopup data={data} />)
}

function init() {
  getPotentialLocations().then(display)
}

init()
