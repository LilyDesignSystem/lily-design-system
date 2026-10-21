import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<details class=\"details\">\n  <summary class=\"details-summary\"><!-- Consumer provides summary --></summary>\n  <!-- Consumer provides content -->\n</details>";

const meta = {
  title: 'Headless/Details',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
