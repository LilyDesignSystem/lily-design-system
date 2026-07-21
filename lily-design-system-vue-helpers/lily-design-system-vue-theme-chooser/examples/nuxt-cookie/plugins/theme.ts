// plugins/theme.ts
//
// Nuxt 3 plugin: forward the server-resolved theme (from
// event.context.theme) to the client via $initialTheme.

export default defineNuxtPlugin(() => {
    const event = useRequestEvent();
    const initial = (event?.context as { theme?: string } | undefined)?.theme ?? "light";
    return { provide: { initialTheme: initial } };
});
