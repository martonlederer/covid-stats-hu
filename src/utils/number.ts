export function fixPercentage(val: number): string {
  return val.toFixed(2)
}

export function prettierNumber(val: number): string {
  let numberInString = val.toString()

  return numberInString.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
