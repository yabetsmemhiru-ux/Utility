import React, { useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'
import LogoutIcon from '@mui/icons-material/Logout'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import AddIcon from '@mui/icons-material/Add'
import SettingsIcon from '@mui/icons-material/Settings'
import { useAuth } from '../../state/auth/authContext.js'

const drawerWidth = 316

const navItems = [
  {
    section: 'Overview',
    label: 'Dashboard',
    path: '/app/dashboard',
    description: 'Live spending pulse and budget status',
    icon: <DashboardIcon />,
  },
  {
    section: 'Operations',
    label: 'Expenses',
    path: '/app/expenses',
    description: 'Capture and organize every transaction',
    icon: <ReceiptLongIcon />,
  },
  {
    section: 'Operations',
    label: 'Analytics',
    path: '/app/analytics',
    description: 'Connected reporting and embedded insights',
    icon: <QueryStatsIcon />,
  },
  {
    section: 'Administration',
    label: 'Profile',
    path: '/app/profile',
    description: 'Personal details and password controls',
    icon: <PersonIcon />,
  },
  {
    section: 'Administration',
    label: 'Secure Vault',
    path: '/app/vault',
    description: 'Protected storage for sensitive records',
    icon: <LockIcon />,
  },
  {
    section: 'Administration',
    label: 'Settings',
    path: '/app/settings',
    description: 'Appearance, alerts, and preferences',
    icon: <SettingsIcon />,
  },
]

function getActiveItem(pathname) {
  return navItems.find((item) => pathname.startsWith(item.path))
}

function getInitials(nameOrEmail) {
  if (!nameOrEmail) return 'U'
  const parts = nameOrEmail
    .split(/[.\s@_-]+/)
    .filter(Boolean)
    .slice(0, 2)

  if (!parts.length) return 'U'
  return parts.map((part) => part[0]?.toUpperCase() || '').join('')
}

function groupNavItems(items) {
  return items.reduce((acc, item) => {
    const section = item.section || 'Navigation'
    acc[section] = acc[section] || []
    acc[section].push(item)
    return acc
  }, {})
}

export function AppShell() {
  const auth = useAuth()
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeItem = useMemo(() => getActiveItem(location.pathname), [location.pathname])
  const title = activeItem?.label ?? 'Utility Management System'
  const description = activeItem?.description ?? 'Operational overview'
  const initials = useMemo(
    () => getInitials(auth.user?.name || auth.user?.email),
    [auth.user?.email, auth.user?.name],
  )
  const navSections = useMemo(() => groupNavItems(navItems), [])
  const drawer = (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: 'auto',
          pr: 0.75,
          mr: -0.75,
        }}
      >
        <Stack spacing={2.25}>
          {Object.entries(navSections).map(([section, items]) => (
            <Box key={section}>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.75,
                  mb: 0.75,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: 0.4,
                    textTransform: 'uppercase',
                    fontSize: 12,
                  }}
                >
                  {section}
                </Typography>
              </Box>
              <List disablePadding sx={{ display: 'grid', gap: 1 }}>
                {items.map((item) => {
                  const selected = location.pathname.startsWith(item.path)
                  return (
                    <ListItemButton
                      key={item.path}
                      selected={selected}
                      onClick={() => {
                        navigate(item.path)
                        setMobileOpen(false)
                      }}
                      sx={{
                        px: 1.5,
                        py: 1.25,
                        borderRadius: 3,
                        alignItems: 'flex-start',
                        border: '1px solid transparent',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 10,
                          bottom: 10,
                          width: 3,
                          borderRadius: 999,
                          backgroundColor: selected ? 'primary.main' : 'transparent',
                        },
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.12),
                          borderColor: alpha(theme.palette.primary.main, 0.26),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.16),
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 38,
                          mt: 0.15,
                          color: selected ? 'primary.main' : 'text.secondary',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        secondary={item.description}
                        primaryTypographyProps={{ fontWeight: 700, fontSize: 14 }}
                        secondaryTypographyProps={{
                          sx: { mt: 0.2, lineHeight: 1.35, fontSize: 12 },
                        }}
                      />
                    </ListItemButton>
                  )
                })}
              </List>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box sx={{ pt: 1.5, flexShrink: 0 }}>
        <Card variant="outlined" sx={{ p: 1.5 }}>
          <Stack spacing={1.25}>
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: alpha(theme.palette.primary.main, 0.14),
                  color: 'primary.main',
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                  {auth.user?.name || auth.user?.email || 'Authenticated user'}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {auth.user?.email || 'Workspace access enabled'}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={auth.colorMode.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                onClick={() => auth.colorMode.toggle()}
                sx={{ justifyContent: 'flex-start', flex: 1 }}
              >
                {auth.colorMode.mode === 'dark' ? 'Light mode' : 'Dark mode'}
              </Button>
              <Button
                variant="text"
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={() => {
                  auth.logout()
                  navigate('/login')
                }}
                sx={{
                  justifyContent: 'flex-start',
                  color: 'text.secondary',
                  flex: 1,
                }}
              >
                Sign out
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isDesktop ? (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              background: (t) => t.custom.gradients.shell,
              borderRight: 'none',
              boxShadow: (t) =>
                t.palette.mode === 'dark'
                  ? '12px 0 32px rgba(0, 0, 0, 0.16)'
                  : '10px 0 28px rgba(36, 86, 211, 0.08)',
            },
          }}
        >
          <Toolbar sx={{ minHeight: 28 }} />
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: 320,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              background: (t) => t.custom.gradients.shell,
              borderRight: 'none',
            },
          }}
        >
          <Toolbar sx={{ minHeight: 20 }} />
          {drawer}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          minHeight: '100vh',
          px: { xs: 2, md: 3.5 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Card
          variant="outlined"
          sx={{
            mb: 3,
            position: 'sticky',
            top: 16,
            zIndex: 5,
            background: (t) => t.custom.gradients.shell,
          }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: { xs: 2, md: 2.5 },
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
            }}
          >
            {!isDesktop ? (
              <Tooltip title="Open navigation" arrow>
                <IconButton color="inherit" onClick={() => setMobileOpen(true)}>
                  <MenuIcon />
                </IconButton>
              </Tooltip>
            ) : null}

            <Box sx={{ flexGrow: 1, minWidth: 240 }}>
              <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700 }}>
                {description}
              </Typography>
              <Typography variant="h4" sx={{ mt: 0.25 }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Signed in as {auth.user?.email ?? 'guest'}.
              </Typography>
            </Box>

            <Chip label="Protected workspace" color="success" variant="outlined" />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/app/expenses')}
              >
                Add expense
              </Button>
              <Button variant="contained" color="secondary" onClick={() => navigate('/app/vault')}>
                Open vault
              </Button>
            </Stack>
          </Box>
        </Card>

        <Box sx={{ pb: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
