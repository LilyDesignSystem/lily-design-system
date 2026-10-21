import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SegmentGroupItem component -->\n<!--\n  Description: one selectable segment in a segment group\n  HTML tag: <button>\n  CSS class: segment-group-item\n  Keyboard: Tab to focus, Enter or Space to activate\n  Accessibility: Implicit button role, aria-label for accessible name\n  Usage:\n    <button class=\"segment-group-item\" aria-label=\"Example\">\n      ...\n    </button>\n-->\n\n<button\n  class=\"segment-group-item\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides button content -->\n</button>";

const meta = {
  title: 'Headless/Segment Group Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
