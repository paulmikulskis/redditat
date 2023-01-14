import React from 'react'

import { IAppContext, INotifData } from '../models'

export const AppContext: React.Context<IAppContext> =
  React.createContext<IAppContext>({
    status: null,
    notify: (notifData: INotifData) => {
      notifData
    },
    user: null,
    activeNavbarItem: null,
    setActiveNavbarKey: null,
    setSubscription: null,
  })
