'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const INITIAL_ELEMENTS = 1400;
const MIN_ELEMENTS = 400;
const MAX_ELEMENTS = 1600;
const DEPTH = 4200;
const SPAWN_RADIUS_X = 2800;
const SPAWN_RADIUS_Y = 1800;

function createTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');

  if (!context) {
    return null;
  }

  context.fillStyle = '#071018';
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 90; i += 1) {
    context.strokeStyle = `rgba(${140 + Math.random() * 100}, ${40 + Math.random() * 50}, ${90 + Math.random() * 120}, ${0.14 + Math.random() * 0.24})`;
    context.lineWidth = 1 + Math.random() * 2.5;
    context.beginPath();
    context.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    context.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    context.stroke();
  }

  for (let i = 0; i < 180; i += 1) {
    const size = 1 + Math.random() * 3;
    context.fillStyle = `rgba(255, ${50 + Math.random() * 90}, ${120 + Math.random() * 90}, ${0.12 + Math.random() * 0.25})`;
    context.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function randomRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function BackgroundVisual() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const [count, setCount] = useState(INITIAL_ELEMENTS);
  const label = useMemo(() => `${count}`, [count]);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020304, 0.00032);

    const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 520;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = mediaQuery.matches;
    let mouseX = 0;
    let mouseY = 0;
    let frame = 0;
    let currentCount = 0;

    const ambient = new THREE.AmbientLight(0x7288a9, 0.78);
    const cyanLight = new THREE.PointLight(0x2cb8ff, 12, 4000, 2);
    cyanLight.position.set(-980, 240, 520);
    const magentaLight = new THREE.PointLight(0xff4f8d, 11, 3400, 2);
    magentaLight.position.set(1120, -180, 420);
    const fillLight = new THREE.PointLight(0x7c5cff, 6, 3600, 2);
    fillLight.position.set(80, 680, -1600);
    scene.add(ambient, cyanLight, magentaLight, fillLight);

    const cubeTexture = createTexture();
    const geometries = [
      new THREE.BoxGeometry(44, 12, 126),
      new THREE.BoxGeometry(28, 18, 88),
      new THREE.BoxGeometry(18, 12, 56),
      new THREE.BoxGeometry(14, 9, 34),
      new THREE.BoxGeometry(9, 9, 22),
    ];

    const materials = [
      new THREE.MeshStandardMaterial({
        color: '#06121a',
        map: cubeTexture,
        emissive: '#1f3650',
        emissiveMap: cubeTexture ?? undefined,
        emissiveIntensity: 1.3,
        roughness: 0.56,
        metalness: 0.74,
      }),
      new THREE.MeshStandardMaterial({
        color: '#081118',
        map: cubeTexture,
        emissive: '#4e1831',
        emissiveMap: cubeTexture ?? undefined,
        emissiveIntensity: 1.24,
        roughness: 0.48,
        metalness: 0.78,
      }),
      new THREE.MeshStandardMaterial({
        color: '#08111a',
        map: cubeTexture,
        emissive: '#14354e',
        emissiveMap: cubeTexture ?? undefined,
        emissiveIntensity: 1.18,
        roughness: 0.52,
        metalness: 0.82,
      }),
    ];

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i += 1) {
      starPositions[i * 3] = randomRange(-2200, 2200);
      starPositions[i * 3 + 1] = randomRange(-1400, 1400);
      starPositions[i * 3 + 2] = randomRange(-DEPTH, 400);
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({
        color: '#d7ecff',
        size: 2.2,
        transparent: true,
        opacity: 0.52,
        depthWrite: false,
      }),
    );
    scene.add(stars);

    const wireGeometry = new THREE.BufferGeometry();
    const wireSegments = 240;
    const wirePositions = new Float32Array(wireSegments * 6);

    for (let i = 0; i < wireSegments; i += 1) {
      const startX = randomRange(-SPAWN_RADIUS_X, SPAWN_RADIUS_X);
      const startY = randomRange(-SPAWN_RADIUS_Y, SPAWN_RADIUS_Y);
      const startZ = randomRange(-DEPTH, 280);
      wirePositions[i * 6] = startX;
      wirePositions[i * 6 + 1] = startY;
      wirePositions[i * 6 + 2] = startZ;
      wirePositions[i * 6 + 3] = startX + randomRange(-120, 120);
      wirePositions[i * 6 + 4] = startY + randomRange(-120, 120);
      wirePositions[i * 6 + 5] = startZ + randomRange(80, 220);
    }

    wireGeometry.setAttribute('position', new THREE.BufferAttribute(wirePositions, 3));
    const wires = new THREE.LineSegments(
      wireGeometry,
      new THREE.LineBasicMaterial({
        color: '#6ea7ff',
        transparent: true,
        opacity: 0.12,
      }),
    );
    scene.add(wires);

    const field = new THREE.Group();
    scene.add(field);

    const positionMesh = (mesh: THREE.Mesh, z?: number) => {
      mesh.position.set(
        randomRange(-SPAWN_RADIUS_X, SPAWN_RADIUS_X),
        randomRange(-SPAWN_RADIUS_Y, SPAWN_RADIUS_Y),
        z ?? randomRange(-DEPTH, 220),
      );
      mesh.rotation.set(
        randomRange(0, Math.PI * 2),
        randomRange(0, Math.PI * 2),
        randomRange(0, Math.PI * 2),
      );
      const scale = randomRange(0.6, 3.4);
      mesh.scale.setScalar(scale);
      mesh.userData.velocity = randomRange(6.5, 17);
      mesh.userData.spinX = randomRange(-0.024, 0.024);
      mesh.userData.spinY = randomRange(-0.024, 0.024);
      mesh.userData.driftX = randomRange(-0.42, 0.42);
      mesh.userData.driftY = randomRange(-0.26, 0.26);
    };

    const addCube = (z?: number) => {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geometry, material);
      positionMesh(mesh, z);
      field.add(mesh);
    };

    const removeCube = () => {
      const mesh = field.children[field.children.length - 1];
      if (mesh) {
        field.remove(mesh);
      }
    };

    const adjustMeshCount = (nextCount: number) => {
      const diff = nextCount - currentCount;

      if (diff > 0) {
        for (let i = 0; i < diff; i += 1) {
          addCube(randomRange(-DEPTH, 200));
        }
      } else if (diff < 0) {
        for (let i = 0; i < Math.abs(diff); i += 1) {
          removeCube();
        }
      }

      currentCount = nextCount;
    };

    adjustMeshCount(INITIAL_ELEMENTS);

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const onReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
    };

    const animate = () => {
      frame = requestAnimationFrame(animate);

      const speedScale = reducedMotion ? 0.25 : 1;
      const driftScale = reducedMotion ? 0.1 : 1;

      camera.position.x += ((mouseX * 140) - camera.position.x) * 0.024;
      camera.position.y += ((mouseY * 84) - camera.position.y) * 0.024;
      camera.lookAt(camera.position.x * 0.18, camera.position.y * 0.08, -1200);

      cyanLight.position.x = -920 + mouseX * 420;
      cyanLight.position.y = 240 + mouseY * 220;
      magentaLight.position.x = 1120 - mouseX * 360;
      magentaLight.position.y = -180 - mouseY * 180;

      field.children.forEach((child) => {
        child.position.z += child.userData.velocity * speedScale;
        child.position.x += child.userData.driftX * driftScale;
        child.position.y += child.userData.driftY * driftScale;
        child.rotation.x += child.userData.spinX * speedScale;
        child.rotation.y += child.userData.spinY * speedScale;

        if (child.position.z > 680) {
          positionMesh(child as THREE.Mesh, -DEPTH);
        }
      });

      stars.rotation.z += 0.00028 * speedScale;
      wires.rotation.z -= 0.00022 * speedScale;
      wires.rotation.x += 0.00008 * speedScale;

      renderer.render(scene, camera);
    };

    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    mediaQuery.addEventListener('change', onReducedMotionChange);
    animate();

    const slider = sliderRef.current;
    const onSliderInput = (event: Event) => {
      const nextCount = Number.parseInt((event.target as HTMLInputElement).value, 10);
      adjustMeshCount(nextCount);
      setCount(nextCount);
    };

    slider?.addEventListener('input', onSliderInput);

    return () => {
      slider?.removeEventListener('input', onSliderInput);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      mediaQuery.removeEventListener('change', onReducedMotionChange);
      cancelAnimationFrame(frame);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      cubeTexture?.dispose();
      starsGeometry.dispose();
      wireGeometry.dispose();
      (stars.material as THREE.Material).dispose();
      (wires.material as THREE.Material).dispose();
      renderer.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div ref={mountRef} id="visual-container" className="absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_12%,rgba(0,0,0,0.06)_54%,rgba(0,0,0,0.2)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.08)_30%,rgba(0,0,0,0.14)_100%)]" />
      <div className="pointer-events-auto absolute bottom-4 right-4 hidden items-center gap-6 rounded-[1.35rem] border border-white/10 bg-slate-800/72 px-6 py-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl md:flex">
        <input
          ref={sliderRef}
          type="range"
          min={MIN_ELEMENTS}
          max={MAX_ELEMENTS}
          defaultValue={INITIAL_ELEMENTS}
          className="h-2 w-48 cursor-pointer appearance-none rounded-full bg-zinc-600/60 outline-none"
          aria-label="Adjust background cube count"
        />
        <span className="min-w-14 text-right text-2xl font-semibold text-zinc-300 [text-shadow:0_0_18px_rgba(160,160,160,0.6)]">
          {label}
        </span>
      </div>
    </div>
  );
}
