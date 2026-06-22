import { getRandomPoints } from '~~/server/utils/geo'
import type { GeoPoint, Picture } from '~~/types/geo'

const MIN_PICS_IN_COLLECTION = 10
const MAX_FAILED_TRIALS = 20
const ALLOW_NON_SEQUENCE_PICS = true
const RANDOM_POINT_BUFFER = 0.05

const GEORHENA_PICS_IDS: string[] = [
  '46a54102-0655-4b2c-a38d-d502965c0b49',
  'cd019240-0b97-4882-aca2-9e86c8e7287e',
  '7340993e-7b42-4a10-9338-47211e358834', // Cathédrale de Bale
]
const GEORHENA_PICS_RATIO = 3 / 5

const RHIN_SUP_BBOX = [6.84079, 47.07434, 8.89452, 49.34438] as const

/**
 * Get the full URL for some Panoramax API route
 * @param route The route to query, like /search
 * @returns The full URL
 */
export function getAPIUrl(route: string = '') {
  return `https://api.panoramax.xyz/api${route}`
}

/**
 * Find one or many Panoramax pictures IDs
 * @param amount The number of wanted Panoramax IDs
 * @return Picture ID & position
 */
export async function getPanoramaxPictureIDs(amount: number = 1): Promise<Picture[]> {
  const targetGeorhena = Math.min(
    Math.round(amount * GEORHENA_PICS_RATIO),
    GEORHENA_PICS_IDS.length,
  )
  // grab all georhena pics and shuffle em
  let georhenaPics = await queryPanoramaxAPIByPicIDs(GEORHENA_PICS_IDS)
  georhenaPics = shuffle(georhenaPics).slice(0, targetGeorhena)

  const randomPics: Picture[] = []
  const targetRandom = amount - georhenaPics.length

  let randomPoints: GeoPoint[] = []
  let trials = 0

  while (randomPics.length < targetRandom) {
    if (randomPoints.length === 0) {
      randomPoints = getRandomPoints()
    }

    const point = randomPoints.pop()
    if (!point) continue

    const pic = await queryPanoramaxAPIPicture(point)
    if (!pic) {
      trials++
      if (trials >= MAX_FAILED_TRIALS) {
        throw new Error("Can't find any pictures")
      }
      continue
    }

    if (
      !randomPics.some((p) => p.id === pic.id) &&
      !georhenaPics.some((p) => p.id === pic.id)
    ) {
      randomPics.push(pic)
      trials = 0
    }
  }

  // on alterne entre les 2 images
  const result: Picture[] = []
  const maxLen = Math.max(georhenaPics.length, randomPics.length)
  for (let i = 0; i < maxLen; i++) {
    if (i < georhenaPics.length) result.push(georhenaPics[i])
    if (i < randomPics.length) result.push(randomPics[i])
  }
  return result
}

/**
 * Find a valid picture ID on Panoramax API
 * @param point The coordinates to look around
 * @returns The picture ID, or null if no one found
 */
export async function queryPanoramaxAPIPicture(point: GeoPoint): Promise<Picture | null> {
  const bbox = limitBBoxToRhinSup([
    point.lng - RANDOM_POINT_BUFFER,
    point.lat - RANDOM_POINT_BUFFER,
    point.lng + RANDOM_POINT_BUFFER,
    point.lat + RANDOM_POINT_BUFFER,
  ])
  const inverted = bbox[0] >= bbox[2] || bbox[1] >= bbox[3]

  const res1 = await fetch(getAPIUrl('/search'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      limit: ALLOW_NON_SEQUENCE_PICS ? 10 : 1,
      bbox: bbox,
      filter: 'field_of_view=360',
    }),
  })

  const res1json = await res1.json()

  // Check if given image is not single in its collection, and we have enough around
  if (res1json.features.length > 0) {
    const res = {
      id: res1json.features[0].id,
      position: {
        lat: res1json.features[0].geometry.coordinates[1],
        lng: res1json.features[0].geometry.coordinates[0],
      },
    }
    const nbSameCollec = res1json.features.filter(
      (f: any) => f.collection === res1json.features[0].collection,
    ).length
    if (nbSameCollec >= MIN_PICS_IN_COLLECTION) {
      // If we have enough pictures in the same collection, we can use it
      return res
    } else {
      // Look at first picture collection details
      const res2 = await fetch(
        getAPIUrl(`/collections/${res1json.features[0].collection}`),
      )
      const res2json = await res2.json()
      if (!res2json?.['stats:items']?.['count']) return null
      if (res2json?.['stats:items']?.['count'] >= 30) {
        return res
      }
    }
  }

  return null
}

//https://api.panoramax.xyz/api/search
// ?limit=10
// &ids=46a54102-0655-4b2c-a38d-d502965c0b49,35f89915-43dd-47b4-9ea3-351d986f4354
export async function queryPanoramaxAPIByPicIDs(ids: string[]): Promise<Picture[]> {
  const limit = ids.length
  const res = await fetch(getAPIUrl(`/search?ids=${ids.join(',')}&limit=${limit}`))
  const resjson = await res.json()
  return resjson.features.map((f: any) => ({
    id: f.id,
    position: {
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
    },
  }))
}

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)) // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const limitBBoxToRhinSup = (
  bbox: [number, number, number, number],
): [number, number, number, number] => {
  return [
    Math.max(bbox[0], RHIN_SUP_BBOX[0]),
    Math.max(bbox[1], RHIN_SUP_BBOX[1]),
    Math.min(bbox[2], RHIN_SUP_BBOX[2]),
    Math.min(bbox[3], RHIN_SUP_BBOX[3]),
  ]
}
