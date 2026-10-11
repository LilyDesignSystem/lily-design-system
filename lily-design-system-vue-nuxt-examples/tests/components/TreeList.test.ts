import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/TreeList.vue";

describe("TreeList", () => {
  test("renders a tree", () => {
    render(Subject, {
      props: { label: "Files" },
      slots: {
        default:
          "<li role='treeitem' tabindex='-1'>Documents</li><li role='treeitem' tabindex='-1'>Photos</li>",
      },
    });
    expect(screen.getByRole("tree")).toBeTruthy();
  });

  test("has aria-label", () => {
    render(Subject, {
      props: { label: "File browser" },
      slots: {
        default:
          "<li role='treeitem' tabindex='-1'>Documents</li><li role='treeitem' tabindex='-1'>Photos</li>",
      },
    });
    expect(screen.getByLabelText("File browser")).toBeTruthy();
  });

  test("renders treeitem children", () => {
    render(Subject, {
      props: { label: "Files" },
      slots: {
        default:
          "<li role='treeitem' tabindex='-1'>Documents</li><li role='treeitem' tabindex='-1'>Photos</li>",
      },
    });
    expect(screen.getAllByRole("treeitem").length).toBe(2);
  });

  test("arrow down navigates to next item", () => {
    render(Subject, {
      props: { label: "Files" },
      slots: {
        default:
          "<li role='treeitem' tabindex='-1'>Documents</li><li role='treeitem' tabindex='-1'>Photos</li>",
      },
    });
    const items = screen.getAllByRole("treeitem");
    items[0].focus();
    items[0].dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    expect(document.activeElement).toBe(items[1]);
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { label: "F", "data-testid": "tv" },
      slots: {
        default:
          "<li role='treeitem' tabindex='-1'>Documents</li><li role='treeitem' tabindex='-1'>Photos</li>",
      },
    });
    expect(screen.getByTestId("tv")).toBeTruthy();
  });
});
