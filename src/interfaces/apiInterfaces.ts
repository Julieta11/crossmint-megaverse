export interface ApiService {
  createMegaverse(): Promise<boolean>
  emptyMegaverse(): Promise<boolean>
}

export type ItemResponse = {
  type: number
  color?: string
  direction?: string
} | null

export interface CurrentMapResponse {
  _id: string
  content: ItemResponse[][]
  candidateId: string
  phase: number
  __v: number
}

export interface GoalMapResponse {
  goal: string[][]
}

export interface Polyanet {
  row: number
  column: number
}

export interface Soloon {
  row: number
  column: number
  color: string
}

export interface Cometh {
  row: number
  column: number
  direction: string
}
