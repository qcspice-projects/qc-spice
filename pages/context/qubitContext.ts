import { createContext } from "react";

export const QubitContext = createContext({
  components: {},
  // TODO: may be unnecessary ?
  // connections: {},
  addComponent: () => {},
  updateComponent: () => {}
});
