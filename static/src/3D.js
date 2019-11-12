import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Raycaster,
  Vector2,
  DirectionalLight,
  PointLight,
  MeshStandardMaterial,
  SmoothShading,
  Mesh,
  PlaneGeometry
  // AxesHelper,
  // EdgesGeometry,
  // LineSegments,
  // LineBasicMaterial,
  // AdditiveBlending
} from '../build/three.module.js'
// } from 'three'
import { GLTFLoader } from '../three/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from '../three/jsm/loaders/DRACOLoader.js'
import Stats from '../three/jsm/libs/stats.module.js'

import gsap from '../gsap/index.js'

// import { Scene, PerspectiveCamera } from 'three'

export const scene = new Scene()
export const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
export const renderer = new WebGLRenderer({ antialias: true })
export const rayCaster = new Raycaster()
export const mouse = new Vector2()
export let placeX
export let placeO
export const stats = new Stats()

const board3d = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]

const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('../three/js/libs/draco/')
loader.setDRACOLoader(dracoLoader)
const updateGlobalMouse = (x, y) => {
  // console.log(x, y)
  mouse.x = x
  mouse.y = y
}

const moveCameraWithMouse = (camera, mouse) => {
  const { x, y } = mouse
  camera.position.x = 1.5 * x
  camera.position.z = -1.5 * y
  camera.rotation.y = Math.PI * x / 20
  camera.rotation.x = -Math.PI / 2 - Math.PI * y / 20
}
const setLight = () => {
  // const light = new THREE.DirectionalLight(0xdddddd, 0.8);
  //
  // const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  // hemiLight.color.setHSL(0.6, 1, 0.6);
  // hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  // hemiLight.position.set(0, 50, 0);

  // const ambientLight = new THREE.HemisphereLight(
  //   0xddeeff, // bright sky color
  //   0x202020, // dim ground color
  //   6, // intensity
  // );
  //
  // scene.add(ambientLight);

  const dirLight = new DirectionalLight(0xffffff, 1)
  dirLight.position.set(-1, 1.75, 1)
  dirLight.position.multiplyScalar(15)
  scene.add(dirLight)
  // const dirLightHeper = new THREE.DirectionalLightHelper(dirLight, 5)
  // scene.add(dirLightHeper);

  const dirLight2 = new DirectionalLight(0xffffff, 1.3)
  dirLight2.position.set(0.5, 1.75, -2)
  dirLight2.position.multiplyScalar(15)
  scene.add(dirLight2)
  // const dirLightHeper2 = new THREE.DirectionalLightHelper(dirLight2, 5)
  // scene.add(dirLightHeper2);

  // var sphere = new THREE.SphereBufferGeometry( 0.1, 16, 8 )
  const light = new PointLight(0xff00ff, 3, 50)
  light.position.set(0, 13, 0)
  // light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
  scene.add(light)

  // const light = new THREE.DirectionalLight(0xffffff, 0.5);

  // light.position.set(-2, 10, 5);

  // scene.add(hemiLight);
  // scene.add(light)
  // scene.add(axesHelper);
  // light.position.z = 5
  // camera.position.z = 15;
}

const setCamera = () => {
  camera.position.y = 17
  camera.rotation.x = -Math.PI / 2
}

const setControls = domElement => {
  const moveEvent = (clientX, clientY) => {
    const normalizeX = (2 * clientX / window.innerWidth - 1)
    const normalizeY = -(2 * clientY / window.innerHeight - 1)

    updateGlobalMouse(normalizeX, normalizeY)
    moveCameraWithMouse(camera, mouse)
  }
  domElement.addEventListener('mousemove', e => {
    const { clientX, clientY } = e
    moveEvent(clientX, clientY)
  })
  domElement.addEventListener('touchmove', e => {
    const { clientX, clientY } = e.targetTouches[0]
    moveEvent(clientX, clientY)
  })
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

export const init = () => {
  renderer.setSize(window.innerWidth, window.innerHeight)

  setLight()
  setCamera()
  // renderer.shadowMap.enabled = true;
  // scene.background = new THREE.Color(0x8FBCD4)

  // const axesHelper = new AxesHelper(10)
  // scene.add(axesHelper)
  const geometry = new PlaneGeometry(25, 25)
  const material = new MeshStandardMaterial({
    color: 0xaaaaaa,
    // emissive: 0x451dba,
    // emissiveIntensity: 0.3,
    // roughness: 0.1,
    // metalness: 0.2,
    flatShading: SmoothShading,
    transparent: true,
    opacity: 0.0
  })
  const plane = new Mesh(geometry, material)
  plane.rotation.x = -Math.PI / 2
  scene.add(plane)
  // const axesHelper = new THREE.AxesHelper(25);
  setControls(renderer.domElement)
  // const controls = new THREE.OrbitControls(camera, renderer.domElement)
  // controls.minDistance = 3;
  // controls.maxDistance = 50;
  // controls.maxPolarAngle = Math.PI / 2;

  // const folderLight = gui.addFolder('Light')
  // folderLight.add(light.position, 'x', -5, 5).listen();
  // folderLight.add(light.position, 'y', -5, 15).listen();
  // folderLight.add(light.position, 'z', -5, 5).listen();
  // folderLight.add(light, 'intensity', 0, 5).listen();
  // folderLight.addColor(light, 'color').listen();

  window.addEventListener('resize', onWindowResize, false)
  document.body.appendChild(renderer.domElement)
  document.body.appendChild(stats.dom)

  // for prevent show placeholder on (0,0) at load
  updateGlobalMouse(-1000, -1000)
  return plane
}

let XGeometry
let OGeometry

const xMaterialConf = {
  color: 0x21f8ff,
  // emissive: 0x451dba,
  // emissiveIntensity: 0.3,
  roughness: 0.05,
  metalness: 0.3,
  flatShading: true
}
const XMaterial = new MeshStandardMaterial(xMaterialConf)
const oMaterialConf = {
  color: 0xda4efc,
  // emissive: 0x451dba,
  // emissiveIntensity: 0.3,
  roughness: 0.05,
  metalness: 0.3,
  flatShading: true
}
const OMaterial = new MeshStandardMaterial(oMaterialConf)

export const addX = (x, y) => {
  const XFigure = new Mesh(XGeometry, XMaterial)
  XFigure.rotation.y = Math.PI / 4
  XFigure.position.x = 6 * (x - 1)
  XFigure.position.z = 6 * (y - 1)
  scene.add(XFigure)
  board3d[x][y] = XFigure
  // animateMesh(XFigure)
  // createEdge(XFigure)
}
export const addO = (x, y) => {
  const OFigure = new Mesh(OGeometry, OMaterial)
  OFigure.position.x = 6 * (x - 1)
  OFigure.position.z = 6 * (y - 1)
  scene.add(OFigure)
  board3d[x][y] = OFigure
  // animateMesh(OFigure)
  // createEdge(OFigure)
}
const gridMaterial = new MeshStandardMaterial({
  color: 0x3e50af,
  // emissive: 0x451dba,
  // emissiveIntensity: 0.3,
  roughness: 0.1,
  metalness: 0.2,
  flatShading: SmoothShading
})
// const placeMaterial = new MeshStandardMaterial({
//   color: 0x3e50af,
//   // emissive: 0x451dba,
//   // emissiveIntensity: 0.3,
//   roughness: 0.1,
//   metalness: 0.2,
//   flatShading: SmoothShading,
//   transparent: true,
//   opacity: 0.0
// })

// let meshes
// loader.load('models/grid_x_o.glb', function (gltf) {
//   meshes = gltf.scene.children
//
//   const gridGeometry = meshes.find(({ name }) => name === 'grid').geometry
//   scene.add(new Mesh(gridGeometry, gridMaterial))
//   // grid.children.forEach(({ geometry }) => {
//   //   const partGrid = new Mesh(geometry, gridMaterial)
//   //   scene.add(partGrid)
//   // })
//   const XGeometry = meshes.find(({ name }) => name === 'x').geometry
//   const OGeometry = meshes.find(({ name }) => name === 'o').geometry
//   const plGeometry = meshes.find(({ name }) => name === 'placeholder').geometry
//
//   for (let i = -1; i < 2; i++) {
//     for (let j = -1; j < 2; j++) {
//       const placeholder = new Mesh(plGeometry, placeMaterial)
//       placeholder.x = i + 1
//       placeholder.y = j + 1
//       placeholder.position.x += 6 * i
//       placeholder.position.z += 6 * j
//       places.push(placeholder)
//
//       const XFigure = new Mesh(XGeometry, XMaterial)
//       XFigure.name = `${i + 1}${j + 1}`
//       XFigure.rotation.y = Math.PI / 4
//       XFigure.position.x += 6 * i
//       XFigure.position.z += 6 * j
//       xs.push(XFigure)
//       scene.add(XFigure)
//
//       const OFigure = new Mesh(OGeometry, OMaterial)
//       OFigure.name = `${i + 1}${j + 1}`
//       OFigure.rotation.y = Math.PI / 4
//       OFigure.position.x += 6 * i
//       OFigure.position.z += 6 * j
//
//       os.push(OFigure)
//       scene.add(OFigure)
//     }
//   }
//   places.forEach(pl => scene.add(pl))
// }, undefined, function (error) {
//   console.error(error)
// })

loader.load('models/grid.glb', function (model) {
  const gridGeometry = model.scene.children[0].geometry
  scene.add(new Mesh(gridGeometry, gridMaterial))
}, undefined, function (error) {
  console.error(error)
})

loader.load('models/x.glb', function (model) {
  XGeometry = model.scene.children[0].geometry
  const XMaterial = new MeshStandardMaterial({
    ...xMaterialConf,
    transparent: true,
    opacity: 0.1
  })
  placeX = new Mesh(XGeometry, XMaterial)

  placeX.rotation.y = Math.PI / 4
  placeX.position.x = -100
  placeX.position.z = -100
  scene.add(placeX)
}, undefined, function (error) {
  console.error(error)
})

loader.load('models/o.glb', function (model) {
  OGeometry = model.scene.children[0].geometry
  const OMaterial = new MeshStandardMaterial(new MeshStandardMaterial({
    ...oMaterialConf,
    transparent: true,
    opacity: 0.1
  }))

  placeO = new Mesh(OGeometry, OMaterial)
  placeO.position.x = -100
  placeO.position.z = -100
  scene.add(placeO)
}, undefined, function (error) {
  console.error(error)
})
/*
export const createEdge = mesh => {
  var edges = new EdgesGeometry(mesh.geometry)
  edges.scale(1.05, 1.05, 1.05)
  var line = new LineSegments(edges, new LineBasicMaterial({
    color: 0x0000ff
  }))
  // line.material.depthTest = false
  line.position.x = 6
  line.position.z = 0
  line.rotation.y = Math.PI / 4
  scene.add(line)
}
*/

export const animateWin = combination => {
  const tl = gsap.timeline()
  combination.forEach(([x, y], index) => {
    const fig = board3d[x][y]
    animateMesh(fig, index, tl)
  })
}

export const animateMesh = (mesh, index, tl) => {
  // eslint-disable-next-line no-undef
  tl.to(mesh.position, { y: 3, duration: 0.6, ease: 'power3.out' }, index === 0 ? '' : '-=0.4')
  // tl.to(mesh.material.color, 1, { r: 0, g: 1, b: 0, ease: Power3.easeOut }, index === 0 ? '' : '-=0.4')
}

// export const test = () => {
//   addX(0, 0)
//   addX(1, 1)
//   addX(2, 2)
//   animateWin([[0, 0], [1, 1], [2, 2]])
// }
