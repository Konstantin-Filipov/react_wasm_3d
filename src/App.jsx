import React from 'react'
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import SceneInit from './SceneInit';
//import Menu from './components/Menu'
//import './App.css'

function App(){
    useEffect(() => {
        const test = new SceneInit('myThreeJsCanvas');
        test.initialize();
        test.animate();
    
        let loadedModel;
        const glftLoader = new GLTFLoader();
        glftLoader.load('/src/assets/truck.glb', (gltfScene) => {
            loadedModel = gltfScene;
            // Calculate bounding box
            const boundingBox = new THREE.Box3().setFromObject(gltfScene.scene);
            const size = new THREE.Vector3();
            boundingBox.getSize(size);

            // Calculate scale factor based on the maximum dimension of the bounding box
            const scaleFactor = 10 / Math.max(size.x, size.y, size.z);

            // Apply scale to the model
            gltfScene.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

    
            gltfScene.scene.rotation.y = Math.PI / 8;
            //gltfScene.scene.position.y = 0;
            //gltfScene.scene.scale.set(8, 8, 8);
            test.scene.add(gltfScene.scene);
        });
    
    }, []);
    
    return (
        <div>
            <canvas id="myThreeJsCanvas"/>
        </div>
    );
}

export default App;
//     const [objFile, setObjFile] = useState(null);
//     const [objLoaded, setObjLoaded] = useState(false);


// useEffect(() => {
//         if (objFile && !objLoaded) {
//             const canvasRenderer = new SceneInit('scene3D');
//             canvasRenderer.initialize();

//             const loader = new GLTFLoader();
//             loader.load(
//                 objFile,
//                 (gltf) => {
//                     // Assuming gltf.scene contains the loaded object
//                     if (gltf.scene) {
//                         canvasRenderer.scene.add(gltf.scene);
//                         setObjLoaded(true);
//                     } else {
//                         console.error('No scene found in the loaded GLTF/GLB file.');
//                     }
//                 },
//                 (xhr) => {
//                     console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
//                 },
//                 (error) => {
//                     console.error('Error loading GLTF/GLB file:', error);
//                 }
//             );
//         }
//     }, [objFile, objLoaded]);

//     const handleFileUploadInApp = (file) => {
//         setObjFile(URL.createObjectURL(file));
//     };

// return (
//     <div className="App">
//         <header className='app-header'>
//             <h1>3D renderer ThreeJS</h1> 
//             <Menu handleFileUploadInApp={handleFileUploadInApp} /> 
//             {objLoaded && <canvas id="scene3D" />}
//         </header>
//         <div className="app-body">
//             <canvas id = "scene3D"/>
//         </div>
//     </div>
// );

//-------------------------------------------------------------------------------------------------

// let loadedModel;
// const glftLoader = new glftLoader();
// glftLoader.load('./assets/shiba/scene.gltf', (gltfScene) => {
    //   loadedModel = gltfScene;
    //   // console.log(loadedModel);
    
    //   gltfScene.scene.rotation.y = Math.PI / 8;
    //   gltfScene.scene.position.y = 3;
    //   gltfScene.scene.scale.set(10, 10, 10);
    //   test.scene.add(gltfScene.scene);
    // });