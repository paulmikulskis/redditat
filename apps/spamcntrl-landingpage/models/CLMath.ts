export class CLMath {
  toPercent(part: number, total: number) {
    return (part / total) * 100
  }

  toPercentString(part: number, total: number, decimal: number = 2) {
    return `${this.toPercent(part, total).toLocaleString(undefined, {
      minimumFractionDigits: decimal,
      maximumFractionDigits: decimal,
    })}`
  }
}
