import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { curriculumSchema } from "../../src/modules/curriculum/content/curriculum.schema";
import { worldSchema } from "../../src/modules/curriculum/content/world.schema";
import {
    validateCurriculumIntegrity,
} from "../../src/modules/curriculum/content/curriculum.integrity.validator";

const definitionsDirectory = resolve(
    process.cwd(),
    "src/modules/curriculum/content/definitions",
);

const curriculumDefinition = JSON.parse(
    readFileSync(
        resolve(definitionsDirectory, "curriculum.json"),
        "utf-8",
    ),
);

const frontendFoundationsWorld = JSON.parse(
    readFileSync(
        resolve(
            definitionsDirectory,
            "worlds/frontend-foundations.json",
        ),
        "utf-8",
    ),
);

describe("Initial Curriculum Content Definitions", () => {
    describe("Curriculum Definition", () => {
        it("should contain valid curriculum data", () => {
            const result = curriculumSchema.safeParse(
                curriculumDefinition,
            );

            expect(result.success).toBe(true);
        });

        it("should use the expected curriculum ID", () => {
            expect(curriculumDefinition.id).toBe("web-development");
        });
    });

    describe("Frontend Foundations World Definition", () => {
        it("should contain valid world data", () => {
            const result = worldSchema.safeParse(
                frontendFoundationsWorld,
            );

            expect(result.success).toBe(true);
        });

        it("should use the expected world ID", () => {
            expect(frontendFoundationsWorld.id).toBe(
                "world-frontend-foundations",
            );
        });

        it("should be the first world in the curriculum", () => {
            expect(frontendFoundationsWorld.order).toBe(1);
        });

        it("should not have prerequisite worlds", () => {
            expect(
                frontendFoundationsWorld.prerequisiteWorldIds,
            ).toEqual([]);
        });
    });

    describe("Curriculum Integrity", () => {
        it("should pass curriculum integrity validation", () => {
            const result = validateCurriculumIntegrity({
                curriculum: curriculumDefinition,
                worlds: [frontendFoundationsWorld],
                modules: [],
                lessons: [],
            });

            expect(result.valid).toBe(true);
            expect(result.issues).toEqual([]);
        });
    });
});