import cn from './i18n/cn.json'
import en from './i18n/en.json'
import de from './i18n/de.json'
import es from './i18n/es.json'
import fr from './i18n/fr.json'
import pt from './i18n/pt.json'
import mg from './i18n/mg.json'
import vi from './i18n/vi.json'

export type i18nLanguages = 'en' | 'cn' | 'de' | 'es' | 'fr' | 'pt' | 'mg'|'vi'

export const getTranslation = (language: i18nLanguages) => {
    switch (language) {
        case 'en':
            return en
        case 'cn':
            return cn
        case 'es':
            return es
        case 'de':
            return de
        case 'pt':
            return pt
        case 'fr':
            return fr
        case 'mg':
            return mg
        case 'vi':
            return vi
        default:
            return en
    }
}
