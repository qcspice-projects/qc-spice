import { useState, useRef, DragEvent } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Connection,
  Edge,
  removeElements,
  Elements,
  OnLoadParams,
  Node,
  ElementId,
  useStoreState,
  ReactFlowState,
} from "react-flow-renderer";
import {
  Header,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderName,
} from "carbon-components-react";
import { QOperation20 } from "@carbon/icons-react";
import { QubitSidebar } from "../QubitSidebar/QubitSidebar";
import styles from "./FlowSpace.module.scss";

// from ReactFlow examples
const initialElements = [
  {
    id: "1",
    type: "input", // input node
    data: { label: "Input Node" },
    position: { x: 250, y: 25 },
  },
  // default node
  {
    id: "2",
    // you can also pass a React component as a label
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: "3",
    type: "output", // output node
    data: { label: "Output Node" },
    position: { x: 250, y: 250 },
  },
  // animated edge
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3" },
];

let id = 0;
const getId = (): ElementId => `qubitnode_${id++}`;

// From example https://github.com/wbkd/react-flow/blob/main/example/src/DragNDrop/index.tsx
export const FlowSpace = () => {
  // const flowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
  const [elements, setElements] = useState<Elements>([]);

  const onConnect = (params: Connection | Edge) =>
    setElements((els) => addEdge(params, els));
  const onElementsRemove = (elementsToRemove: Elements) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onLoad = (_reactFlowInstance: OnLoadParams) =>
    setReactFlowInstance(_reactFlowInstance);

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const typeMap = (type: string) => {
    if (type === "gnd") return "output";
    return "default";
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();

    if (reactFlowInstance) {
      const type = event.dataTransfer.getData("application/reactflow");
      const position = reactFlowInstance.project({
        x: event.clientX,
        y: event.clientY - 40,
      });
      const newNode: Node = {
        id: getId(),
        type: typeMap(type),
        position,
        data: { label: `${type}` },
      };
      setElements((es) => es.concat(newNode));
    }
  };

  /* TODO: on clicking header button, put the arrays together and send them
     to server */
  const FormatGraph = () => {
    const nodes = useStoreState((state: ReactFlowState) => state.nodes);
    const edges = useStoreState((state: ReactFlowState) => state.edges);
    const combinedGraph: Array<Node<any> | Edge<any>> = [...nodes, ...edges];
    console.log(combinedGraph);
    return null;
  };

  return (
    <>
      <ReactFlowProvider>
        <Header aria-label="Quantum Spice">
          <HeaderName href="#" prefix="Quantum">
            Spice
          </HeaderName>
          <HeaderGlobalBar>
            <HeaderGlobalAction aria-label="Simulate" tooltipAlignment="end">
              <QOperation20 />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
        </Header>
        <div className={styles.qubitFlow}>
          <QubitSidebar />
          <div className={styles.qubitReactFlowWrapper}>
            <FormatGraph />
            <ReactFlow
              elements={elements}
              onConnect={onConnect}
              onElementsRemove={onElementsRemove}
              onLoad={onLoad}
              onDragOver={onDragOver}
              onDrop={onDrop}
            ></ReactFlow>
          </div>
        </div>
      </ReactFlowProvider>
    </>
  );
};
