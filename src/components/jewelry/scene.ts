import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createJewelryModel, disposeModel } from "./models";
import type { ModelConfig } from "./models";

export interface JewelryScene {
  setModel: (config: ModelConfig) => void;
  setTheme: (dark: boolean) => void;
  setSpinning: (spinning: boolean) => void;
  zoom: (direction: number) => void;
  rotate: (horizontal: number, vertical?: number) => void;
  reset: () => void;
  dispose: () => void;
}
export function createJewelryScene(
  host: HTMLElement,
  config: ModelConfig,
  onContextLost: () => void,
): JewelryScene {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute("role", "img");
  canvas.setAttribute(
    "aria-label",
    "Interactive 3D jewelry. Drag to rotate, pinch to zoom, or use arrow keys. Plus and minus zoom; Home resets.",
  );
  host.appendChild(canvas);
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.09;
  controls.rotateSpeed = 0.65;
  controls.autoRotateSpeed = 0.6;
  controls.minDistance = 4.2;
  controls.maxDistance = 10;
  controls.minPolarAngle = 0.12;
  controls.maxPolarAngle = Math.PI - 0.12;
  controls.target.set(0, 0.05, 0);
  const fill = new THREE.HemisphereLight("#d2e7ff", "#33405e", 1.7);
  scene.add(fill);
  const key = new THREE.DirectionalLight("#ffffff", 4.5);
  key.position.set(3, 5, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -4;
  key.shadow.normalBias = 0.025;
  scene.add(key);
  const rim = new THREE.DirectionalLight("#8fbcff", 3);
  rim.position.set(-4, 2, -3);
  scene.add(rim);
  const pedestalMaterial = new THREE.MeshStandardMaterial({
    color: "#162b41",
    roughness: 0.72,
    metalness: 0.28,
  });
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(2.15, 2.27, 0.16, 96),
    pedestalMaterial,
  );
  pedestal.position.y = -1.9;
  pedestal.receiveShadow = true;
  scene.add(pedestal);
  let model = createJewelryModel(config);
  scene.add(model);
  let disposed = false,
    visible = true,
    frame = 0,
    lastTime = 0,
    idleFrames = 0,
    updating = false;
  const draw = () => {
    if (!disposed && visible) renderer.render(scene, camera);
  };
  const tick = (time: number) => {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
    lastTime = time;
    updating = true;
    const changed = controls.update(delta);
    draw();
    updating = false;
    if (controls.autoRotate || changed || idleFrames++ < 2)
      frame = requestAnimationFrame(tick);
    else lastTime = 0;
  };
  const wake = () => {
    idleFrames = 0;
    if (!frame && !updating && !disposed && visible && !document.hidden)
      frame = requestAnimationFrame(tick);
  };
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (width < 1 || height < 1) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    wake();
  };
  const reset = () => {
    camera.position.set(3.7, 2.1, 6.5);
    controls.target.set(0, 0.05, 0);
    controls.update();
    controls.saveState();
    wake();
  };
  const rotate = (horizontal: number, vertical = 0) => {
    const spherical = new THREE.Spherical().setFromVector3(
      camera.position.clone().sub(controls.target),
    );
    spherical.theta += horizontal;
    spherical.phi = THREE.MathUtils.clamp(
      spherical.phi + vertical,
      0.12,
      Math.PI - 0.12,
    );
    camera.position.copy(
      new THREE.Vector3().setFromSpherical(spherical).add(controls.target),
    );
    controls.update();
    wake();
  };
  const zoom = (direction: number) => {
    const offset = camera.position.clone().sub(controls.target);
    offset.setLength(
      THREE.MathUtils.clamp(
        offset.length() * (direction > 0 ? 0.86 : 1.16),
        controls.minDistance,
        controls.maxDistance,
      ),
    );
    camera.position.copy(controls.target).add(offset);
    controls.update();
    wake();
  };
  const onKey = (event: KeyboardEvent) => {
    if (
      ![
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "+",
        "=",
        "-",
        "Home",
      ].includes(event.key)
    )
      return;
    event.preventDefault();
    if (event.key === "Home") reset();
    else if (event.key === "+" || event.key === "=") zoom(1);
    else if (event.key === "-") zoom(-1);
    else
      rotate(
        event.key === "ArrowLeft" ? -0.2 : event.key === "ArrowRight" ? 0.2 : 0,
        event.key === "ArrowUp" ? -0.16 : event.key === "ArrowDown" ? 0.16 : 0,
      );
  };
  const focus = () => canvas.focus({ preventScroll: true });
  // Scroll the page normally until the visitor deliberately focuses the viewer.
  const onWheel = (event: WheelEvent) => {
    if (document.activeElement !== canvas) event.stopImmediatePropagation();
  };
  const onLost = (event: Event) => {
    event.preventDefault();
    onContextLost();
  };
  canvas.addEventListener("keydown", onKey);
  canvas.addEventListener("pointerdown", focus);
  canvas.addEventListener("wheel", onWheel, { capture: true });
  canvas.addEventListener("webglcontextlost", onLost);
  controls.addEventListener("change", wake);
  controls.addEventListener("start", wake);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        lastTime = 0;
        wake();
      } else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { threshold: 0 },
  );
  visibilityObserver.observe(host);
  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    } else wake();
  };
  document.addEventListener("visibilitychange", onVisibility);
  reset();
  resize();
  return {
    setModel: (next) => {
      const replacement = createJewelryModel(next);
      scene.remove(model);
      disposeModel(model);
      model = replacement;
      scene.add(model);
      reset();
    },
    setTheme: (dark) => {
      fill.intensity = dark ? 1.45 : 1.7;
      pedestalMaterial.color.set(dark ? "#102036" : "#162b41");
      wake();
    },
    setSpinning: (spinning) => {
      controls.autoRotate = spinning;
      wake();
    },
    zoom,
    rotate,
    reset,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", focus);
      canvas.removeEventListener("wheel", onWheel, { capture: true });
      canvas.removeEventListener("webglcontextlost", onLost);
      controls.dispose();
      disposeModel(model);
      pedestal.geometry.dispose();
      pedestalMaterial.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
