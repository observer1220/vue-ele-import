module.exports = {
  'presets': [
    ['@babel/env', {
      'targets': {
        'browsers': 'last 2 versions'
      }
    }]
  ],
  'env': {
    'test': {
      'plugins': [
        ['istanbul',
          {
            'exclude': '*.+(test|stub|spec).*',
            'useInlineSourceMaps': false
          }
        ]
      ]
    }
  }
}
