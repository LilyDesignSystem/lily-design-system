import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"australia-individual-healthcare-identifier-view\"\n  aria-label=\"Individual Healthcare Identifier\"\n></span>";

const meta = {
  title: 'Headless/Australia Individual Healthcare Identifier View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
