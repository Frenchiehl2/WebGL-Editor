import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Helper from './Helpers'
import Editor from './Editor'
import { EffectComposer,RenderPass } from 'three/examples/jsm/Addons.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';  
import EnvironmentLoader from '../lib/HDRLoader';
import FogCreator from '../lib/Fog/FogCreator'

export default class SceneInit {


  
    //Core components to initialize Three.js app.
    scene!: THREE.Scene;
    camera! : THREE.PerspectiveCamera;
    renderer! : THREE.WebGLRenderer;
    canvas! : any

    //effects
    composer! : EffectComposer
    renderPass! : RenderPass

    bloomPass!: UnrealBloomPass

    fog! : THREE.FogExp2

    //Camera params;
    fov = 75;
    nearPlane = 1;
    farPlane = 1000;
    canvasId = undefined;

    //Additional components.
    clock : THREE.Clock | undefined;

    controls : OrbitControls | undefined;

    //Lighting is basically required.
    ambientLight : THREE.AmbientLight | undefined;
    directionalLight! : THREE.DirectionalLight;

    //used for debugging
    Helpers : Helper | undefined
   // Editor : Editor | undefined

    constructor() {
      this.initialize();
    }

  CreateHelpers(){
     this.Helpers = new Helper(this.scene);
     this.Helpers.SetDirectinalLightHelper(this.directionalLight);

    this.Helpers.CreateGridHelper();
  }

  EnablePostProcessing(){
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene,this.camera)

    this.composer.addPass(this.renderPass)
    
  }

  EnableUnrealBloom(){
     this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth,window.innerHeight),0.4,0.8,0.2)
     this.composer.addPass(this.bloomPass)
  }
  CreateFog(){
    this.fog = new THREE.FogExp2("#262837",0.002)
    this.scene.fog = this.fog;
   // FogCreator.initialize(this.scene);
  }

  CreateBackground(){
    EnvironmentLoader.LoadEnvironment('/public/environment.hdr',this.scene);
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 0.8;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );

    this.camera.position.z = 48;

    //Specify a canvas which is already created in the HTML.
    this.canvas = document.getElementById("MainCanvas")
    this.renderer = new THREE.WebGLRenderer({
      canvas : this.canvas,
      antialias: true,
    });
    this.renderer.setClearColor("262837")
    this.renderer.setSize(window.innerWidth, window.innerHeight);
 
    document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
   
   

    // directional light - parallel sun rays
    // this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // this.directionalLight.castShadow = true;
    // this.scene.add(this.directionalLight)
    // if window resizes
    window.addEventListener('resize', () => this.onWindowResize(), false);

    // NOTE: Load space background.
    // this.loader = new THREE.TextureLoader();
    // this.scene.background = this.loader.load('./pics/space.jpeg');

    // NOTE: Declare uniforms to pass into glsl shaders.
    // this.uniforms = {
    //   u_time: { type: 'f', value: 1.0 },
    //   colorB: { type: 'vec3', value: new THREE.Color(0xfff000) },
    //   colorA: { type: 'vec3', value: new THREE.Color(0xffffff) },
    // };
    this.EnablePostProcessing();
    this.EnableUnrealBloom();
   // this.CreateHelpers();
    this.CreateFog();
    this.CreateBackground();

    Editor.initalize(this.scene);
    Editor.AddSubFolderToEditor('Camera Position');
    Editor.AddParameterToSubFolder('Camera Position',this.camera.position,'x',-500,500,'X position')
    Editor.AddParameterToSubFolder('Camera Position',this.camera.position,'y',-500,500,'y position')
    Editor.AddParameterToSubFolder('Camera Position',this.camera.position,'z',-500,500,'z position')

    Editor.AddSubFolderToEditor('Post Process');
    Editor.AddParameterToSubFolder('Post Process',this.bloomPass,'strength',0,5,'Strength')
    Editor.AddParameterToSubFolder('Post Process',this.bloomPass,'radius',0,5,'Radius')
    Editor.AddParameterToSubFolder('Post Process',this.bloomPass,'threshold',0,5,'hreshold')

    Editor.AddSubFolderToEditor('Fog')
    Editor.AddParameterToSubFolder('Fog',this.fog,'density',0,0.01,'Fog Density')    
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
   // this.controls?.update();
  }

  render() {
    //Update uniform data on each render.
    // this.uniforms.u_time.value += this.clock.getDelta();
   // this.renderer?.render(this.scene, this.camera);
   this.composer.render();

  //  if(FogCreator.terrainShader) {
  //   FogCreator.terrainShader.uniforms.time.value += this.clock?.getDelta() ;
  // }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}