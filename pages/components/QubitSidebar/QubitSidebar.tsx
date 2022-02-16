import { DragEvent } from "react";
import { QubitComponentDrag } from "../QubitDraggable/QubitDraggable";

const onDragStart = (event: DragEvent, nodeType: string) => {
  console.log(event);
  console.log(nodeType);
  event.dataTransfer.setData("application/reactflow", nodeType);
  event.dataTransfer.effectAllowed = "move";
};

export const QubitSidebar = () => {
  return (
    <aside>
      <QubitComponentDrag
        compType="capacitor"
        compName="Capacitor"
        isSubsystem={false}
        dragStart={onDragStart}
      />
      <QubitComponentDrag
        compType="inductor"
        compName="Inductor"
        isSubsystem={false}
        dragStart={onDragStart}
      />
      <QubitComponentDrag
        compType="ground"
        compName="Ground"
        isSubsystem={false}
        dragStart={onDragStart}
      />
    </aside>
  );
};
