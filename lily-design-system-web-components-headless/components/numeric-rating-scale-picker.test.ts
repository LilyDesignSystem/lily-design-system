import { afterEach, describe, expect, test } from "vitest";
import userEvent from "@testing-library/user-event";

import { NumericRatingScalePicker } from "./numeric-rating-scale-picker.js";

if (!customElements.get("lily-numeric-rating-scale-picker"))
    customElements.define("lily-numeric-rating-scale-picker", NumericRatingScalePicker);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("NumericRatingScalePicker", () => {
    test("is a fieldset with a legend, radios from 0 to 10 and described ends", () => {
        document.body.innerHTML = `<lily-numeric-rating-scale-picker label="How bad is your pain now?" min-label="No pain" max-label="Worst pain imaginable"></lily-numeric-rating-scale-picker>`;
        expect(document.querySelector("fieldset legend")?.textContent).toBe(
            "How bad is your pain now?",
        );
        const radios = document.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        expect(radios).toHaveLength(11);
        expect(
            document.getElementById(radios[0].getAttribute("aria-describedby") ?? "")?.textContent,
        ).toBe("No pain");
        expect(
            document.getElementById(radios[10].getAttribute("aria-describedby") ?? "")?.textContent,
        ).toBe("Worst pain imaginable");
    });

    test("arrow keys move and choose; value reads the choice", async () => {
        const user = userEvent.setup();
        document.body.innerHTML = `<lily-numeric-rating-scale-picker label="Pain" value="3"></lily-numeric-rating-scale-picker>`;
        (document.querySelector('input[value="3"]') as HTMLInputElement).focus();
        await user.keyboard("{ArrowRight}");
        expect(
            (document.querySelector("lily-numeric-rating-scale-picker") as NumericRatingScalePicker)
                .value,
        ).toBe("4");
    });
});

describe("NumericRatingScalePicker follows its attributes (P50-T28)", () => {
    test("builds the scale again, keeping a score the person chose", () => {
        document.body.innerHTML =
            '<lily-numeric-rating-scale-picker label="Old" value="2"></lily-numeric-rating-scale-picker>';
        const host = document.querySelector("lily-numeric-rating-scale-picker") as HTMLElement;
        const radios = () =>
            Array.from(document.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
        const checked = () => radios().find((r) => r.checked)?.value;
        expect(checked()).toBe("2");
        host.setAttribute("label", "Pain now");
        host.setAttribute("max", "5");
        host.setAttribute("min-label", "None");
        host.setAttribute("class", "wide");
        expect(document.querySelector("legend")?.textContent).toBe("Pain now");
        expect(radios()).toHaveLength(6);
        expect(document.querySelector("fieldset")?.className).toBe(
            "numeric-rating-scale-picker wide",
        );
        expect(
            document.getElementById(radios()[0].getAttribute("aria-describedby") ?? "")
                ?.textContent,
        ).toBe("None");
        expect(checked()).toBe("2");
        host.setAttribute("value", "3");
        expect(checked()).toBe("3");
        radios()[4].checked = true;
        host.setAttribute("value", "1");
        host.setAttribute("label", "Pain today");
        expect(checked()).toBe("4");
        expect(radios().find((r) => r.defaultChecked)?.value).toBe("1");
    });
});
