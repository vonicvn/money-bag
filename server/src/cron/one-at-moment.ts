import { ErrorHandler } from '../global'

export abstract class OneAtMomemnt {
  public isRunning = false

  async process() {
    if (this.isRunning) return

    this.isRunning = true
    try {
      await this.do()
    } catch (error) {
      ErrorHandler.handle(error)
    }
    this.isRunning = false
  }

  abstract do(): Promise<void>
}
