import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"file-upload\" x-data=\"lilyFileUpload()\">\n  <button class=\"file-upload-button\" aria-label=\"\" x-bind=\"trigger\"><!-- Consumer provides button text --></button>\n  <input class=\"file-upload-input\" hidden aria-hidden=\"true\" tabindex=\"-1\" x-bind=\"input\">\n  <span class=\"file-upload-status\" data-file-count=\"0\" x-bind=\"status\"></span>\n</div>";

const meta = {
  title: 'Headless/File Upload',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
