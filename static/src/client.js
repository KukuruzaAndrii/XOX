const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const loader = new THREE.GLTFLoader();
const renderer = new THREE.WebGLRenderer({ antialias: true })
// const gui = new dat.GUI({ width: 300 })
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const places = []
const stats = new Stats();
let isClick = false
const updateGlobalMouse = (x, y) => {
  mouse.x = x
  mouse.y = y
}

const moveCameraWithMouse = (camera, mouse) => {
  const { x, y } = mouse
  camera.position.x = 1.5 * x
  camera.position.z = -1.5 * y
  camera.rotation.y = Math.PI * x / 20;
  camera.rotation.x = -Math.PI / 2 - Math.PI * y / 20;
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

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-1, 1.75, 1);
  dirLight.position.multiplyScalar(15);
  scene.add(dirLight);
  const dirLightHeper = new THREE.DirectionalLightHelper(dirLight, 5);
  // scene.add(dirLightHeper);


  const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.3);
  dirLight2.position.set(0.5, 1.75, -2);
  dirLight2.position.multiplyScalar(15);
  scene.add(dirLight2);
  const dirLightHeper2 = new THREE.DirectionalLightHelper(dirLight2, 5);
  // scene.add(dirLightHeper2);

  // var sphere = new THREE.SphereBufferGeometry( 0.1, 16, 8 )
  const light = new THREE.PointLight(0xff00ff, 3, 50);
  light.position.set(0, 13, 0)
  // light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
  scene.add(light);

  // const light = new THREE.DirectionalLight(0xffffff, 0.5);

  // light.position.set(-2, 10, 5);


  // scene.add(hemiLight);
  // scene.add(light)
  // scene.add(axesHelper);
  // light.position.z = 5
  // camera.position.z = 15;
}

const setCamera = () => {
  camera.position.y = 17;
  camera.rotation.x = -Math.PI / 2;
}

const setControls = domElement => {
  domElement.addEventListener('mousemove', e => {
    const { clientX, clientY } = e
    const normalizeX = (2 * clientX / window.innerWidth - 1)
    const normalizeY = -(2 * clientY / window.innerHeight - 1)

    updateGlobalMouse(normalizeX, normalizeY)
    moveCameraWithMouse(camera, mouse)
  })
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onClick () {
  // console.log('click')
  isClick = true
}

const init = () => {
  renderer.setSize(window.innerWidth, window.innerHeight)

  setLight()
  setCamera()
  // renderer.shadowMap.enabled = true;
  // scene.background = new THREE.Color(0x8FBCD4)
  // const geometry = new THREE.PlaneGeometry(50, 50, 32)
  // const material = new THREE.MeshStandardMaterial({
  //   color: 0x111111,
  //   side: THREE.FrontSide,
  //   roughness: 0.8
  // })
  // const material = new THREE.MeshBasicMaterial({ color: 0x2c2742, side: THREE.FrontSide })
  // const plane = new THREE.Mesh(geometry, material);
  // plane.rotation.x = -Math.PI / 2
  // scene.add(plane);
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

  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('click', onClick, false);
  document.body.appendChild(renderer.domElement)
  document.body.appendChild(stats.dom)
}
const animate = () => {
  requestAnimationFrame(animate);
  stats.update();
  // gltfO.rotation.x += 0.01;
  raycaster.setFromCamera(mouse, camera);
// debugger
  const intersects = raycaster.intersectObjects(places);
  // some wrong with first check intersect after grid and places is loaded, and intersectObjects return all objects
  if (intersects.length === places.length) return
  if (intersects.length === 1) {
    const [{ object }] = intersects
    object.material.opacity = 0.1
    places.filter(pl => pl !== object).forEach(pl => pl.material.opacity = 0)
  }
  console.log(intersects)
  for (let i = 0; i < intersects.length; i++) {
    // intersects[i].object.material.color.set(0xff0000);
    // intersects[i].object.visible = false
  }


  renderer.render(scene, camera);
}

init()
animate()


// let grid
loader.load('models/grid6.glb', function (gltf) {
  // debugger
  // let parameters = {
  // map: imgTexture,
  // bumpMap: imgTexture,
  // bumpScale: 1,
  // color: 0x111111,
  // specular: 0x222222,
  // reflectivity: 0.9,
  // shininess: 800,
  // envMap: alphaIndex % 2 === 0 ? null : reflectionCube
  // }
  // const gridMaterial = new THREE.MeshToonMaterial(parameters);

  // const folderMaterial = gui.addFolder('Material')
  // folderMaterial.add(parameters, 'bumpScale', -1, 3).listen();
  // folderMaterial.add(parameters, 'color').listen();
  // folderMaterial.add(parameters, 'specular').listen();
  // folderMaterial.add(parameters, 'reflectivity', 0, 1).listen();
  // folderMaterial.add(parameters, 'shininess', 0, 1000).listen();


  const gridMaterial = new THREE.MeshStandardMaterial({
    color: 0x3e50af,
    // emissive: 0x451dba,
    // emissiveIntensity: 0.3,
    roughness: 0.1,
    metalness: 0.2,
    shading: THREE.SmoothShading
  })

  const meshes = gltf.scene.children

  const grid = meshes.find(({ name }) => name === 'grid')
  grid.children.forEach(({geometry}) => {
    const partGrid = new THREE.Mesh(geometry, gridMaterial)
    scene.add(partGrid);
  })

  const XGeometry = meshes.find(({ name }) => name === 'x').geometry
  const XMaterial = new THREE.MeshStandardMaterial({
    color: 0x21f8ff,
    // emissive: 0x451dba,
    // emissiveIntensity: 0.3,
    roughness: 0.05,
    metalness: 0.3,
    shading: THREE.SmoothShading
  })
  const XFigure = new THREE.Mesh(XGeometry, XMaterial)
  XFigure.position.x += 6
  scene.add(XFigure);

  const OGeometry = meshes.find(({ name }) => name === 'o').geometry
  const OMaterial = new THREE.MeshStandardMaterial({
    color: 0xda4efc,
    // emissive: 0x451dba,
    // emissiveIntensity: 0.3,
    roughness: 0.05,
    metalness: 0.3,
    shading: THREE.SmoothShading
  })
  const OFigure = new THREE.Mesh(OGeometry, OMaterial)
  OFigure.position.z += 6
  scene.add(OFigure);

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const placeMaterial = new THREE.MeshStandardMaterial({
        color: 0x3e50af,
        // emissive: 0x451dba,
        // emissiveIntensity: 0.3,
        roughness: 0.1,
        metalness: 0.2,
        shading: THREE.SmoothShading,
        transparent: true,
        opacity: 0.0
      })
      const placeholder = new THREE.Mesh(meshes[1].geometry, placeMaterial)
      placeholder.x = i + 1
      placeholder.y = j + 1
      placeholder.position.x += 6 * i
      placeholder.position.z += 6 * j
      // clone.visible = false
      places.push(placeholder)

    }
  }
  places.forEach(pl => scene.add(pl))

}, undefined, function (error) {

  console.error(error);

});


const setMessage = message => {
  console.log(message)
}

const sock = io()
let canMove = true
sock.on('message', setMessage)
sock.on('move', ([x, y]) => {
  document.querySelector(`[data-x='${x}'][data-y='${y}']`).innerHTML = 'O'
  canMove = true
})
sock.on('win')

const move = (x, y) => sock.emit('move', [x, y])

document.querySelectorAll('.cell').forEach(cell => {
  cell.addEventListener('click', () => {
    if (cell.innerHTML === '' && canMove) {
      cell.innerHTML = 'X'
      move(cell.dataset.x, cell.dataset.y)
      canMove = false
    }
  })
})
