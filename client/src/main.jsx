import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import App from './App.jsx'
import { CompareProvider } from './context/CompareContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './index.css'
import { persistor, store } from './redux/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ThemeProvider>
					<FavoritesProvider>
						<CompareProvider>
							<App />
						</CompareProvider>
					</FavoritesProvider>
				</ThemeProvider>
			</PersistGate>
		</Provider>
	</React.StrictMode>
)
