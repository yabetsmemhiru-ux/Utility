import React, { useCallback, useMemo, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'
import { SnackbarContext } from './snackbarContext.js'

export function SnackbarProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    message: '',
    severity: 'info',
  })

  const show = useCallback((message, opts = {}) => {
    setState({
      open: true,
      message,
      severity: opts.severity ?? 'info',
    })
  }, [])

  const api = useMemo(() => ({ show }), [show])

  return (
    <SnackbarContext.Provider value={api}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={3500}
        onClose={() => setState((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setState((s) => ({ ...s, open: false }))}
          severity={state.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

