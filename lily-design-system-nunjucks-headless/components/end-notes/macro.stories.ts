import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<section
  class="end-notes"
  aria-label="End notes"></section>`;

const meta = {
  title: 'Headless/EndNotes',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
