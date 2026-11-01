import { fireEvent, render } from "@solidjs/testing-library";
import { ContactForm } from "./ContactForm";

test("the form drives the tooltip and the dialog through attr: and on:", async () => {
    const sent: string[] = [];
    const { container, getByText } = render(() => <ContactForm onSend={(n) => sent.push(n)} />);
    const input = container.querySelector("lily-text-input input") as HTMLInputElement;
    expect(input.getAttribute("aria-label")).toBe("Name");
    expect(input.required).toBe(true);

    const tip = container.querySelector("lily-tooltip")!;
    const tooltip = () => tip.querySelector('[role="tooltip"]') as HTMLElement;
    expect(tooltip().hidden).toBe(true);
    fireEvent.focus(getByText("Help"));
    expect(tip.hasAttribute("visible")).toBe(true);
    expect(tooltip().hidden).toBe(false);
    fireEvent.blur(getByText("Help"));
    expect(tip.hasAttribute("visible")).toBe(false);

    input.value = "Ada";
    fireEvent.input(input);
    const dialog = container.querySelector("lily-dialog")!;
    expect(dialog.hasAttribute("open")).toBe(false);
    fireEvent.submit(container.querySelector("form")!);
    expect(dialog.hasAttribute("open")).toBe(true);
    dialog.dispatchEvent(new CustomEvent("lily-close", { bubbles: true, composed: true }));
    expect(dialog.hasAttribute("open")).toBe(false);

    fireEvent.submit(container.querySelector("form")!);
    fireEvent.click(getByText("Yes"));
    expect(sent).toEqual(["Ada"]);
    expect(dialog.hasAttribute("open")).toBe(false);
});
