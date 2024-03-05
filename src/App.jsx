import React from 'react'
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import SceneInit from './SceneInit';
//import Menu from './components/Menu'
//import './App.css'

function App(){
    const [geometry, setGeometry] = useState(null); // State to store the loaded geometry

    useEffect(() => {
        load3d()
    }, [])

    const onJsBtnCLick = () => {
        const startTime = performance.now();
        calculateGeometricCenter(geometry)
        const endTime = performance.now();
        console.log(`Loading time: ${endTime - startTime}`)
    }

    const onWasmBtnCLick = () => {
        const startTime = performance.now();
        // Call WASM function here
        const endTime = performance.now();
        console.log("WASM load performance: ", endTime - startTime)
    }
    

    function calculateGeometricCenter(bufferGeometry) {
        if (!bufferGeometry.isBufferGeometry) {
            console.error('Geometry is not BufferGeometry.');
            return new THREE.Vector3();
        }
    
        const positionAttribute = bufferGeometry.getAttribute('position');
        const vertexCount = positionAttribute.count;
        let centroid = new THREE.Vector3(0, 0, 0);
    
        for (let i = 0; i < vertexCount; i++) {
            centroid.x += positionAttribute.getX(i);
            centroid.y += positionAttribute.getY(i);
            centroid.z += positionAttribute.getZ(i);
        }
    
        centroid.divideScalar(vertexCount);
    
        console.log('Geometric Center:', centroid);
        return centroid;
    }
    

    const load3d = () => {
        const test = new SceneInit('myThreeJsCanvas');
        test.initialize();
        test.animate();
    
        const glftLoader = new GLTFLoader();
        glftLoader.load('/src/assets/truck.glb', (gltfScene) => {
            const loadedModel = gltfScene.scene;
            loadedModel.name = "object" // set object name

            // Calculate bounding box
            const boundingBox = new THREE.Box3().setFromObject(loadedModel);
            const size = new THREE.Vector3();
            boundingBox.getSize(size);

            gltfScene.scene.traverse((child) => {
                if (child.isMesh) {
                    setGeometry(child.geometry); // This line stores the geometry
                }
            });

            // Calculate scale factor based on the maximum dimension of the bounding box
            const scaleFactor = 10 / Math.max(size.x, size.y, size.z);

            // Apply scale to the model
            loadedModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

    
            loadedModel.rotation.y = Math.PI / 8;
            //gltfScene.scene.position.y = 0;
            //gltfScene.scene.scale.set(8, 8, 8)
            
            // Traverse the loaded model
            loadedModel.traverse((child) => {
                // Check if the child is a mesh and has geometry
                if (child.isMesh && child.geometry) {
                    
                    //print information about the geometry
                    console.log("Geometry name:", child.name);
                    console.log("Geometry:", child.geometry);
                    
                    //set states
                    setBufferGeometry(child.geometry);
                    setIsLoading(false);
                }
            });
            test.scene.add(loadedModel);
            
        //     if (gltfScene.scene.children.length > 0) {
                
        //         let object = gltfScene.scene.children[ 0 ];
        //         if (object !== undefined) {
        //             console.log("Buffer Geometry:", object.geometry);
        //             setBufferGeometry(object.geometry);
        //             setIsLoading(false);
        //         } else {
        //             console.error("No geometry found on the loaded object.");
        //         }
        //     } else {
        //         console.error("No children found in GLTF scene.");
        //     }
        // }, undefined, (error) => {
        //     console.error("Error loading GLTF model:", error);
        });
    }
    
    return (
        <div>
            <button onClick={onJsBtnCLick} disabled={isLoading}>Process with JS</button>
            <button>Process with Wasm</button>
            <canvas id="myThreeJsCanvas"/>
        </div>
    );
}

export default App;