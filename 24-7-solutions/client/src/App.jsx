import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import WebyPage from './pages/WebyPage'
import HostingPage from './pages/HostingPage'
import WebAplikacePage from './pages/WebAplikacePage'
import JinePage from './pages/JinePage'
import KurzyPage from './pages/KurzyPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="weby" element={<WebyPage />} />
          <Route path="hosting" element={<HostingPage />} />
          <Route path="web-aplikace" element={<WebAplikacePage />} />
          <Route path="kurzy" element={<KurzyPage />} />
          <Route path="jine" element={<JinePage />} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
