import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import Faq from './pages/Faq'
import Privacy from './pages/Privacy'
import Examples from './pages/Examples'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="how-it-works/" element={<HowItWorks />} />
          <Route path="examples" element={<Examples />} />
          <Route path="examples/" element={<Examples />} />
          <Route path="faq" element={<Faq />} />
          <Route path="faq/" element={<Faq />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="privacy/" element={<Privacy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
