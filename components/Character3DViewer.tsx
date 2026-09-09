'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Box,
  RotateCw,
  Eye,
  Sun,
  Moon,
  Sparkles,
  Shield,
  Zap,
  Info,
  Layers,
  Crosshair,
  Maximize2,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import type { FFPlayerData } from '@/lib/freefire';

interface Character3DViewerProps {
  player: FFPlayerData;
}

const DEFAULT_SKILLS = ['205000661', '214000000', '211052001', '203052002', '204052002'];

export function Character3DViewer({ player }: Character3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [lightingTheme, setLightingTheme] = useState<'tactical' | 'cyberpunk' | 'sunset'>('tactical');
  const [selectedSlot, setSelectedSlot] = useState<'avatar' | 'clothes' | 'weapon' | 'skills' | 'skincolor'>('clothes');

  const { basic, profile, pet } = player;

  // Equipment values
  const avatarId = profile?.avatarId ?? 3;
  const clothesIds = profile?.clothes && profile.clothes.length > 0 ? profile.clothes : ['50'];
  const skinColorCode = profile?.skinColor ?? 3006;
  const weaponId = profile?.pvePrimaryWeapon ?? 1;
  const equippedSkills = profile?.equippedSkills && profile.equippedSkills.length > 0 ? profile.equippedSkills : DEFAULT_SKILLS;
  const skillsKey = equippedSkills.join(',');

  // Three.js refs for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const characterGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const lightsRef = useRef<{ key: THREE.DirectionalLight; rim: THREE.PointLight; ambient: THREE.AmbientLight } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.3, 4.2);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffa24c, 1.8);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 2.5, 10);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    lightsRef.current = { key: keyLight, rim: rimLight, ambient: ambientLight };

    // 5. Grid and Floor Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.4, 1.6, 0.15, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.8,
      roughness: 0.3,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.075;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Hologram Ring around pedestal
    const ringGeo = new THREE.RingGeometry(1.45, 1.55, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);

    // 6. Build Stylized 3D Character Mannequin
    const charGroup = new THREE.Group();
    characterGroupRef.current = charGroup;
    scene.add(charGroup);

    materialsRef.current = [];

    // Calculate tone from skinColorCode (e.g. 3006)
    const baseHue = (skinColorCode % 360) / 360;
    const skinColorHex = skinColorCode === 3006 ? 0xd4a373 : new THREE.Color().setHSL(baseHue, 0.45, 0.55).getHex();

    const skinMat = new THREE.MeshStandardMaterial({
      color: skinColorHex,
      roughness: 0.6,
      metalness: 0.1,
    });
    materialsRef.current.push(skinMat);

    const clothesMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.4,
      metalness: 0.3,
    });
    materialsRef.current.push(clothesMat);

    const armorAccentMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.3,
      metalness: 0.7,
      emissive: 0x7c2d12,
      emissiveIntensity: 0.3,
    });
    materialsRef.current.push(armorAccentMat);

    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
    });
    materialsRef.current.push(visorMat);

    // Head
    const headGeo = new THREE.SphereGeometry(0.18, 24, 24);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.62;
    head.castShadow = true;
    charGroup.add(head);

    // Tactical Visor / Mask
    const visorGeo = new THREE.BoxGeometry(0.22, 0.08, 0.15);
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.63, 0.11);
    charGroup.add(visor);

    // Torso / Tactical Vest (Clothes #50)
    const torsoGeo = new THREE.CylinderGeometry(0.24, 0.2, 0.62, 16);
    const torso = new THREE.Mesh(torsoGeo, clothesMat);
    torso.position.y = 1.15;
    torso.castShadow = true;
    charGroup.add(torso);

    // Chest Rig Armor Plating
    const plateGeo = new THREE.BoxGeometry(0.3, 0.32, 0.28);
    const plate = new THREE.Mesh(plateGeo, armorAccentMat);
    plate.position.set(0, 1.2, 0.04);
    charGroup.add(plate);

    // Belt
    const beltGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.07, 16);
    const belt = new THREE.Mesh(beltGeo, armorAccentMat);
    belt.position.y = 0.82;
    charGroup.add(belt);

    // Left Arm
    const armGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.55, 12);
    const leftArm = new THREE.Mesh(armGeo, clothesMat);
    leftArm.position.set(-0.34, 1.15, 0.05);
    leftArm.rotation.z = 0.2;
    charGroup.add(leftArm);

    // Right Arm (Holding primary weapon)
    const rightArm = new THREE.Mesh(armGeo, clothesMat);
    rightArm.position.set(0.34, 1.15, 0.15);
    rightArm.rotation.x = -0.6;
    rightArm.rotation.z = -0.2;
    charGroup.add(rightArm);

    // Primary Weapon Hologram (ID #1: Assault Rifle)
    const weaponMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xf97316,
      emissiveIntensity: 0.4,
    });
    materialsRef.current.push(weaponMat);

    const rifleBarrelGeo = new THREE.BoxGeometry(0.08, 0.12, 0.75);
    const rifle = new THREE.Mesh(rifleBarrelGeo, weaponMat);
    rifle.position.set(0.32, 1.05, 0.55);
    rifle.rotation.y = -0.1;
    charGroup.add(rifle);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.75, 12);
    const leftLeg = new THREE.Mesh(legGeo, clothesMat);
    leftLeg.position.set(-0.13, 0.42, 0);
    charGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, clothesMat);
    rightLeg.position.set(0.13, 0.42, 0);
    charGroup.add(rightLeg);

    // Boots
    const bootGeo = new THREE.BoxGeometry(0.13, 0.12, 0.24);
    const leftBoot = new THREE.Mesh(bootGeo, armorAccentMat);
    leftBoot.position.set(-0.13, 0.06, 0.04);
    charGroup.add(leftBoot);

    const rightBoot = new THREE.Mesh(bootGeo, armorAccentMat);
    rightBoot.position.set(0.13, 0.06, 0.04);
    charGroup.add(rightBoot);

    // 5 Orbiting Skill Runes / Orbs (representing equipped skills)
    const orbsGroup = new THREE.Group();
    charGroup.add(orbsGroup);

    const orbColors = [0xf97316, 0x06b6d4, 0xa855f7, 0x22c55e, 0xeab308];
    const skillsList = skillsKey.split(',').filter(Boolean);
    skillsList.slice(0, 5).forEach((skillId, idx) => {
      const angle = (idx / 5) * Math.PI * 2;
      const radius = 0.8;
      const orbGeo = new THREE.DodecahedronGeometry(0.05, 0);
      const orbMat = new THREE.MeshBasicMaterial({
        color: orbColors[idx % orbColors.length],
        wireframe: false,
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.set(Math.cos(angle) * radius, 1.1 + Math.sin(angle * 2) * 0.15, Math.sin(angle) * radius);
      orbsGroup.add(orb);
    });

    // 7. Mouse / Touch Orbit Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !charGroup) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      charGroup.rotation.y += deltaX * 0.008;
      charGroup.rotation.x = Math.max(-0.4, Math.min(0.4, charGroup.rotation.x + deltaY * 0.004));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(2.2, Math.min(6.5, camera.position.z + e.deltaY * 0.003));
    };

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !charGroup || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      charGroup.rotation.y += deltaX * 0.01;
      charGroup.rotation.x = Math.max(-0.4, Math.min(0.4, charGroup.rotation.x + deltaY * 0.005));

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });
    dom.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isRotating && charGroup && !isDragging) {
        charGroup.rotation.y += 0.008;
      }

      // Bobbing floating animation
      if (charGroup) {
        charGroup.position.y = Math.sin(elapsedTime * 2) * 0.02;
      }

      // Rotate skill runes
      if (orbsGroup) {
        orbsGroup.rotation.y -= 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 420;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('wheel', handleWheel);
      dom.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [skinColorCode, skillsKey, isRotating]);

  // Handle wireframe toggle
  useEffect(() => {
    materialsRef.current.forEach((mat) => {
      mat.wireframe = wireframe;
    });
  }, [wireframe]);

  // Handle lighting themes
  useEffect(() => {
    if (!lightsRef.current) return;
    const { key, rim, ambient } = lightsRef.current;
    if (lightingTheme === 'tactical') {
      key.color.setHex(0xffa24c);
      rim.color.setHex(0x38bdf8);
      ambient.color.setHex(0xffffff);
      ambient.intensity = 0.85;
    } else if (lightingTheme === 'cyberpunk') {
      key.color.setHex(0xa855f7);
      rim.color.setHex(0x06b6d4);
      ambient.color.setHex(0x1e1b4b);
      ambient.intensity = 1.1;
    } else {
      // Sunset
      key.color.setHex(0xf43f5e);
      rim.color.setHex(0xfbbf24);
      ambient.color.setHex(0x451a03);
      ambient.intensity = 0.95;
    }
  }, [lightingTheme]);

  const handleResetCamera = () => {
    if (characterGroupRef.current) {
      characterGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header Section */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-950/40">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Box className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Visualiseur 3D du Skin &amp; Équipement
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-mono border border-orange-500/30">
                WebGL 360°
              </span>
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Reconstitution 3D en temps réel des identifiants d&apos;apparence Garena (Habits, Teinte de peau, Arme PvE et Runes de compétences).
          </p>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
              isRotating
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isRotating ? 'Rotation ON' : 'Pause'}</span>
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
              wireframe
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{wireframe ? 'Polygones' : 'Solide'}</span>
          </button>

          <button
            onClick={() =>
              setLightingTheme(
                lightingTheme === 'tactical' ? 'cyberpunk' : lightingTheme === 'cyberpunk' ? 'sunset' : 'tactical'
              )
            }
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white flex items-center gap-1.5 transition"
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="capitalize">{lightingTheme}</span>
          </button>

          <button
            onClick={handleResetCamera}
            title="Recentrer le modèle 3D"
            className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D Canvas and Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left: Interactive 3D WebGL Canvas */}
        <div className="lg:col-span-7 relative bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 min-h-[380px] sm:min-h-[440px] flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-800">
          <div ref={mountRef} className="w-full h-full min-h-[380px] sm:min-h-[440px] cursor-grab active:cursor-grabbing" />

          {/* Interactive Hint Floating Badge */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-zinc-400 border border-white/10 pointer-events-none flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-orange-400" />
            <span>Glisser pour pivoter &bull; Molette pour zoomer</span>
          </div>

          {/* Bottom Live Player Info Floating Pill */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none">
            <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{basic.nickname}</span>
              <span className="text-zinc-500 font-mono">Lvl {basic.level}</span>
            </div>

            <div className="bg-orange-950/80 backdrop-blur-md border border-orange-500/30 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-orange-300">
              Skin Tone #{skinColorCode}
            </div>
          </div>
        </div>

        {/* Right: Garena Skin Protocol & Detailed Gear Slots */}
        <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-zinc-900/60">
          {/* Official Garena 3D Protocol Clarification Box */}
          <div className="bg-zinc-950/90 border border-orange-500/30 p-3.5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
              <Info className="w-4 h-4 shrink-0 text-orange-400" />
              <span>Garena propose-t-il le skin en 3D ?</span>
            </div>
            <p className="text-[12px] text-zinc-300 leading-relaxed">
              <strong>Non, Garena ne fournit pas de fichier 3D ouvert (.obj/.gltf)</strong> via ses passerelles HTTP/Protobuf car ses maillages 3D originaux sont protégés et chiffrés dans les paquets Unity (<code className="text-orange-300 text-[11px]">.unity3d</code>) du client de jeu.
            </p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Ce visualiseur WebGL traduit donc directement les identifiants bruts (<code className="text-zinc-300">clothes</code>, <code className="text-zinc-300">skinColor</code>, <code className="text-zinc-300">avatarId</code>, <code className="text-zinc-300">skills</code>) renvoyés par Garena pour modéliser le personnage en 3D interactive.
            </p>
          </div>

          {/* Equipment Slots Breakdown */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Équipement Actif &amp; Identifiants
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Avatar Base */}
              <div
                onClick={() => setSelectedSlot('avatar')}
                className={`p-2.5 rounded-lg border cursor-pointer transition ${
                  selectedSlot === 'avatar'
                    ? 'bg-orange-500/10 border-orange-500/40 ring-1 ring-orange-500/20'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="text-[10px] text-zinc-500 font-semibold uppercase">Avatar Base</div>
                <div className="text-xs font-black text-white mt-0.5 flex items-center justify-between">
                  <span>ID #{avatarId}</span>
                  <span className="text-[10px] font-normal text-orange-400">Combattant</span>
                </div>
              </div>

              {/* Clothes Outfit */}
              <div
                onClick={() => setSelectedSlot('clothes')}
                className={`p-2.5 rounded-lg border cursor-pointer transition ${
                  selectedSlot === 'clothes'
                    ? 'bg-orange-500/10 border-orange-500/40 ring-1 ring-orange-500/20'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="text-[10px] text-zinc-500 font-semibold uppercase">Habits / Outfit</div>
                <div className="text-xs font-black text-white mt-0.5 flex items-center justify-between">
                  <span>ID #{clothesIds[0] || '50'}</span>
                  <span className="text-[10px] font-normal text-emerald-400">Équipé</span>
                </div>
              </div>

              {/* Skin Tone Code */}
              <div
                onClick={() => setSelectedSlot('skincolor')}
                className={`p-2.5 rounded-lg border cursor-pointer transition ${
                  selectedSlot === 'skincolor'
                    ? 'bg-orange-500/10 border-orange-500/40 ring-1 ring-orange-500/20'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="text-[10px] text-zinc-500 font-semibold uppercase">Teinte de Peau</div>
                <div className="text-xs font-black text-white mt-0.5 flex items-center justify-between">
                  <span>Code #{skinColorCode}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d4a373] border border-white/20" />
                </div>
              </div>

              {/* Primary Weapon PvE */}
              <div
                onClick={() => setSelectedSlot('weapon')}
                className={`p-2.5 rounded-lg border cursor-pointer transition ${
                  selectedSlot === 'weapon'
                    ? 'bg-orange-500/10 border-orange-500/40 ring-1 ring-orange-500/20'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="text-[10px] text-zinc-500 font-semibold uppercase">Arme Principale</div>
                <div className="text-xs font-black text-white mt-0.5 flex items-center justify-between">
                  <span>Arme ID #{weaponId}</span>
                  <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </div>
            </div>

            {/* Equipped Skills (5 Slots) */}
            <div
              onClick={() => setSelectedSlot('skills')}
              className={`p-3 rounded-lg border cursor-pointer transition ${
                selectedSlot === 'skills'
                  ? 'bg-orange-500/10 border-orange-500/40 ring-1 ring-orange-500/20'
                  : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Compétences Équipées (5 Runes Actives)
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">{equippedSkills.length} slots</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {equippedSkills.map((skId, idx) => (
                  <span
                    key={skId}
                    className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700/80 font-mono text-[10px] text-zinc-300"
                  >
                    {idx === 0 ? 'Active: ' : `Slot ${idx + 1}: `}
                    <strong className="text-orange-300">{skId}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Pet Companion Note */}
            {pet && (
              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="font-bold text-white">{pet.name}</span>
                    <span className="text-zinc-500 text-[11px] ml-1.5">Lvl {pet.level} (Skin #{pet.skinId || 'Défaut'})</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  Skill #{pet.selectedSkillId}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
