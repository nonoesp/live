
declare global {
    interface Window { ml5: typeof ml5; }
}
  
  export default function ml5() {

    let a : typeof ml5;

    console.log(`dynamic component`);
    console.log(window.ml5);

    return (
        <>
        Dynamic component
        </>
    )
}