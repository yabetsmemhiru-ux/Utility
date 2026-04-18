import React, { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
  Alert,
  Box,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded'

import { expensesApi } from '../../api/expensesApi.js'
import { StatCard } from '../components/StatCard.jsx'
import { PageHero } from '../components/PageHero.jsx'
import { useSnackbar } from '../snackbarContext.js'
import { formatCurrency } from '../../utils/currency.js'

const CATEGORIES = ['Food', 'Transport', 'Rent', 'Utilities', 'Shopping', 'Health', 'Other']

function sum(rows) {
  return rows.reduce((acc, row) => acc + Number(row.amount || 0), 0)
}

function ExpenseDialog({ open, onClose, initial, onSave }) {
  const snackbar = useSnackbar()
  const [amount, setAmount] = useState(initial?.amount ?? '')
  const [category, setCategory] = useState(initial?.category ?? 'Food')
  const [date, setDate] = useState(initial?.date ?? dayjs().format('YYYY-MM-DD'))
  const [description, setDescription] = useState(initial?.description ?? '')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setAmount(initial?.amount ?? '')
    setCategory(initial?.category ?? 'Food')
    setDate(initial?.date ?? dayjs().format('YYYY-MM-DD'))
    setDescription(initial?.description ?? '')
  }, [open, initial])

  const canSave = Number(amount) > 0 && category && date

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial?.id ? 'Edit expense' : 'Add expense'}</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            helperText="Use a decimal amount in ETB."
          />
          <TextField
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((categoryOption) => (
              <MenuItem key={categoryOption} value={categoryOption}>
                {categoryOption}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={2}
            helperText="Add context so finance and operations teams can review later."
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={busy || !canSave}
          onClick={async () => {
            try {
              setBusy(true)
              await onSave({
                ...initial,
                amount: Number(amount),
                category,
                date,
                description,
              })
            } catch (e) {
              snackbar.show(e.message || 'Failed to save', { severity: 'error' })
            } finally {
              setBusy(false)
            }
          }}
        >
          Save record
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function ExpensesPage() {
  const snackbar = useSnackbar()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filterCategory, setFilterCategory] = useState('All')

  async function refresh() {
    try {
      setLoading(true)
      const data = await expensesApi.list({ from: dayjs().startOf('month').format('YYYY-MM-DD') })
      setRows(data)
    } catch (e) {
      snackbar.show(e.message || 'Failed to load expenses', { severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const next = filterCategory === 'All' ? rows : rows.filter((row) => row.category === filterCategory)
    return [...next].sort((a, b) => b.date.localeCompare(a.date))
  }, [rows, filterCategory])

  const monthTotal = useMemo(() => sum(filtered), [filtered])
  const transactionCount = filtered.length
  const averageSpend = transactionCount ? monthTotal / transactionCount : 0
  const latestEntry = filtered[0]?.date || 'No records yet'

  return (
    <Stack spacing={3}>
      <PageHero
        eyebrow="Expense Operations"
        title="Operational expense ledger"
        description="Review, filter, and maintain current-month expense records in a format that is easier for finance, audit, and team leads to scan."
        badges={[
          { label: `${transactionCount} transactions in scope`, color: 'primary' },
          { label: `Latest entry: ${latestEntry}`, color: 'success' },
        ]}
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <TextField
              select
              label="Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              size="small"
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="All">All categories</MenuItem>
              {CATEGORIES.map((categoryOption) => (
                <MenuItem key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditing(null)
                setDialogOpen(true)
              }}
            >
              New expense
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <StatCard
            label="Filtered spend"
            value={formatCurrency(monthTotal)}
            helper="Current month total after active filters"
            right={<AccountBalanceWalletRoundedIcon />}
            tone="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            label="Transactions"
            value={String(transactionCount)}
            helper="Rows available for review"
            right={<ReceiptLongRoundedIcon />}
            tone="positive"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            label="Average entry"
            value={formatCurrency(averageSpend)}
            helper="Mean amount per transaction"
            right={<AssessmentRoundedIcon />}
            tone="primary"
          />
        </Grid>
      </Grid>

      {loading ? <Alert severity="info">Loading expense records...</Alert> : null}

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6">Expense register</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Structured for quick reconciliation, lightweight oversight, and clear row-level actions.
              </Typography>
            </Box>

            {filtered.length === 0 ? (
              <Alert severity="info">
                No expenses match the current view. Adjust the category filter or add a new entry.
              </Alert>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((row, index) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          '&:last-child td': { borderBottom: 'none' },
                        }}
                      >
                        <TableCell sx={{ minWidth: 120 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {dayjs(row.date).format('MMM D, YYYY')}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ minWidth: 130 }}>
                          <Chip size="small" label={row.category} />
                        </TableCell>
                        <TableCell sx={{ minWidth: 260 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {row.description || 'No description provided'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Record #{String(index + 1).padStart(2, '0')}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ minWidth: 120 }}>
                          <Typography sx={{ fontWeight: 700 }}>{formatCurrency(row.amount)}</Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ minWidth: 120 }}>
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <IconButton
                              aria-label="Edit"
                              onClick={() => {
                                setEditing(row)
                                setDialogOpen(true)
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="Delete"
                              onClick={async () => {
                                if (!confirm('Delete this expense?')) return
                                try {
                                  await expensesApi.remove(row.id)
                                  snackbar.show('Expense deleted', { severity: 'success' })
                                  refresh()
                                } catch (e) {
                                  snackbar.show(e.message || 'Failed to delete', {
                                    severity: 'error',
                                  })
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Divider />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Review tip: descriptions and categories are what make this table useful during audit and weekly finance review.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Scope: current month, sorted newest to oldest
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <ExpenseDialog
        open={dialogOpen}
        initial={editing}
        onClose={() => setDialogOpen(false)}
        onSave={async (payload) => {
          await expensesApi.upsert(payload)
          snackbar.show('Expense saved', { severity: 'success' })
          setDialogOpen(false)
          refresh()
        }}
      />
    </Stack>
  )
}
