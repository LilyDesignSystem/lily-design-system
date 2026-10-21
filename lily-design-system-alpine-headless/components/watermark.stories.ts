import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"watermark\"\n  data-rotate=\"-22\"\n  data-gap=\"100px\"\n>\n  <!-- Decorative repeating overlay layer. aria-hidden so screen readers ignore it. -->\n  <div\n    class=\"watermark-overlay\"\n    aria-hidden=\"true\"\n    data-text=\"\"\n    data-image-url=\"\"\n  ></div>\n\n  <!-- Consumer provides the page content rendered beneath the watermark -->\n</div>";

const meta = {
  title: 'Headless/Watermark',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
