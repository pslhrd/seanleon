class RAF {
  constructor () {
    this.subscribers = []
    this.startTime = Date.now()
    this.time = this.startTime

    this.update()
  }

  subscribe (f) {
    const sub = new RAFSubscription(f)
    this.subscribers.push(sub)
    return sub
  }

  unSubscibe (sub) {
    const index = this.subscribers.indexOf(sub)
    this.subscribers.splice(index)
  }

  update () {
    this.time = Date.now() - this.startTime

    this.subscribers.forEach(sub => {
      sub.execute(this.time)
    })
    requestAnimationFrame(this.update.bind(this))
  }
}

class RAFSubscription {
  constructor (f) {
    this.f = f
    this.isPlaying = true
  }

  play () { this.isPlaying = true }
  pause () { this.isPlaying = false }

  execute (time, force = false) {
    if (this.isPlaying || force) {
      this.f(time)
    }
  }
}

export default new RAF()
