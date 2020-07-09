import { QueryBuilder } from 'knex'
import { Transaction, exists } from '../../../../global'
import { AbstractApiExcutor } from '../../../shared'
import { IInput, IOutput } from './metadata'

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process(): Promise<IOutput> {
    const transactions = await Transaction.findAll({}, builder => {
      this.getAllBuilder(builder)
      const { limit, page } = this.input
      return builder
        .offset((page - 1) * limit)
        .limit(limit)
        .orderBy('transactionId')
    })

    const total = await Transaction.count({}, this.getAllBuilder.bind(this))

    return {
      transactions,
      total,
    }
  }

  private getAllBuilder(builder: QueryBuilder) {
    const { fromTransactionId, assetId } = this.input
    builder
      .where('transactionId', '>=', fromTransactionId)
      .where({ partnerId: this.partnerContext.partner.partnerId })

    if (exists(assetId)) builder.where({ assetId })
    return builder
  }
}
