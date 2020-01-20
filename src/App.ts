import * as express from 'express'

class App {
  public express

  constructor () {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World!'
      })
    })
    router.get('/name/:title', (req, res) => {
      var tit : String = req.params.title
      res.json({
        message: `Hello ${tit}`
      })
    })
    this.express.use('/', router)
  }
}

export default new App().express