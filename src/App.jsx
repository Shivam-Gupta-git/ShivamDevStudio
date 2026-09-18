import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DashboardProvider } from './context/DashboardContext'
import Layout from './components/Layout'
import CodePracticePage from './pages/CodePracticePage'
import AdminPage from './pages/AdminPage'
import MockInterviewPage from './pages/MockInterviewPage'
import Toast from './components/Toast'
import CommandPalette from './components/CommandPalette'

function App() {
  return (
    <DashboardProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/practice" element={<CodePracticePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/interview" element={<MockInterviewPage />} />
        </Routes>
        <Toast />
        <CommandPalette />
      </BrowserRouter>
    </DashboardProvider>
  )
}

export default App
