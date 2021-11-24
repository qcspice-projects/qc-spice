import { DragEvent, MouseEvent, useState } from "react";
import styles from "./QubitDraggable.module.scss";

interface QubitProps {
  compType: string;
  compName: string;
  isSubsystem: boolean;
  dragStart: (event: DragEvent, nodeType: string) => void;
}

// TODO: needs to be a CustomNode type for ReactFlow
export const QubitComponent = (props: QubitProps) => {
  // if (!props.isSubsystem)
  // const [valueFieldVisible, setValueFieldVisible] = useState(false);

  // TODO: would single click or double click be better for this?
  // const onDblClick = (event: MouseEvent) => setValueFieldVisible(true);
  return (
    <>
      <div
        className={"dndnode " + styles.qubitComponent}
        draggable
        onDragStart={(event: DragEvent) => {
          console.log("drag start");
          props.dragStart(event, props.compType);
        }}
        // onDoubleClick={(event: MouseEvent) => onDblClick(event)}
      >
        {props.compName}
      </div>
    </>
  );

  // return <></>;
};
