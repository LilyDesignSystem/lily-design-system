import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<fieldset
  class="mutually-exclusive"></fieldset>`;

const meta = {
  title: 'Headless/MutuallyExclusive',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
