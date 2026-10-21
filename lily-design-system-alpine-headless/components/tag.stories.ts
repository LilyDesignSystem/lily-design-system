import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span class=\"tag\">\n  <!-- Consumer provides text content -->\n  <span class=\"screen-reader-span\"><!-- Optional context for screen readers --></span>\n</span>";

const meta = {
  title: 'Headless/Tag',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
