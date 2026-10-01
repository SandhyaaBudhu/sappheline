import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  createJewelryModel,
  disposeModel,
} from "../src/components/jewelry/models";
import type { JewelryShape } from "../src/components/jewelry/models";

describe("procedural jewelry geometry", () => {
  it.each<JewelryShape>(["ring", "pendant", "hoops"])(
    "builds a finite, framed %s with genuine mesh depth",
    (shape) => {
      const model = createJewelryModel({
        shape,
        metal: "Sterling silver",
        stone: "Sapphire",
      });
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      expect(Math.max(size.x, size.y, size.z)).toBeCloseTo(3.25, 4);
      expect(size.z).toBeGreaterThan(0.1);
      const meshes: THREE.Mesh[] = [];
      model.traverse((object) => {
        if (object instanceof THREE.Mesh) meshes.push(object);
      });
      expect(meshes.length).toBeGreaterThan(4);
      for (const mesh of meshes) {
        expect(
          Array.from(mesh.geometry.getAttribute("position").array).every(
            Number.isFinite,
          ),
        ).toBe(true);
        expect(
          Array.from(mesh.geometry.getAttribute("normal").array).every(
            Number.isFinite,
          ),
        ).toBe(true);
      }
      disposeModel(model);
    },
  );
  it("changes the actual metal material and includes faceted gemstone surfaces", () => {
    const model = createJewelryModel({
      shape: "ring",
      metal: "14k yellow gold",
      stone: "Sapphire",
    });
    const metals: THREE.MeshPhysicalMaterial[] = [],
      stones: THREE.Mesh[] = [];
    model.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const material = object.material as THREE.MeshPhysicalMaterial;
        if (material.name === "precious-metal") metals.push(material);
        if (material.name === "gemstone") stones.push(object);
      }
    });
    expect(metals[0].color.getHexString()).toBe("d3b47a");
    expect(metals[0].metalness).toBe(1);
    expect(stones).toHaveLength(1);
    expect(stones[0].geometry.index).toBeNull();
    expect(stones[0].geometry.getAttribute("normal").count).toBeGreaterThan(
      100,
    );
    disposeModel(model);
  });
});
