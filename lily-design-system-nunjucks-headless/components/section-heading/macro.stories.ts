import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<header
  class="section-heading"><h2 class="section-heading-heading"></h2></header>`;

const meta = {
  title: 'Headless/SectionHeading',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
