import * as THREE from 'three'
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js'

export default class EnvironmentLoader{

    static LoadEnvironment(path:string,scene:THREE.Scene){

        
        var loader = new RGBELoader()
        loader.load(path,(environmentMap)=>{
            environmentMap.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = environmentMap;
            scene.environment = environmentMap;          
        })
    }

}
