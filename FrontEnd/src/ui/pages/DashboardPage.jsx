import React, { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded'
import TodayRoundedIcon from '@mui/icons-material/TodayRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { expensesApi } from '../../api/expensesApi.js'
import { budgetsApi } from '../../api/budgetsApi.js'
import { StatCard } from '../components/StatCard.jsx'
import { useSnackbar } from '../snackbarContext.js'
import { formatCurrency, formatCurrencyAxis } from '../../utils/currency.js'

function sum(rows) {
  return rows.reduce((acc, r) => acc + Number(r.amount || 0), 0)
}

function groupByDay(rows) {
  const map = new Map()
  for (const row of rows) {
    map.set(row.date, (map.get(row.date) ?? 0) + Number(row.amount || 0))
  }

  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, total]) => ({ date, total: Math.round(total * 100) / 100 }))
}

function groupByCategory(rows) {
  const map = new Map()
  for (const row of rows) {
    map.set(row.category, (map.get(row.category) ?? 0) + Number(row.amount || 0))
  }

  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value)
}

export function DashboardPage() {
  const theme = useTheme()
  const snackbar = useSnackbar()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const month = dayjs().format('YYYY-MM')
  const [budget, setBudget] = useState(null)
  const [budgetLimit, setBudgetLimit] = useState('')

  useEffect(() => {
    let mounted = true

    async function run() {
      try {
        setLoading(true)
        const [expenses, budgetResponse] = await Promise.all([
          expensesApi.list({ from: dayjs().startOf('month').format('YYYY-MM-DD') }),
          budgetsApi.getCurrent(month),
        ])

        if (!mounted) return

        setRows(expenses)
        setBudget(budgetResponse)
        setBudgetLimit(budgetResponse?.limit ? String(budgetResponse.limit) : '')
      } catch (e) {
        snackbar.show(e.message || 'Failed to load dashboard', { severity: 'error' })
      } finally {
        if (mounted) setLoading(false)
      }
    }

    run()

    return () => {
      mounted = false
    }
  }, [month, snackbar])

  const monthTotal = useMemo(() => sum(rows), [rows])
  const today = dayjs().format('YYYY-MM-DD')
  const todayTotal = useMemo(() => sum(rows.filter((row) => row.date === today)), [rows, today])
  const last7 = useMemo(() => {
    const from = dayjs().subtract(6, 'day').format('YYYY-MM-DD')
    return rows.filter((row) => row.date >= from)
  }, [rows])
  const last7Total = useMemo(() => sum(last7), [last7])
  const byDay = useMemo(() => groupByDay(last7), [last7])
  const byCategory = useMemo(() => groupByCategory(rows), [rows])
  const budgetExceeded = budget?.limit ? monthTotal > budget.limit : false
  const budgetProgress = budget?.limit ? Math.min((monthTotal / budget.limit) * 100, 100) : 0
  const remainingBudget = budget?.limit ? Math.max(budget.limit - monthTotal, 0) : 0
  const chartPalette = theme.custom.chartPalette
  const lineColor = theme.palette.primary.main
  const gridColor = alpha(theme.palette.text.secondary, 0.14)
  const heroTone = budgetExceeded ? 'warning' : budget?.limit ? 'success' : 'primary'
  const heroTitle = budgetExceeded
    ? 'Budget attention needed this month'
    : budget?.limit
      ? 'Spending is being tracked with healthy visibility'
      : 'Set a budget guardrail to unlock proactive guidance'
  const heroBody = budgetExceeded
    ? `Spending has moved past the current monthly target by ${formatCurrency(monthTotal - budget.limit)}.`
    : budget?.limit
      ? `${formatCurrency(remainingBudget)} remains before you reach the monthly limit.`
      : 'Add a monthly target below to monitor progress, trigger alerts, and make tradeoffs earlier.'

  return (
    <Stack spacing={3}>
      {loading ? <Alert severity="info">Loading dashboard...</Alert> : null}

      <Card
        variant="outlined"
        sx={{
          overflow: 'hidden',
          background: (t) =>
            heroTone === 'warning'
              ? `linear-gradient(135deg, ${alpha(t.palette.warning.main, t.palette.mode === 'dark' ? 0.16 : 0.12)} 0%, ${alpha(t.palette.secondary.main, t.palette.mode === 'dark' ? 0.12 : 0.08)} 100%)`
              : t.custom.gradients.hero,
        }}
      >
        <CardContent>
          <Grid container spacing={2.5} alignItems="stretch">
            <Grid item xs={12} lg={7}>
              <Stack spacing={1.5} sx={{ height: '100%', justifyContent: 'space-between' }}>
                <Box>
                  <Typography
                    variant="overline"
                    color={`${heroTone}.main`}
                    sx={{ fontWeight: 700 }}
                  >
                    {budgetExceeded
                      ? 'Immediate review suggested'
                      : budget?.limit
                        ? 'Operational confidence is active'
                        : 'Budget planning is ready'}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 0.5, maxWidth: 560 }}>
                    {heroTitle}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1.25, maxWidth: 620 }}>
                    {heroBody}
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Chip
                    color={budgetExceeded ? 'warning' : 'primary'}
                    variant="outlined"
                    label={`${rows.length} transactions this month`}
                  />
                  <Chip
                    color="success"
                    variant="outlined"
                    label={`${byCategory.length || 0} active categories`}
                  />
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} lg={5}>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={4} lg={12}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Month to date
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 0.75 }}>
                        {formatCurrency(monthTotal)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4} lg={12}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Budget status
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 0.75 }}>
                        {budget?.limit ? `${Math.round(budgetProgress)}% used` : 'Not set'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4} lg={12}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Today
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 0.75 }}>
                        {formatCurrency(todayTotal)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <StatCard
            label="This month"
            value={formatCurrency(monthTotal)}
            helper={dayjs().format('MMMM YYYY')}
            right={<SavingsRoundedIcon />}
            tone="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            label="Today"
            value={formatCurrency(todayTotal)}
            helper={dayjs(today).format('dddd, MMM D')}
            right={<TodayRoundedIcon />}
            tone="positive"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            label="Last 7 days"
            value={formatCurrency(last7Total)}
            helper="Rolling weekly spend"
            right={<TimelineRoundedIcon />}
            tone={budgetExceeded ? 'warning' : 'primary'}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Card variant="outlined" sx={{ height: 380 }}>
            <CardContent sx={{ height: '100%' }}>
              <Stack spacing={1.5} sx={{ height: '100%' }}>
                <Box>
                  <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700 }}>
                    Momentum
                  </Typography>
                  <Typography variant="h6">Daily spending trend</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Review the last seven days for acceleration, recovery, or unusual spikes.
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                  {byDay.length === 0 ? (
                    <Stack sx={{ height: '100%' }} justifyContent="center" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Add expenses to start building a short-term trend line.
                      </Typography>
                    </Stack>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={byDay}>
                        <CartesianGrid stroke={gridColor} vertical={false} />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value) => dayjs(value).format('MMM D')}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          tickFormatter={(value) => formatCurrencyAxis(value)}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(value) => formatCurrency(value)}
                          labelFormatter={(label) => dayjs(label).format('MMM D, YYYY')}
                        />
                        <Line
                          type="monotone"
                          dataKey="total"
                          stroke={lineColor}
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 0, fill: lineColor }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card variant="outlined" sx={{ height: 380 }}>
            <CardContent sx={{ height: '100%' }}>
              <Stack spacing={2} sx={{ height: '100%' }}>
                <Box>
                  <Typography variant="overline" color="success.main" sx={{ fontWeight: 700 }}>
                    Budget control
                  </Typography>
                  <Typography variant="h6">Monthly guardrail</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Keep one clear threshold so teams know when spending shifts from normal to review.
                  </Typography>
                </Box>

                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Chip
                      size="small"
                      color={budgetExceeded ? 'warning' : budget?.limit ? 'success' : 'primary'}
                      icon={
                        budgetExceeded ? <WarningAmberRoundedIcon /> : <CheckCircleRoundedIcon />
                      }
                      label={
                        budgetExceeded
                          ? 'Over limit'
                          : budget?.limit
                            ? 'On track'
                            : 'Awaiting target'
                      }
                    />
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={budget?.limit ? Math.max(6, budgetProgress) : 0}
                    color={budgetExceeded ? 'warning' : 'success'}
                    sx={{ mt: 1.25, height: 10, borderRadius: 999 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {budget?.limit
                      ? `${formatCurrency(monthTotal)} spent of ${formatCurrency(budget.limit)}`
                      : 'No monthly budget has been set yet.'}
                  </Typography>
                </Box>

                <Stack spacing={1.25}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Remaining
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {budget?.limit ? formatCurrency(remainingBudget) : '--'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Transactions
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {rows.length}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Categories tracked
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {byCategory.length}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row', lg: 'column' }} spacing={1.25}>
                  <TextField
                    label="Monthly limit"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    size="small"
                    inputMode="decimal"
                  />
                  <Button
                    variant="contained"
                    onClick={async () => {
                      try {
                        const limit = Number(budgetLimit)
                        if (!Number.isFinite(limit) || limit <= 0) {
                          snackbar.show('Enter a valid budget limit', { severity: 'warning' })
                          return
                        }
                        const next = await budgetsApi.setLimit({ month, limit })
                        setBudget(next)
                        snackbar.show('Budget saved', { severity: 'success' })
                      } catch (e) {
                        snackbar.show(e.message || 'Failed to save budget', {
                          severity: 'error',
                        })
                      }
                    }}
                  >
                    Save budget
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={5}>
          <Card variant="outlined" sx={{ height: 360 }}>
            <CardContent sx={{ height: '100%' }}>
              <Stack spacing={1.5} sx={{ height: '100%' }}>
                <Box>
                  <Typography variant="overline" color="secondary.main" sx={{ fontWeight: 700 }}>
                    Distribution
                  </Typography>
                  <Typography variant="h6">Category mix</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Spot concentration risk and recurring expense patterns by category.
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                  {byCategory.length === 0 ? (
                    <Stack sx={{ height: '100%' }} justifyContent="center" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Category data will appear here once expenses are added.
                      </Typography>
                    </Stack>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Pie
                          data={byCategory}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={70}
                          outerRadius={108}
                          paddingAngle={3}
                        >
                          {byCategory.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={chartPalette[index % chartPalette.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={7}>
          <Card variant="outlined" sx={{ height: 360 }}>
            <CardContent sx={{ height: '100%' }}>
              <Stack spacing={1.5} sx={{ height: '100%' }}>
                <Box>
                  <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700 }}>
                    Priorities
                  </Typography>
                  <Typography variant="h6">Top categories by spend</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use the highest-spend categories to guide optimizations and review habits.
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                  {byCategory.length === 0 ? (
                    <Stack sx={{ height: '100%' }} justifyContent="center" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        No category totals yet.
                      </Typography>
                    </Stack>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={byCategory.slice(0, 6)} layout="vertical" margin={{ left: 8 }}>
                        <CartesianGrid stroke={gridColor} horizontal={false} />
                        <XAxis
                          type="number"
                          tickFormatter={(value) => formatCurrencyAxis(value)}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={92}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar dataKey="value" radius={[0, 12, 12, 0]}>
                          {byCategory.slice(0, 6).map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={chartPalette[index % chartPalette.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}
