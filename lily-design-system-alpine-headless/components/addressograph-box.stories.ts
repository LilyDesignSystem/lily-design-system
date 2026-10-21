import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- AddressographBox component -->\n<!--\n  Description: a box that shows a person's identification details, such as name, tracking information, and salient notations\n  HTML tag: <div>\n  CSS class: addressograph-box\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"addressograph-box\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Addressograph Box',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
