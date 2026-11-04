// The shared tree-expand contract on Alpine's tree, nested one level so the branch has a parent.
import { it } from "vitest";
import { runPattern } from "../../shared/pattern-tester";
import { mount, tick } from "../test/mount.js";

const html = `<ol class="tree-list" role="tree" aria-label="Files" x-data="lilyTree(true, ['parent'])" x-bind="tree">
  <li role="treeitem" x-bind="item('parent', true)">Parent
    <ul role="group" x-bind="group('parent')">
      <li id="branch" role="treeitem" x-bind="item('branch', true)">Branch
        <ul role="group" x-bind="group('branch')">
          <li role="treeitem" x-bind="item('child')">Child</li>
        </ul>
      </li>
    </ul>
  </li>
</ol>`;

it("meets the tree-expand contract", async () => {
    await mount("tree-list", html);
    await runPattern("tree-expand", {
        root: document.getElementById("branch"),
        hook: "tree-list",
        settle: tick,
    });
});
