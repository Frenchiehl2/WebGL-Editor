
import { useEffect} from 'react'
import ModelLoader from '../lib/ModelLoader'
import SceneInit from '../lib/SceneInit';
import './App.css'

function App() {
 
  useEffect( () => {
    
    
    
    var mainScene = new SceneInit();

    ModelLoader.loadModel('/public/models/MegaStructure.gltf',mainScene.scene,20)
    mainScene.animate();
})
 return (
     <div id ="MainContainer">
      <>
      <canvas id="MainCanvas"> </canvas>
      <div id ="Overlay">
      </div>
    </>
    </div>

 )
}
export default App
