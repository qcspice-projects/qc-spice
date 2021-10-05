import Head from "next/head"
import React from "react"
import { Header } from "carbon-components-react"
import { FlowSpace } from "./components/FlowSpace/FlowSpace"


const SpiceIndex = () => {
  return (
    <div className="app-container">
      <Head>
        <title>QC Spice</title>
      </Head>
      <main>
        <Header aria-label="QC Spice">
          QC Spice
        </Header>
        <FlowSpace />
      </main>
    </div>
  )
}

export default SpiceIndex
