import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
/*
  I removed StrictMode to avoid the useEffect to be called twice
<React.StrictMode>
    <App />
  </React.StrictMode>, */
  <App />
  )
