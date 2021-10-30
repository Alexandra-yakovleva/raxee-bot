import {User} from 'typegram'

export type MessageVariants = Array<(user: User) => string>
