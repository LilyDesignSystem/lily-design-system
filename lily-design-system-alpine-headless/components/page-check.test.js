// The page-level development check. One file, synced to the HTML, Nunjucks and Alpine catalogs.
import { afterEach, describe, expect, test, vi } from "vitest";
import { checkPage, findUnnamed } from "../page-check.js";

const unnamed = (html) => {
    document.body.innerHTML = html;
    return findUnnamed(document).length;
};

afterEach(() => {
    delete globalThis.lilyWarnings;
    vi.restoreAllMocks();
    document.body.innerHTML = "";
});

describe("findUnnamed", () => {
    test.each([
        ["an empty button", "<button></button>"],
        ["an icon-only button", '<button><svg aria-hidden="true"></svg></button>'],
        ["an input with only a placeholder", '<input placeholder="Name" />'],
        ["an empty aria-label", '<input aria-label="" />'],
        ["a labelledby naming nothing", '<button aria-labelledby="nope"></button>'],
        ["an image with empty alt in a link", '<a href="/"><img alt="" /></a>'],
        ["a dialog with only content", "<dialog>Text</dialog>"],
        ["a listbox with only options", '<div role="listbox"><div role="option">One</div></div>'],
    ])("flags %s", (_, html) => {
        expect(unnamed(html)).toBeGreaterThan(0);
    });

    test.each([
        ["text", "<button>Save</button>"],
        ["aria-label", '<button aria-label="Save"></button>'],
        ["aria-labelledby", '<span id="n">Save</span><button aria-labelledby="n"></button>'],
        ["a wrapping label", "<label>Name <input /></label>"],
        ["label for", '<label for="i">Name</label><input id="i" />'],
        ["alt in a link", '<a href="/"><img alt="Home" /></a>'],
        ["an svg title", "<button><svg><title>Save</title></svg></button>"],
        ["an input value", '<input type="button" value="Save" />'],
        ["a default submit", '<input type="submit" />'],
    ])("accepts %s", (_, html) => {
        expect(unnamed(html)).toBe(0);
    });

    test("skips hidden and inert content, and hidden inputs", () => {
        expect(
            unnamed(
                '<div aria-hidden="true"><button></button></div><div inert><button></button></div><input type="hidden" />',
            ),
        ).toBe(0);
    });
});

describe("checkPage", () => {
    test("warns once per element and counts them", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        document.body.innerHTML = '<button class="a"></button><button class="b"></button>';
        expect(checkPage()).toBe(2);
        expect(warn).toHaveBeenCalledTimes(2);
        expect(warn.mock.calls[0][0]).toContain('class="a"');
    });

    test("lilyWarnings = false turns it off", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        globalThis.lilyWarnings = false;
        document.body.innerHTML = "<button></button>";
        expect(checkPage()).toBe(0);
        expect(warn).not.toHaveBeenCalled();
    });
});
