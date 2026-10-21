import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"overlay-container\" x-data=\"lilyOverlay(false)\" x-bind=\"container\">\n  <!-- Consumer provides the overlay child (typically a dialog or sheet) -->\n</div>";

const meta = {
  title: 'Headless/Overlay Container',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
