import React, { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import KeyIcon from '@mui/icons-material/Key'
import LockPersonRoundedIcon from '@mui/icons-material/LockPersonRounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import DnsRoundedIcon from '@mui/icons-material/DnsRounded'

import { vaultApi } from '../../api/vaultApi.js'
import { StatCard } from '../components/StatCard.jsx'
import { PageHero } from '../components/PageHero.jsx'
import { useSnackbar } from '../snackbarContext.js'

const TYPES = ['Bank', 'Card', 'ATM PIN', 'Password', 'Other']

function VaultDialog({ open, onClose, onSave }) {
  const [type, setType] = useState('Password')
  const [title, setTitle] = useState('')
  const [username, setUsername] = useState('')
  const [secret, setSecret] = useState('')
  const [notes, setNotes] = useState('')

  const canSave = title && secret

  if (!open) return null

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" keepMounted={false}>
      <DialogTitle>Add vault entry</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <TextField select label="Type" value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((entryType) => (
              <MenuItem key={entryType} value={entryType}>
                {entryType}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField
            label="Username (optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            helperText="This mock demonstrates a protected workflow, not production crypto."
          />
          <TextField
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            minRows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!canSave}
          onClick={() => onSave({ type, title, username, secret, notes })}
        >
          Save entry
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function MasterPasswordDialog({ open, onClose, onSet }) {
  const [masterPassword, setMasterPassword] = useState('')

  if (!open) return null

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" keepMounted={false}>
      <DialogTitle>Master password</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            This session master password gates reveal actions inside the mock vault flow. In a real
            enterprise setup, decryption would stay server-governed and audited.
          </Typography>
          <TextField
            label="Master password"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
            type="password"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={masterPassword.length < 4}
          onClick={() => onSet(masterPassword)}
        >
          Set for session
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function VaultPage() {
  const snackbar = useSnackbar()
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState([])
  const [addOpen, setAddOpen] = useState(false)
  const [masterOpen, setMasterOpen] = useState(false)
  const [revealed, setRevealed] = useState({})

  async function refresh() {
    try {
      setLoading(true)
      const data = await vaultApi.list()
      setRows(data)
    } catch (e) {
      snackbar.show(e.message || 'Failed to load vault', { severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const revealedCount = Object.keys(revealed).length
  const typesInUse = useMemo(() => new Set(rows.map((row) => row.type)).size, [rows])

  return (
    <Stack spacing={3}>
      <PageHero
        eyebrow="Secure Records"
        title="Credential and secret vault"
        description="Organize sensitive records in a layout that makes classification, access intent, and row-level actions easier to review."
        badges={[
          { label: `${rows.length} entries stored`, color: 'primary' },
          { label: `${revealedCount} revealed this session`, color: 'warning' },
        ]}
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="outlined" startIcon={<KeyIcon />} onClick={() => setMasterOpen(true)}>
              Master password
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
              Add entry
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <StatCard
            label="Protected entries"
            value={String(rows.length)}
            helper="Current inventory under vault management"
            right={<LockPersonRoundedIcon />}
            tone="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            label="Types in use"
            value={String(typesInUse)}
            helper="Coverage across credential categories"
            right={<DnsRoundedIcon />}
            tone="positive"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            label="Session reveals"
            value={String(revealedCount)}
            helper="Visible items during this active session"
            right={<ShieldRoundedIcon />}
            tone={revealedCount ? 'warning' : 'primary'}
          />
        </Grid>
      </Grid>

      {loading ? <Alert severity="info">Loading secure records...</Alert> : null}

      {rows.length === 0 && !loading ? (
        <Alert severity="info">
          No vault entries exist yet. Start with passwords, banking references, or ATM PIN records.
        </Alert>
      ) : null}

      <Grid container spacing={2}>
        {rows.map((row) => {
          const isRevealed = Boolean(revealed[row.id])
          return (
            <Grid item xs={12} md={6} lg={4} key={row.id}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent sx={{ height: '100%' }}>
                  <Stack spacing={1.5} sx={{ height: '100%' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Stack spacing={0.75}>
                        <Typography sx={{ fontWeight: 800 }}>{row.title}</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Chip size="small" label={row.type} color="primary" variant="outlined" />
                          <Chip
                            size="small"
                            label={isRevealed ? 'Revealed' : 'Encrypted'}
                            color={isRevealed ? 'warning' : 'success'}
                            variant="outlined"
                          />
                        </Stack>
                      </Stack>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          aria-label="Reveal"
                          onClick={async () => {
                            try {
                              const res = await vaultApi.reveal(row.id)
                              setRevealed((map) => ({ ...map, [row.id]: res.secret }))
                            } catch (e) {
                              snackbar.show(e.message || 'Reveal failed', { severity: 'error' })
                            }
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          aria-label="Delete"
                          onClick={async () => {
                            if (!confirm('Delete this vault entry?')) return
                            try {
                              await vaultApi.remove(row.id)
                              snackbar.show('Vault entry deleted', { severity: 'success' })
                              refresh()
                            } catch (e) {
                              snackbar.show(e.message || 'Delete failed', { severity: 'error' })
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </Stack>

                    <Divider />

                    <Stack spacing={0.75}>
                      <Typography variant="caption" color="text.secondary">
                        Username
                      </Typography>
                      <Typography variant="body2">
                        {row.username || 'Not specified'}
                      </Typography>
                    </Stack>

                    <Stack spacing={0.75}>
                      <Typography variant="caption" color="text.secondary">
                        Secret preview
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
                      >
                        {isRevealed ? revealed[row.id] : '******** (protected until reveal)'}
                      </Typography>
                    </Stack>

                    <Box sx={{ flexGrow: 1 }} />

                    <Stack spacing={0.75}>
                      <Typography variant="caption" color="text.secondary">
                        Notes
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {row.notes || 'No operational notes attached to this record.'}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <VaultDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={async (payload) => {
          try {
            await vaultApi.create(payload)
            snackbar.show('Vault entry saved', { severity: 'success' })
            setAddOpen(false)
            refresh()
          } catch (e) {
            snackbar.show(e.message || 'Save failed', { severity: 'error' })
          }
        }}
      />

      <MasterPasswordDialog
        open={masterOpen}
        onClose={() => setMasterOpen(false)}
        onSet={(masterPassword) => {
          vaultApi.setMasterPassword(masterPassword)
          snackbar.show('Master password set for this session', { severity: 'success' })
          setMasterOpen(false)
        }}
      />
    </Stack>
  )
}
