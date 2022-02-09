import { useState, DragEvent, MouseEvent, KeyboardEvent, ChangeEvent, useEffect } from "react";
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
  Background,
  BackgroundVariant,
  FlowElement,
} from "react-flow-renderer";
import {
  Header,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderName,
} from "carbon-components-react";
import { QOperation20 } from "@carbon/icons-react";
import { QubitSidebar } from "../QubitSidebar/QubitSidebar";
import {
  GroundNode,
  CapacitorNode,
  InductorNode,
} from "../QubitDraggable/QubitDraggable";
import { QubitContext } from "../../context/qubitContext";
import styles from "./FlowSpace.module.scss";

// Type
interface ComponentValue {
  capacitance: number | string;
  inductance: number | string;
}

// TODO IMPORTANT: this file is so big...needs to be split

// TODO: not great way of generating ids
let capId = 0;
let indId = 0;
let gndId = 0;
let id = 0;
const getId = (nodeType: String): ElementId => {
  switch (nodeType) {
    case "capacitor":
      return `capacitor_${capId++}`;
    case "inductor":
      return `inductor_${indId++}`;
    case "ground":
      return `ground_${gndId++}`;
    default:
      return `qubitComp_${id++}`;
  }
};
const customNodeTypes = {
  ground: GroundNode,
  inductor: InductorNode,
  capacitor: CapacitorNode,
};

export const FlowSpace = () => {
  const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
  const [elements, setElements] = useState<Elements>([]);
  const [activeElement, setActiveElement] = useState<any>();
  const [activeElementValue, setActiveElementValue] = useState<ComponentValue>();

  // Context origin
  const [components, setComponents] = useState({});

  // UseEffects keep ReactFlow state in sync with data state (?)
  useEffect(() => {
    console.log(activeElementValue);

  }, [activeElementValue, setElements])

  /**
   * Internal func:
   * -add node to ReactFlow space
   * -pass it the "createValue" function
   * -add node to QubitContext
   */
  const createNode = (nodeInfo) => {
    const nodeTerminals =
      nodeInfo.type === "ground"
        ? ["gnd"]
        : [`${nodeInfo.id}_1`, `${nodeInfo.id}_2`];
    const newNode = {
      label: nodeInfo.data.label,
      type: nodeInfo.type,
      terminals: nodeTerminals,
      value: nodeInfo.data.value,
      connections: {},
    };
    setComponents((components) => ({ ...components, [nodeInfo.id]: newNode }));
  };

  const onElementClick = (event: MouseEvent, element: FlowElement) => {
    console.log(event);
    console.log(element);
    if (element.type !== "step") {
      setActiveElement(element);
      setActiveElementValue(element.data.value);
    }
  }

  // reference: https://codesandbox.io/s/rqf2q?file=/src/Flow.js
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.id);
    console.log(activeElementValue);
    if (e.target.id === "inductance") setActiveElementValue({...activeElementValue, inductance: e.target.value});
    if (e.target.id === "capacitance") setActiveElementValue({...activeElementValue, capacitance: e.target.value});
    // console.log(activeElement);
    // console.log(e);
    // setActiveElement((prevActiveEl) => ({...prevActiveEl, data: {...prevActiveEl.data, value: e.target.value}}));
    // console.log(activeElement);
    // const updatedElement = elements.map((el) => {
    //   if (el.id === activeElement.id) {
    //     return {...el, data: {...el.data, value: e.target.value}};
    //   }
    //   return el;
    // });

    // setElements(updatedElement);
  }

  /**
   * Internal func:
   * -when connecting nodes, look up id (is there a better way?)
   * -add connections to id's connections obj
   */
  const connectNode = (sourceNode, targetNode) => {};

  /**
   *
   *
  // //  */
  // const updateValue = (nodeId, newValue) => {
  //   // TODO: components is being saved as "at time" object
  //   // this should be a callback ?
  //   console.log(nodeId);
  //   console.log(components);
  //   const targetNode = components.nodeId;
  //   console.log(targetNode);
  //   const updatedNode = { ...targetNode, value: newValue };
  //   setComponents((components) => ({ ...components, [nodeId]: updatedNode }));
  // };

  const onConnect = (params: Connection | Edge) =>
    setElements((els) => addEdge({...params, type: "step"}, els));
  const onElementsRemove = (elementsToRemove: Elements) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onLoad = (_reactFlowInstance: OnLoadParams) =>
    setReactFlowInstance(_reactFlowInstance);

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();

    if (reactFlowInstance) {
      const type = event.dataTransfer.getData("application/reactflow");
      console.log(type);
      const position = reactFlowInstance.project({
        x: event.clientX,
        y: event.clientY - 40,
      });

      console.log(event.dataTransfer.dropEffect);
      console.log(event.dataTransfer.effectAllowed);
      const newNodeId = getId(type);
      const newNode: Node = {
        id: newNodeId,
        type: type,
        position,
        data: {
          nodeId: newNodeId,
          label: `${type}`,
          value: { capacitance: 0, inductance: 0 },
          onChange: onInputChange,
        },
      };
      setElements((es) => es.concat(newNode));
      createNode(newNode);
    }
  };

  // TODO: qubit data state needs to be managed separately from reactflow
  /**
   * format expected by function: object containing:
   * label
   * type
   * terminals
   * value
   * connections
   */

  /**
   * Translate state structure to graph for Metal
   */
  const formatGraph = () => {};

  return (
    <>
      <ReactFlowProvider>
        <QubitContext.Provider
          value={{
            components,
            addComponent: createNode,
            updateComponent: connectNode,
          }}
        >
          <Header aria-label="Quantum Spice">
            <HeaderName href="#" prefix="Quantum">
              Spice
            </HeaderName>
            <HeaderGlobalBar>
              <HeaderGlobalAction
                aria-label="Simulate"
                tooltipAlignment="end"
                onClick={() => {
                  console.log(components);
                }}
              >
                <QOperation20 />
              </HeaderGlobalAction>
            </HeaderGlobalBar>
          </Header>
          <div className={styles.qubitFlow}>
            <QubitSidebar />
            <div className={styles.qubitReactFlowWrapper}>
              {/* <FormatGraph /> */}
              <ReactFlow
                elements={elements}
                onConnect={onConnect}
                onElementsRemove={onElementsRemove}
                onElementClick={onElementClick}
                onLoad={onLoad}
                onDragOver={onDragOver}
                onDrop={onDrop}
                nodeTypes={customNodeTypes}
              >
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#aaa" />
              </ReactFlow>
            </div>
          </div>
        </QubitContext.Provider>
      </ReactFlowProvider>
    </>
  );
};
