import { DragEvent } from "react";
import { QubitComponent } from "../QubitDraggable/QubitDraggable";

const onDragStart = (event: DragEvent, nodeType: string) => {
  console.log(event);
  console.log(nodeType);
  event.dataTransfer.setData("application/reactflow", nodeType);
  event.dataTransfer.effectAllowed = "move";
};

export const QubitSidebar = () => {
  return (
    <aside>
      <QubitComponent
        compType="capacitor"
        compName="Capacitor"
        isSubsystem={false}
        dragStart={onDragStart}
      />
      <QubitComponent
        compType="inductor"
        compName="Inductor"
        isSubsystem={false}
        dragStart={onDragStart}
      />
      <QubitComponent
        compType="gnd"
        compName="Ground"
        isSubsystem={false}
        dragStart={onDragStart}
      />
      {/* <div className="dndnode" onDragStart={(event: DragEvent) => onDragStart(event, 'capacitor')}>Capacitor</div>
      <div className="dndnode" onDragStart={(event: DragEvent) => onDragStart(event, 'inductor')}>Inductor</div>
      <div className="dndnode output" onDragStart={(event: DragEvent) => onDragStart(event, 'ground')}>Ground</div> */}
    </aside>
  );
};
