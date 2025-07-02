import { language_bg } from './translations/language_bg';
import { language_de } from './translations/language_de';
import { language_en } from './translations/language_en';
import { language_nl } from './translations/language_nl';

export function lang(lang, word) {
    switch (lang) {
        case 'en':
            return language_en(word);
        case 'bg':
            return language_bg(word);
        case 'nl':
            return language_nl(word);
        case 'de':
            return language_de(word);
    }
}