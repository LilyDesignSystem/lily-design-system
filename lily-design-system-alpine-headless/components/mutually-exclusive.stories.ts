import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MutuallyExclusive component -->\n<fieldset\n  class=\"mutually-exclusive\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</fieldset>";

const meta = {
  title: 'Headless/Mutually Exclusive',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
