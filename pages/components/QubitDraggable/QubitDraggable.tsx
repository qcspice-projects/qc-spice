import { DragEvent, forwardRef, memo, MouseEvent, useState } from "react";
import Image from "next/image";
import { Handle, Position } from "react-flow-renderer";
import styles from "./QubitDraggable.module.scss";
import { TextInput, Tooltip } from "carbon-components-react";

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
        <Handle type="source" position={Position.Top} />
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
        <Handle type="source" position={Position.Left} />
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
        </Tooltip>
        <Handle type="target" position={Position.Right} />
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
        <Handle type="source" position={Position.Left} />
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
        </Tooltip>
        <Handle type="target" position={Position.Right} />
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
