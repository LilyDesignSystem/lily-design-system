import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { nextTick } from "vue";

import PickerBar, { DEFAULT_THEMES, DEFAULT_SIZES } from "./PickerBar.vue";

/** Let Vue's scheduler and the wrapped pickers' onMounted effects settle. */
async function flush(): Promise<void> {
  await nextTick();
  await new Promise((r) => setTimeout(r, 0));
  await nextTick();
}

const LABELS = {
  theme: "Theme",
  locale: "Language",
  textSize: "Text size",
  share: "Share",
};
const THEMES_URL = "/assets/themes/";
const LOCALES = ["en", "cy"];

const wrappers: VueWrapper<any>[] = [];

function build(props: Record<string, unknown> = {}) {
  const wrapper = mount(PickerBar, {
    props: {
      labels: LABELS,
      themesUrl: THEMES_URL,
      locales: LOCALES,
      ...props,
    },
    attachTo: document.body,
  });
  wrappers.push(wrapper);
  return wrapper;
}

function buttons(wrapper: VueWrapper<any>) {
  return {
    theme: wrapper.find("button.theme-picker-button"),
    locale: wrapper.find("button.locale-picker-button"),
    textSize: wrapper.find("button.text-size-picker-button"),
    share: wrapper.find("button.share-picker-button"),
  };
}

beforeEach(() => {
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("lang");
  document.documentElement.removeAttribute("dir");
  document.documentElement.removeAttribute("data-text-size");
  document.head
    .querySelectorAll("link[data-lily-theme-picker]")
    .forEach((n) => n.remove());
  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
});

afterEach(() => {
  while (wrappers.length) wrappers.pop()!.unmount();
  document.body.innerHTML = "";
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("lang");
  document.documentElement.removeAttribute("dir");
  document.documentElement.removeAttribute("data-text-size");
});

describe("PickerBar — DEFAULT_THEMES (§3, §5.1)", () => {
  test("has all 45 Lily reference theme slugs", () => {
    expect(DEFAULT_THEMES).toHaveLength(45);
  });

  test("is alphabetical, with the UK & US themes moved to the bottom as one alphabetical group", () => {
    const nonUkUs = DEFAULT_THEMES.filter((t) => !t.startsWith("united-"));
    const ukUs = DEFAULT_THEMES.filter((t) => t.startsWith("united-"));
    expect(nonUkUs).toEqual([...nonUkUs].sort());
    expect(ukUs).toEqual([...ukUs].sort());
    expect(DEFAULT_THEMES).toEqual([...nonUkUs, ...ukUs]);
  });

  test("first entry is 'abyss', last is 'united-states-web-design-system'", () => {
    expect(DEFAULT_THEMES[0]).toBe("abyss");
    expect(DEFAULT_THEMES[DEFAULT_THEMES.length - 1]).toBe(
      "united-states-web-design-system",
    );
  });
});

describe("PickerBar — DEFAULT_SIZES (§3, §5.2)", () => {
  test("is the seven-step scale, largest first", () => {
    expect(DEFAULT_SIZES).toEqual([
      "largest",
      "larger",
      "large",
      "normal",
      "small",
      "smaller",
      "smallest",
    ]);
  });
});

describe("PickerBar — composition (§4, §7.1–§7.4)", () => {
  test("§7.1 renders the root with the base class plus the consumer's class", () => {
    const wrapper = build({ class: "my-picker-bar" });
    const root = wrapper.find("div.picker-bar");
    expect(root.exists()).toBe(true);
    expect(root.classes()).toContain("my-picker-bar");
  });

  test("§7.2 renders all four pickers, each named from `labels`", () => {
    const wrapper = build();
    const { theme, locale, textSize, share } = buttons(wrapper);
    expect(theme.attributes("aria-label")).toBe("Theme");
    expect(locale.attributes("aria-label")).toBe("Language");
    expect(textSize.attributes("aria-label")).toBe("Text size");
    expect(share.attributes("aria-label")).toBe("Share");
  });

  test("§7.2 renders the four picker root class hooks in theme, locale, text-size, share order", () => {
    const wrapper = build();
    const roots = wrapper
      .findAll(".picker-bar > div")
      .map((el) => el.classes()[0]);
    expect(roots).toEqual([
      "theme-picker",
      "locale-picker",
      "text-size-picker",
      "share-picker",
    ]);
  });

  test("§7.5 fallthrough attributes land on the root (Vue's default single-root inheritAttrs)", () => {
    const wrapper = build({ "data-testid": "header-picker-bar" });
    expect(
      wrapper.find('[data-testid="header-picker-bar"]').exists(),
    ).toBe(true);
  });
});

describe("PickerBar — theme-picker wiring (§5.1, §7.3, §7.6)", () => {
  test("§7.3 forwards themesUrl and uses DEFAULT_THEMES when `themes` is omitted", async () => {
    const wrapper = build();
    await buttons(wrapper).theme.trigger("click");
    const options = wrapper.findAll(".theme-picker-option");
    expect(options).toHaveLength(45);
    expect(options[0].text()).toBe("Abyss");
    expect(options[37].text()).toBe(
      "United Kingdom Government Digital Service",
    );
  });

  test("§7.6 an explicit `themes` prop overrides the default", async () => {
    const wrapper = build({ themes: ["light", "dark"] });
    await buttons(wrapper).theme.trigger("click");
    expect(wrapper.findAll(".theme-picker-option")).toHaveLength(2);
  });

  test("§7.7 `themeProps` reaches ThemePicker (storageKey persists a selection)", async () => {
    const wrapper = build({ themeProps: { storageKey: "lily-theme" } });
    await buttons(wrapper).theme.trigger("click");
    const options = wrapper.findAll(".theme-picker-option");
    await options[0].trigger("click");
    expect(localStorage.getItem("lily-theme")).toBe("abyss");
  });

  test("§7.11 re-emits ThemePicker's change as `theme-change`", async () => {
    const wrapper = build();
    await flush(); // let the mount-time default (e.g. "light") apply first
    await buttons(wrapper).theme.trigger("click");
    const options = wrapper.findAll(".theme-picker-option");
    await options[0].trigger("click");
    const emissions = wrapper.emitted("theme-change") ?? [];
    expect(emissions.at(-1)).toEqual(["abyss"]);
  });
});

describe("PickerBar — locale-picker wiring (§5.2, §7.4)", () => {
  test("§7.4 forwards the required `locales` list", async () => {
    const wrapper = build();
    await buttons(wrapper).locale.trigger("click");
    expect(wrapper.findAll(".locale-picker-option")).toHaveLength(
      LOCALES.length,
    );
  });
});

describe("PickerBar — text-size-picker wiring (§5.3, §7.8, §7.9)", () => {
  test("§7.8 uses DEFAULT_SIZES when `sizes` is omitted, in largest-to-smallest order", async () => {
    const wrapper = build();
    await buttons(wrapper).textSize.trigger("click");
    const options = wrapper
      .findAll(".text-size-picker-option")
      .map((el) => el.text());
    expect(options).toEqual([
      "Largest",
      "Larger",
      "Large",
      "Normal",
      "Small",
      "Smaller",
      "Smallest",
    ]);
  });

  test("§7.9 defaults the initial value to 'normal'", async () => {
    const wrapper = build();
    await flush();
    const hidden = wrapper.find(
      'input[name="text-size"]',
    ).element as HTMLInputElement;
    expect(hidden.value).toBe("normal");
  });

  test("§7.9 `textSizeProps.defaultValue` overrides the built-in 'normal' default", async () => {
    const wrapper = build({ textSizeProps: { defaultValue: "small" } });
    await flush();
    const hidden = wrapper.find(
      'input[name="text-size"]',
    ).element as HTMLInputElement;
    expect(hidden.value).toBe("small");
  });
});

describe("PickerBar — share-picker wiring (§5.4, §7.10)", () => {
  test("§7.10 forwards `shareTargets` to SharePicker's list", async () => {
    const wrapper = build({
      shareTargets: [
        {
          id: "email",
          label: "Email",
          href: (url: string) => `mailto:?body=${url}`,
        },
      ],
    });
    await buttons(wrapper).share.trigger("click");
    expect(wrapper.find(".share-picker-target").text()).toBe("Email");
  });
});
