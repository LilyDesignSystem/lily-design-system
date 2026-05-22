import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<a
  class="download-button"></a>`;

const meta = {
  title: 'Headless/DownloadButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
