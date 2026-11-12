const { withAppBuildGradle } = require("@expo/config-plugins");

const CMAKE_ARGUMENT = "-DCMAKE_OBJECT_PATH_MAX=250";

function withCmakeObjectPath(config) {
  return withAppBuildGradle(config, (config) => {
    const contents = config.modResults.contents;

    // Avoid adding the same argument more than once.
    if (contents.includes(CMAKE_ARGUMENT)) {
      return config;
    }

    // Find versionName inside defaultConfig.
    const defaultConfigPattern =
      /(\bdefaultConfig\s*\{[\s\S]*?^\s*versionName\s+["'][^"']+["']\s*$)/m;

    if (!defaultConfigPattern.test(contents)) {
      throw new Error(
        "[withCmakeObjectPath] Could not find versionName inside defaultConfig."
      );
    }

    config.modResults.contents = contents.replace(
      defaultConfigPattern,
      `$1\n\n        externalNativeBuild {\n            cmake {\n                arguments "${CMAKE_ARGUMENT}"\n            }\n        }`
    );

    return config;
  });
}

module.exports = withCmakeObjectPath;