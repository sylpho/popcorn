import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { Popcorn } from "./frame"
import { Panel } from "./panels/panel"

let rootFrame: ReactElement = <Popcorn.Frame><Panel></Panel></Popcorn.Frame>

ReactDOM.render(rootFrame, document.getElementById("root"));
