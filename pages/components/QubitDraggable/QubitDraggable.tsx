import { DragEvent } from "react";

interface QubitProps {
  compType: string;
  compName: string;
  isSubsystem: boolean;
  dragStart: (event: DragEvent, nodeType: string) => void;
}

export const QubitComponent = (props: QubitProps) => {
  // if (!props.isSubsystem)
  return (
    <>
      <div
        className="dndnode"
        draggable
        onDragStart={(event: DragEvent) => {
          console.log("drag start");
          props.dragStart(event, props.compType);
        }}
      >
        {props.compName}
      </div>
    </>
  );

  // return <></>;
};
