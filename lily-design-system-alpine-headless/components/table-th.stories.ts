import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<table><thead><tr><th class=\"table-th\" aria-label=\"Example\" scope=\"col\">\n    <!-- Consumer provides child content -->\n</th></tr></thead></table>";

const meta = {
  title: 'Headless/Table TH',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
