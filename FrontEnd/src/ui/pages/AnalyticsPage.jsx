import React, { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import HubRoundedIcon from '@mui/icons-material/HubRounded'
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'
import DatasetLinkedRoundedIcon from '@mui/icons-material/DatasetLinkedRounded'
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded'
import { PowerBIEmbed } from 'powerbi-client-react'
import { models } from 'powerbi-client'

import { PageHero } from '../components/PageHero.jsx'
import { StatCard } from '../components/StatCard.jsx'

export function AnalyticsPage() {
  const [embedUrl, setEmbedUrl] = useState(import.meta.env.VITE_PBI_EMBED_URL || '')
  const [reportId, setReportId] = useState(import.meta.env.VITE_PBI_REPORT_ID || '')
  const [accessToken, setAccessToken] = useState(import.meta.env.VITE_PBI_ACCESS_TOKEN || '')

  const canEmbed = useMemo(
    () => Boolean(embedUrl && reportId && accessToken),
    [embedUrl, reportId, accessToken],
  )

  const readiness = {
    url: Boolean(embedUrl),
    report: Boolean(reportId),
    token: Boolean(accessToken),
  }

  const readyCount = Object.values(readiness).filter(Boolean).length

  return (
    <Stack spacing={3}>
      <PageHero
        eyebrow="Business Intelligence"
        title="Embedded analytics workspace"
        description="Present analytics in a more deployment-oriented layout with readiness checks, embed controls, and a clearer report surface."
        badges={[
          { label: `${readyCount}/3 embed requirements provided`, color: readyCount === 3 ? 'success' : 'warning' },
          { label: canEmbed ? 'Preview available' : 'Awaiting configuration', color: canEmbed ? 'success' : 'primary' },
        ]}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <StatCard
            label="Embed URL"
            value={readiness.url ? 'Ready' : 'Missing'}
            helper="Tenant-specific Power BI endpoint"
            right={<HubRoundedIcon />}
            tone={readiness.url ? 'positive' : 'warning'}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            label="Report ID"
            value={readiness.report ? 'Ready' : 'Missing'}
            helper="Unique report reference"
            right={<DatasetLinkedRoundedIcon />}
            tone={readiness.report ? 'positive' : 'warning'}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            label="Access token"
            value={readiness.token ? 'Ready' : 'Missing'}
            helper="Embed access credential"
            right={<VerifiedUserRoundedIcon />}
            tone={readiness.token ? 'positive' : 'warning'}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            label="Preview"
            value={canEmbed ? 'Enabled' : 'Blocked'}
            helper="Report canvas render state"
            right={<QueryStatsRoundedIcon />}
            tone={canEmbed ? 'positive' : 'primary'}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={4}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6">Embed configuration</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    In production, these values should come from a controlled backend flow rather than
                    being typed by end users.
                  </Typography>
                </Box>
                <TextField
                  label="Embed URL"
                  value={embedUrl}
                  onChange={(e) => setEmbedUrl(e.target.value)}
                />
                <TextField
                  label="Report ID"
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                />
                <TextField
                  label="Access token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  helperText="Use AAD-backed token generation on the server in real deployments."
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Card variant="outlined" sx={{ height: { xs: 520, md: 720 } }}>
            <CardContent sx={{ height: '100%' }}>
              {!canEmbed ? (
                <Stack spacing={2} sx={{ height: '100%', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <Typography variant="h5">Report preview is waiting for configuration</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Provide the embed URL, report ID, and access token to render the Power BI report
                    in this workspace.
                  </Typography>
                  <Alert severity="info" sx={{ maxWidth: 520 }}>
                    This screen is now structured like an analytics delivery surface: setup on the
                    left, validation at the top, and report canvas on the right.
                  </Alert>
                </Stack>
              ) : (
                <Box sx={{ height: '100%', width: '100%' }}>
                  <PowerBIEmbed
                    embedConfig={{
                      type: 'report',
                      id: reportId,
                      embedUrl,
                      accessToken,
                      tokenType: models.TokenType.Embed,
                      settings: {
                        panes: { filters: { expanded: false, visible: true } },
                        background: models.BackgroundType.Transparent,
                      },
                    }}
                    cssClassName="powerbi-embed"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}
