import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import SplashScreen from './components/SplashScreen'

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SplashScreen />
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
