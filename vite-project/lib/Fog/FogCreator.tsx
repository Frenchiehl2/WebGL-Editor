import * as THREE from 'three'
import * as dat from "dat.gui";
import { fogParsVert, fogVert, fogParsFrag, fogFrag } from "./FogReplace";

import {ImprovedNoise} from 'three/examples/jsm/math/ImprovedNoise.js';

interface params {
fogNearColor: number,
fogHorizonColor: number,
fogDensity: number,
fogNoiseSpeed: number,
fogNoiseFreq: number,
fogNoiseImpact: number
};

export default class FogCreator{
    
   static worldWidth:number = 256;
   static worldDepth:number = 256;
     
    static fogParams :params = {
              fogNearColor: 0xfc4848,
              fogHorizonColor: 0xe4dcff,
              fogDensity: 0.0025,
              fogNoiseSpeed: 100,
              fogNoiseFreq: 0.0012,
              fogNoiseImpact: 0.5
    }
     static initialize(scene:THREE.Scene){
         
         

         scene.background = new THREE.Color(this.fogParams.fogHorizonColor);
         scene.fog = new THREE.FogExp2(this.fogParams.fogHorizonColor, this.fogParams.fogDensity);

         var data = generateHeight(this.worldWidth, this.worldDepth);

         var geometry = new THREE.PlaneGeometry(
            7500,
            7500,
            this.worldWidth - 1,
            this.worldDepth - 1
             );

         geometry.rotateX(-Math.PI / 2);
         var vertices = geometry.attributes.position.array;

        for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
           vertices[j + 1] = data[i] * 10;
        }

       var  mesh = new THREE.Mesh(
         geometry,
         new THREE.MeshBasicMaterial({ color: new THREE.Color(0xefd1b5) }));

         mesh.material.onBeforeCompile = shader => {
            shader.vertexShader = shader.vertexShader.replace(
            `#include <fog_pars_vertex>`,
            fogParsVert
            );
            shader.vertexShader = shader.vertexShader.replace(
            `#include <fog_vertex>`,
            fogVert
            );
            shader.fragmentShader = shader.fragmentShader.replace(
            `#include <fog_pars_fragment>`,
            fogParsFrag
            );
            shader.fragmentShader = shader.fragmentShader.replace(
            `#include <fog_fragment>`,
            fogFrag
            );

           const uniforms = ({
      fogNearColor: { value: new THREE.Color(this.fogParams.fogNearColor) },
      fogNoiseFreq: { value: this.fogParams.fogNoiseFreq },
      fogNoiseSpeed: { value: this.fogParams.fogNoiseSpeed },
      fogNoiseImpact: { value: this.fogParams.fogNoiseImpact },
      time: { value: 0 }
    });

    shader.uniforms = THREE.UniformsUtils.merge([shader.uniforms, uniforms]);
    var terrainShader = shader;};
    
    scene.add(mesh);

         
    }

}

function  generateHeight(width:number, height:number) {
    var seed = Math.PI / 4;
    window.Math.random = function() {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    var size = width * height,
        data = new Uint8Array(size);
    var perlin = new ImprovedNoise(),
        quality = 1,
        z = Math.random() * 100;

    for (var j = 0; j < 4; j++) {
        for (var i = 0; i < size; i++) {
        var x = i % width,
            y = ~~(i / width);
        data[i] += Math.abs(
            perlin.noise(x / quality, y / quality, z) * quality * 1.75
        );
        }

        quality *= 5;
    }

    return data;
    }