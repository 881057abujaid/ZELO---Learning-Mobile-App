const fs = require("node:fs");
const path = require("node:path");

const packageJsonPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "react-native-reanimated",
  "package.json"
);

const gradlePath = path.join(
  __dirname,
  "..",
  "node_modules",
  "react-native-reanimated",
  "android",
  "build.gradle.kts"
);

const expectedVersion = "4.7.1";
const cmakeArgument = '"-DCMAKE_OBJECT_PATH_MAX=250",';
const marker = '"-DREANIMATED_FEATURE_FLAGS=$REANIMATED_FEATURE_FLAGS",';

if (!fs.existsSync(packageJsonPath) || !fs.existsSync(gradlePath)) {
  console.error("ERROR: React Native Reanimated files not found.");
  process.exit(1);
}

const packageInfo = JSON.parse(
  fs.readFileSync(packageJsonPath, "utf8")
);

if (packageInfo.version !== expectedVersion) {
  console.error(
    `ERROR: Expected Reanimated ${expectedVersion}, found ${packageInfo.version}.`
  );
  process.exit(1);
}

let gradleContent = fs.readFileSync(gradlePath, "utf8");

if (gradleContent.includes(cmakeArgument)) {
  console.log("Reanimated CMake path-length fix is already applied.");
  process.exit(0);
}

if (!gradleContent.includes(marker)) {
  console.error("ERROR: Expected CMake arguments marker was not found.");
  process.exit(1);
}

gradleContent = gradleContent.replace(
  marker,
  `${marker}\n                    ${cmakeArgument}`
);

fs.writeFileSync(gradlePath, gradleContent, "utf8");

console.log("Successfully applied Reanimated CMake path-length fix.");