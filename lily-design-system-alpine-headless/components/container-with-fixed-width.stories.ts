import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ContainerWithFixedWidth component -->\n<!--\n  Description: a centered content wrapper with a fixed max-width breakpoint\n\n  HTML tag: <div>\n  CSS class: container-with-fixed-width\n  Keyboard: None (passive element)\n  Accessibility: None — purely structural layout container\n\n  Behavior:\n    Inline style applies max-width and margin-inline: auto so the container\n    is centered horizontally within its parent. The data-max-width attribute\n    is exposed for consumer CSS hooks.\n\n  Usage:\n    <div class=\"container-with-fixed-width\" data-max-width=\"1200px\"\n         style=\"max-width: 1200px; margin-inline: auto;\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"container-with-fixed-width\"\n  data-max-width=\"1200px\"\n  style=\"max-width: 1200px; margin-inline: auto;\"\n>\n  <!-- Consumer provides centered content -->\n</div>";

const meta = {
  title: 'Headless/Container With Fixed Width',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
