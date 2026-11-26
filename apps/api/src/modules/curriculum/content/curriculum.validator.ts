import type { Lesson } from "./lesson.schema.js";

export interface CurriculumValidationIssue {
    code: string;
    message: string;
    lessonId?: string;
}

export interface CurriculumValidationResult {
    valid: boolean;
    issues: CurriculumValidationIssue[];
}

export interface CurriculumReference {
    worldIds: string[];
    moduleIds: string[];
}

export function validateCurriculum(
    lessons: Lesson[],
    references: CurriculumReference,
): CurriculumValidationResult {
    const issues: CurriculumValidationIssue[] = [];

    const lessonIds = new Set<string>();
    const worldIds = new Set(references.worldIds);
    const moduleIds = new Set(references.moduleIds);

    // 1. Check duplicate lesson IDs
    for (const lesson of lessons) {
        if (lessonIds.has(lesson.id)) {
            issues.push({
                code: "DUPLICATE_LESSON_ID",
                message: `Duplicate lesson ID: ${lesson.id}`,
                lessonId: lesson.id,
            });
        }

        lessonIds.add(lesson.id);
    }

    // 2. Check world and module references
    for (const lesson of lessons) {
        if (!worldIds.has(lesson.worldId)) {
            issues.push({
                code: "INVALID_WORLD_REFERENCE",
                message: `Lesson "${lesson.id}" references unknown world "${lesson.worldId}".`,
                lessonId: lesson.id,
            });
        }

        if (!moduleIds.has(lesson.moduleId)) {
            issues.push({
                code: "INVALID_MODULE_REFERENCE",
                message: `Lesson "${lesson.id}" references unknown module "${lesson.moduleId}".`,
                lessonId: lesson.id,
            });
        }
    }

    // 3. Check prerequisite references
    for (const lesson of lessons) {
        for (const prerequisiteId of lesson.prerequisiteLessonIds) {
            if (!lessonIds.has(prerequisiteId)) {
                issues.push({
                    code: "INVALID_PREREQUISITE_REFERENCE",
                    message: `Lesson "${lesson.id}" references unknown prerequisite "${prerequisiteId}".`,
                    lessonId: lesson.id,
                });
            }

            if (prerequisiteId === lesson.id) {
                issues.push({
                    code: "SELF_PREREQUISITE",
                    message: `Lesson "${lesson.id}" cannot be its own prerequisite.`,
                    lessonId: lesson.id,
                });
            }
        }
    }

    // 4. Check circular prerequisites
    const lessonMap = new Map(
        lessons.map((lesson) => [lesson.id, lesson]),
    );

    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    function hasCycle(lessonId: string): boolean {
        if (recursionStack.has(lessonId)) {
            return true;
        }

        if (visited.has(lessonId)) {
            return false;
        }

        visited.add(lessonId);
        recursionStack.add(lessonId);

        const lesson = lessonMap.get(lessonId);

        if (lesson) {
            for (const prerequisiteId of lesson.prerequisiteLessonIds) {
                if (!lessonMap.has(prerequisiteId)) {
                    continue;
                }

                if (hasCycle(prerequisiteId)) {
                    return true;
                }
            }
        }

        recursionStack.delete(lessonId);

        return false;
    }

    for (const lesson of lessons) {
        if (hasCycle(lesson.id)) {
            issues.push({
                code: "CIRCULAR_PREREQUISITE",
                message: `Circular prerequisite dependency detected involving lesson "${lesson.id}".`,
                lessonId: lesson.id,
            });

            break;
        }
    }

    return {
        valid: issues.length === 0,
        issues,
    };
}