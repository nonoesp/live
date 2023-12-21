import React from "react";
import { renderToString } from "react-dom/server";

const Component = () => {
    const child = <p>Some text</p>;

    return <div>{child}</div>;
};

const output = renderToString(<Component />);

console.log(output);
