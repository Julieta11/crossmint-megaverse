import { translateGoalMapResponse, getArrays, verifyResult } from '../src/services/utils'

describe('translateGoalMapResponse', () => {
  it('should translate goal map correctly', () => {
    const mockGoalMap = [
      ['SPACE', 'POLYANET'],
      ['SPACE', 'SPACE']
    ]

    const result = translateGoalMapResponse(mockGoalMap)

    expect(result[0][0]).toBeNull()
    expect(result[0][1]?.type).toEqual(0)
    expect(result[1][0]).toBeNull()
    expect(result[1][1]).toBeNull()
  })

  it('should handle unknown items gracefully', () => {
    const mockGoalMap = [
      ['SPACE', 'POLYANET'],
      ['UNKNOWN', 'JULI']
    ]

    const result = translateGoalMapResponse(mockGoalMap)

    expect(result[0][0]).toBeNull()
    expect(result[0][1]?.type).toEqual(0)
    expect(result[1][0]).toBeNull()
    expect(result[1][1]).toBeNull()
  })
})

describe('getArrays', () => {
  it('should separate items into polyanets, soloons, and comeths correctly', () => {
    const mockMegaverseMap = [
      [{ type: 0 }, { type: 1, color: 'red' }, { type: 2, direction: 'left' }],
      [{ type: 0 }, { type: 1, color: 'blue' }, { type: 2, direction: 'right' }]
    ]

    const result = getArrays(mockMegaverseMap)

    expect(result).toEqual({
      polyanets: [
        { column: 0, row: 0 },
        { column: 0, row: 1 }
      ],
      soloons: [
        { column: 1, row: 0, color: 'red' },
        { column: 1, row: 1, color: 'blue' }
      ],
      comeths: [
        { column: 2, row: 0, direction: 'left' },
        { column: 2, row: 1, direction: 'right' }
      ]
    })
  })
})

describe('verifyResult', () => {
  it('returns true for equal arrays', () => {
    const arr1 = [[{ type: 1, color: 'red' }], [{ type: 2, direction: 'left' }]]
    const arr2 = [[{ type: 1, color: 'red' }], [{ type: 2, direction: 'left' }]]

    const result = verifyResult(arr1, arr2)

    expect(result).toBe(true)
  })

  it('returns false for arrays with different lengths', () => {
    const arr1 = [[{ type: 1, color: 'red' }], [{ type: 2, direction: 'left' }]]
    const arr2 = [[{ type: 1, color: 'red' }]]

    const result = verifyResult(arr1, arr2)

    expect(result).toBe(false)
  })

  it('returns false for arrays with different item values', () => {
    const arr1 = [[{ type: 1, color: 'red' }]]
    const arr2 = [[{ type: 2, direction: 'right' }]]

    const result = verifyResult(arr1, arr2)

    expect(result).toBe(false)
  })

  it('returns false for arrays with different item values (case sensitive)', () => {
    const arr1 = [[{ type: 1, color: 'RED' }]]
    const arr2 = [[{ type: 1, color: 'red' }]]

    const result = verifyResult(arr1, arr2)

    expect(result).toBe(false)
  })
})
