export function createGradient(
  context,
  colors: { colorStart?: string; colorEnd?: string } = {}
) {
  let gradient = context.chart.ctx.createLinearGradient(
    0,
    0,
    context.chart.width,
    context.chart.height
  )

  gradient.addColorStop(0, colors.colorStart ?? 'rgba(255, 160, 128, 1)')
  gradient.addColorStop(1, colors.colorEnd ?? 'rgb(255, 62, 0)')

  return gradient
}
