import * as THREE from 'three';

export default class Helper{

    Scene! : THREE.Scene
    GridHelper : THREE.GridHelper | undefined
    AxesHelper : THREE.AxesHelper | undefined
    DirectionlLightHelper : THREE.DirectionalLightHelper | undefined


    constructor(Scene : THREE.Scene){
        this.Scene = Scene;
    }

    SetDirectinalLightHelper(DirectionalLight : THREE.DirectionalLight){
        this.DirectionlLightHelper = new THREE.DirectionalLightHelper(DirectionalLight);
        this.Scene.add(this.DirectionlLightHelper)
    }

    CreateGridHelper(){
        this.GridHelper = new THREE.GridHelper(1000,20);
        this.Scene.add(this.GridHelper);
    }

}