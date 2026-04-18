import React, { useState } from 'react'
import {
  Alert,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
  Button,
} from '@mui/material'
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded'

import { useAuth } from '../../state/auth/authContext.js'
import { StatCard } from '../components/StatCard.jsx'
import { PageHero } from '../components/PageHero.jsx'
import { useSnackbar } from '../snackbarContext.js'

export function ProfilePage() {
  const auth = useAuth()
  const snackbar = useSnackbar()
  const [name, setName] = useState(auth.user?.name || '')
  const [email] = useState(auth.user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  return (
    <Stack spacing={3}>
      <PageHero
        eyebrow="Identity & Access"
        title="Account profile and security controls"
        description="Make user identity and credential management feel more appropriate for an enterprise workspace, with clearer ownership and security messaging."
        badges={[
          { label: email || 'No account email', color: 'primary' },
          { label: 'JWT-backed session flow', color: 'success' },
        ]}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <StatCard
            label="Profile owner"
            value={name || 'Unnamed user'}
            helper="Primary account display name"
            right={<ManageAccountsRoundedIcon />}
            tone="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            label="Identity"
            value={email || 'No email'}
            helper="Current sign-in address"
            right={<BadgeRoundedIcon />}
            tone="positive"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            label="Password policy"
            value="Min 8 chars"
            helper="Baseline client-side validation"
            right={<SecurityRoundedIcon />}
            tone="primary"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6">Profile details</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Keep personal information accurate so ownership and accountability remain clear.
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                {err ? <Alert severity="error">{err}</Alert> : null}
                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField label="Email" value={email} disabled />
                <Button
                  variant="contained"
                  disabled={busy}
                  onClick={async () => {
                    setErr('')
                    try {
                      setBusy(true)
                      await auth.updateProfile({ name })
                      snackbar.show('Profile updated', { severity: 'success' })
                    } catch (e) {
                      setErr(e.message || 'Update failed')
                    } finally {
                      setBusy(false)
                    }
                  }}
                >
                  Save changes
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6">Password management</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                In production this should pair with stronger policy checks, backend audit events, and
                forced session invalidation where required.
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <TextField
                  label="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type="password"
                />
                <TextField
                  label="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  helperText="Minimum 8 characters recommended."
                />
                <Button
                  variant="contained"
                  disabled={busy || !currentPassword || newPassword.length < 8}
                  onClick={async () => {
                    try {
                      setBusy(true)
                      await auth.changePassword({ currentPassword, newPassword })
                      snackbar.show('Password changed', { severity: 'success' })
                      setCurrentPassword('')
                      setNewPassword('')
                    } catch (e) {
                      snackbar.show(e.message || 'Change password failed', { severity: 'error' })
                    } finally {
                      setBusy(false)
                    }
                  }}
                >
                  Update password
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}
