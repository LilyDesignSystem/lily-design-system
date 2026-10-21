import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DownloadButton component -->\n<!--\n  Description: a download link styled as a button, with optional file size and format metadata\n  HTML tag: <a>\n  CSS class: download-button\n  Keyboard: Tab to focus, Enter to activate (native <a> behavior)\n  Accessibility:\n    - aria-label is REQUIRED — provides the descriptive name including download intent\n    - data-file-size and data-file-format expose file metadata for styling and screen readers\n    - native download attribute prompts the browser to save the linked resource\n  Usage:\n    <a\n      class=\"download-button\"\n      href=\"/files/report.pdf\"\n      aria-label=\"Download report (PDF, 2.4 MB)\"\n      data-file-size=\"2.4 MB\"\n      data-file-format=\"PDF\"\n      download=\"report.pdf\"\n    >\n      Download report\n    </a>\n-->\n\n<a\n  class=\"download-button\"\n  href=\"#\"\n  aria-label=\"\"\n  data-file-size=\"\"\n  data-file-format=\"\"\n  download\n>\n  <!-- Consumer provides button content (defaults to label if omitted) -->\n</a>";

const meta = {
  title: 'Headless/Download Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
