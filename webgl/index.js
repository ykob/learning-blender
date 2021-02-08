import * as THREE from 'three'

export default class WebGLContent {
  constructor() {
    this.renderer = null
    this.scene = new THREE.Scene()
    this.clock = new THREE.Clock({
      autoStart: false,
    })
    this.camera = null
    this.floor = null
    this.controls = null
    this.glTFLoader = null
    this.spotLight = null
    this.ambientLight = null
    this.models = Array(4)
    this.currentNum = 0
  }

  async init(resolution) {
    const canvas = document.getElementById('canvas-webgl')
    let Controls

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
    this.renderer.setClearColor(0x000000, 0.0)
    this.renderer.shadowMap.enabled = true

    await Promise.all([
      import('three/examples/jsm/controls/OrbitControls').then((module) => {
        Controls = module.OrbitControls
      }),
      import('three/examples/jsm/loaders/GLTFLoader').then((module) => {
        const Module = module.GLTFLoader
        this.glTFLoader = new Module()
      }),
      import('./Camera').then((module) => {
        const Module = module.default
        this.camera = new Module()
        this.camera.start()
      }),
      import('./Floor').then((module) => {
        const Module = module.default
        this.floor = new Module()
        this.floor.position.y = -10
        this.floor.rotation.x = (-90 * Math.PI) / 180
        this.scene.add(this.floor)
      }),
    ])

    this.controls = new Controls(this.camera, this.renderer.domElement)
    this.spotLight = new THREE.SpotLight('#ffffff', 2, 100, Math.PI / 4, 1)
    this.ambientLight = new THREE.AmbientLight('#cccccc')
    this.spotLight.position.set(0, 20, 0)
    this.spotLight.castShadow = true
    this.ambientLight.castShadow = true
    this.scene.add(this.spotLight)
    this.scene.add(this.ambientLight)
    this.resize(resolution)
  }

  start() {
    this.clock.start()
  }

  async load(id) {
    let model

    switch (id) {
      case 'sword':
        await this.glTFLoader
          .loadAsync('/models/sword_v1.glb')
          .then((response) => {
            model = response.scene.children.find((o) => {
              return o.name === 'Sword'
            })
          })
        break
      default:
        break
    }

    this.currentNum = (this.currentNum + 1) % this.models.length
    model.castShadow = true
    console.log(model)
    this.models[this.currentNum] = model
    this.scene.add(this.models[this.currentNum])
  }

  destroy(id) {
    this.scene.remove(this.models[this.currentNum])
  }

  update() {
    if (this.clock.running === false) return

    // const time = this.clock.running === true ? this.clock.getDelta() : 0

    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  resize(resolution) {
    if (this.camera) this.camera.resize(resolution)
    if (this.renderer) this.renderer.setSize(resolution.x, resolution.y)
  }
}
