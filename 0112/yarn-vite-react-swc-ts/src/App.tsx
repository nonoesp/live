import { useState } from "react";
import "./App.css";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <div>
                <a
                    href='https://youtube.com/NonoMartinezAlonso'
                    target='_blank'
                >
                    <img
                        src={`https://nono.ma/img/u/profile-nono-ma.jpg`}
                        className='logo'
                    />
                </a>
            </div>
            <h1>Creative AI & Coding</h1>
            <div className='card'>
                <button onClick={() => setCount((count) => count + 1)}>
                    {count} {count === 1 ? `click` : `clicks`}
                </button>
                <p>A thing by Nono Martínez Alonso.</p>
            </div>
            <p className='read-the-docs'>
                Built during{" "}
                <a href='https://nono.ma/live/112' target='_blank'>
                    Live 112
                </a>
                .
            </p>
        </>
    );
}

export default App;
