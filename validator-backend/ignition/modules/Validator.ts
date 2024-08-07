import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const ValidatorModule = buildModule('ValidatorModule', (m) => {
  const validator = m.contract('Validator')

  return { validator }
})

export default ValidatorModule
