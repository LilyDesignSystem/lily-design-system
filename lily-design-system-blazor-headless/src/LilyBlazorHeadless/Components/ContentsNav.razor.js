// ContentsNav.razor.js — runs the scrollspy from an interactive ContentsNav, so C# hears which section is active.
// Under static rendering nothing runs this: load contents-nav-spy.js and call autoInit() (see that file).

import { initContentsNavSpy } from "../contents-nav-spy.js";

export function attach(nav, dotnet) {
    const stop = initContentsNavSpy(nav, {
        onChange: (id) => dotnet.invokeMethodAsync("OnSpyChange", id),
    });
    return { dispose: stop };
}
