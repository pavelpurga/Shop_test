export const terserOptions = {
  compress: {
    drop_console: true,
    drop_debugger: true,
    passes: 2,
  },
  mangle: true,
  format: {
    comments: false,
  },
}

