import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { RequireAuth } from './routing/RequireAuth.jsx'
import { AppShell } from './ui/layout/AppShell.jsx'
import { LoginPage } from './ui/pages/auth/LoginPage.jsx'
import { RegisterPage } from './ui/pages/auth/RegisterPage.jsx'
import { ForgotPasswordPage } from './ui/pages/auth/ForgotPasswordPage.jsx'
import { ResetPasswordPage } from './ui/pages/auth/ResetPasswordPage.jsx'
import { DashboardPage } from './ui/pages/DashboardPage.jsx'
import { ExpensesPage } from './ui/pages/ExpensesPage.jsx'
import { AnalyticsPage } from './ui/pages/AnalyticsPage.jsx'
import { ProfilePage } from './ui/pages/ProfilePage.jsx'
import { VaultPage } from './ui/pages/VaultPage.jsx'
import { SettingsPage } from './ui/pages/SettingsPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        path="/app"
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="vault" element={<VaultPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  )
}
