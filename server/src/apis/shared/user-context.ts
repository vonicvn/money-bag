import { trim, last } from 'lodash'
import { exists, JWT, IRequest, IUser, User } from '../../global'

export interface IUserContext {
  readonly isUser: boolean
  readonly user: IUser
}

export class UserContext implements IUserContext {
  constructor(public readonly user: IUser = null) {}

  get isUser() { return exists(this.user) }
}

export class UserContextManager {
  public static async getUserContext(req: IRequest): Promise<IUserContext> {
    try {
      const token = this.getToken(req)
      const { id } = await JWT.verifyToken<{ id: number }>(token)
      const user = await User.findById(id)
      return new UserContext(user)
    } catch (error) {
      return new UserContext()
    }
  }

  private static getToken(req: IRequest) {
    const { authorization } = req.headers
    const SPACE = ' '
    return last(trim(authorization).split(SPACE))
  }
}
