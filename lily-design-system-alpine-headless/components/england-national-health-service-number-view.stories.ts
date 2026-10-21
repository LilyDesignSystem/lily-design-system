import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"england-national-health-service-number-view\"\n  aria-label=\"National Health Service Number\"\n></span>";

const meta = {
  title: 'Headless/England National Health Service Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
