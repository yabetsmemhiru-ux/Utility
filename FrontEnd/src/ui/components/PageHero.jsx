import React from 'react'
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

export function PageHero({ eyebrow, title, description, badges = [], actions }) {
  return (
    <Card
      variant="outlined"
      sx={{
        overflow: 'hidden',
        position: 'relative',
        background: (t) => t.custom.gradients.hero,
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: (t) =>
            `linear-gradient(135deg, ${alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.14 : 0.08)} 0%, transparent 58%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <CardContent sx={{ position: 'relative' }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', md: 'flex-start' }}
            spacing={2}
          >
            <Box sx={{ maxWidth: 760 }}>
              {eyebrow ? (
                <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700 }}>
                  {eyebrow}
                </Typography>
              ) : null}
              <Typography variant="h4" sx={{ mt: 0.25 }}>
                {title}
              </Typography>
              {description ? (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  {description}
                </Typography>
              ) : null}
            </Box>
            {actions ? <Box>{actions}</Box> : null}
          </Stack>

          {badges.length ? (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} flexWrap="wrap">
              {badges.map((badge) => (
                <Chip
                  key={badge.label}
                  label={badge.label}
                  color={badge.color || 'primary'}
                  variant="outlined"
                />
              ))}
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  )
}
