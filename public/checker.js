import fs from 'fs'
import path from 'path'
import process from 'process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.chdir(__dirname)

const baseLocale = 'en'
const localesDir = './locales'

const baseLocaleDir = path.join(localesDir, baseLocale)
const localeDirs = fs
  .readdirSync(localesDir)
  .filter((dir) => dir !== baseLocale && fs.statSync(path.join(localesDir, dir)).isDirectory())

localeDirs.forEach((locale) => {
  const localeDir = path.join(localesDir, locale)

  let mismatchCount = 0
  fs.readdirSync(baseLocaleDir).forEach((file) => {
    const baseFilePath = path.join(baseLocaleDir, file)
    const localeFilePath = path.join(localeDir, file)

    if (fs.existsSync(localeFilePath)) {
      const baseTranslations = JSON.parse(fs.readFileSync(baseFilePath, 'utf8'))
      const translations = JSON.parse(fs.readFileSync(localeFilePath, 'utf8'))

      const missingKeys = findMissingKeys(baseTranslations, translations, '')
      const misplacedKeys = findMisplacedKeys(baseTranslations, translations, '')

      if (missingKeys.length > 0 || misplacedKeys.length > 0) {
        console.log(`File: ${locale}/${file}`)
        if (missingKeys.length > 0) {
          console.log('Missing keys:')
          console.log(missingKeys)
          mismatchCount++
        }

        if (misplacedKeys.length > 0) {
          console.log('Incorrect key order:')
          console.log(misplacedKeys)
          mismatchCount++
        }
        console.log('\n---------------------\n')
      } else {
        console.log(`All keys match in ${locale}/${file}`)
      }
    } else {
      console.log(`File missing: ${locale}/${file}`)
      mismatchCount++
    }
  })

  console.log('\n---------------------\n')

  if (mismatchCount < 1) {
    console.log('Locale checker passed successfully')
  } else {
    throw Error(
      `Locale checker failed with ${mismatchCount} ${mismatchCount > 1 ? 'mismatches' : 'mismatch'}`,
    )
  }
})

function findMissingKeys(baseObj, compareObj, prefix) {
  let missingKeys = []

  for (const key in baseObj) {
    const baseValue = baseObj[key]
    const compareValue = compareObj[key]

    if (compareValue === undefined) {
      const missingKey = prefix ? `${prefix}.${key}` : key
      missingKeys.push(missingKey)
    } else if (typeof baseValue === 'object' && typeof compareValue === 'object') {
      const nestedPrefix = prefix ? `${prefix}.${key}` : key
      const nestedMissingKeys = findMissingKeys(baseValue, compareValue, nestedPrefix)
      missingKeys = missingKeys.concat(nestedMissingKeys)
    }
  }

  return missingKeys
}

function findMisplacedKeys(baseObj, compareObj, prefix) {
  const baseKeys = Object.keys(baseObj)
  const compareKeys = Object.keys(compareObj)

  let misplacedKeys = []

  for (let i = 0; i < baseKeys.length; i++) {
    const baseKey = baseKeys[i]
    const compareKey = compareKeys[i]

    if (baseKey !== compareKey) {
      const misplacedKey = prefix ? `${prefix}.${baseKey}` : baseKey
      misplacedKeys.push(misplacedKey)
    } else {
      const baseValue = baseObj[baseKey]
      const compareValue = compareObj[compareKey]

      if (typeof baseValue === 'object' && typeof compareValue === 'object') {
        const nestedPrefix = prefix ? `${prefix}.${baseKey}` : baseKey
        const nestedMisplacedKeys = findMisplacedKeys(baseValue, compareValue, nestedPrefix)
        misplacedKeys = misplacedKeys.concat(nestedMisplacedKeys)
      }
    }
  }

  return misplacedKeys
}
