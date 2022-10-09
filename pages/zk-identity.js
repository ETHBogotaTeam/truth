import dynamic from "next/dynamic"
import React from "react"
const ZkIdentityComponent = dynamic(() => import("../components/ZkIdentity"), {
  ssr: false
})



export default function ZkIdentity() {

 
  return (
    <ZkIdentityComponent />
  );
};
