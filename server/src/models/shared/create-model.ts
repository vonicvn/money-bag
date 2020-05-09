/* istanbul ignore file */
import { defaultTo, isNil } from 'lodash'
import Knex, { QueryBuilder, Transaction as KnexTransaction } from 'knex'
import { knex, exists } from '../../global'

interface IBuilderFunction {
  (queryBuilder: QueryBuilder): QueryBuilder
}

export const defaultBuilderFunction: IBuilderFunction = query => query

export function createModel<T>(tableName: string, primaryKey = `${tableName}Id`) {
  return class {
    static get knex(): QueryBuilder {
      return knex(tableName)
    }

    private static getParams(arg1?: KnexTransaction | IBuilderFunction, arg2?: IBuilderFunction): { trx: KnexTransaction | Knex, builder: IBuilderFunction } {
      if (exists(arg2)) return { trx: defaultTo(arg1 as KnexTransaction, knex), builder: arg2 }
      if (isNil(arg1)) return { trx: knex, builder: query => query }
      // tslint:disable-next-line: no-any
      const objectIsKnexTransaction = (obj: any) => exists(obj.with)
      if (objectIsKnexTransaction(arg1)) return { trx: arg1 as KnexTransaction, builder: query => query }
      return { trx: knex, builder: arg1 }
    }

    static async findById(id: number, builder?: IBuilderFunction): Promise<T>
    static async findById(id: number, trx?: KnexTransaction): Promise<T>
    static async findById(id: number, trx: KnexTransaction, builder?: IBuilderFunction): Promise<T>
    static async findById(id: number, arg1: KnexTransaction | IBuilderFunction, arg2?: IBuilderFunction): Promise<T> {
      const { trx, builder } = this.getParams(arg1, arg2)
      return builder(trx(tableName).first().where({ [primaryKey]: id }))
    }

    static async findOne(filter: Partial<T>, builder?: IBuilderFunction): Promise<T>
    static async findOne(filter: Partial<T>, trx?: KnexTransaction): Promise<T>
    static async findOne(filter: Partial<T>, trx: KnexTransaction, builder?: IBuilderFunction): Promise<T>
    static async findOne(filter: Partial<T>, arg1: KnexTransaction | IBuilderFunction, arg2?: IBuilderFunction): Promise<T> {
      const { trx, builder } = this.getParams(arg1, arg2)
      return builder(trx(tableName).first().where(filter))
    }

    static async findAll(filter: Partial<T>, builder?: IBuilderFunction): Promise<T[]>
    static async findAll(filter: Partial<T>, trx?: KnexTransaction): Promise<T[]>
    static async findAll(filter: Partial<T>, trx: KnexTransaction, builder?: IBuilderFunction): Promise<T[]>
    static async findAll(filter: Partial<T>, arg1: KnexTransaction | IBuilderFunction, arg2?: IBuilderFunction): Promise<T[]> {
      const { trx, builder } = this.getParams(arg1, arg2)
      return builder(trx(tableName).where(filter))

    }

    static async create(input: Partial<T>, builder?: IBuilderFunction): Promise<T>
    static async create(input: Partial<T>, trx?: KnexTransaction): Promise<T>
    static async create(input: Partial<T>, trx: KnexTransaction, builder?: IBuilderFunction): Promise<T>
    static async create(input: Partial<T>, arg1: KnexTransaction | IBuilderFunction, arg2?: IBuilderFunction): Promise<T> {
      const { trx, builder } = this.getParams(arg1, arg2)
      const [result] = await builder(trx(tableName).insert(input).returning('*'))
      return result
    }

    static async createMany(input: Partial<T>[], builder?: IBuilderFunction): Promise<T[]>
    static async createMany(input: Partial<T>[], trx?: KnexTransaction): Promise<T[]>
    static async createMany(input: Partial<T>[], trx: KnexTransaction, builder?: IBuilderFunction): Promise<T[]>
    static async createMany(input: Partial<T>[], arg1: KnexTransaction | IBuilderFunction, arg2?: IBuilderFunction): Promise<T[]> {
      const { trx, builder } = this.getParams(arg1, arg2)
      return builder(trx(tableName).insert(input).returning('*'))
    }

    static async findByIdAndUpdate(id: number, input: Partial<T>, builder?: IBuilderFunction): Promise<T>
    static async findByIdAndUpdate(id: number, input: Partial<T>, trx?: KnexTransaction): Promise<T>
    static async findByIdAndUpdate(id: number, input: Partial<T>, trx: KnexTransaction, builder?: IBuilderFunction): Promise<T>
    static async findByIdAndUpdate(id: number, input: Partial<T>, arg1: KnexTransaction | IBuilderFunction, arg2?: IBuilderFunction): Promise<T> {
      const { trx, builder } = this.getParams(arg1, arg2)
      const [result] = await builder(trx(tableName).where({ [primaryKey]: id }).update(input).returning('*'))
      return result
    }

    static async findOneAndUpdate(filter: Partial<T>, input: Partial<T>, builder?: IBuilderFunction): Promise<T>
    static async findOneAndUpdate(filter: Partial<T>, input: Partial<T>, trx?: KnexTransaction): Promise<T>
    static async findOneAndUpdate(filter: Partial<T>, input: Partial<T>, trx: KnexTransaction, builder?: IBuilderFunction): Promise<T>
    static async findOneAndUpdate(filter: Partial<T>, input: Partial<T>, arg1: KnexTransaction | IBuilderFunction, arg2?: IBuilderFunction): Promise<T> {
      const { trx, builder } = this.getParams(arg1, arg2)
      const [result] = await builder(trx(tableName).where(filter).update(input).returning('*'))
      return result
    }

    static async updateMany(filter: Partial<T>, input: Partial<T>, builder?: IBuilderFunction): Promise<T[]>
    static async updateMany(filter: Partial<T>, input: Partial<T>, trx?: KnexTransaction): Promise<T[]>
    static async updateMany(filter: Partial<T>, input: Partial<T>, trx: KnexTransaction, builder?: IBuilderFunction): Promise<T[]>
    static async updateMany(filter: Partial<T>, input: Partial<T>, arg1: KnexTransaction | IBuilderFunction, arg2?: IBuilderFunction): Promise<T[]> {
      const { trx, builder } = this.getParams(arg1, arg2)
      return builder(trx(tableName).where(filter).update(input).returning('*'))
    }

    static async findByIdAndDelete(id: number, builder?: IBuilderFunction): Promise<T>
    static async findByIdAndDelete(id: number, trx?: KnexTransaction): Promise<T>
    static async findByIdAndDelete(id: number, trx: KnexTransaction, builder?: IBuilderFunction): Promise<T>
    static async findByIdAndDelete(id: number, arg1: KnexTransaction | IBuilderFunction, arg2?: IBuilderFunction): Promise<T> {
      const { trx, builder } = this.getParams(arg1, arg2)
      return builder(trx(tableName).where({ [primaryKey]: id }).del())
    }

    static async findOneAndDelete(filter: Partial<T>, builder?: IBuilderFunction): Promise<T>
    static async findOneAndDelete(filter: Partial<T>, trx?: KnexTransaction): Promise<T>
    static async findOneAndDelete(filter: Partial<T>, trx: KnexTransaction, builder?: IBuilderFunction): Promise<T>
    static async findOneAndDelete(filter: Partial<T>, arg1: KnexTransaction | IBuilderFunction, arg2?: IBuilderFunction): Promise<T> {
      const { trx, builder } = this.getParams(arg1, arg2)
      return builder(trx(tableName).where(filter).del())
    }

    static async deleteMany(filter: Partial<T>, builder?: IBuilderFunction): Promise<T>
    static async deleteMany(filter: Partial<T>, trx?: KnexTransaction): Promise<T>
    static async deleteMany(filter: Partial<T>, trx: KnexTransaction, builder?: IBuilderFunction): Promise<T>
    static async deleteMany(filter: Partial<T>, arg1: KnexTransaction | IBuilderFunction, arg2?: IBuilderFunction): Promise<T> {
      const { trx, builder } = this.getParams(arg1, arg2)
      return builder(trx(tableName).where(filter).del())
    }

    static async count(filter: Partial<T>, builder?: IBuilderFunction): Promise<number>
    static async count(filter: Partial<T>, trx?: KnexTransaction): Promise<number>
    static async count(filter: Partial<T>, trx: KnexTransaction, builder?: IBuilderFunction): Promise<number>
    static async count(filter: Partial<T>, arg1: KnexTransaction | IBuilderFunction, arg2?: IBuilderFunction): Promise<number> {
      const { trx, builder } = this.getParams(arg1, arg2)
      const [result] = await builder(trx(tableName).count(primaryKey).where(filter))
      return Number(result.count)
    }

    static async max(field: keyof T, builder?: IBuilderFunction): Promise<number>
    static async max(field: keyof T, trx?: KnexTransaction): Promise<number>
    static async max(field: keyof T, trx: KnexTransaction, builder?: IBuilderFunction): Promise<number>
    static async max(field: keyof T, arg1: KnexTransaction | IBuilderFunction, arg2?: IBuilderFunction): Promise<number> {
      const { trx, builder } = this.getParams(arg1, arg2)
      const [{ max: result }] = await builder(trx(tableName).max(field as string))
      return defaultTo(result, 0)
    }

    static async sum(field: keyof T, filter: Partial<T>, builder?: IBuilderFunction): Promise<number>
    static async sum(field: keyof T, filter: Partial<T>, trx?: KnexTransaction): Promise<number>
    static async sum(field: keyof T, filter: Partial<T>, trx: KnexTransaction, builder?: IBuilderFunction): Promise<number>
    static async sum(field: keyof T, filter: Partial<T>, arg1: KnexTransaction | IBuilderFunction, arg2?: IBuilderFunction): Promise<number> {
      const { trx, builder } = this.getParams(arg1, arg2)
      const [{ sum: result }] = await builder(trx(tableName).sum(field as string).where(filter))
      return defaultTo(Number(result), 0)
    }
  }
}
