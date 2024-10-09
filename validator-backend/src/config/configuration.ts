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
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
})
