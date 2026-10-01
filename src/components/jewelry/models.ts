import * as THREE from "three";
import type { Metal } from "../../data/products";

export type JewelryShape = "ring" | "pendant" | "hoops";
export interface ModelConfig {
  shape: JewelryShape;
  metal: Metal;
  stone: string;
}

/** Local, real geometry: no remote models or image-based rotation tricks. */
export function createJewelryModel({ shape, metal, stone }: ModelConfig) {
  const group = new THREE.Group();
  const silver = new THREE.MeshPhysicalMaterial({
    color: metal.includes("yellow") ? "#d3b47a" : "#d9e3ed",
    metalness: 1,
    roughness: metal === "Sterling silver" ? 0.19 : 0.14,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.65,
  });
  silver.name = "precious-metal";
  const gem = new THREE.MeshPhysicalMaterial({
    color:
      stone === "Diamond"
        ? "#d8efff"
        : stone === "Amethyst"
          ? "#7553b6"
          : "#2055bb",
    metalness: 0.05,
    roughness: 0.07,
    transmission: 0.18,
    thickness: 0.5,
    ior: 1.76,
    clearcoat: 1,
    envMapIntensity: 1.8,
    flatShading: true,
  });
  gem.name = "gemstone";
  const mesh = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    parent: THREE.Group = group,
  ) => {
    const object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  };
  if (shape === "ring") {
    mesh(sculpturalBand(), silver);
    const stoneMesh = mesh(facetedStone(), gem);
    stoneMesh.position.y = 1.37;
    const basket = mesh(new THREE.TorusGeometry(0.53, 0.065, 12, 64), silver);
    basket.rotation.x = Math.PI / 2;
    basket.scale.y = 0.77;
    basket.position.y = 1.35;
    for (const x of [-1, 1])
      for (const z of [-1, 1]) {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(x * 0.87, 0.65, z * 0.05),
          new THREE.Vector3(x * 0.53, 1.12, z * 0.22),
          new THREE.Vector3(x * 0.39, 1.62, z * 0.29),
          new THREE.Vector3(x * 0.32, 1.68, z * 0.24),
        ]);
        mesh(new THREE.TubeGeometry(curve, 32, 0.065, 12, false), silver);
        const tip = mesh(new THREE.SphereGeometry(0.075, 16, 12), silver);
        tip.position.copy(curve.getPoint(1));
      }
    if (stone === "Diamond") {
      for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2;
        const halo = mesh(facetedStone(), gem);
        halo.scale.setScalar(0.14);
        halo.position.set(Math.cos(angle) * 0.67, 1.38, Math.sin(angle) * 0.54);
      }
    }
    group.rotation.set(0.13, -0.16, -0.2);
  } else if (shape === "pendant") {
    for (let i = 0; i < 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      const link = mesh(new THREE.TorusGeometry(0.095, 0.025, 8, 16), silver);
      link.position.set(
        Math.sin(angle) * 1.02,
        0.7 + Math.cos(angle) * 1.42,
        0,
      );
      link.rotation.z = Math.PI / 2 - angle;
      link.rotation.y = i % 2 ? Math.PI / 2 : 0;
      link.scale.y = 1.25;
    }
    const pendant = new THREE.Group();
    group.add(pendant);
    pendant.position.set(0, -1.22, 0.035);
    const bezel = mesh(
      new THREE.TorusGeometry(0.56, 0.072, 12, 64),
      silver,
      pendant,
    );
    bezel.scale.set(0.83, 1.16, 1);
    const stoneMesh = mesh(facetedStone(), gem, pendant);
    stoneMesh.rotation.x = Math.PI / 2;
    stoneMesh.scale.set(0.75, 0.95, 1.3);
    stoneMesh.position.z = 0.12;
    const bail = mesh(
      new THREE.TorusGeometry(0.13, 0.046, 12, 32),
      silver,
      pendant,
    );
    bail.position.y = 0.76;
  } else {
    for (const side of [-1, 1]) {
      const earring = new THREE.Group();
      earring.position.set(side * 0.95, 0.15, side * 0.14);
      earring.rotation.set(0, side * -0.24, side * 0.07);
      group.add(earring);
      for (const phase of [0, Math.PI]) {
        const points = Array.from({ length: 129 }, (_, i) => {
          const angle = (i / 128) * Math.PI * 2;
          const twist = angle * 5 + phase;
          const radius = 0.66 + 0.047 * Math.cos(twist);
          return new THREE.Vector3(
            Math.sin(angle) * radius,
            Math.cos(angle) * radius * 1.2,
            0.065 * Math.sin(twist),
          );
        });
        mesh(
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(points),
            160,
            0.081,
            12,
            true,
          ),
          silver,
          earring,
        );
      }
      const hinge = mesh(
        new THREE.SphereGeometry(0.115, 16, 12),
        silver,
        earring,
      );
      hinge.position.y = 0.79;
      const pin = mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.3, 12),
        silver,
        earring,
      );
      pin.position.set(0, 0.79, -0.12);
      pin.rotation.x = Math.PI / 2;
    }
  }
  // Match scale and framing across the three designs.
  const box = new THREE.Box3().setFromObject(group);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const normalized = new THREE.Group();
  normalized.add(group);
  group.position.sub(center);
  normalized.scale.setScalar(3.25 / Math.max(size.x, size.y, size.z));
  return normalized;
}

function sculpturalBand() {
  const radial = 128,
    cross = 24,
    positions: number[] = [],
    indices: number[] = [];
  for (let i = 0; i <= radial; i++) {
    const angle = (i / radial) * Math.PI * 2;
    const shoulder = Math.pow(Math.max(0, Math.cos(angle)), 6);
    const width = 0.17 + shoulder * 0.15;
    for (let j = 0; j <= cross; j++) {
      const section = (j / cross) * Math.PI * 2;
      const radius = 1.02 + (0.155 + shoulder * 0.045) * Math.cos(section);
      positions.push(
        Math.sin(angle) * radius,
        Math.cos(angle) * radius,
        Math.sin(section) * width,
      );
      if (i < radial && j < cross) {
        const a = i * (cross + 1) + j,
          b = (i + 1) * (cross + 1) + j;
        indices.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function facetedStone() {
  const segments = 12,
    positions: number[] = [],
    indices: number[] = [];
  const levels = [
    { radius: 0.57, y: 0.32 },
    { radius: 1, y: 0.07 },
    { radius: 1, y: 0 },
    { radius: 0.03, y: -0.43 },
  ];
  for (const level of levels)
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      positions.push(
        Math.cos(angle) * 0.58 * level.radius,
        level.y,
        Math.sin(angle) * 0.44 * level.radius,
      );
    }
  positions.push(0, 0.32, 0, 0, -0.43, 0);
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    indices.push(segments * 4, next, i);
    for (let level = 0; level < levels.length - 1; level++) {
      const a = level * segments + i,
        b = level * segments + next,
        c = (level + 1) * segments + i,
        d = (level + 1) * segments + next;
      indices.push(a, b, c, b, d, c);
    }
    indices.push(segments * 4 + 1, segments * 3 + i, segments * 3 + next);
  }
  const indexed = new THREE.BufferGeometry();
  indexed.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  indexed.setIndex(indices);
  const geometry = indexed.toNonIndexed();
  indexed.dispose();
  geometry.computeVertexNormals();
  return geometry;
}

export function disposeModel(model: THREE.Object3D) {
  const materials = new Set<THREE.Material>();
  model.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      (Array.isArray(object.material)
        ? object.material
        : [object.material]
      ).forEach((material) => materials.add(material));
    }
  });
  materials.forEach((material) => material.dispose());
}
