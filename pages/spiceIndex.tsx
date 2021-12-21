import Head from "next/head";
import React from "react";

import { FlowSpace } from "./components/FlowSpace/FlowSpace";

const SpiceIndex = () => {
  return (
    <div className="app-container">
      <Head>
        <title>QC Spice</title>
      </Head>
      <main>
        <FlowSpace />
      </main>
    </div>
  );
};

export default SpiceIndex;
