import * as React from 'react'
import { Picture } from './components/picture'

function App(): JSX.Element {
    return (
        <div>
            <div className="wrapper">
            <h1>Hello, React! 🚀</h1>
                <p>We're coding live. 🙃</p>
                <Picture
                    title={`Zoom H6`}
                    image={`https://nono.imgix.net/img/u/sketch-210508-panaderos-zoom-recorder-h6.jpg?ar=16%3A9&fit=clamp&h=1600&ixlib=php-3.3.1&w=800&pad=1900`}
                />
                <Picture
                    title={`Sony a6500`}
                    image={`https://nono.imgix.net/img/u/sketch-210923-sony-alpha-6500-evil-mirrorless-camera-tripod-video-8-usb-cable.jpg?ar=16%3A9&fit=clamp&h=1600&ixlib=php-3.3.1&w=800&pad=1900`}
                />
                <Picture
                    title={`Out of Context`}
                    image={`https://nono.imgix.net/img/u/sketch-190419_london-british-museum-hoa-hokakanaia.jpg?ar=16%3A9&fit=clamp&h=1600&ixlib=php-3.3.1&w=800&pad=1900`}
                />
                <Picture
                    title={`Erythrina Caffra`}
                    image={`https://nono.imgix.net/img/u/sketch-190531_malaga-enrique-garcia-herrera-tree-erythrina-caffra.jpg?ar=16%3A9&fit=clamp&h=1600&ixlib=php-3.3.1&w=800&pad=1900`}
                />
            </div>
        </div>
    )
}

export default App;