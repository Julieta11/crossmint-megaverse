import { Cometh, ItemResponse, Polyanet, Soloon } from '../interfaces/apiInterfaces'

export function translateGoalMapResponse(goalMap: string[][]): ItemResponse[][] {
  const content: ItemResponse[][] = []

  for (const row of goalMap) {
    const itemRow: ItemResponse[] = []

    for (const item of row) {
      // Perform translation based on your logic
      const itemResponse: ItemResponse = translateItem(item)
      itemRow.push(itemResponse)
    }

    content.push(itemRow)
  }

  return content
}

function translateItem(item: string): ItemResponse | null {
  if (item.toUpperCase() === 'SPACE') {
    return null
  }
  if (item.toUpperCase() === 'POLYANET') {
    return { type: 0 }
  }
  const parts = item.split('_')
  if (parts.length === 2) {
    const [data, type] = parts

    if (type.toUpperCase() === 'SOLOON') {
      // Handle Soloon
      return {
        type: 1,
        color: data.toLowerCase() // Extracted color data
      }
      //TODO: handle case data is null
    } else if (type.toUpperCase() === 'COMETH') {
      // Handle Cometh
      return {
        type: 2,
        direction: data.toLowerCase() // Extracted direction data
      }
    }
  }

  // Handle other cases or provide a default translation
  return null
}

export function getArrays(megaverseMap: ItemResponse[][]): {
  polyanets: Polyanet[]
  soloons: Soloon[]
  comeths: Cometh[]
} {
  const polyanets: Polyanet[] = []
  const soloons: Soloon[] = []
  const comeths: Cometh[] = []

  megaverseMap.forEach((row, rowIndex) => {
    row.forEach((item, columnIndex) => {
      if (item) {
        const newItem = { row: rowIndex, column: columnIndex }

        switch (item.type) {
          case 0: // Polyanet
            polyanets.push(newItem)
            break
          case 1: // Soloon
            if (item.color) {
              const soloonItem: Soloon = { ...newItem, color: item.color }
              soloons.push(soloonItem)
            }
            break
          case 2: // Cometh
            if (item.direction) {
              const comethItem: Cometh = {
                ...newItem,
                direction: item.direction
              }
              comeths.push(comethItem)
            }
            break
        }
      }
    })
  })

  return { polyanets, soloons, comeths }
}

// Function to compare two ItemResponse arrays
export function verifyResult(arr1: ItemResponse[][], arr2: ItemResponse[][]): boolean {
  if (arr1.length !== arr2.length) {
    return false
  }

  for (let i = 0; i < arr1.length; i++) {
    const subArr1 = arr1[i]
    const subArr2 = arr2[i]

    if (subArr1.length !== subArr2.length) {
      return false
    }

    for (let j = 0; j < subArr1.length; j++) {
      const item1 = subArr1[j]
      const item2 = subArr2[j]

      if (!areItemResponsesEqual(item1, item2)) {
        return false
      }
    }
  }
  return true
}

// Function to compare two ItemResponse objects
function areItemResponsesEqual(item1: ItemResponse, item2: ItemResponse): boolean {
  return item1?.type === item2?.type && item1?.color === item2?.color && item1?.direction === item2?.direction
}
