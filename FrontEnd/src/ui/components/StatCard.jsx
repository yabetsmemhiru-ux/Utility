import React from 'react'
import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

export function StatCard({ label, value, helper, right, tone = 'primary' }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: (t) => {
            const paletteKey =
              tone === 'warning' ? 'warning' : tone === 'positive' ? 'success' : 'primary'
            return `linear-gradient(135deg, ${alpha(t.palette[paletteKey].main, t.palette.mode === 'dark' ? 0.16 : 0.08)} 0%, transparent 58%)`
          },
          pointerEvents: 'none',
        },
      }}
    >
      <CardContent sx={{ py: 2.5, position: 'relative' }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: 1.1, fontWeight: 700 }}
            >
              {label}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.75 }}>
              {value}
            </Typography>
            {helper ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {helper}
              </Typography>
            ) : null}
          </Box>
          <Box
            sx={{
              minWidth: 44,
              minHeight: 44,
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              color: (t) =>
                tone === 'warning'
                  ? t.palette.warning.main
                  : tone === 'positive'
                    ? t.palette.success.main
                    : t.palette.primary.main,
              backgroundColor: (t) => {
                const paletteKey =
                  tone === 'warning' ? 'warning' : tone === 'positive' ? 'success' : 'primary'
                return alpha(
                  t.palette[paletteKey].main,
                  t.palette.mode === 'dark' ? 0.16 : 0.1,
                )
              },
            }}
          >
            {right ?? null}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

