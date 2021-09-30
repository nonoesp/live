import * as React from 'react';
import './App.css';
import { getStroke, getStrokePoints, getStrokeOutlinePoints } from 'perfect-freehand'

function App() {

  const [points, setPoints] = React.useState<number[][]>([])

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setPoints([[e.pageX, e.pageY, e.pressure]])
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (e.buttons !== 1) return
    setPoints([...points, [e.pageX, e.pageY, e.pressure]])
  }

  const stroke = getStroke(points, {
    size: 16,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  })

  const pathData = getSvgPathFromStroke(stroke);

  return (
      <svg
        id="svg"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        style={{
          position: `fixed`,
          top: 0,
          left: 0,
          width: `100%`,
          height: `100%`,
          backgroundColor: `plum`,
          touchAction: `none`
        }}
      >
        <path
          d={pathData}
          fill={`black`}
          strokeWidth={2}
        />
      </svg>
  );
}

function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return ''

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length]
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
      return acc
    },
    ['M', ...stroke[0], 'Q']
  )

  d.push('Z')
  return d.join(' ')
}

export default App;
