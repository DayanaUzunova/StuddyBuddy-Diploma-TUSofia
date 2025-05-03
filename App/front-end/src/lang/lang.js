export function lang(lang, word) {
    switch (lang) {
        case 'English':
            return language_en(word);
        case 'Bulgarian':
            return language_bg(word);
    }
}