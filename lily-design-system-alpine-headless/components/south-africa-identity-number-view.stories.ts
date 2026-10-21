import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"south-africa-identity-number-view\"\n  aria-label=\"South African Identity Number\"\n></span>";

const meta = {
  title: 'Headless/South Africa Identity Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
