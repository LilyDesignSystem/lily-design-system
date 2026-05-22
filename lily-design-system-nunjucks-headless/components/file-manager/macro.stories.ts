import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<section
  class="file-manager"
  role="region"
  aria-label="File manager"
  data-module="file-manager"></section>`;

const meta = {
  title: 'Headless/FileManager',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
