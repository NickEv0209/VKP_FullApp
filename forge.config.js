// module.exports = {
//   packagerConfig: {
//     asar: true,
//   },
//   rebuildConfig: {},
//   makers: [
//     {
//       name: '@electron-forge/maker-squirrel',
//       config: {},
//     },
//     {
//       name: '@electron-forge/maker-zip',
//       platforms: ['darwin'],
//     },
//     {
//       name: '@electron-forge/maker-deb',
//       config: {},
//     },
//     {
//       name: '@electron-forge/maker-rpm',
//       config: {},
//     },
//   ],
//   plugins: [
//     {
//       name: '@electron-forge/plugin-auto-unpack-natives',
//       config: {},
//     },
//   ],
// };

module.exports = {
  packagerConfig: {
    asar: true,
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'VKParser',
      },
    },
  ],
  hooks: {
    postPackage: async (forgeConfig, options) => {
      try {
        const ymlPath = path.join(__dirname, 'dist', 'latest.yml'); // Укажите правильный путь

        // Проверяем, есть ли packageJSON в options
        if (!options || !options.packageJSON) {
          throw new Error('Поле packageJSON отсутствует в options.');
        }

        // Формируем содержимое YAML-файла
        const ymlContent = `version: ${options.packageJSON.version} releaseDate: ${new Date().toISOString()}`;

        // Создаём файл
        fs.writeFileSync(ymlPath, ymlContent, 'utf8');
        console.log('Файл latest.yml успешно создан:', ymlPath);
      } catch (err) {
        console.error('Ошибка при создании файла latest.yml:', err.message);
      }
    },
  },
};
