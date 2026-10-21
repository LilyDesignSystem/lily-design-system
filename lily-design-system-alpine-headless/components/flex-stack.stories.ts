import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- FlexStack component -->\n<!--\n  Description: a flex layout container for vertical or horizontal stacking with consistent gap\n\n  HTML tag: <div>\n  CSS class: flex-stack\n  Keyboard: None (passive element)\n  Accessibility: None — purely structural layout container\n\n  Behavior:\n    Inline style applies display: flex with consumer-controlled flex-direction and gap.\n    Optional align-items and justify-content can be added by consumer.\n    The data-direction attribute is exposed for consumer CSS hooks.\n\n  Usage:\n    <div class=\"flex-stack\" data-direction=\"column\"\n         style=\"display: flex; flex-direction: column; gap: 1rem;\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"flex-stack\"\n  data-direction=\"column\"\n  style=\"display: flex; flex-direction: column; gap: 1rem;\"\n>\n  <!-- Consumer provides stacked children -->\n</div>";

const meta = {
  title: 'Headless/Flex Stack',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
