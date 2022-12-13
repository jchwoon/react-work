import Home from "./Component/Home";
import { PlanProvider } from "./store/plan-context";

function App() {
  return (
    <PlanProvider>
      <Home />
    </PlanProvider>
  );
}

export default App;
