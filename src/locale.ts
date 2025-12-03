import { System } from 'typebox/system'

const Locale = System.Locale

type LocaleString = Exclude<keyof typeof Locale, 'Get' | 'Set' | 'Reset'> & ({} & string)

/** Sets the locale for which errors are generated. */
export function locale(locale: LocaleString): void {
  const F = locale in System.Locale ? System.Locale[locale] : System.Locale.en_US
  System.Locale.Set(F)
}
