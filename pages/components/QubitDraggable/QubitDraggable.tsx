import { DragEvent, forwardRef, memo, MouseEvent, useState } from "react";
import Image from "next/image";
import { Handle, Position } from "react-flow-renderer";
import styles from "./QubitDraggable.module.scss";
import { Dropdown, TextInput, Tooltip } from "carbon-components-react";

interface QubitProps {
  compType: string;
  compName: string;
  isSubsystem: boolean;
  dragStart: (event: DragEvent, nodeType: string) => void;
}

// Custom node def
export const GroundNode = ({ data }) => {
  return (
    <>
      <div className={styles.qubitDraggable}>
        <Handle
          type="source"
          position={Position.Top}
          id={`${data.nodeId}_gnd`}
          style={{ height: "10px", width: "10px" }}
        />
        <Image src="/ground.svg" alt="Ground" height="100px" width="50px" />
      </div>
    </>
  );
};

export const InductorNode = ({ data }) => {
  const iconRef = forwardRef(() => (
    <Image src="/inductor.svg" alt="Inductor" height="50px" width="100px" />
  ));
  iconRef.displayName = "iconRef";
  return (
    <>
      <div className={styles.qubitDraggable}>
        <Handle
          type="source"
          position={Position.Left}
          id={`${data.nodeId}_1`}
          style={{ height: "10px", width: "10px" }}
        />
        <Tooltip
          showIcon={true}
          direction="right"
          focusTrap={true}
          renderIcon={iconRef}
        >
          <TextInput
            id="inductance"
            labelText="Inductance"
            onChange={data.onChange}
            value={data.value.inductance}
          />
          <Dropdown
            id="inductance_subsys"
            titleText="Subsystem"
            label="Subsystem options"
            items={["Subsystem1", "Subsystem2", "Subsystem3"]}
            selectedItem={data.subsystem}
            onChange={data.onDropdownChange}
          />
        </Tooltip>
        <Handle
          type="target"
          position={Position.Right}
          id={`${data.nodeId}_2`}
          style={{ height: "10px", width: "10px" }}
        />
      </div>
    </>
  );
};

export const CapacitorNode = ({ data }) => {
  const iconRef = forwardRef(() => (
    <Image src="/capacitor.svg" alt="Capacitor" height="50px" width="100px" />
  ));
  iconRef.displayName = "iconRef";
  return (
    <>
      <div className={styles.qubitDraggable}>
        <Handle
          type="source"
          position={Position.Left}
          id={`${data.nodeId}_1`}
          style={{ height: "10px", width: "10px" }}
        />
        <Tooltip
          showIcon={true}
          direction="right"
          focusTrap={true}
          renderIcon={iconRef}
        >
          <TextInput
            id="capacitance"
            labelText="Capacitance"
            onChange={data.onChange}
            value={data.value.capacitance}
          />
          <Dropdown
            id="capitance_subsys"
            titleText="Subsystem"
            label="Subsystem options"
            items={["Subsystem1", "Subsystem2", "Subsystem3"]}
            selectedItem={data.subsystem}
            onChange={data.onDropdownChange}
          />
        </Tooltip>
        <Handle
          type="target"
          position={Position.Right}
          id={`${data.nodeId}_2`}
          style={{ height: "10px", width: "10px" }}
        />
      </div>
    </>
  );
};

// TODO: use images
export const QubitComponentDrag = (props: QubitProps) => {
  return (
    <>
      <div
        className={"dndnode " + styles.qubitComponent}
        draggable
        onDragStart={(event: DragEvent) => {
          props.dragStart(event, props.compType);
        }}
      >
        {props.compName}
      </div>
    </>
  );
};
