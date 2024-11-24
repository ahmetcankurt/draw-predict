import React, { memo } from "react";
import Particles from "@tsparticles/react";

const MemoizedParticles = memo(({ options }) => {
  return <Particles className="particles-container" options={options} />;
});

export default MemoizedParticles;
