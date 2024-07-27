import eslint from '@eslint/js'
import tslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier/recommended'

export default tslint.config(eslint.configs.recommended, ...tslint.configs.recommended, prettier, { ignores: ['dist'] })
