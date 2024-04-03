import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import WindowManager from './WindowManager';

const App = () => {
    const canvasRef = useRef(null);
    const scene = useRef(new THREE.Scene());
    const camera = useRef(new THREE.OrthographicCamera(0, window.innerWidth, 0, window.innerHeight, -10000, 10000));
    const renderer = useRef(new THREE.WebGLRenderer());
    const world = useRef(new THREE.Object3D());
    const cubes = useRef([]);
    const windowManager = useRef(null);
    const sceneOffset = useRef({ x: 0, y: 0 });
    const sceneOffsetTarget = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        const addOriginCube = () => {
          const cubeSize = 50;
          const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
          const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
          const originCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
          originCube.position.set(window.innerWidth / 2, window.innerHeight / 2, 0);
          world.current.add(originCube);
          return originCube;
      };
      
        const init = () => {
            setupScene();
            setupWindowManager();
            resize();
            updateWindowShape(false);
            render();
            window.addEventListener('resize', resize);
        };
        
        const setupScene = () => {
            camera.current.position.z = 2.5;
            scene.current.background = new THREE.Color(0.0);
            renderer.current.setPixelRatio(window.devicePixelRatio);
            renderer.current.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.current.domElement);
            scene.current.add(world.current);
        
            // Add origin cube for this window
            const originCube = addOriginCube();
            cubes.current.push(originCube);
        };
      

        const setupWindowManager = () => {
            windowManager.current = new WindowManager();
            windowManager.current.setWinShapeChangeCallback(updateWindowShape);
            windowManager.current.setWinChangeCallback(windowsUpdated);
            const metaData = { foo: "bar" };
            windowManager.current.init(metaData);
            windowsUpdated();
        };

        const render = () => {
          windowManager.current.update();
          // let t = getTime();
          let falloff = 0.05;
          sceneOffset.current.x += (sceneOffsetTarget.current.x - sceneOffset.current.x) * falloff;
          sceneOffset.current.y += (sceneOffsetTarget.current.y - sceneOffset.current.y) * falloff;
          world.current.position.x = sceneOffset.current.x;
          world.current.position.y = sceneOffset.current.y;
      
          // Rotate cubes
          cubes.current.forEach(cube => {
              cube.rotation.x += 0.01;
              cube.rotation.y += 0.01;
          });
      
          renderer.current.render(scene.current, camera.current);
          requestAnimationFrame(render);
      };
      

        const resize = () => {
            camera.current.left = 0;
            camera.current.right = window.innerWidth;
            camera.current.top = 0;
            camera.current.bottom = window.innerHeight;
            camera.current.updateProjectionMatrix();
            renderer.current.setSize(window.innerWidth, window.innerHeight);
        };

        const getTime = () => {
            return (new Date().getTime() - today.getTime()) / 1000.0;
        };

        const updateWindowShape = (easing = true) => {
            sceneOffsetTarget.current = { x: -window.screenX, y: -window.screenY };
            if (!easing) sceneOffset.current = sceneOffsetTarget.current;
        };

        const windowsUpdated = () => {
            updateNumberOfCubes();
        };

        const updateNumberOfCubes = () => {
            let wins = windowManager.current.getWindows();
            cubes.current.forEach((c) => {
                world.current.remove(c);
            });
            cubes.current = [];
            for (let i = 0; i < wins.length; i++) {
                addCube(i, wins[i]);
            }
        };

        const addCube = (index, win) => {
            let c = new THREE.Color();
            c.setHSL(index * 0.1, 1.0, 0.5);
            let s = 100 + index * 50;
            let cube = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), new THREE.MeshBasicMaterial({ color: c, wireframe: true }));
            cube.position.x = win.shape.x + (win.shape.w * 0.5);
            cube.position.y = win.shape.y + (win.shape.h * 0.5);
            world.current.add(cube);
            cubes.current.push(cube);
        };

        init();

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <div ref={canvasRef} />;
};

export default App;
