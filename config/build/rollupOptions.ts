export const createRollupOptions = () => ({
  // don't mark react/react-dom as external so they are bundled into the final build
  output: {
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    manualChunks(id: string | undefined) {
      if (!id || !id.includes('node_modules')) return

      const scopedMatch = id.match(/node_modules[\/](?:@[^\/]+[\/][^\/]+)/)
      let pkg: string | null = null
      if (scopedMatch) {
          pkg = scopedMatch[0].split(/[\\/]/).slice(1).join('/')
      } else {
        const match = id.match(/node_modules[\\/]([^\/]+)/)
        if (match) pkg = match[1]
      }

      if (!pkg) return
      const name = pkg.replace('@', '').replace(/[\/]/g, '-')
      return `vendor-${name}`
    },
    chunkFileNames: 'assets/[name]-[hash].js',
  },
})
