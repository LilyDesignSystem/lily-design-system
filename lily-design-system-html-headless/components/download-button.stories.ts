import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<a
  class="download-button"
  href="#"
  aria-label=""
  data-file-size=""
  data-file-format=""
  download
>
  <!-- Consumer provides button content (defaults to label if omitted) -->
</a>`;

const meta = {
  title: 'Headless/DownloadButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
