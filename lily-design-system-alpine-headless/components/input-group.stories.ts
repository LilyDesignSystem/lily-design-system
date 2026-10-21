import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- InputGroup component -->\n<!--\n  Description: a group wrapping an input with prefix and suffix addons\n\n  HTML tag: <div>\n  CSS class: input-group\n  Keyboard: None at the group level; the inner input handles its own keyboard interaction\n  Accessibility: role=\"group\" with aria-label so assistive technology presents the prefix, input, and suffix as one unit\n\n  Behavior:\n    Renders a <div role=\"group\"> containing optional prefix, the input\n    (consumer-supplied), and optional suffix. Prefix and suffix are wrapped\n    in <span> elements with the input-group-prefix / input-group-suffix\n    classes so consumer CSS can style them.\n\n  Usage:\n    <div class=\"input-group\" role=\"group\" aria-label=\"Amount\">\n      <span class=\"input-group-prefix\">$</span>\n      <input type=\"text\" />\n      <span class=\"input-group-suffix\">.00</span>\n    </div>\n-->\n\n<div\n  class=\"input-group\"\n  role=\"group\"\n  aria-label=\"\"\n>\n  <!-- Optional prefix addon (e.g., currency symbol, icon) -->\n  <span class=\"input-group-prefix\">\n    <!-- Consumer provides prefix content -->\n  </span>\n\n  <!-- Consumer-supplied input goes here -->\n\n  <!-- Optional suffix addon (e.g., unit, button, icon) -->\n  <span class=\"input-group-suffix\">\n    <!-- Consumer provides suffix content -->\n  </span>\n</div>";

const meta = {
  title: 'Headless/Input Group',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
