// tslint:disable-next-line: no-any
export const hotWalletAbi: any = [
  {
    'constant': false,
    'inputs': [
      {
        'internalType': 'address[]',
        'name': 'newAdmins',
        'type': 'address[]',
      },
      {
        'internalType': 'address[]',
        'name': 'removedAdmins',
        'type': 'address[]',
      },
    ],
    'name': 'modifyAdmins',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address',
      },
    ],
    'name': 'admins',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
      },
    ],
    'name': 'isPaid',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'payable': true,
    'stateMutability': 'payable',
    'type': 'fallback',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'transactionRequestId',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'internalType': 'address',
        'name': 'coinAddress',
        'type': 'address',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'value',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'internalType': 'address payable',
        'name': 'to',
        'type': 'address',
      },
    ],
    'name': 'Transfer',
    'type': 'event',
  },
  {
    'constant': false,
    'inputs': [
      {
        'internalType': 'uint256',
        'name': 'transactionRequestId',
        'type': 'uint256',
      },
      {
        'internalType': 'address',
        'name': 'coinAddress',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': 'value',
        'type': 'uint256',
      },
      {
        'internalType': 'address payable',
        'name': 'to',
        'type': 'address',
      },
    ],
    'name': 'transfer',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'internalType': 'address',
        'name': 'coinAddress',
        'type': 'address',
      },
    ],
    'name': 'getBalances',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': 'balance',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
]
