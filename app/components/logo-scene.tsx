"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* The six shards of the Oxcode logo, traced from public/logo.svg. */
const shards: { points: [number, number][]; tone: "teal" | "silver" }[] = [
  { tone: "teal", points: [[189.886, 108.318], [125.202, 43.404], [125.202, 0], [169.217, 0], [233.519, 64.53], [233.519, 108.318]] },
  { tone: "teal", points: [[313.585, 232], [248.901, 167.086], [248.901, 123.682], [292.917, 123.682], [357.218, 188.212], [357.218, 232]] },
  { tone: "silver", points: [[64.684, 232], [0, 167.086], [0, 123.682], [44.016, 123.682], [108.317, 188.212], [108.317, 232]] },
  { tone: "teal", points: [[292.534, 108.318], [357.219, 43.404], [357.219, 0], [313.203, 0], [248.901, 64.53], [248.901, 108.318]] },
  { tone: "silver", points: [[43.642, 108.318], [108.326, 43.404], [108.326, 0], [64.31, 0], [0.008, 64.53], [0.008, 108.318]] },
  { tone: "teal", points: [[167.934, 232], [233.536, 167.086], [233.536, 123.682], [188.895, 123.682], [123.682, 188.212], [123.682, 232]] },
];

const CENTER_X = 178.6;
const CENTER_Y = 116;
const UNIT = 100;

const easeOut = (value: number) => 1 - Math.pow(1 - value, 4);
const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** The logo as a real 3D object: follows the pointer, and comes apart on scroll. */
export default function LogoScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        setFallback(true);
        return;
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 800 ? 1.5 : 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = environment;

      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.z = 11;

      const rim = new THREE.DirectionalLight(0x6ff0da, 3.2);
      rim.position.set(-5, 4, 3);
      scene.add(rim);
      const fill = new THREE.DirectionalLight(0xffffff, 1.1);
      fill.position.set(5, -3, 5);
      scene.add(fill);

      const materials = {
        teal: new THREE.MeshPhysicalMaterial({ color: 0x1f9c8b, metalness: 1, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 0.95 }),
        silver: new THREE.MeshPhysicalMaterial({ color: 0xc9d4d1, metalness: 1, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 0.8 }),
      };

      const logo = new THREE.Group();
      scene.add(logo);

      const geometries: import("three").BufferGeometry[] = [];
      const parts = shards.map((shard, index) => {
        const outline = new THREE.Shape();
        shard.points.forEach(([x, y], pointIndex) => {
          const px = (x - CENTER_X) / UNIT;
          const py = (CENTER_Y - y) / UNIT;
          if (pointIndex === 0) outline.moveTo(px, py);
          else outline.lineTo(px, py);
        });
        outline.closePath();

        const geometry = new THREE.ExtrudeGeometry(outline, {
          depth: 0.42,
          bevelEnabled: true,
          bevelThickness: 0.05,
          bevelSize: 0.035,
          bevelSegments: 4,
        });
        geometry.computeBoundingBox();
        const box = geometry.boundingBox!;
        const cx = (box.min.x + box.max.x) / 2;
        const cy = (box.min.y + box.max.y) / 2;
        const cz = (box.min.z + box.max.z) / 2;
        geometry.translate(-cx, -cy, -cz);
        geometries.push(geometry);

        const mesh = new THREE.Mesh(geometry, materials[shard.tone]);
        logo.add(mesh);

        const length = Math.hypot(cx, cy) || 1;
        return {
          mesh,
          home: new THREE.Vector3(cx, cy, 0),
          direction: new THREE.Vector3(cx / length, cy / length, index % 2 === 0 ? 0.55 : -0.55),
          spin: new THREE.Vector3(index % 2 === 0 ? 1 : -1, index % 3 === 0 ? -1 : 1, 0.5),
          delay: index * 0.08,
        };
      });

      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      const onPointer = (event: PointerEvent) => {
        pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
        pointer.ty = (event.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      let wide = true;
      const resize = () => {
        const { clientWidth, clientHeight } = host;
        renderer.setSize(clientWidth, clientHeight);
        camera.aspect = clientWidth / Math.max(clientHeight, 1);
        camera.updateProjectionMatrix();
        wide = window.innerWidth > 900;
      };
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(host);

      const hero = host.closest<HTMLElement>(".hero");
      const clock = new THREE.Clock();
      let visible = true;
      const seen = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      seen.observe(host);

      let frame = 0;
      const draw = () => {
        frame = requestAnimationFrame(draw);
        if (!visible) return;

        const time = clock.getElapsedTime();
        pointer.x += (pointer.tx - pointer.x) * 0.06;
        pointer.y += (pointer.ty - pointer.y) * 0.06;

        let progress = 0;
        if (hero) {
          const box = hero.getBoundingClientRect();
          progress = clamp(-box.top / Math.max(box.height - window.innerHeight, 1));
        }
        const apart = Math.sin(clamp((progress - 0.12) / 0.76) * Math.PI);

        const scale = wide ? 0.9 : 0.72;
        logo.scale.setScalar(scale);
        logo.position.x = wide ? 1.95 * (1 - clamp(progress / 0.45)) : 0;
        logo.position.y = wide ? 0 : 1.2 * (1 - clamp(progress / 0.45));
        logo.rotation.y = -0.42 + Math.sin(time * 0.45) * 0.16 + pointer.x * 0.42 + progress * Math.PI * 2;
        logo.rotation.x = 0.1 + Math.cos(time * 0.38) * 0.07 + pointer.y * 0.26;

        parts.forEach((part) => {
          const intro = reduced ? 1 : easeOut(clamp((time - part.delay) / 1.5));
          const spread = (1 - intro) * 5 + apart * 1.02;
          part.mesh.position.copy(part.home).addScaledVector(part.direction, spread);
          const turn = (1 - intro) * 2.4 + apart * 0.9;
          part.mesh.rotation.set(part.spin.x * turn, part.spin.y * turn, part.spin.z * turn);
        });

        renderer.render(scene, camera);
      };

      if (reduced) {
        progressOnce();
      } else {
        draw();
      }

      function progressOnce() {
        logo.scale.setScalar(window.innerWidth > 900 ? 0.9 : 0.72);
        logo.position.x = window.innerWidth > 900 ? 1.95 : 0;
        logo.position.y = window.innerWidth > 900 ? 0 : 1.2;
        logo.rotation.set(0.1, -0.42, 0);
        parts.forEach((part) => part.mesh.position.copy(part.home));
        renderer.render(scene, camera);
      }

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", onPointer);
        observer.disconnect();
        seen.disconnect();
        geometries.forEach((geometry) => geometry.dispose());
        materials.teal.dispose();
        materials.silver.dispose();
        environment.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    void start();
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className="logo-scene" ref={hostRef} aria-hidden="true">
      {fallback ? <Image className="logo-scene-fallback" src="/logo.svg" alt="" width={358} height={232} /> : null}
    </div>
  );
}
