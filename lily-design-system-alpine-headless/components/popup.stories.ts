import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div x-data=\"lilyOverlay(false)\">\n  <button class=\"popup-trigger\" x-bind=\"trigger\" aria-controls=\"popup-1\"><!-- Consumer provides trigger label --></button>\n  <div class=\"popup\" id=\"popup-1\" role=\"dialog\" aria-label=\"\" tabindex=\"-1\" x-bind=\"surface\">\n    <!-- Consumer provides content -->\n    <button class=\"popup-close\" x-bind=\"closer\"><!-- Consumer provides close label --></button>\n  </div>\n</div>";

const meta = {
  title: 'Headless/Popup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
