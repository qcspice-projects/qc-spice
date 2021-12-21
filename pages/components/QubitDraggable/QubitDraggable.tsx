import { DragEvent, memo, MouseEvent, useState } from "react";
import Image from "next/image";
import { Handle } from "react-flow-renderer";
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
        <Handle type="source" position="top" />
        <Image src="/ground.svg" alt="Ground" height="100px" width="50px" />
      </div>
    </>
  );
};

export const InductorNode = ({ data }) => {
  return (
    <>
      <div className={styles.qubitDraggable}>
        <Handle type="source" position="left" />
        <Tooltip
          showIcon={true}
          direction="right"
          renderIcon={() => (
            <Image
              src="/inductor.svg"
              alt="Inductor"
              height="50px"
              width="100px"
            />
          )}
        >
          <TextInput
            id="inductance"
            labelText="Inductance"
            onChange={(e) =>
              data.onChange(data.nodeId, {
                inductance: e.target.value,
                capacitance: null,
              })
            }
            value={data.value.inductance}
          />
        </Tooltip>
        <Handle type="target" position="right" />
      </div>
    </>
  );
};

export const CapacitorNode = ({ data }) => {
  return (
    <>
      <div className={styles.qubitDraggable}>
        <Handle type="source" position="left" />
        <Image
          src="/capacitor.svg"
          alt="Capacitor"
          height="50px"
          width="100px"
        />
        <Handle type="target" position="right" />
      </div>
    </>
  );
};

// TODO: this is the thing that'll be on the sidebar
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
