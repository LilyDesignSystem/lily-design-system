import { fireEvent, render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./FiveFaceRatingPicker.svelte";

describe("FiveFaceRatingPicker", () => {
  test("renders as a radiogroup", () => {
    render(Subject, { props: { label: "Experience" } });
    expect(screen.getByRole("radiogroup", { name: "Experience" })).toBeTruthy();
  });

  test("has 5 radio buttons", () => {
    render(Subject, { props: { label: "Experience" } });
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  test("has all 5 default labels", () => {
    render(Subject, { props: { label: "Experience", labels: ["Very bad", "Bad", "Okay", "Good", "Very good"] } });
    expect(screen.getByText("Very bad")).toBeTruthy();
    expect(screen.getByText("Bad")).toBeTruthy();
    expect(screen.getByText("Okay")).toBeTruthy();
    expect(screen.getByText("Good")).toBeTruthy();
    expect(screen.getByText("Very good")).toBeTruthy();
  });

  test("supports custom labels", () => {
    render(Subject, {
      props: { label: "E", labels: ["Terrible", "Poor", "Fair", "Great", "Excellent"] },
    });
    expect(screen.getByText("Terrible")).toBeTruthy();
    expect(screen.getByText("Poor")).toBeTruthy();
    expect(screen.getByText("Fair")).toBeTruthy();
    expect(screen.getByText("Great")).toBeTruthy();
    expect(screen.getByText("Excellent")).toBeTruthy();
  });

  test("clicking selects a face", async () => {
    const user: UserEvent = userEvent.setup();
    render(Subject, { props: { label: "Experience" } });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    await user.click(radios[3]);
    expect(radios[3].checked).toBe(true);
  });

  test("uses default name for form submission", () => {
    render(Subject, { props: { label: "Experience" } });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[0].name).toBe("face-rating");
  });

  test("supports custom name", () => {
    render(Subject, { props: { label: "Experience", name: "satisfaction" } });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[0].name).toBe("satisfaction");
  });

  test("supports disabled", () => {
    render(Subject, {
      props: { label: "Experience", disabled: true, "data-testid": "r" },
    });
    expect((screen.getByTestId("r") as HTMLFieldSetElement).disabled).toBe(
      true,
    );
  });

  test("disabled radios cannot be clicked", async () => {
    const user: UserEvent = userEvent.setup();
    render(Subject, {
      props: { label: "Experience", disabled: true },
    });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    await user.click(radios[2]);
    expect(radios[2].checked).toBe(false);
  });

  test("no radio is checked by default", () => {
    render(Subject, { props: { label: "Experience" } });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    const checked = radios.filter((r) => r.checked);
    expect(checked).toHaveLength(0);
  });

  test("passes through attributes", () => {
    render(Subject, { props: { label: "E", "data-testid": "fr" } });
    expect(screen.getByTestId("fr")).toBeTruthy();
  });
});

/** Render inside a real <form>, so form.reset() reaches the component. */
function inForm(props: Record<string, unknown>): HTMLFormElement {
    const form = document.createElement("form");
    document.body.appendChild(form);
    render(Subject, { target: form, props: props as any });
    return form;
}

const afterReset = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("form reset", () => {
    test("a form reset restores the initial value, in the radios and in what the form submits", async () => {
        const form = inForm({ label: "Rating", name: "face", value: 2 });
        const pickRadio = form.querySelector<HTMLInputElement>('input[value="4"]')!;
        await fireEvent.click(pickRadio);
        expect(new FormData(form).get("face")).toBe("4");
        form.reset();
        await afterReset();
        expect(form.querySelector<HTMLInputElement>('input:checked')?.value).toBe("2");
        expect(new FormData(form).get("face")).toBe("2");
    });

    test("a cancelled reset changes nothing", async () => {
        const form = inForm({ label: "Rating", name: "face", value: 2 });
        await fireEvent.click(form.querySelector<HTMLInputElement>('input[value="4"]')!);
        form.addEventListener("reset", (event) => event.preventDefault());
        form.reset();
        await afterReset();
        expect(new FormData(form).get("face")).toBe("4");
    });
});

describe("no English default", () => {
  test("without labels the options are the numbers 1 to 5", () => {
    render(Subject, { props: { label: "Feedback" } });
    for (const n of ["1", "2", "3", "4", "5"]) expect(screen.getByLabelText(n)).toBeTruthy();
    expect(screen.queryByText(/bad|good|okay/i)).toBeNull();
  });
});
