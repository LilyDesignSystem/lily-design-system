import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="eesti-isikukood-view"
  aria-label="Personal Identification Code">sample-value</span>`;

const meta = {
  title: 'Headless/EestiIsikukoodView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
