import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="file-upload"
  data-module="file-upload">
  <label class="file-upload-label" for="file-upload-input">Drop files here, or choose</label>
  <input
    class="file-upload-input"
    type="file"
    id="file-upload-input"  >
</div>`;

const meta = {
  title: 'Headless/FileUpload',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
