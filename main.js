import Lenis from 'lenis'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

const headerMenu = document.querySelector('.header-dropdown')

headerMenu.addEventListener('click', () => {
  headerMenu.classList.toggle('active')
})

const marqueHeight = document.querySelector('.marquee1').clientHeight
const marquee = document.querySelector('.marquee')

marquee.style.height = `${marqueHeight}px`

const bg = document.querySelector('.section-2')

const cards = [...document.querySelectorAll('.card')]
const dets = document.querySelector('.dets')

cards.forEach(card => {
  card.addEventListener('mouseover', () => {
    bg.classList.add(card.dataset.color)
    gsap.to(dets, {
      opacity: 1,
      duration: .5
    })
  })

  card.addEventListener('mouseout', () => {
    bg.classList.remove(card.dataset.color)
    gsap.to(dets, {
      opacity: 0,
      duration: .5
    })
  })
})



window.addEventListener('mousemove', (e) => {
  gsap.to(dets, {
    x: e.clientX,
    y: e.clientY
  })
})

const detsImages = [...document.querySelectorAll('.mac-images img')]

gsap.to(detsImages, {
  y: 0,
  ease: 'power4.out',
  duration: 1,
  stagger: 1,
  repeat: -1
})

const cardImages = [...document.querySelectorAll('.card img')]

cardImages.forEach(img => {
  gsap.to(img, {
    y: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: img,
      start: 'top bottom',
      end: 'bottom 20%',
      scrub: 2
    }
  })
})

const hrSlider = document.querySelector('.section3')

const slider = document.querySelector('.h-images-slider')
const sliderText = document.querySelector('.h-slider-text')

const hrtl = gsap.timeline({
  defaults: {
    ease: 'none',
  },
  scrollTrigger: {
    trigger: hrSlider,
    start: 'top top',
    end: `+=2000`,
    scrub: 2,
    pin: hrSlider,
  }
})

const textMovement = sliderText.getBoundingClientRect().width - window.innerWidth

hrtl.to(slider, {
  x: '-300vw',
})
  .to(sliderText, {
    x: `-${textMovement}px`,
  }, '<')



//threejs scene setup

const scene = new THREE.Scene()

const loader = new THREE.TextureLoader()

const planeTexture = loader.load('./texture.png')

const dirLight = new THREE.DirectionalLight(0xffffff, 1)
dirLight.position.set(0, 0, 6)
const dirLight2 = new THREE.DirectionalLight(0xffffff, 1)
dirLight2.position.set(-5, 5, 0)
const dirLight3 = new THREE.DirectionalLight(0xffffff, 1)
dirLight3.position.set(5, -5, 0)
scene.add(dirLight, dirLight2, dirLight3)
//scene.add(new THREE.AmbientLight(0xffffff, .1));


const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 6),
  new THREE.MeshBasicMaterial({
    map: planeTexture,
    side: THREE.FrontSide
  })
)
plane.position.set(0, 0, -3)
scene.add(plane)

const gltfLoader = new GLTFLoader()

let hologramShape = null
let material = null

const params = {
  color: 0xffffff,
  transmission: .995,
  opacity: 1,
  metalness: 0,
  roughness: 0.25,
  ior: 1.6,
  thickness:.23,
  specularIntensity: .8,
  specularColor: 0xffffff,
  dispersion: 20,
};

gltfLoader.load('./shape.glb', (gltf) => {
  hologramShape = gltf.scene
  //change materila
  material = new THREE.MeshPhysicalMaterial({
    color: params.color,
    transmission: params.transmission,
    opacity: params.opacity,
    metalness: params.metalness,
    roughness: params.roughness,
    ior: params.ior,
    thickness: params.thickness,
    specularIntensity: params.specularIntensity,
    specularColor: params.specularColor,
    side: THREE.DoubleSide,
    dispersion: params.dispersion,
  });

  hologramShape.traverse((child) => {
    if (child.isMesh) {
      child.material = material
    }
  })
  hologramShape.position.set(0, 0, 0)
  hologramShape.scale.setScalar(1.6)
  scene.add(hologramShape)
})

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

scene.add(camera)

const canvas = document.querySelector('canvas.webgl')

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()
const mouse = {
  x: 0,
  y: 0
}

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  if (hologramShape) {
    hologramShape.rotation.y = elapsedTime * .4
    hologramShape.rotation.z = elapsedTime * .6
    gsap.to(hologramShape.position, {
      x: mouse.x * 2,

      ease: 'power2.out',
      duration: 5
    })
    //hologramShape.position.x = mouse.x * 2
   //hologramShape.position.y = mouse.y * 1.5
  }
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()


window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)
  mouse.y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
  console.log(mouse.x, mouse.y);
  
})