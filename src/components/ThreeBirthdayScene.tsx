import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ThreeBirthdaySceneProps {
  isLit: boolean;
  onBlowCandle: () => void;
  onOpenGift: () => void;
  girlfriendName: string;
}

export const ThreeBirthdayScene: React.FC<ThreeBirthdaySceneProps> = ({
  isLit,
  onBlowCandle,
  onOpenGift,
  girlfriendName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const flameMeshRef = useRef<THREE.Mesh | null>(null);
  const flameLightRef = useRef<THREE.PointLight | null>(null);
  const smokeParticlesRef = useRef<THREE.Points | null>(null);
  const giftLidRef = useRef<THREE.Group | null>(null);
  const isLidOpenRef = useRef<boolean>(false);
  const [hoverTarget, setHoverTarget] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0814, 0.035);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.5, 7.2);
    camera.lookAt(0, 1.2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffd5e5, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff0f5, 1.2);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xf43f5e, 0.8);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // Candle Flame Point Light
    const flameLight = new THREE.PointLight(0xffa238, 2.5, 6);
    flameLight.position.set(0, 3.4, 0);
    scene.add(flameLight);
    flameLightRef.current = flameLight;

    // Groups
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Pedestal / Cake Stand
    const standMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5d061,
      metalness: 0.85,
      roughness: 0.25,
    });
    const standPlate = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.4, 0.15, 48), standMaterial);
    standPlate.position.y = 0.08;
    standPlate.receiveShadow = true;
    mainGroup.add(standPlate);

    const standBase = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.6, 0.4, 32), standMaterial);
    standBase.position.y = -0.15;
    mainGroup.add(standBase);

    // 2. Cake Layers
    // Cake Tier 1 (Bottom)
    const cakeMat1 = new THREE.MeshStandardMaterial({
      color: 0xff9ebb, // Velvet Rose
      roughness: 0.4,
      metalness: 0.05,
    });
    const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 0.85, 48), cakeMat1);
    tier1.position.y = 0.58;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    mainGroup.add(tier1);

    // Cream piping swirls for Tier 1
    const creamMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
    const pearlCount = 28;
    for (let i = 0; i < pearlCount; i++) {
      const angle = (i / pearlCount) * Math.PI * 2;
      const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), creamMat);
      pearl.position.set(Math.cos(angle) * 1.9, 0.98, Math.sin(angle) * 1.9);
      mainGroup.add(pearl);
    }

    // Inscribed Chocolate Plaque on Tier 1
    const plaqueCanvas = document.createElement("canvas");
    plaqueCanvas.width = 512;
    plaqueCanvas.height = 256;
    const pctx = plaqueCanvas.getContext("2d");
    if (pctx) {
      const grad = pctx.createLinearGradient(0, 0, 512, 256);
      grad.addColorStop(0, "#3a0e18");
      grad.addColorStop(0.5, "#581827");
      grad.addColorStop(1, "#290810");
      pctx.fillStyle = grad;
      pctx.beginPath();
      if (typeof (pctx as any).roundRect === "function") {
        (pctx as any).roundRect(16, 16, 480, 224, 28);
      } else {
        pctx.rect(16, 16, 480, 224);
      }
      pctx.fill();

      // Golden piping trim
      pctx.strokeStyle = "#fbbf24";
      pctx.lineWidth = 6;
      pctx.stroke();

      pctx.fillStyle = "#fef08a";
      pctx.font = "bold 38px 'Playfair Display', serif";
      pctx.textAlign = "center";
      pctx.textBaseline = "middle";
      pctx.fillText("Happy Birthday", 256, 88);

      pctx.fillStyle = "#f43f5e";
      pctx.font = "bold 52px 'Dancing Script', cursive, sans-serif";
      pctx.fillText(`${girlfriendName || "Ashika"} ❤️`, 256, 158);
    }
    const plaqueTex = new THREE.CanvasTexture(plaqueCanvas);
    const plaqueMat = new THREE.MeshStandardMaterial({
      map: plaqueTex,
      roughness: 0.35,
      metalness: 0.15,
    });
    const plaqueMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.65), plaqueMat);
    plaqueMesh.position.set(0, 0.58, 1.92);
    mainGroup.add(plaqueMesh);

    // Cake Tier 2 (Middle)
    const cakeMat2 = new THREE.MeshStandardMaterial({
      color: 0xffe3ec, // Vanilla Strawberry
      roughness: 0.35,
    });
    const tier2 = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.75, 48), cakeMat2);
    tier2.position.y = 1.35;
    tier2.castShadow = true;
    tier2.receiveShadow = true;
    mainGroup.add(tier2);

    // Pearl ring for Tier 2
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), creamMat);
      pearl.position.set(Math.cos(angle) * 1.35, 1.7, Math.sin(angle) * 1.35);
      mainGroup.add(pearl);
    }

    // Cake Tier 3 (Top)
    const cakeMat3 = new THREE.MeshStandardMaterial({
      color: 0xf43f5e, // Radiant Rose
      roughness: 0.3,
    });
    const tier3 = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.65, 40), cakeMat3);
    tier3.position.y = 2.05;
    tier3.castShadow = true;
    tier3.receiveShadow = true;
    mainGroup.add(tier3);

    // Strawberries & Toppings on top tier
    const strawberryMat = new THREE.MeshStandardMaterial({
      color: 0xd90429,
      roughness: 0.2,
    });
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const berry = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.24, 16), strawberryMat);
      berry.position.set(Math.cos(angle) * 0.58, 2.45, Math.sin(angle) * 0.58);
      berry.rotation.x = Math.PI;
      mainGroup.add(berry);
    }

    // 3. The Candle
    const candleGroup = new THREE.Group();
    candleGroup.name = "candle";
    const candleStickMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
    });
    const candleStick = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.7, 24), candleStickMat);
    candleStick.position.y = 2.7;
    candleGroup.add(candleStick);

    // Candle Spiral Stripe (blush pink)
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    for (let s = 0; s < 4; s++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.072, 0.015, 8, 20), stripeMat);
      ring.position.y = 2.45 + s * 0.15;
      ring.rotation.x = Math.PI / 2 + 0.2;
      candleGroup.add(ring);
    }

    // Wick
    const wick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8),
      new THREE.MeshBasicMaterial({ color: 0x222222 })
    );
    wick.position.y = 3.1;
    candleGroup.add(wick);

    // Flame (Teardrop shape)
    const flameGeo = new THREE.SphereGeometry(0.12, 16, 16);
    flameGeo.scale(0.8, 2.0, 0.8);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffbe3b,
      transparent: true,
      opacity: 0.95,
    });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.y = 3.28;
    flameMesh.name = "flame";
    candleGroup.add(flameMesh);
    flameMeshRef.current = flameMesh;

    // Inner bright core of flame
    const coreGeo = new THREE.SphereGeometry(0.06, 12, 12);
    coreGeo.scale(0.6, 1.6, 0.6);
    const coreMesh = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    coreMesh.position.y = 3.25;
    flameMesh.add(coreMesh);

    mainGroup.add(candleGroup);

    // 4. Smoke particle system for when candle is blown
    const smokeCount = 35;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePositions = new Float32Array(smokeCount * 3);
    const smokeVelocities = new Float32Array(smokeCount * 3);
    for (let i = 0; i < smokeCount; i++) {
      smokePositions[i * 3] = (Math.random() - 0.5) * 0.1;
      smokePositions[i * 3 + 1] = 3.1 + Math.random() * 0.2;
      smokePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      smokeVelocities[i * 3] = (Math.random() - 0.5) * 0.005;
      smokeVelocities[i * 3 + 1] = 0.015 + Math.random() * 0.02;
      smokeVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    smokeGeo.setAttribute("position", new THREE.BufferAttribute(smokePositions, 3));
    const smokeMat = new THREE.PointsMaterial({
      color: 0xd8b4e2,
      size: 0.12,
      transparent: true,
      opacity: 0,
    });
    const smokeParticles = new THREE.Points(smokeGeo, smokeMat);
    mainGroup.add(smokeParticles);
    smokeParticlesRef.current = smokeParticles;

    // 5. Floating 3D Extruded Hearts Galaxy
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    heartShape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
    heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings = {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.center();

    const heartColors = [0xf43f5e, 0xfb7185, 0xf472b6, 0xfbbf24, 0xe11d48, 0xffe4e6];
    const heartsArray: {
      mesh: THREE.Mesh;
      baseY: number;
      orbitRadius: number;
      orbitSpeed: number;
      angle: number;
      rotSpeed: THREE.Vector3;
    }[] = [];

    const numHearts = 22;
    for (let i = 0; i < numHearts; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: heartColors[i % heartColors.length],
        metalness: 0.4,
        roughness: 0.2,
      });
      const heartMesh = new THREE.Mesh(heartGeo, mat);
      const scale = 0.22 + Math.random() * 0.25;
      heartMesh.scale.set(scale, scale, scale);

      const orbitRadius = 2.4 + Math.random() * 2.2;
      const angle = (i / numHearts) * Math.PI * 2 + Math.random() * 0.5;
      const baseY = 0.8 + Math.random() * 3.2;

      heartMesh.position.set(
        Math.cos(angle) * orbitRadius,
        baseY,
        Math.sin(angle) * orbitRadius
      );
      mainGroup.add(heartMesh);

      heartsArray.push({
        mesh: heartMesh,
        baseY,
        orbitRadius,
        orbitSpeed: 0.25 + Math.random() * 0.4,
        angle,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.03,
          (Math.random() - 0.5) * 0.02
        ),
      });
    }

    // 6. 3D Gift Box
    const giftGroup = new THREE.Group();
    giftGroup.name = "gift";
    giftGroup.position.set(2.4, 0.4, 1.2);
    giftGroup.rotation.y = -0.4;

    const giftBoxMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48, // Ruby red
      roughness: 0.3,
      metalness: 0.2,
    });
    const giftRibbonMat = new THREE.MeshStandardMaterial({
      color: 0xf5d061, // Gold ribbon
      metalness: 0.7,
      roughness: 0.2,
    });

    // Box body
    const boxBody = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.8), giftBoxMat);
    giftGroup.add(boxBody);

    // Ribbons on body
    const ribbonV = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.71, 0.82), giftRibbonMat);
    const ribbonH = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.71, 0.12), giftRibbonMat);
    giftGroup.add(ribbonV);
    giftGroup.add(ribbonH);

    // Box Lid (Can open/lift)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.35, 0);

    const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.15, 0.86), giftBoxMat);
    lidGroup.add(lidMesh);

    const lidRibbonV = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.16, 0.88), giftRibbonMat);
    const lidRibbonH = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.16, 0.13), giftRibbonMat);
    lidGroup.add(lidRibbonV);
    lidGroup.add(lidRibbonH);

    // Bow on top
    const bowGeo = new THREE.TorusGeometry(0.1, 0.035, 12, 24);
    const bowL = new THREE.Mesh(bowGeo, giftRibbonMat);
    bowL.position.set(-0.08, 0.12, 0);
    bowL.rotation.y = Math.PI / 4;
    const bowR = new THREE.Mesh(bowGeo, giftRibbonMat);
    bowR.position.set(0.08, 0.12, 0);
    bowR.rotation.y = -Math.PI / 4;
    lidGroup.add(bowL);
    lidGroup.add(bowR);

    giftGroup.add(lidGroup);
    giftLidRef.current = lidGroup;
    mainGroup.add(giftGroup);

    // 7. Golden Star Dust Particles
    const starCount = 180;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 14;
      starPos[i * 3 + 1] = Math.random() * 8 - 1;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffe4e6,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // Raycasting & Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Check hover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([candleStick, flameMesh, boxBody, lidMesh], true);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit === candleStick || hit === flameMesh || hit.parent === flameMesh) {
          setHoverTarget("candle");
          container.style.cursor = "pointer";
        } else if (hit === boxBody || hit === lidMesh || hit.parent === lidGroup) {
          setHoverTarget("gift");
          container.style.cursor = "pointer";
        }
      } else {
        setHoverTarget(null);
        container.style.cursor = isDragging ? "grabbing" : "grab";
      }

      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.007;
      targetRotationX += deltaY * 0.004;
      // Clamp vertical tilt
      targetRotationX = Math.max(-0.35, Math.min(0.45, targetRotationX));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      container.style.cursor = hoverTarget ? "pointer" : "grab";
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([candleStick, flameMesh, boxBody, lidMesh], true);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit === candleStick || hit === flameMesh || hit.parent === flameMesh) {
          onBlowCandle();
        } else if (hit === boxBody || hit === lidMesh || hit.parent === lidGroup) {
          isLidOpenRef.current = !isLidOpenRef.current;
          onOpenGift();
        }
      }
    };

    // Touch events for mobile devices
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.004;
      targetRotationX = Math.max(-0.35, Math.min(0.45, targetRotationX));

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("click", onClick);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth rotate towards target
      if (!isDragging) {
        targetRotationY += 0.003; // Auto gentle orbit
      }
      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.08;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.08;

      // Candle Flame flickering
      if (flameMeshRef.current && flameLightRef.current) {
        if (flameMeshRef.current.visible) {
          const flicker = Math.sin(elapsedTime * 18) * 0.08 + Math.cos(elapsedTime * 27) * 0.05;
          flameMeshRef.current.scale.set(
            0.8 + flicker,
            2.0 + flicker * 1.5,
            0.8 + flicker
          );
          flameMeshRef.current.rotation.z = Math.sin(elapsedTime * 12) * 0.12;
          flameLightRef.current.intensity = 2.4 + flicker * 1.2;
        }
      }

      // Smoke physics if candle is off
      if (smokeParticlesRef.current && smokeParticlesRef.current.visible) {
        const positions = smokeParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < smokeCount; i++) {
          positions[i * 3 + 1] += smokeVelocities[i * 3 + 1];
          positions[i * 3] += Math.sin(elapsedTime * 4 + i) * 0.003;
          if (positions[i * 3 + 1] > 4.5) {
            positions[i * 3 + 1] = 3.1;
            positions[i * 3] = (Math.random() - 0.5) * 0.1;
          }
        }
        smokeParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Floating hearts animation
      heartsArray.forEach((item, index) => {
        item.angle += item.orbitSpeed * 0.008;
        item.mesh.position.x = Math.cos(item.angle) * item.orbitRadius;
        item.mesh.position.z = Math.sin(item.angle) * item.orbitRadius;
        item.mesh.position.y = item.baseY + Math.sin(elapsedTime * 2 + index) * 0.18;
        item.mesh.rotation.x += item.rotSpeed.x;
        item.mesh.rotation.y += item.rotSpeed.y;
        item.mesh.rotation.z += item.rotSpeed.z;
      });

      // Gift Box Lid animation
      if (giftLidRef.current) {
        const targetLidY = isLidOpenRef.current ? 0.85 : 0.35;
        const targetLidRot = isLidOpenRef.current ? -0.5 : 0;
        giftLidRef.current.position.y += (targetLidY - giftLidRef.current.position.y) * 0.1;
        giftLidRef.current.rotation.z += (targetLidRot - giftLidRef.current.rotation.z) * 0.1;
      }

      // Gentle star shimmer
      starPoints.rotation.y = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("click", onClick);
      container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", handleResize);

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [girlfriendName]);

  // Update candle state smoothly
  useEffect(() => {
    if (flameMeshRef.current && flameLightRef.current && smokeParticlesRef.current) {
      flameMeshRef.current.visible = isLit;
      flameLightRef.current.visible = isLit;
      smokeParticlesRef.current.visible = !isLit;
      if (!isLit) {
        const smokeMat = smokeParticlesRef.current.material as THREE.PointsMaterial;
        smokeMat.opacity = 0.7;
      }
    }
  }, [isLit]);

  return (
    <div className="relative w-full h-full min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] select-none">
      {/* 3D Canvas Mount */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Interaction Hint Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pointer-events-none">
        <div className="bg-rose-950/60 backdrop-blur-md border border-rose-500/30 rounded-full px-3.5 py-1.5 text-xs text-rose-200 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          <span>Drag to rotate in 3D</span>
        </div>
        <div className="bg-amber-950/60 backdrop-blur-md border border-amber-500/30 rounded-full px-3.5 py-1.5 text-xs text-amber-200 flex items-center gap-2 shadow-lg">
          <span>🕯️ Tap candle to make a wish</span>
        </div>
        <div className="bg-fuchsia-950/60 backdrop-blur-md border border-fuchsia-500/30 rounded-full px-3.5 py-1.5 text-xs text-fuchsia-200 flex items-center gap-2 shadow-lg">
          <span>🎁 Tap gift box to open</span>
        </div>
      </div>

      {/* Dynamic Hover Tooltip */}
      {hoverTarget && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-rose-900/90 text-white border border-rose-400/50 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium tracking-wide shadow-2xl animate-bounce">
            {hoverTarget === "candle"
              ? isLit
                ? "✨ Click to blow out candle & make your wish!"
                : "🔥 Click to light the candle again!"
              : "🎁 Click to unwrap your special surprise!"}
          </div>
        </div>
      )}
    </div>
  );
};
