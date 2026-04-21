'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const labels = ['MATH', 'ENG', 'SCI', 'READ'];
const actTiming = [
  { label: 'English', stat: '35 min', detail: '50 questions in the enhanced format' },
  { label: 'Math', stat: '50 min', detail: '45 questions with more time per item' },
  { label: 'Reading', stat: '40 min', detail: '36 questions focused on passage evidence' },
  { label: 'Science', stat: '40 min', detail: 'Optional on the enhanced ACT, still valuable to prep' },
];

export default function SectionOrbit() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isVisible = true;
    let isReducedMotion = mediaQuery.matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.4));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.7, 0),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: '#27272a', roughness: 0.22, metalness: 0.7 }),
    );
    scene.add(core);

    const orbit = new THREE.Group();
    scene.add(orbit);

    const nodes = labels.map((_, index) => {
      const angle = (index / labels.length) * Math.PI * 2;
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 24, 24),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.75 }),
      );
      mesh.position.set(Math.cos(angle) * 2.2, Math.sin(angle) * 1.1, Math.sin(angle) * 1.4);
      orbit.add(mesh);
      return mesh;
    });

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.02, 16, 220),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 }),
    );
    ring.rotation.x = Math.PI / 2.4;
    scene.add(ring);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(3, 2, 4);
    scene.add(key);

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
      const t = performance.now() * 0.00055;
      const motionScale = isReducedMotion ? 0.25 : 1;

      orbit.rotation.y = t * 0.5 * motionScale;
      orbit.rotation.x = Math.sin(t * 0.7) * 0.08 * motionScale;
      core.rotation.x = t * 0.7 * motionScale;
      core.rotation.y = t * 0.55 * motionScale;
      nodes.forEach((node, index) => {
        node.scale.setScalar(1 + Math.sin(t * 1.4 + index) * 0.04 * motionScale);
      });

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
      renderer.dispose();
    };
  }, []);

  return (
    <div className="panel rounded-[2rem] p-6" data-reveal>
      <div ref={mountRef} className="h-64 w-full" aria-hidden="true" />
      <div className="mt-4 flex flex-wrap gap-2">
        {labels.map((label) => (
          <span
            key={label}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-[0.3em] text-zinc-300"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="section-rule mt-5" />
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-zinc-500">ACT at a glance</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
          Clear pacing targets for every core section.
        </h3>
        <p className="mt-3 text-sm leading-7 text-zinc-300">
          ACT Forge keeps the four classic study tracks side by side, then layers in the current enhanced
          timing structure so students can practice with better pacing expectations from the start.
        </p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {actTiming.map((item) => (
          <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">{item.label}</p>
              <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.24em] text-zinc-300">
                {item.stat}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{item.detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/practice" className="button-primary button-primary-sm">
          Start a timed set
        </Link>
        <Link href="/chat" className="button-secondary button-secondary-sm">
          Ask for section strategy
        </Link>
      </div>
    </div>
  );
}
