import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"united-kingdom-national-insurance-number-view\"\n  aria-label=\"National Insurance Number\"\n></span>";

const meta = {
  title: 'Headless/United Kingdom National Insurance Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
