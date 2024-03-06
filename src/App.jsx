import React from 'react'
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import SceneInit from './SceneInit';
import init, { run_bevy_app } from '../wasm_3d/pkg/wasm_3d';
//import Menu from './components/Menu'
//import './App.css'

function App() {
    const [model, setModel] = useState(null)
    const [jsLoadTime, setJsLoadTime] = useState(null)
    const [wasmLoadTime, setWasmLoadTime] = useState(null)

    useEffect(() => {
        init().then(() => {
            console.log('Wasm module initialized');
        });
    }, []);


    const onJsBtnCLick = () => {
        const startTime = performance.now();
        load3d();        
        const endTime = performance.now();
        setJsLoadTime(endTime-startTime)
    }

    const onWasmBtnCLick = async () => {
        const startTime = performance.now();
        try {
            run_bevy_app();
        } catch (error) {
            
        }
        const endTime = performance.now();
        setWasmLoadTime(endTime-startTime)
    }

    


    const load3d = () => {
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

            setModel(gltfScene)

            // Calculate scale factor based on the maximum dimension of the bounding box
            const scaleFactor = 10 / Math.max(size.x, size.y, size.z);

            // Apply scale to the model
            gltfScene.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);


            gltfScene.scene.rotation.y = Math.PI / 8;

            test.scene.add(gltfScene.scene);
        });
    }

    return (
        <div className='App'>
            <div>
            <button onClick={onJsBtnCLick}>Process with JS</button>
            <button onClick={onWasmBtnCLick}>Process with Wasm</button>
            <h3>JS load time: {jsLoadTime}</h3>
            <h3>Wasm load time: {wasmLoadTime}</h3>
            </div>

            <canvas id="myThreeJsCanvas" />
        </div>
    );
}

export default App;