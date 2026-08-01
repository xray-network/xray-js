import { CardanoWeb3, utils } from "@xray-network/xray-js-cardano"
import { testData } from "./__test.js"

const app = async () => {
  const web3 = new CardanoWeb3()
  const data = await web3.getTip()
  console.log(data)
}

app()
