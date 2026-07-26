import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import Faq from './pages/Faq'
import Privacy from './pages/Privacy'
import Examples from './pages/Examples'
import TapChange from './pages/TapChange'
import { I18nProvider } from './i18n/context'
import './App.css'

const pageRoutes = (
  <>
    <Route index element={<Home />} />
    <Route path="how-it-works" element={<HowItWorks />} />
    <Route path="how-it-works/" element={<HowItWorks />} />
    <Route path="examples" element={<Examples />} />
    <Route path="examples/" element={<Examples />} />
    <Route path="tap-change" element={<TapChange />} />
    <Route path="tap-change/" element={<TapChange />} />
    <Route path="faq" element={<Faq />} />
    <Route path="faq/" element={<Faq />} />
    <Route path="privacy" element={<Privacy />} />
    <Route path="privacy/" element={<Privacy />} />
  </>
)

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <Routes>
          <Route element={<Layout />}>
            {pageRoutes}
            <Route path="en">{pageRoutes}</Route>
            <Route path="ko">{pageRoutes}</Route>
            <Route path="zh">{pageRoutes}</Route>
            <Route path="tr">{pageRoutes}</Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </I18nProvider>
    </BrowserRouter>
  )
}
