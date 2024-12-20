import { useState } from 'react';
import { ChatPane } from './components/ChatPane';
import { GeneratedComponentPane } from './components/GeneratedComponentPane';
import { MainLayout } from './components/MainLayout';

function App() {
	const [htmlString, setHtmlString] = useState<string | null>(null);

	return (
		<MainLayout>
			<GeneratedComponentPane htmlString={htmlString} />
			<ChatPane onHTMLReceived={setHtmlString} />
		</MainLayout>
	);
}

export default App;
