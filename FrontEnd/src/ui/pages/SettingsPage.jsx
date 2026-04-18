import React, { useState } from 'react'
import { Box, Card, CardContent, Divider, Stack, Switch, Typography } from '@mui/material'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import PolicyRoundedIcon from '@mui/icons-material/PolicyRounded'

import { useAuth } from '../../state/auth/authContext.js'
import { PageHero } from '../components/PageHero.jsx'
import { StatCard } from '../components/StatCard.jsx'

export function SettingsPage() {
  const { colorMode } = useAuth()
  const isDark = colorMode.mode === 'dark'
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [auditHints, setAuditHints] = useState(true)

  return (
    <Stack spacing={3}>
      <PageHero
        eyebrow="Workspace Settings"
        title="Appearance, notification, and governance preferences"
        description="Enterprise-ready interfaces expose the settings that teams expect to review regularly, with clearer grouping and more explicit intent."
        badges={[
          { label: isDark ? 'Dark mode active' : 'Light mode active', color: 'primary' },
          { label: auditHints ? 'Audit hints enabled' : 'Audit hints disabled', color: 'success' },
        ]}
      />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Box sx={{ flex: 1 }}>
          <StatCard
            label="Appearance"
            value={isDark ? 'Dark' : 'Light'}
            helper="Current workspace theme"
            right={<TuneRoundedIcon />}
            tone="primary"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <StatCard
            label="Notifications"
            value={emailAlerts ? 'Active' : 'Muted'}
            helper="Email budget alert state"
            right={<NotificationsActiveRoundedIcon />}
            tone={emailAlerts ? 'positive' : 'warning'}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <StatCard
            label="Governance"
            value={auditHints ? 'Visible' : 'Hidden'}
            helper="Operational guidance in the UI"
            right={<PolicyRoundedIcon />}
            tone="primary"
          />
        </Box>
      </Stack>

      <Card variant="outlined" sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}
          >
            Appearance
          </Typography>
        </Box>
        <Divider />
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Dark Mode
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toggle the workspace between light and dark presentation modes.
              </Typography>
            </Box>
            <Switch checked={isDark} onChange={() => colorMode.toggle()} color="primary" />
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}
          >
            Notifications
          </Typography>
        </Box>
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Email Alerts
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Receive a signal when monthly budget thresholds are exceeded.
                </Typography>
              </Box>
              <Switch
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                color="primary"
              />
            </Stack>
            <Divider />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Weekly Digest
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Send a compact summary of expenses and budget posture each week.
                </Typography>
              </Box>
              <Switch
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                color="primary"
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}
          >
            Governance
          </Typography>
        </Box>
        <Divider />
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Audit Guidance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Keep operational hints visible to reinforce finance and security review habits.
              </Typography>
            </Box>
            <Switch
              checked={auditHints}
              onChange={(e) => setAuditHints(e.target.checked)}
              color="primary"
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
