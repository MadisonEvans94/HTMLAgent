import { ChatPane } from "./components/ChatPane";
import { GeneratedComponentPane } from "./components/GeneratedComponentPane";
import { MainLayout } from "./components/MainLayout";

function App() {

  return (
		<>
			<MainLayout>
				<GeneratedComponentPane />
				<ChatPane />
			</MainLayout>
		</>
  );
}

export default App
