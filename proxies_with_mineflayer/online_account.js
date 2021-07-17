process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const { createBot } = require('mineflayer')
const ProxyAgent = require('proxy-agent')
const socks = require('socks').SocksClient
const { mcUsername, mcPassword, mcServerHost, mcServerPort, proxyHost, proxyPassword, proxyPort, proxyUsername } = require('./config.json')

const bot = createBot({
  username: mcUsername,
  password: mcPassword,
  host: mcServerHost,
  port: mcServerPort,
  agent: new ProxyAgent({ protocol: 'socks5:', host: proxyHost, port: proxyPort, username: proxyUsername, password: proxyPassword }),
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
