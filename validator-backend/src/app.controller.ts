import { Body, Controller, Get, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { Contract, ethers, Wallet } from 'ethers'
import contractArtifact from '../artifacts/contracts/Validator.sol/Validator.json'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getTransaction() {
    const provider = new ethers.JsonRpcProvider('http://localhost:8545')

    const wallet = new Wallet(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      provider,
    )
    const contract = new Contract(
      '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      contractArtifact.abi,
      wallet,
    )

    const pubKey = wallet.signingKey.publicKey
    const hashedPubKey = ethers.keccak256(pubKey)
    const hash32bytes =
      '0x1234567890123456789012dd567882223456788dd33456789012dd5678901234'

    const contractTransaction = await contract.storeHash.populateTransaction(
      hash32bytes,
      hashedPubKey,
    )

    const transaction = await wallet.populateTransaction(contractTransaction)

    console.log(transaction)

    const signedTransaction = await wallet.signTransaction(transaction)

    return signedTransaction
  }

  @Post()
  async sendTransaction(@Body() body) {
    const provider = new ethers.JsonRpcProvider('http://localhost:8545')

    return await provider.broadcastTransaction(body.transaction)
  }
}
