import dynamic from "next/dynamic"
import React from "react"
const  NoirComponent  = dynamic(() => import("../components/Noir.tsx"), {
  ssr: false
})


export default function Noir() {


  return (
    <NoirComponent />
  );
};


