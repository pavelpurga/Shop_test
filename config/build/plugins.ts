import { visualizer } from 'rollup-plugin-visualizer'

export const buildPlugins = [
  visualizer({ filename: 'dist/bundle-report.html', open: false })
]

