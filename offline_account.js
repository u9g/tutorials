process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const { createBot } = require('mineflayer')
const socks = require('socks').SocksClient
const { mcServerHost, mcServerPort, proxyHost, proxyPassword, proxyPort, proxyUsername } = require('./config.json')

const bot = createBot({
  host: mcServerHost,
  username: 'my_offline_acc',
  skipValidation: true,
  connect: (client) => {
    socks.createConnection({
      proxy: {
        host: proxyHost,
        port: proxyPort,
        type: 5,
        userId: proxyUsername,
        password: proxyPassword
      },
      command: 'connect',
      destination: {
        host: mcServerHost,
        port: mcServerPort
      }
    }, (err, info) => {
      if (err) {
        console.log(err)
        return
      }
      client.setSocket(info.socket)
      client.emit('connect')
    })
  }
})

bot.once('spawn', () => console.log('spawned'))
