import { useState } from "react";
import Buttons from "./Buttons";
import Display from "./Display";

function Calculator(){
  const [upper, setUpper]= useState("");
  const [lower, setLower]= useState("0");

  return(
    <div id="container">
      <Display lower={lower} upper={upper}/>
      <Buttons lower={lower} upper={upper} setUpper={setUpper} setLower={setLower}/>
    </div>
  );
}

export default Calculator