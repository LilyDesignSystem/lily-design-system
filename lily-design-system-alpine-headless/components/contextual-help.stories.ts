import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"contextual-help\" x-data=\"lilyPopover(false)\" x-bind=\"root\">\n  <button class=\"contextual-help-trigger\" x-bind=\"trigger\" aria-label=\"\" aria-controls=\"contextual-help-panel-1\">?</button>\n  <div class=\"contextual-help-panel\" id=\"contextual-help-panel-1\" role=\"dialog\" aria-label=\"\" x-bind=\"panel\">\n    <!-- Consumer provides popover content -->\n  </div>\n</div>";

const meta = {
  title: 'Headless/Contextual Help',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
