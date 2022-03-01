import {
  useState,
  DragEvent,
  MouseEvent,
  KeyboardEvent,
  ChangeEvent,
  useEffect,
} from "react";
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
  Background,
  BackgroundVariant,
  FlowElement,
  ConnectionLineType,
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

// Types
interface ComponentValue {
  capacitance?: number | string | undefined;
  inductance?: number | string | undefined;
}

interface QComponent {
  label: string;
  type: string | undefined;
  terminals: Array<string>;
  value: ComponentValue;
  connections: Record<string, Array<string>>;
  subsystem?: string;
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
  const [activeElement, setActiveElement] = useState<FlowElement>(
    {} as FlowElement
  );
  const [activeElementValue, setActiveElementValue] = useState<number | string>(
    ""
  );
  const [valueChanged, setValueChanged] = useState<boolean>(false);
  const [activeElementSubsys, setActiveElementSubsys] = useState<string>("");
  const [subsysChanged, setSubsysChanged] = useState<boolean>(false);

  // Data representation of elements for sending to Metal
  const [components, setComponents] = useState<Record<string, QComponent>>({});

  useEffect(() => {
    if (subsysChanged) {
      const updatedElement = elements.map((el) => {
        if (el.id === activeElement.id) {
          return {
            ...el,
            data: { ...el.data, subsystem: activeElementSubsys },
          };
        }
        return el;
      });

      const updatedQComp = {
        ...components[activeElement.id],
        subsystem: activeElementSubsys,
      };
      const newQComps = { ...components, [activeElement.id]: updatedQComp };
      setElements(updatedElement);
      setComponents(newQComps);
      setSubsysChanged(false);
    }
  }, [subsysChanged, activeElementSubsys, setElements]);

  // useEffect
  // reference: https://codesandbox.io/s/rqf2q?file=/src/Flow.js
  useEffect(() => {
    if (valueChanged) {
      let newValue: ComponentValue = {};
      if (activeElement.type === "inductor")
        newValue = {
          capacitance: activeElement.data?.value.capacitance,
          inductance: activeElementValue,
        };
      if (activeElement.type === "capacitor")
        newValue = {
          capacitance: activeElementValue,
          inductance: activeElement.data?.value.inductance,
        };
      setActiveElement({
        ...activeElement,
        data: { ...activeElement.data, value: newValue },
      });
      console.log(activeElement);
      const updatedElement = elements.map((el) => {
        if (el.id === activeElement.id) {
          return { ...el, data: { ...el.data, value: newValue } };
        }
        return el;
      });
      setElements(updatedElement);
      updateQComponent(activeElement.id, newValue);
      setValueChanged(false);
    }
  }, [valueChanged, activeElementValue, setElements]);

  /**
   * Internal func:
   * -add node to ReactFlow space
   * -pass it the "createValue" function
   * -add node to QubitContext
   */
  const createNode = (nodeInfo: Node) => {
    const nodeTerminals =
      nodeInfo.type === "ground"
        ? [`${nodeInfo.id}_gnd`]
        : [`${nodeInfo.id}_1`, `${nodeInfo.id}_2`];
    const nodeConnections = nodeTerminals.reduce(
      (prev, curr) => ({ ...prev, [curr]: [] }),
      {}
    );
    const newNode: QComponent = {
      label: nodeInfo.data.label,
      type: nodeInfo.type,
      terminals: nodeTerminals,
      value: nodeInfo.data.value,
      connections: nodeConnections,
      subsystem: "Subsystem 1",
    };
    // setComponents((components) => ({ ...components, [nodeInfo.id]: newNode }));
    createQComponent(nodeInfo.id, newNode);
  };

  const onElementClick = (event: MouseEvent, element: FlowElement) => {
    if (element.type !== ConnectionLineType.Straight) {
      setActiveElement(element);
      setValueChanged(false);
      if (element.type === "inductor")
        setActiveElementValue(element.data.value.inductance);
      if (element.type === "capacitor")
        setActiveElementValue(element.data.value.capacitance);
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setActiveElementValue(e.target.value);
    setValueChanged(true);
  };

  const onDropdownChange = (e) => {
    // console.log(e);
    setActiveElementSubsys(e.selectedItem);
    setSubsysChanged(true);
  };

  const createQComponent = (nodeId: string, newNode: QComponent) => {
    setComponents((components) => ({ ...components, [nodeId]: newNode }));
  };

  const updateQComponent = (qId: string, newValue: ComponentValue) => {
    const updatedQComp = { ...components[qId], value: newValue };
    const newQComps = { ...components, [qId]: updatedQComp };
    setComponents(newQComps);
  };

  const connectQComponent = (params: Connection | Edge) => {
    // override types -- we won't be accepting null (null shouldn't appear from ReactFlow)
    const { source, sourceHandle, target, targetHandle } = params as {
      source: string;
      sourceHandle: string;
      target: string;
      targetHandle: string;
    };
    const sourceComp = components[source];
    const sourceConnections = sourceComp.connections;
    const targetComp = components[target];
    const targetConnections = targetComp.connections;
    // Add handle to connections
    // Convert connections to Set to remove duplicates
    // then convert Set back to Array
    // ...might consider just using a Set ?
    const newSConnections = Array.from(
      new Set([...sourceConnections[sourceHandle], targetHandle])
    );
    const newTConnections = Array.from(
      new Set([...targetConnections[targetHandle], sourceHandle])
    );
    const newSourceComp = {
      ...sourceComp,
      connections: {
        ...sourceConnections,
        [sourceHandle]: newSConnections,
      },
    };
    const newTargetComp = {
      ...targetComp,
      connections: {
        ...targetConnections,
        [targetHandle]: newTConnections,
      },
    };
    setComponents({
      ...components,
      [source]: newSourceComp,
      [target]: newTargetComp,
    });
  };

  const onConnect = (params: Connection | Edge) =>
    setElements((els) => {
      connectQComponent(params);
      return addEdge({ ...params, type: ConnectionLineType.Straight }, els);
    });
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

      // console.log(event.dataTransfer.dropEffect);
      // console.log(event.dataTransfer.effectAllowed);
      const newNodeId = getId(type);
      const newNode: Node = {
        id: newNodeId,
        type: type,
        position,
        data: {
          nodeId: newNodeId,
          label: `${type}`,
          value: { capacitance: 0, inductance: 0 },
          subsystem: "Subsystem 1",
          onChange: onInputChange,
          onDropdownChange: onDropdownChange,
        },
      };
      setElements((es) => es.concat(newNode));
      createNode(newNode);
    }
  };

  // Resets selected element when clicking on empty space.
  const onPaneClick = () => {
    setActiveElement({} as FlowElement);
    setActiveElementValue("");
  };

  return (
    <>
      <ReactFlowProvider>
        <QubitContext.Provider
          value={{
            components,
            // addComponent: createNode,
            // updateComponent: connectNode,
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
              <ReactFlow
                elements={elements}
                onConnect={onConnect}
                onElementsRemove={onElementsRemove}
                onElementClick={onElementClick}
                onPaneClick={onPaneClick}
                onLoad={onLoad}
                onDragOver={onDragOver}
                onDrop={onDrop}
                nodeTypes={customNodeTypes}
              >
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={20}
                  size={1}
                  color="#aaa"
                />
              </ReactFlow>
            </div>
          </div>
        </QubitContext.Provider>
      </ReactFlowProvider>
    </>
  );
};
