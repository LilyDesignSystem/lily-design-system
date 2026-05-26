import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="norge-fodselsnummer-view"
  aria-label="Norwegian Birth Number">sample-value</span>`;

const meta = {
  title: 'Headless/NorgeFodselsnummerView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
