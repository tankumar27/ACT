'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function PracticeSphere() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 5;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isVisible = true;
    let isReducedMotion = mediaQuery.matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.3));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.2, 6);
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.03,
      transparent: true,
      opacity: 0.78,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06 }),
    );
    scene.add(glow);

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
      const t = performance.now() * 0.0008;
      const motionScale = isReducedMotion ? 0.3 : 1;
      points.rotation.y = t * 0.45 * motionScale;
      points.rotation.x = t * 0.28 * motionScale;
      glow.scale.setScalar(1 + Math.sin(t * 2) * 0.035 * motionScale);
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
      geometry.dispose();
      material.dispose();
      (glow.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="h-48 w-full" aria-hidden="true" />;
}
