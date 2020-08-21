import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Raycaster,
  Vector2,
  DirectionalLight,
  PointLight,
  MeshStandardMaterial,
  // MeshPhongMaterial,
  SmoothShading,
  Mesh,
  PlaneGeometry,
  AxesHelper,
  TextGeometry,
  BufferGeometry,
  FontLoader,
  Object3D,
  Vector3,
  LineBasicMaterial,
  Line
  // Triangle
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
import View from './view.js'
// import { Scene, PerspectiveCamera } from 'three'

export const scene = new Scene()
export const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
export const renderer = new WebGLRenderer({ antialias: true })
export const rayCaster = new Raycaster()
export const mouse = new Vector2()
export let placeX
export let placeO
export let startBtn
export const stats = new Stats()
export const view = new View({ x: 0, y: 0 }, camera)
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

// export const moveCameraWithMouse = (camera, mouse) => {
//   const { position, rotation } = view.getCameraPosition(mouse)
//   camera.position.x = position.x
//   camera.position.z = position.z
//   camera.rotation.x = rotation.x
//   camera.rotation.y = rotation.y
// }
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

const setControls = domElement => {
  const moveEvent = (clientX, clientY) => {
    const normalizeX = (2 * clientX / window.innerWidth - 1)
    const normalizeY = -(2 * clientY / window.innerHeight - 1)

    updateGlobalMouse(normalizeX, normalizeY)
    // moveCameraWithMouse(camera, mouse)
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
  // showStartScreen()
  setLight()
  // setCamera()
  // renderer.shadowMap.enabled = true;
  // scene.background = new THREE.Color(0x8FBCD4)

  const axesHelper = new AxesHelper(10)
  scene.add(axesHelper)
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

loader.load('models/grid.glb', model => {
  const gridGeometry = model.scene.children[0].geometry
  scene.add(new Mesh(gridGeometry, gridMaterial))
}, xhr => {
  console.log((xhr.loaded / xhr.total * 100) + '% loaded')
}, function (error) {
  console.error(error)
})

loader.load('models/x.glb', model => {
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
}, xhr => {
  console.log((xhr.loaded / xhr.total * 100) + '% loaded')
}, function (error) {
  console.error(error)
})

loader.load('models/o.glb', model => {
  OGeometry = model.scene.children[0].geometry
  const OMaterial = new MeshStandardMaterial({
    ...oMaterialConf,
    transparent: true,
    opacity: 0.1
  })

  placeO = new Mesh(OGeometry, OMaterial)
  placeO.position.x = -100
  placeO.position.z = -100
  scene.add(placeO)
}, xhr => {
  console.log((xhr.loaded / xhr.total * 100) + '% loaded')
}, function (error) {
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
  const animateMesh = (mesh, index, tl) => {
    tl.to(mesh.position, { y: 3, duration: 0.6, ease: 'power3.out' }, index === 0 ? '' : '-=0.4')
    // tl.to(mesh.material.color, 1, { r: 0, g: 1, b: 0, ease: Power3.easeOut }, index === 0 ? '' : '-=0.4')
  }
  const tl = gsap.timeline()
  combination.forEach(([x, y], index) => {
    const fig = board3d[x][y]
    animateMesh(fig, index, tl)
  })
}

export const restart = () => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board3d[i][j] !== null) {
        board3d[i][j].geometry.dispose()
        board3d[i][j].material.dispose()
        scene.remove(board3d[i][j])
      }
    }
  }
}

export const animateStart = () => {
  // return gsap.to(startBtn.rotation, { x: Math.PI + Math.PI / 2, duration: 5, ease: 'power.out', paused: true })
  const tl = gsap.timeline()
  tl.to(startBtn.rotation, { x: -2 * Math.PI - Math.PI / 2, duration: 1, ease: 'power.out' })
  tl.to(startBtn.position, { y: 3, duration: 2 / 7, ease: 'none' }, '<')
  tl.to(startBtn.position, { y: 0, duration: 5 / 7, ease: 'none' }, '>')
  return tl
  // const animateMesh = (mesh, index, tl) => {
  //   tl.to(mesh.position, { y: 3, duration: 0.6, ease: 'power3.out' }, index === 0 ? '' : '-=0.4')
  //   // tl.to(mesh.material.color, 1, { r: 0, g: 1, b: 0, ease: Power3.easeOut }, index === 0 ? '' : '-=0.4')
  // }
  // const tl = gsap.timeline()
  // combination.forEach(([x, y], index) => {
  //   const fig = board3d[x][y]
  //   animateMesh(fig, index, tl)
  // })
}

// export const test = () => {
//   addX(0, 0)
//   addX(1, 1)
//   addX(2, 2)
//   animateWin([[0, 0], [1, 1], [2, 2]])
// }

const fontLoader = new FontLoader()
let font
// loader.load('/three/fonts/' + fontName + '_' + fontWeight + '.typeface.json', function (response) {
fontLoader.load('/models/Rajdhani_Bold.json', function (response) {
  font = response
  showStartScreen()
})

const showStartScreen = () => {
  // camera.rotation.x = -Math.PI / 2
  // startBtn = new Mesh(OGeometry, OMaterial)
  // startBtn.rotation.y = Math.PI / 4
  // startBtn.position.x = 0
  // startBtn.position.z = -30
  // startBtn.name = 'startBtn'
  // scene.add(startBtn)

  const height = 1
  const size = 6
  const curveSegments = 25
  // const bevelThickness = 0.3
  // const bevelSize = 0.1
  // const bevelEnabled = false
  // const bevelOffset = 0
  // const bevelSegments = 5
  // const createWord = text => {
  //
  // }
  const textGeo = new TextGeometry('start', {
    font,
    size,
    height,
    curveSegments
  })

  const textGeometry = new BufferGeometry().fromGeometry(textGeo)

  const materials = [
    // new MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
    XMaterial,
    XMaterial
    // new MeshPhongMaterial({ color: 0xffffff }) // side
  ]
  const startBtn1 = new Mesh(textGeometry, materials)
  textGeometry.computeBoundingBox()
  textGeometry.boundingBox.getCenter()

  textGeometry.boundingBox.getCenter(startBtn1.position).multiplyScalar(-1).add(new Vector3(0, 0.7, 0))
  startBtn1.name = 'startBtn'

  startBtn = new Object3D()
  startBtn.add(startBtn1)
  startBtn.position.x = 0 // centerOffsetX
  startBtn.position.y = 0
  startBtn.position.z = -30 // centerOffsetY * 7 / 10 - 30
  startBtn.rotation.x = -Math.PI / 2
  startBtn.name = 'startBtn'
  scene.add(startBtn)

  // create a blue LineBasicMaterial
  var material = new LineBasicMaterial({ color: 0xff0000 })

  var points = []
  points.push(startBtn1.position.clone().add(new Vector3(0, 0, -30)))
  points.push(startBtn1.position.clone().add(new Vector3(-15, 0, -30)))
  points.push(startBtn1.position.clone().add(new Vector3(15, 0, -30)))

  var geometry = new BufferGeometry().setFromPoints(points)
  var line = new Line(geometry, material)
  scene.add(line)

  /*   startBtn = new Mesh(textGeometry, materials)
    // textGeometry.computeBoundingBox()
    // textGeometry.boundingBox.getCenter(startBtn1.position).multiplyScalar(-1)
    // startBtn1.name = 'startBtn'
    //
    // startBtn = new Object3D()
    // startBtn.add(startBtn1)
    startBtn.position.x = centerOffsetX
    startBtn.position.y = 0
    startBtn.position.z = centerOffsetY * 7 / 10 - 30
    startBtn.rotation.x = -Math.PI / 2
    startBtn.name = 'startBtn'
    scene.add(startBtn) */
}

/*  if (mirror) {
    textMesh2 = new THREE.Mesh(textGeo, materials)

    textMesh2.position.x = centerOffset
    textMesh2.position.y = -hover
    textMesh2.position.z = height

    textMesh2.rotation.x = Math.PI
    textMesh2.rotation.y = Math.PI * 2

    group.add(textMesh2)
  } */
