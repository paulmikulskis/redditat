import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '../store/index'

import Popup from './Popup'

const container = document.getElementById('popup-root') as Element
const root = createRoot(container)
root.render(
  <Provider store={store}>
    <Popup />
  </Provider>
)
