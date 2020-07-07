export class WalletService {
  public static isCreatingWallet = false

  async createWallet(partnerId: number, numberOfWallets: number) {
    if (WalletService.isCreatingWallet) throw new Error('SERVICE_NOT_AVAILABLE')
    await this.create(partnerId, numberOfWallets)
    WalletService.isCreatingWallet = false
  }

  async create(partnerId: number, numberOfWallets: number) {
    try {
      //
    } catch (error) {
      //
    }
  }
}
