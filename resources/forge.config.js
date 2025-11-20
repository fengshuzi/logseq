const path = require('path');

module.exports = {
  packagerConfig: {
    name: 'Logseq',
    icon: './icons/logseq_big_sur.icns',
    buildVersion: 75,
    asar: true,
    protocols: [
      {
        protocol: 'logseq',
        name: 'logseq',
        schemes: ['logseq']
      }
    ]
  },
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      config: {
        name: 'Logseq',
        icon: './icons/logseq_big_sur.icns'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    }
  ]
};
