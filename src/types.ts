// Shape of one search result. Shared by the mock backend and the UI.
export interface Library {
  name: string
  description: string
  category: string
  version: string
  license: string
  weeklyDownloads: number
  stars: number
  lastPublished: string // ISO date
}
