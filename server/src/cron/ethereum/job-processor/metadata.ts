import {
  ITransaction,
  IBlockchainJob,
  IBlockchainNetwork,
} from '../../../global'

export interface IBlockchainJobInput {
  blockchainJob?: IBlockchainJob
  transaction?: ITransaction
}

export interface IJobCreator {
  blockchainNetwork?: IBlockchainNetwork
  create(blockchainJobInput: IBlockchainJobInput): Promise<void>
}

export interface IJobFinisher {
  blockchainNetwork?: IBlockchainNetwork
  finish(job: IBlockchainJob): Promise<void>
}

export enum EJobAction {
  EXCUTE = 'EXCUTE',
  FINISH = 'FINISH',
  WAIT = 'WAIT',
  RETRY = 'RETRY',
}

export interface IJobChecker {
  blockchainNetwork?: IBlockchainNetwork
  check(job: IBlockchainJob): Promise<EJobAction>
}

export interface IJobExcutor {
  blockchainNetwork?: IBlockchainNetwork
  excute(job: IBlockchainJob): Promise<void>
}

export interface IJobRetrier {
  blockchainNetwork?: IBlockchainNetwork
  retry(job: IBlockchainJob): Promise<void>
}

export interface IJobProcessor {
  blockchainNetwork?: IBlockchainNetwork
  creator?: IJobCreator
  finisher: IJobFinisher
  checker: IJobChecker
  retrier: IJobRetrier
  excutor: IJobExcutor
}
