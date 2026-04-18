import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material'

export function AuthLayout({ title, subtitle, children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 3, md: 4 },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: (t) => t.custom.gradients.hero,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.08fr 0.92fr' },
            gap: { xs: 2.5, md: 4 },
            alignItems: 'stretch',
          }}
        >
          <Card
            variant="outlined"
            sx={{
              minHeight: { md: 620 },
              background: (t) => t.custom.gradients.hero,
            }}
          >
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 4,
              }}
            >
              <Stack spacing={2.5}>
                <Chip
                  label="Designed for calm financial decision-making"
                  color="primary"
                  sx={{ alignSelf: 'flex-start' }}
                />
                <Stack spacing={1.5}>
                  <Typography variant="h3" sx={{ maxWidth: 520 }}>
                    Utility Management System
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
                    Trust-building blues guide the primary workflow, green confirms progress, and
                    amber draws attention only when action matters. The result is a more confident,
                    production-ready experience for daily operations.
                  </Typography>
                </Stack>
              </Stack>

              <Stack spacing={1.5}>
                {[
                  ['Budget visibility', 'See trends, category shifts, and limits before they become surprises.'],
                  ['Protected workflows', 'Keep secure records, account actions, and expense management in one place.'],
                  ['Focused actions', 'Use clear visual priority instead of noisy, competing colors.'],
                ].map(([heading, copy]) => (
                  <Box
                    key={heading}
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      border: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: (t) =>
                        t.palette.mode === 'dark'
                          ? 'rgba(8, 17, 29, 0.34)'
                          : 'rgba(255, 255, 255, 0.54)',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {heading}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {copy}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card
            variant="outlined"
            sx={{
              alignSelf: 'center',
              position: 'relative',
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700 }}>
                  Secure Access
                </Typography>
                <Typography variant="h4">{title}</Typography>
                {subtitle ? (
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                ) : null}
              </Stack>
              {children}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  )
}

