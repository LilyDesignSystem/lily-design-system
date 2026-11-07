// @vitest-environment jsdom
// The native radio group's keys, played by user-event in jsdom: what this guards is the shared name.
import { userEvent } from "@testing-library/user-event";
import { expect, it } from "vitest";

import { render } from "../../test/render.js";

it("ArrowRight and ArrowLeft move the selection through the native radio group", async () => {
    document.body.innerHTML = render("red-amber-green-picker", {
        label: "Status",
    }).document.body.innerHTML;
    const radios = [...document.querySelectorAll('input[type="radio"]')];
    const user = userEvent.setup();
    await user.click(radios[0]);
    await user.keyboard("{ArrowRight}");
    expect(radios[1].checked).toBe(true);
    expect(document.activeElement).toBe(radios[1]);
    await user.keyboard("{ArrowLeft}");
    expect(radios[0].checked).toBe(true);
});
