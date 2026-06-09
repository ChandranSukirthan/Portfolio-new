import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* ── Planet configuration ─────────────────────────────────────── */
const PLANET_CONFIG = [
  {
    key: "home",
    label: "☀️ Home",
    isSun: true,
    orbitRadius: 0,
    size: 14,
    color: "#ff8800",
    emissive: "#ffcc44",
    emissiveIntensity: 2.5,
    speed: 0,
  },
  {
    key: "about",
    label: "Mercury · About",
    orbitRadius: 32,
    size: 2.4,
    color: "#a0a0a0",
    emissive: "#555555",
    emissiveIntensity: 0.4,
    speed: 0.0047,
  },
  {
    key: "skills",
    label: "Venus · Skills",
    orbitRadius: 48,
    size: 3.6,
    color: "#d4a96a",
    emissive: "#8b5e2a",
    emissiveIntensity: 0.4,
    speed: 0.0035,
  },
  {
    key: "experience",
    label: "Earth · Experience",
    orbitRadius: 66,
    size: 3.9,
    color: "#2563a8",
    emissive: "#0d4a8b",
    emissiveIntensity: 0.5,
    speed: 0.003,
  },
  {
    key: "education",
    label: "Mars · Education",
    orbitRadius: 85,
    size: 3.1,
    color: "#c1440e",
    emissive: "#7a1f00",
    emissiveIntensity: 0.5,
    speed: 0.0024,
  },
  {
    key: "projects",
    label: "Jupiter · Projects",
    orbitRadius: 114,
    size: 8.5,
    color: "#c47e3a",
    emissive: "#7a4410",
    emissiveIntensity: 0.3,
    speed: 0.0013,
  },
  {
    key: "certificates",
    label: "Saturn · Certificates",
    orbitRadius: 146,
    size: 6.8,
    color: "#e4d080",
    emissive: "#b09020",
    emissiveIntensity: 0.3,
    speed: 0.00097,
    hasRings: true,
  },
  {
    key: "contact",
    label: "Uranus · Contact",
    orbitRadius: 174,
    size: 5.2,
    color: "#7de8e8",
    emissive: "#1a9090",
    emissiveIntensity: 0.5,
    speed: 0.00068,
  },
  {
    key: "contact",
    label: "Neptune · Contact",
    orbitRadius: 202,
    size: 5.0,
    color: "#274687",
    emissive: "#102550",
    emissiveIntensity: 0.5,
    speed: 0.00053,
  },
];

export default function SolarSystem({ onSectionSelect, activeSection }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const frameRef = useRef(null);
  const planetMeshesRef = useRef([]); // { mesh, config, angle }
  const labelDivsRef = useRef([]);
  const tooltipRef = useRef(null);
  const hoveredRef = useRef(null);
  const isTweeningRef = useRef(false);
  const activeSectionRef = useRef(activeSection);

  // Keep ref in sync so closures see latest value
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  const handleSectionSelect = useCallback(
    (key) => {
      onSectionSelect(key);
    },
    [onSectionSelect]
  );

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Renderer ─────────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    /* ── Scene ────────────────────────────────────────────────── */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#010208");
    sceneRef.current = scene;

    /* ── Camera ───────────────────────────────────────────────── */
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      2000
    );
    camera.position.set(0, 80, 200);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    /* ── OrbitControls ────────────────────────────────────────── */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 30;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI * 0.75;
    controls.autoRotate = false;
    controlsRef.current = controls;

    /* ── Lights ───────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight("#ffffff", 0.12));

    const sunLight = new THREE.PointLight("#fff8e0", 6, 800, 1.2);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    /* ── Starfield ────────────────────────────────────────────── */
    const starCount = 9000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 350 + Math.random() * 250;
      starPositions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: "#ffffff",
      size: 0.65,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    /* ── Orbit circles ────────────────────────────────────────── */
    PLANET_CONFIG.filter((p) => !p.isSun).forEach((p) => {
      const orbitGeo = new THREE.RingGeometry(p.orbitRadius - 0.18, p.orbitRadius + 0.18, 128);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: "#334466",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      });
      const ring = new THREE.Mesh(orbitGeo, orbitMat);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
    });

    /* ── Planets ──────────────────────────────────────────────── */
    const planetMeshes = [];

    PLANET_CONFIG.forEach((cfg) => {
      const geo = new THREE.SphereGeometry(cfg.size, 48, 48);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(cfg.color),
        emissive: new THREE.Color(cfg.emissive),
        emissiveIntensity: cfg.emissiveIntensity,
        roughness: 0.75,
        metalness: 0.05,
      });
      const mesh = new THREE.Mesh(geo, mat);

      const initialAngle = Math.random() * Math.PI * 2;
      mesh.position.set(
        Math.cos(initialAngle) * cfg.orbitRadius,
        0,
        Math.sin(initialAngle) * cfg.orbitRadius
      );
      mesh.userData = { key: cfg.key, config: cfg };
      scene.add(mesh);

      // Saturn rings
      if (cfg.hasRings) {
        const ringGeo = new THREE.TorusGeometry(cfg.size * 1.7, cfg.size * 0.42, 3, 80);
        const ringMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#c9a96e"),
          emissive: new THREE.Color("#6b5020"),
          emissiveIntensity: 0.2,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.72,
          roughness: 0.9,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.5;
        mesh.add(ringMesh);
      }

      // Sun corona glow — additive sphere
      if (cfg.isSun) {
        const glowGeo = new THREE.SphereGeometry(cfg.size * 1.45, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color("#ff9900"),
          transparent: true,
          opacity: 0.18,
          side: THREE.BackSide,
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        mesh.add(glow);
      }

      planetMeshes.push({ mesh, config: cfg, angle: initialAngle, baseScale: 1 });
    });

    planetMeshesRef.current = planetMeshes;

    /* ── Asteroid belt ────────────────────────────────────────── */
    const asteroidGroup = new THREE.Group();
    scene.add(asteroidGroup);

    const rng = () => Math.random();
    for (let i = 0; i < 160; i++) {
      const angle = rng() * Math.PI * 2;
      const r = 93 + rng() * 16;
      const size = 0.22 + rng() * 0.55;
      const aGeo = new THREE.SphereGeometry(size, 6, 6);
      const aMat = new THREE.MeshStandardMaterial({
        color: "#5a4a3a",
        roughness: 0.95,
        emissive: "#1a1208",
        emissiveIntensity: 0.1,
      });
      const ast = new THREE.Mesh(aGeo, aMat);
      ast.position.set(
        Math.cos(angle) * r,
        (rng() - 0.5) * 3.5,
        Math.sin(angle) * r
      );
      ast.userData = { isAsteroid: true };
      asteroidGroup.add(ast);
    }

    /* ── HTML Labels ──────────────────────────────────────────── */
    const labelContainer = document.createElement("div");
    labelContainer.style.cssText =
      "position:absolute;inset:0;pointer-events:none;overflow:hidden;";
    mount.style.position = "relative";
    mount.appendChild(labelContainer);

    const labelDivs = PLANET_CONFIG.map((cfg) => {
      const div = document.createElement("div");
      div.className = "planet-label";
      div.textContent = cfg.label;
      div.dataset.key = cfg.key;
      labelContainer.appendChild(div);
      return { div, config: cfg };
    });
    labelDivsRef.current = labelDivs;

    /* ── Tooltip ──────────────────────────────────────────────── */
    const tooltip = document.createElement("div");
    tooltip.className = "planet-tooltip";
    tooltip.style.display = "none";
    mount.appendChild(tooltip);
    tooltipRef.current = tooltip;

    /* ── Raycaster ────────────────────────────────────────────── */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const planetMeshList = planetMeshes.map((p) => p.mesh);

    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(planetMeshList);

      if (hits.length > 0) {
        const hit = hits[0].object;
        hoveredRef.current = hit.userData.config?.label || hit.userData.key;
        mount.style.cursor = "pointer";

        tooltip.textContent = hit.userData.config?.label || hit.userData.key;
        tooltip.style.display = "block";
        tooltip.style.left = e.clientX - rect.left + 16 + "px";
        tooltip.style.top = e.clientY - rect.top - 10 + "px";
      } else {
        hoveredRef.current = null;
        mount.style.cursor = "default";
        tooltip.style.display = "none";
      }
    };

    const onMouseClick = (e) => {
      if (isTweeningRef.current) return;
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(planetMeshList);

      if (hits.length > 0) {
        const hit = hits[0].object;
        const key = hit.userData.key;
        tweenCameraTo(hit, key);
      }
    };

    mount.addEventListener("mousemove", onMouseMove);
    mount.addEventListener("click", onMouseClick);

    /* ── Camera tween ─────────────────────────────────────────── */
    const tweenCameraTo = (planetMesh, key) => {
      isTweeningRef.current = true;
      controls.enabled = false;

      const startPos = camera.position.clone();
      const duration = 1100; // ms
      let startTime = performance.now();

      const tick = (now) => {
        const t = Math.min((now - startTime) / duration, 1);

        // Ease out cubic
        const ease = 1 - Math.pow(1 - t, 3);

        const currentPlanetPos = planetMesh.position;
        const offset = new THREE.Vector3(0, 8, 28);
        const endPos = currentPlanetPos.clone().add(offset);

        camera.position.lerpVectors(startPos, endPos, ease);
        camera.lookAt(currentPlanetPos);
        controls.target.copy(currentPlanetPos);

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          isTweeningRef.current = false;
          handleSectionSelect(key);
        }
      };
      requestAnimationFrame(tick);
    };

    /* ── Resize ───────────────────────────────────────────────── */
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    /* ── Animation Loop ───────────────────────────────────────── */
    const tempVec = new THREE.Vector3();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      const time = performance.now() * 0.001;

      // Rotate asteroid belt
      asteroidGroup.rotation.y += 0.0006;

      // Orbit planets
      planetMeshes.forEach((p) => {
        if (p.config.isSun) {
          p.mesh.rotation.y += 0.004;
          return;
        }
        p.angle += p.config.speed;
        p.mesh.position.x = Math.cos(p.angle) * p.config.orbitRadius;
        p.mesh.position.z = Math.sin(p.angle) * p.config.orbitRadius;
        p.mesh.rotation.y += 0.008;

        // Hover glow scale
        const isHovered = hoveredRef.current === p.config.label;
        const targetScale = isHovered ? 1.28 : 1;
        p.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        const mat = p.mesh.material;
        mat.emissiveIntensity = THREE.MathUtils.lerp(
          mat.emissiveIntensity,
          isHovered ? 2.5 : p.config.emissiveIntensity,
          0.1
        );
      });

      // Sun pulse
      const sunEntry = planetMeshes[0];
      const pulse = 1 + Math.sin(time * 1.8) * 0.03;
      sunEntry.mesh.scale.setScalar(pulse);

      // Update labels
      labelDivs.forEach(({ div, config }) => {
        const entry = planetMeshes.find((p) => p.config.label === config.label);
        if (!entry) return;
        tempVec.copy(entry.mesh.position);
        // Position label above planet
        tempVec.y += entry.config.size + 3.5;
        tempVec.project(camera);

        const x = ((tempVec.x + 1) / 2) * mount.clientWidth;
        const y = ((-tempVec.y + 1) / 2) * mount.clientHeight;

        // Hide if behind camera
        if (tempVec.z > 1) {
          div.style.display = "none";
        } else {
          div.style.display = "block";
          div.style.transform = `translate(-50%, -100%) translate(${x}px,${y}px)`;
          div.style.opacity = hoveredRef.current === config.label ? "1" : "0.55";
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    /* ── Cleanup ──────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("mousemove", onMouseMove);
      mount.removeEventListener("click", onMouseClick);
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      if (mount.contains(labelContainer)) mount.removeChild(labelContainer);
      if (mount.contains(tooltip)) mount.removeChild(tooltip);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const prevActiveSectionRef = useRef(activeSection);

  const tweenCameraBack = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    isTweeningRef.current = true;
    controlsRef.current.enabled = false;

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(0, 80, 200);

    const startTarget = controls.target.clone();
    const endTarget = new THREE.Vector3(0, 0, 0);

    let startTime = performance.now();
    const duration = 1200; // ms

    const tick = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic

      camera.position.lerpVectors(startPos, endPos, ease);

      const currentTarget = new THREE.Vector3();
      currentTarget.lerpVectors(startTarget, endTarget, ease);
      camera.lookAt(currentTarget);
      controls.target.copy(currentTarget);

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        isTweeningRef.current = false;
        controls.enabled = true;
      }
    };
    requestAnimationFrame(tick);
  };

  /* ── When returning to solar system, tween back ─── */
  useEffect(() => {
    if (!controlsRef.current) return;
    if (activeSection === null) {
      if (prevActiveSectionRef.current !== null) {
        tweenCameraBack();
      } else {
        controlsRef.current.enabled = true;
      }
    }
    prevActiveSectionRef.current = activeSection;
  }, [activeSection]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
