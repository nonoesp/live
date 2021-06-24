import Parser from 'rss-parser';
import * as async from 'async';
import * as https from 'https';
import * as fs from 'fs';

const OUTPUT_DIR = '/Users/nono/Desktop/images/';
const IMAGE_SIZE = 2500;

type CustomFeed = {foo: string};
type CustomItem = {
    'media:content': string;
    'media:square': any;
};

const parser: Parser<CustomFeed, CustomItem> = new Parser({
    customFields: {
        feed: [/*'foo'*/],
        item: [
            'media:content',
            'media:square',
        ],
    }
});

(async () => {
    const feed = await parser.parseURL(`https://nono.ma/sketch.xml`);
    console.log(`Reading ${feed.title} feed..`);
    console.log(`Downloading ${feed.items.length} images..`);

    let i = 0;
    feed.items.reverse().forEach(item => {
            const Url = item['media:square'].$.url.split(`2048`).join(IMAGE_SIZE);
            const slug = item.title?.toLowerCase()
                .split(' ').join('-')
                .split('?').join('')
                .split(':').join('-')
                .split('--').join('-');
            const paddedIndex = `${i+1}`.padStart(3, '0');
            const Filename = `${paddedIndex}-${slug}.jpg`;
            
            // Add images to download queue
            q.push({Url, Filename});
        i++;
    });
})();

type ImageTask = {
    Url: string;
    Filename: string;
};

const downloadFileFromUrl = (task: ImageTask, dir: string, callback: Function) => {

    console.log(`Downloading ${task.Filename}..`);

    const file = fs.createWriteStream(`${dir}/${task.Filename}`);
    const request = https.get(task.Url, (response) => {
        response.pipe(file);
        callback();
    })
};

var q = async.queue(function(task: ImageTask, callback: Function) {
    downloadFileFromUrl(task, OUTPUT_DIR, () => {
        callback();
    });
}, 10);

q.drain(function() {
    console.log('All images have been downloaded!');
})

q.error(function(err, task) {
    console.error('Task experienced an error.');
});