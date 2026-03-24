import React from 'react'
import { createRoot } from 'react-dom/client'
import Lab7 from './lab7'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element with id "root" was not found')
}

createRoot(rootElement).render(
  <React.StrictMode>
    <Lab7 />
  </React.StrictMode>
)
