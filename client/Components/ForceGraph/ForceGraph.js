import React, { useEffect } from "react";
import { runForceGraph } from "./ForceGraphGenerator";
import styles from "./forceGraph.module.css";
import * as d3 from "d3";

export function ForceGraph({
  skillsData,
  linksData,
  nodesData,
  nodeHoverTooltip,
  getNodeInfo,
  setActiveStyle,
  activeStyle,
  setRecipient,
  setIsChat,
}) {
  const containerRef = React.useRef(null);

  useEffect(() => {
    let destroyFn;

    d3.select("svg").remove();

    if (containerRef.current) {
      const { destroy } = runForceGraph(
        containerRef.current,
        linksData,
        nodesData,
        skillsData,
        nodeHoverTooltip,
        getNodeInfo,
        setActiveStyle,
        activeStyle,
        setRecipient,
        setIsChat
      );
      destroyFn = destroy;
    }

    return destroyFn;
  }, [linksData, nodesData]);

  return <div ref={containerRef} className={styles.container} />;
}
