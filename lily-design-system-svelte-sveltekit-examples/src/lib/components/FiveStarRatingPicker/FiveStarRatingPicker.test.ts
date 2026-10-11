import { fireEvent, render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./FiveStarRatingPicker.svelte";

describe("FiveStarRatingPicker", () => {
  test("renders as a radiogroup", () => {
    render(Subject, { props: { label: "Rating" } });
    expect(screen.getByRole("radiogroup", { name: "Rating" })).toBeTruthy();
  });

  test("has 5 radio buttons", () => {
    render(Subject, { props: { label: "Rating" } });
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  test("clicking a star selects it", async () => {
    const user: UserEvent = userEvent.setup();
    render(Subject, { props: { label: "Rating" } });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    await user.click(radios[2]);
    expect(radios[2].checked).toBe(true);
  });

  test("supports disabled", () => {
    render(Subject, {
      props: { label: "Rating", disabled: true, "data-testid": "r" },
    });
    expect((screen.getByTestId("r") as HTMLFieldSetElement).disabled).toBe(
      true,
    );
  });

  test("passes through attributes", () => {
    render(Subject, { props: { label: "Rating", "data-testid": "r" } });
    expect(screen.getByTestId("r")).toBeTruthy();
  });
});

/** Render inside a real <form>, so form.reset() reaches the component. */
function inForm(props: Record<string, unknown>): HTMLFormElement {
    const form = document.createElement("form");
    document.body.appendChild(form);
    render(Subject, { target: form, props });
    return form;
}

const afterReset = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("form reset", () => {
    test("a form reset restores the initial value, in the radios and in what the form submits", async () => {
        const form = inForm({ label: "Rating", name: "rating", value: 3 });
        const pickRadio = form.querySelector<HTMLInputElement>('input[value="5"]')!;
        await fireEvent.click(pickRadio);
        expect(new FormData(form).get("rating")).toBe("5");
        form.reset();
        await afterReset();
        expect(form.querySelector<HTMLInputElement>('input:checked')?.value).toBe("3");
        expect(new FormData(form).get("rating")).toBe("3");
    });

    test("a cancelled reset changes nothing", async () => {
        const form = inForm({ label: "Rating", name: "rating", value: 3 });
        await fireEvent.click(form.querySelector<HTMLInputElement>('input[value="5"]')!);
        form.addEventListener("reset", (event) => event.preventDefault());
        form.reset();
        await afterReset();
        expect(new FormData(form).get("rating")).toBe("5");
    });
});

describe("no English default", () => {
  test("without starLabel the options are the numbers alone", () => {
    render(Subject, { props: { label: "Rating" } });
    expect(screen.getByLabelText("3")).toBeTruthy();
    expect(screen.queryByText(/stars?/)).toBeNull();
  });

  test("starLabel supplies each option's text", () => {
    render(Subject, { props: { label: "Rating", starLabel: (n: number) => (n === 1 ? "1 étoile" : `${n} étoiles`) } });
    expect(screen.getByLabelText("1 étoile")).toBeTruthy();
    expect(screen.getByLabelText("4 étoiles")).toBeTruthy();
  });
});
