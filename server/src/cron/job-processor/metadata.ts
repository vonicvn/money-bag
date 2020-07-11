import {
  ITransaction,
  IBlockchainJob,
} from '../../global'

export interface IBlockchainJobInput {
  blockchainJob?: IBlockchainJob
  transaction?: ITransaction
}

export interface IJobCreator {
  create(blockchainJobInput: IBlockchainJobInput): Promise<void>
}

export interface IJobFinisher {
  finish(job: IBlockchainJob): Promise<void>
}

export interface IJobChecker {
  check(job: IBlockchainJob): Promise<void>
}

export interface IJobExcutor {
  excute(job: IBlockchainJob): Promise<void>
}

export interface IJobRetrier {
  retry(job: IBlockchainJob): Promise<void>
}

export interface IJobProcessor {
  creator: IJobCreator
  finisher: IJobFinisher
  checker: IJobChecker
  retrier: IJobRetrier
  excutor: IJobExcutor
}
