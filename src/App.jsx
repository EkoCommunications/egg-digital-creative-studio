import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import MainContent from '@/components/layout/MainContent'

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-brand-bg">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  )
}
