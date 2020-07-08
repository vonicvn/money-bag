export class WalletService {
  public static isCreatingWallet = false

  async createWallet(partnerId: number, quantity: number) {
    if (WalletService.isCreatingWallet) throw new Error('SERVICE_NOT_AVAILABLE')
    await this.create(partnerId, quantity)
    WalletService.isCreatingWallet = false
  }

  async create(partnerId: number, quantity: number) {
    try {
      //
    } catch (error) {
      //
    }
  }
}
