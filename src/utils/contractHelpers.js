const CONTRACT_ADDRESS = '0x8ac4ceA9F84d586d8441a1F5b0C3EB98b5b74Ff8';
const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'paymentId',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'PaymentCompleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'paymentId',
        type: 'string',
      },
    ],
    name: 'PaymentExpired',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'paymentId',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'expiryTime',
        type: 'uint256',
      },
    ],
    name: 'PaymentRequestCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sellerAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'businessName',
        type: 'string',
      },
    ],
    name: 'SellerRegistered',
    type: 'event',
  },
  {
    inputs: [],
    name: 'PAYMENT_WINDOW',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'paymentId',
        type: 'string',
      },
    ],
    name: 'checkPaymentStatus',
    outputs: [
      {
        internalType: 'bool',
        name: 'isPaid',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'isExpired',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'remainingTime',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'paymentId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'createPaymentRequest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'offset',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'limit',
        type: 'uint256',
      },
    ],
    name: 'getAllSellers',
    outputs: [
      {
        internalType: 'address[]',
        name: 'addresses',
        type: 'address[]',
      },
      {
        internalType: 'string[]',
        name: 'businessNames',
        type: 'string[]',
      },
      {
        internalType: 'uint256[]',
        name: 'transactions',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'client',
        type: 'address',
      },
    ],
    name: 'getClientPaymentCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'client',
        type: 'address',
      },
    ],
    name: 'getClientPaymentHistory',
    outputs: [
      {
        internalType: 'string[]',
        name: 'paymentIds',
        type: 'string[]',
      },
      {
        internalType: 'address[]',
        name: 'sellers',
        type: 'address[]',
      },
      {
        internalType: 'string[]',
        name: 'businessNames',
        type: 'string[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'timestamps',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sellerAddress',
        type: 'address',
      },
    ],
    name: 'getSellerStats',
    outputs: [
      {
        internalType: 'string',
        name: 'businessName',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'totalTransactions',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'paymentId',
        type: 'string',
      },
    ],
    name: 'makePayment',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'paymentId',
        type: 'string',
      },
    ],
    name: 'markPaymentExpired',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'paymentRequests',
    outputs: [
      {
        internalType: 'string',
        name: 'paymentId',
        type: 'string',
      },
      {
        internalType: 'address payable',
        name: 'seller',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expiryTime',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isPaid',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'isExpired',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'businessName',
        type: 'string',
      },
    ],
    name: 'registerSeller',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'sellerAddresses',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'sellers',
    outputs: [
      {
        internalType: 'address payable',
        name: 'walletAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'businessName',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'isRegistered',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'totalTransactions',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSellers',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export { CONTRACT_ADDRESS, CONTRACT_ABI };
