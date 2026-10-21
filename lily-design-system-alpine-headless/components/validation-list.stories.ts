import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<ul\n  class=\"validation-list\"\n  aria-label=\"\"\n  aria-live=\"polite\"\n>\n  <!-- Consumer provides <li class=\"validation-list-item\"> children -->\n</ul>";

const meta = {
  title: 'Headless/Validation List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
