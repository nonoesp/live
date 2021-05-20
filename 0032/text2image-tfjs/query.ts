// Dependencies
const fs = require('fs');
const shell = require('shelljs');
const argv = require('yargs')
            .option('query', {
                alias: 'q',
                type: 'string',
                description: 'Image search query.',
                default: 'frog'
            })
            .option('dir', {
                alias: 'd',
                type: 'string',
                description: 'Directory of images to search for.',
                default: '/Users/nono/repos/Live/32/images-224x224/'
            })
            .argv;

console.log(`› Looking for an image of ${argv.query}..`);
console.log();

// Iterate through folder contents
const files = fs.readdirSync(argv.dir);
for (let fileName of files) {
    if (fileName.split('.json').length > 1) {
        const filePath = `${argv.dir}${fileName}`;
        const json = JSON.parse(fs.readFileSync(filePath, `utf-8`));
        const topPrediction = json.labels[0];

        if (topPrediction.split(argv.query).length > 1) {
            console.log(`› Found image of ${topPrediction}!`);
            console.log();
            const matchName = fileName.replace(`.json`, ``);
            console.log(`› ${matchName}`);

            const matchPath = `${argv.dir}${matchName}`
            shell.exec(`open ${matchPath}`);

            break;
        }
        // Read file contents in search of {query} labels
    }
}