import type { ThemeRegistration } from 'shiki'

export const awlLeaseTheme: ThemeRegistration = {
  name: 'awl-lease',
  type: 'light',
  colors: {
    'editor.background': '#f7f4ef',
    'editor.foreground': '#1a1d21',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#7c8694', fontStyle: 'italic' },
    },
    {
      scope: ['string', 'string.quoted'],
      settings: { foreground: '#5a9a6e' },
    },
    {
      scope: ['constant.numeric', 'constant.language'],
      settings: { foreground: '#6b7a3a' },
    },
    {
      scope: ['keyword', 'storage.type', 'storage.modifier'],
      settings: { foreground: '#c47a2a', fontStyle: 'bold' },
    },
    {
      scope: ['keyword.control', 'keyword.operator'],
      settings: { foreground: '#c47a2a' },
    },
    {
      scope: ['entity.name.function', 'support.function'],
      settings: { foreground: '#8a5a1a' },
    },
    {
      scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class'],
      settings: { foreground: '#8a5a1a', fontStyle: 'bold' },
    },
    {
      scope: ['variable', 'variable.other'],
      settings: { foreground: '#1a1d21' },
    },
    {
      scope: ['variable.parameter'],
      settings: { foreground: '#3d3530' },
    },
    {
      scope: ['punctuation', 'meta.brace'],
      settings: { foreground: '#5a6270' },
    },
    {
      scope: ['operator', 'keyword.operator.arithmetic', 'keyword.operator.logical'],
      settings: { foreground: '#5a6270' },
    },
    {
      scope: ['entity.name.tag', 'support.class.component'],
      settings: { foreground: '#c47a2a' },
    },
    {
      scope: ['entity.other.attribute-name', 'support.type.property-name'],
      settings: { foreground: '#7a8a5a' },
    },
    {
      scope: ['meta.import', 'keyword.control.import', 'keyword.control.export'],
      settings: { foreground: '#c47a2a' },
    },
    {
      scope: ['meta.function', 'entity.name.function'],
      settings: { foreground: '#8a5a1a' },
    },
    {
      scope: ['support.constant', 'support.type.primitive'],
      settings: { foreground: '#6b7a3a' },
    },
    {
      scope: ['entity.name.namespace'],
      settings: { foreground: '#3d3530' },
    },
    {
      scope: ['meta.selector', 'entity.other.inherited-class'],
      settings: { foreground: '#7a8a5a' },
    },
    {
      scope: ['constant.other.color', 'support.constant.color'],
      settings: { foreground: '#5a9a6e' },
    },
    {
      scope: ['invalid', 'invalid.illegal'],
      settings: { foreground: '#c0392b' },
    },
  ],
}

export const awlLeaseThemeDark: ThemeRegistration = {
  name: 'awl-lease-dark',
  type: 'dark',
  colors: {
    'editor.background': '#1a1d21',
    'editor.foreground': '#e8e4df',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#8a9299', fontStyle: 'italic' },
    },
    {
      scope: ['string', 'string.quoted'],
      settings: { foreground: '#6abf7a' },
    },
    {
      scope: ['constant.numeric', 'constant.language'],
      settings: { foreground: '#9ab87a' },
    },
    {
      scope: ['keyword', 'storage.type', 'storage.modifier'],
      settings: { foreground: '#e8a040', fontStyle: 'bold' },
    },
    {
      scope: ['keyword.control', 'keyword.operator'],
      settings: { foreground: '#e8a040' },
    },
    {
      scope: ['entity.name.function', 'support.function'],
      settings: { foreground: '#e8b060' },
    },
    {
      scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class'],
      settings: { foreground: '#e8b060', fontStyle: 'bold' },
    },
    {
      scope: ['variable', 'variable.other'],
      settings: { foreground: '#e8e4df' },
    },
    {
      scope: ['variable.parameter'],
      settings: { foreground: '#d8d4cf' },
    },
    {
      scope: ['punctuation', 'meta.brace'],
      settings: { foreground: '#9a9299' },
    },
    {
      scope: ['operator', 'keyword.operator.arithmetic', 'keyword.operator.logical'],
      settings: { foreground: '#9a9299' },
    },
    {
      scope: ['entity.name.tag', 'support.class.component'],
      settings: { foreground: '#e8a040' },
    },
    {
      scope: ['entity.other.attribute-name', 'support.type.property-name'],
      settings: { foreground: '#9aba7a' },
    },
    {
      scope: ['meta.import', 'keyword.control.import', 'keyword.control.export'],
      settings: { foreground: '#e8a040' },
    },
    {
      scope: ['meta.function', 'entity.name.function'],
      settings: { foreground: '#e8b060' },
    },
    {
      scope: ['support.constant', 'support.type.primitive'],
      settings: { foreground: '#9ab87a' },
    },
    {
      scope: ['entity.name.namespace'],
      settings: { foreground: '#d8d4cf' },
    },
    {
      scope: ['meta.selector', 'entity.other.inherited-class'],
      settings: { foreground: '#9aba7a' },
    },
    {
      scope: ['constant.other.color', 'support.constant.color'],
      settings: { foreground: '#6abf7a' },
    },
    {
      scope: ['invalid', 'invalid.illegal'],
      settings: { foreground: '#e05050' },
    },
  ],
}
