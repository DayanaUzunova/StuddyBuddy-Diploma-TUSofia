import { language_bg } from './translations/language_bg';
import { language_en } from './translations/language_en';

export function lang(lang, word) {
    switch (lang) {
        case 'en':
            return language_en(word);
        case 'bg':
            return language_bg(word);
    }
}