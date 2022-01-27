import fs from 'fs'
import esbuild from 'esbuild'
import serve, { error, log } from 'create-serve'
import cssModulesPlugin from 'esbuild-css-modules-plugin'

const isDevServer = process.argv.includes('--dev')
const isProduction = process.argv.includes('--prod')

if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist')
}

fs.copyFile('./src/index.html', './dist/index.html', (err) => {
    if (err) throw err
})

esbuild.build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    minify: isProduction,
    target: ['chrome58', 'firefox57', 'safari11', 'edge18'],
    outfile: 'dist/bundle.js',
    sourcemap: false,
    watch: isDevServer && {
        onRebuild: (err) => {
            serve.update()
            err ? error(`❌ Failed`) : log(`✅ Updated`)
        }
    },
    plugins: [
        cssModulesPlugin(),
    ]
}).catch(() => process.exit(1))

if (isDevServer) {
    serve.start({
        port: 5000,
        root: './dist',
        live: true,
    })
}