'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.2, 7.5);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isVisible = true;
    let isReducedMotion = mediaQuery.matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const orbGeometry = new THREE.IcosahedronGeometry(1.45, 5);
    const orbMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.6,
      roughness: 0.15,
      transmission: 0.35,
      transparent: true,
      opacity: 0.8,
      emissive: new THREE.Color('#3f3f46'),
      emissiveIntensity: 0.4,
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    group.add(orb);

    const wireframe = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.82, 0)),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16 }),
    );
    group.add(wireframe);

    const ringGeometry = new THREE.TorusGeometry(2.85, 0.02, 24, 240);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.28 });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.6;
    ring.rotation.y = Math.PI / 5;
    scene.add(ring);

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 140;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i += 1) {
      const radius = 3.2 + Math.random() * 2.8;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 3;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.035,
        transparent: true,
        opacity: 0.75,
      }),
    );
    scene.add(particles);

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    const directional = new THREE.DirectionalLight(0xffffff, 2.2);
    directional.position.set(3, 3, 4);
    scene.add(ambient, directional);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 },
    );
    observer.observe(mount);

    const handleReducedMotion = (event: MediaQueryListEvent) => {
      isReducedMotion = event.matches;
    };
    mediaQuery.addEventListener('change', handleReducedMotion);

    let frame = 0;

    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (!isVisible) {
        return;
      }

      const t = performance.now() * 0.0004;
      const motionScale = isReducedMotion ? 0.2 : 1;

      group.rotation.x = t * 0.42 * motionScale;
      group.rotation.y = t * 0.58 * motionScale;
      ring.rotation.z = t * 0.32 * motionScale;
      particles.rotation.y = t * 0.18 * motionScale;
      particles.rotation.x = Math.sin(t * 1.2) * 0.04 * motionScale;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) {
        return;
      }

      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleReducedMotion);
      mount.removeChild(renderer.domElement);
      orbGeometry.dispose();
      orbMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      particleGeometry.dispose();
      (particles.material as THREE.Material).dispose();
      (wireframe.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="h-[320px] w-full lg:h-[480px]" aria-hidden="true" />;
}
