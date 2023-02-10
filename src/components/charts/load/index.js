import React from "react";
import { Theme } from "@mui/material";

const Progress_bar = ({ bgcolor, progress, height, name }) => {

   

  const Parentdiv = {
    height: height,
    width: "100%",
    backgroundColor: "whitesmoke",
    borderRadius: 40,
    margin: 3,
   


  };

  const Childdiv = {
    height: "100%",
    backgroundColor: bgcolor,
    borderRadius: 40,
    textAlign: "left",
    maxWidth: `${progress}%`,
  };

  const progresstext = {
    paddingLeft:10,
    color: "white",
    fontWeight: 900,
    textAlign: "center",
    display:"flex",
  
    
  };

  return (
    <div style={Parentdiv}>
      <div style={Childdiv}>
        <span style={progresstext}>
         {`${progress}%`}
        </span>
      </div>
    </div>
  );
};

export default Progress_bar;
