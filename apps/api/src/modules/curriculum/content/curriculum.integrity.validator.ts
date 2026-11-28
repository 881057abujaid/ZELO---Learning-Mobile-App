import type { Curriculum } from "./curriculum.schema.js";
import type { World } from "./world.schema.js";
import type { CurriculumModule } from "./module.schema.js";
import type { Lesson } from "./lesson.schema.js";

export interface CurriculumIntegrityIssue {
    code: string;
    message: string;
    entityId?: string;
}

export interface CurriculumIntegrityResult {
    valid: boolean;
    issues: CurriculumIntegrityIssue[];
}

export interface CurriculumContent {
    curriculum: Curriculum;
    worlds: World[];
    modules: CurriculumModule[];
    lessons: Lesson[];
}

export function validateCurriculumIntegrity(
    content: CurriculumContent,
): CurriculumIntegrityResult {
    const issues: CurriculumIntegrityIssue[] = [];

    const {
        worlds,
        modules,
        lessons,
    } = content;

    /*
    |--------------------------------------------------------------------------
    | 1. Duplicate IDs
    |--------------------------------------------------------------------------
    */

    function checkDuplicateIds(
        items: { id: string }[],
        entityName: string,
    ): Set<string> {
        const ids = new Set<string>();

        for (const item of items) {
            if (ids.has(item.id)) {
                issues.push({
                    code: `DUPLICATE_${entityName.toUpperCase()}_ID`,
                    message: `Duplicate ${entityName} ID: "${item.id}".`,
                    entityId: item.id,
                });
            }

            ids.add(item.id);
        }

        return ids;
    }

    const worldIds = checkDuplicateIds(worlds, "world");
    const moduleIds = checkDuplicateIds(modules, "module");
    const lessonIds = checkDuplicateIds(lessons, "lesson");

    /*
    |--------------------------------------------------------------------------
    | 2. World prerequisite references
    |--------------------------------------------------------------------------
    */

    for (const world of worlds) {
        for (const prerequisiteId of world.prerequisiteWorldIds) {
            if (!worldIds.has(prerequisiteId)) {
                issues.push({
                    code: "INVALID_WORLD_PREREQUISITE",
                    message:
                        `World "${world.id}" references unknown prerequisite world "${prerequisiteId}".`,
                    entityId: world.id,
                });
            }

            if (prerequisiteId === world.id) {
                issues.push({
                    code: "SELF_WORLD_PREREQUISITE",
                    message:
                        `World "${world.id}" cannot be its own prerequisite.`,
                    entityId: world.id,
                });
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | 3. Circular world prerequisites
    |--------------------------------------------------------------------------
    */

    const worldMap = new Map(
        worlds.map((world) => [world.id, world]),
    );

    const visitedWorlds = new Set<string>();
    const worldRecursionStack = new Set<string>();

    function hasWorldCycle(worldId: string): boolean {
        if (worldRecursionStack.has(worldId)) {
            return true;
        }

        if (visitedWorlds.has(worldId)) {
            return false;
        }

        visitedWorlds.add(worldId);
        worldRecursionStack.add(worldId);

        const world = worldMap.get(worldId);

        if (world) {
            for (const prerequisiteId of world.prerequisiteWorldIds) {
                if (!worldMap.has(prerequisiteId)) {
                    continue;
                }

                if (hasWorldCycle(prerequisiteId)) {
                    return true;
                }
            }
        }

        worldRecursionStack.delete(worldId);

        return false;
    }

    for (const world of worlds) {
        if (hasWorldCycle(world.id)) {
            issues.push({
                code: "CIRCULAR_WORLD_PREREQUISITE",
                message:
                    `Circular world prerequisite dependency detected involving "${world.id}".`,
                entityId: world.id,
            });

            break;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | 4. Module references
    |--------------------------------------------------------------------------
    */

    const moduleMap = new Map(
        modules.map((module) => [module.id, module]),
    );

    for (const module of modules) {
        if (!worldIds.has(module.worldId)) {
            issues.push({
                code: "INVALID_MODULE_WORLD_REFERENCE",
                message:
                    `Module "${module.id}" references unknown world "${module.worldId}".`,
                entityId: module.id,
            });
        }
    }

    /*
    |--------------------------------------------------------------------------
    | 5. Module ordering within worlds
    |--------------------------------------------------------------------------
    */

    const moduleOrdersByWorld = new Map<string, Set<number>>();

    for (const module of modules) {
        const existingOrders =
            moduleOrdersByWorld.get(module.worldId) ?? new Set<number>();

        if (existingOrders.has(module.order)) {
            issues.push({
                code: "DUPLICATE_MODULE_ORDER",
                message:
                    `Duplicate module order "${module.order}" in world "${module.worldId}".`,
                entityId: module.id,
            });
        }

        existingOrders.add(module.order);

        moduleOrdersByWorld.set(
            module.worldId,
            existingOrders,
        );
    }

    /*
    |--------------------------------------------------------------------------
    | 6. Lesson references
    |--------------------------------------------------------------------------
    */

    for (const lesson of lessons) {
        if (!worldIds.has(lesson.worldId)) {
            issues.push({
                code: "INVALID_LESSON_WORLD_REFERENCE",
                message:
                    `Lesson "${lesson.id}" references unknown world "${lesson.worldId}".`,
                entityId: lesson.id,
            });
        }

        if (!moduleIds.has(lesson.moduleId)) {
            issues.push({
                code: "INVALID_LESSON_MODULE_REFERENCE",
                message:
                    `Lesson "${lesson.id}" references unknown module "${lesson.moduleId}".`,
                entityId: lesson.id,
            });
        }

        const referencedModule = moduleMap.get(lesson.moduleId);

        if (
            referencedModule &&
            referencedModule.worldId !== lesson.worldId
        ) {
            issues.push({
                code: "LESSON_MODULE_WORLD_MISMATCH",
                message:
                    `Lesson "${lesson.id}" belongs to world "${lesson.worldId}", but its module "${lesson.moduleId}" belongs to world "${referencedModule.worldId}".`,
                entityId: lesson.id,
            });
        }
    }

    /*
    |--------------------------------------------------------------------------
    | 7. Lesson prerequisites
    |--------------------------------------------------------------------------
    */

    for (const lesson of lessons) {
        for (const prerequisiteId of lesson.prerequisiteLessonIds) {
            if (!lessonIds.has(prerequisiteId)) {
                issues.push({
                    code: "INVALID_LESSON_PREREQUISITE",
                    message:
                        `Lesson "${lesson.id}" references unknown prerequisite lesson "${prerequisiteId}".`,
                    entityId: lesson.id,
                });
            }

            if (prerequisiteId === lesson.id) {
                issues.push({
                    code: "SELF_LESSON_PREREQUISITE",
                    message:
                        `Lesson "${lesson.id}" cannot be its own prerequisite.`,
                    entityId: lesson.id,
                });
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | 8. Circular lesson prerequisites
    |--------------------------------------------------------------------------
    */

    const lessonMap = new Map(
        lessons.map((lesson) => [lesson.id, lesson]),
    );

    const visitedLessons = new Set<string>();
    const lessonRecursionStack = new Set<string>();

    function hasLessonCycle(lessonId: string): boolean {
        if (lessonRecursionStack.has(lessonId)) {
            return true;
        }

        if (visitedLessons.has(lessonId)) {
            return false;
        }

        visitedLessons.add(lessonId);
        lessonRecursionStack.add(lessonId);

        const lesson = lessonMap.get(lessonId);

        if (lesson) {
            for (const prerequisiteId of lesson.prerequisiteLessonIds) {
                if (!lessonMap.has(prerequisiteId)) {
                    continue;
                }

                if (hasLessonCycle(prerequisiteId)) {
                    return true;
                }
            }
        }

        lessonRecursionStack.delete(lessonId);

        return false;
    }

    for (const lesson of lessons) {
        if (hasLessonCycle(lesson.id)) {
            issues.push({
                code: "CIRCULAR_LESSON_PREREQUISITE",
                message:
                    `Circular lesson prerequisite dependency detected involving "${lesson.id}".`,
                entityId: lesson.id,
            });

            break;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | 9. Lesson ordering within modules
    |--------------------------------------------------------------------------
    |
    | Lesson order is not yet defined in the current Lesson schema.
    | Therefore, lesson ordering validation is intentionally omitted.
    |
    */

    return {
        valid: issues.length === 0,
        issues,
    };
}