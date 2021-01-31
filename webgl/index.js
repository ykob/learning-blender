import * as THREE from 'three'

export default class WebGLContent {
  constructor() {
    this.renderer = null
    this.scene = new THREE.Scene()
    this.clock = new THREE.Clock({
      autoStart: false,
    })
    this.camera = null
  }

  async init(resolution) {
    const canvas = document.createElement('canvas')

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    })
    this.renderer.setClearColor(0x000000, 0.0)

    await Promise.all([
      import('./Camera').then((module) => {
        const Module = module.default
        this.camera = new Module()
        this.camera.start()
      }),
    ])

    canvas.style = `
      position: absolute;
      top: 0;
      left: 0;
    `
    document.body.append(canvas)
    this.resize(resolution)
  }

  start() {
    this.clock.start()
  }

  update() {
    if (this.clock.running === false) return

    // const time = this.clock.running === true ? this.clock.getDelta() : 0

    this.renderer.render(this.scene, this.camera)
  }

  resize(resolution) {
    if (this.camera) this.camera.resize(resolution)
    if (this.renderer) this.renderer.setSize(resolution.x, resolution.y)
  }
}