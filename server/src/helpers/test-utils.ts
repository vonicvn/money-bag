import { IPartner, Partner, PartnerContext, IPartnerContext } from '../global'

export class TestUtils {
  public static getTestTitle(filename: string) {
    const skipText = filename.includes('src') ? 'src' : 'dist'
    const startIndex = filename.indexOf(skipText) + skipText.length
    return filename.substring(startIndex, filename.length - '.test.ts'.length)
  }
}

export class TestPartnerContextBuilder {
  private partner: Partial<IPartner>

  static create(partnerInput: Partial<IPartner>) {
    return new TestPartnerContextBuilder().create(partnerInput)
  }

  create(partnerInput: Partial<IPartner>) {
    const defaultPartner = {
      name: 'Testing Partner',
    }
    this.partner = { ...defaultPartner, ...partnerInput }
    return this.save()
  }

  private async save(): Promise<IPartnerContext> {
    const partner = await Partner.create(this.partner)
    return new PartnerContext(partner)
  }
}
