import * as THREE from 'three';
import dat, {GUI} from 'dat.gui';


export default class Editor{

    static Scene : THREE.Scene
    static Gui : GUI 
    static Files : Map<string,any>

    static initalize(scene : THREE.Scene){
        Editor.Scene = scene;
        Editor.Gui = new GUI();
        Editor.Files = new Map<string,any>();
    }

    static AddSubFolderToEditor(FolderName : string){
        var newSubFolder = this.Gui.addFolder(FolderName)
        Editor.Files.set(FolderName,newSubFolder)
    }

    static AddParameterToSubFolder(FolderName : string , Object : any , Param : string, from : number , toNum : number, ParamName : string ){

        //get file from map
        var subFile = Editor.Files.get(FolderName);
        subFile.add(Object,Param,from,toNum).name(ParamName);
    }
}