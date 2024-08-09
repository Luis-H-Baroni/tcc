export default () => ({
  contract: {
    methods: process.env.CONTRACT_METHODS.split(','),
  },
})
