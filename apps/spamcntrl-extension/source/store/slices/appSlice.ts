import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { subDays, subHours } from 'date-fns'
import { useSelector } from 'react-redux'
import { RootState } from '..'
import { IDropdownMenuOption } from '../../components/CDropdownButton'
import { CLoaderProps } from '../../components/CLoader'
import CLNotification from '../../models/CLNotification'

interface AppSlice {
  loader: CLoaderProps
  navbarItems: IDropdownMenuOption[]
  navbarHiddenItems: IDropdownMenuOption[]
  navbarHiddenInsideItems: IDropdownMenuOption[]
  notifications: CLNotification[]
}

const defaultState: AppSlice = {
  loader: {
    show: false,
    title: '',
  },
  navbarItems: [
    {
      key: 'dashboard',
      title: 'Dashboard',
    },
    {
      key: 'purging',
      title: 'Purging',
    },
    {
      key: 'subscription',
      title: 'Payment & Subscription',
    },
  ],
  navbarHiddenItems: [
    {
      key: 'help',
      title: 'Help',
    },
    {
      key: 'notifications',
      title: 'Notifications',
    },
    {
      key: 'logout',
      title: 'Logout',
    },
  ],
  navbarHiddenInsideItems: [
    {
      key: 'purging-history',
      title: 'Purging History',
    },
    {
      key: 'my-videos',
      title: 'My Videos',
    },
    {
      key: 'schedule-purge',
      title: 'Schedule Purge',
    },
    {
      key: 'ongoing-purge',
      title: 'Ongoing Purge',
    },
    {
      key: 'my-playlist',
      title: 'My Playlist',
    },
    {
      key: 'create-playlist',
      title: 'Create Playlist',
    },
    {
      key: 'pricing-plan',
      title: 'Pricing Plan',
    },
    {
      key: 'single-purge',
      title: 'Single Purge',
    },
    {
      key: 'transaction-history',
      title: 'Transaction History',
    },
  ],
  notifications: [
    {
      date: subHours(new Date(), 3),
      title: 'You have successfully purchased pro plan.',
      content: 'Sample Content',
      linkTitle: 'Learn More',
      isRead: true,
    },
    {
      date: subDays(new Date(), 5),
      title: 'Your channel purge is done.',
      content: 'Sample Content',
      linkTitle: 'Check Results',
      isRead: false,
    },
    {
      date: subDays(new Date(), 8),
      title: 'Pro plan succesfully renewed.',
      content: 'Sample Content',
      linkTitle: 'Learn More',
      isRead: true,
    },
    {
      date: subDays(new Date(), 9),
      title: 'You have successfully purchased pro plan.',
      content: 'Sample Content',
      linkTitle: 'Learn More',
      isRead: true,
    },
    {
      date: subDays(new Date(), 10),
      title: 'Your single purchase is done.',
      content: 'Sample Content',
      linkTitle: 'Check Results',
      isRead: true,
    },
  ],
}

const modalSlice = createSlice({
  name: 'app',
  initialState: defaultState,
  reducers: {
    setLoader(state, action: PayloadAction<CLoaderProps>) {
      state.loader = action.payload
    },
    hideLoader(state) {
      state.loader = {
        show: false,
        title: '',
      }
    },
  },
})

export const { setLoader, hideLoader } = modalSlice.actions
export default modalSlice.reducer

export function getAllNavbarItems() {
  return useSelector((state: RootState) =>
    state.app.navbarItems
      .concat(state.app.navbarHiddenItems)
      .concat(state.app.navbarHiddenInsideItems)
  )
}

export function getNavbarItems() {
  return useSelector((state: RootState) => state.app.navbarItems)
}

export function getNavbarHiddenItems() {
  return useSelector((state: RootState) => state.app.navbarHiddenItems)
}

export function getNotifications() {
  return useSelector((state: RootState) => state.app.notifications)
}
