const axios = require("axios")
const net = require("net")

const influxClient = new net.Socket()

const HOST = "172.17.0.2"
const PORT = 9009


async function main() {
  await influxClient.connect(PORT, HOST)

  async function getBinanceData() {
    const { data } = await axios.get(
      "https://api.binance.us/api/v3/avgPrice?symbol=BTCUSD",
    )
    const row = `crypto,currency=BTC,exchange=Binance price=${data.price} ${ Date.now() * 1e6 }`

    await influxClient.write(`${row}\n`)

    setTimeout(getBinanceData, 1000)
  }

  getBinanceData()
}

main()