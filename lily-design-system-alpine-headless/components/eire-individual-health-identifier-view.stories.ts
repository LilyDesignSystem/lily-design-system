import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"eire-individual-health-identifier-view\"\n  aria-label=\"IHI\"\n></span>";

const meta = {
  title: 'Headless/Eire Individual Health Identifier View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
