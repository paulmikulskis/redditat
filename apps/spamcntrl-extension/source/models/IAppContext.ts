import { TStatus } from '.'
import { IDropdownMenuOption } from '../components/CDropdownButton'
import { INotifData, IUser, ISubscription } from '../models'

export default interface IAppContext {
  status: TStatus | null
  notify: (notifData: INotifData) => void | null
  user: IUser | null
  activeNavbarItem: IDropdownMenuOption | null
  setActiveNavbarKey: ((value: string) => void) | null
  setSubscription: ((subscription: ISubscription) => void) | null
}
