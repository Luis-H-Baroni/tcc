export default () => ({
  contract: {
    methods: process.env.CONTRACT_METHODS.split(','),
    address: process.env.CONTRACT_ADDRESS,
  },
  provider: {
    rpcProviderUrl: process.env.RPC_PROVIDER_URL,
  },
  wallet: {
    privateKey: process.env.WALLET_PRIVATE_KEY,
  },
})
