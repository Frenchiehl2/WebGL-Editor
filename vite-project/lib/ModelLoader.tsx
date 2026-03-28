import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';   
export default class ModelLoader{

    static scene : THREE.Scene
    
    static loadModel(path:string,scene:THREE.Scene,size:number){
      
      var loader = new GLTFLoader()

        loader.load(path, (gltf)=>{
            gltf.scene.scale.x = size
            gltf.scene.scale.y = size
            gltf.scene.scale.z = size
              
            scene.add(gltf.scene);
        })
    }
    
}