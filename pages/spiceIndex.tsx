import Head from "next/head";
import React from "react";
import { Header, HeaderName, SkipToContent } from "carbon-components-react";
import { FlowSpace } from "./components/FlowSpace/FlowSpace";

const SpiceIndex = () => {
  return (
    <div className="app-container">
      <Head>
        <title>QC Spice</title>
      </Head>
      <main>
        <Header aria-label="Quantum Spice">
          <HeaderName href="#" prefix="Quantum">
            Spice
          </HeaderName>
        </Header>
        <FlowSpace />
      </main>
    </div>
  );
};

export default SpiceIndex;
