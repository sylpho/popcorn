import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { Frame } from "./frame"
import { Panel } from "./panels/panel"

let rootFrame: ReactElement = <Frame><Panel></Panel></Frame>

ReactDOM.render(rootFrame, document.getElementById("root"));
