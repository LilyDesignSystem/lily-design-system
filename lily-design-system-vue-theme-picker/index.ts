export {
    default,
    default as ThemePicker,
    normaliseThemesUrl,
    themeHref,
    themeName,
    matchSystemTheme,
    nextThemePickerId,
} from "./ThemePicker.vue";
export type { Props, SlotArgs, ChildArgs } from "./ThemePicker.vue";
export {
    SYSTEM_THEME,
    DEFAULT_SYSTEM_THEMES,
    THEME_COOKIE_MAX_AGE,
    prefersDarkScheme,
    watchColorScheme,
    resolveTheme,
    themeChoices,
    readThemeCookie,
    themeCookie,
    readDocumentThemeCookie,
    writeDocumentThemeCookie,
} from "./theme-choice";
export type { SystemThemes } from "./theme-choice";
