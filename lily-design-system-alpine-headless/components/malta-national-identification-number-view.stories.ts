import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"malta-national-identification-number-view\"\n  aria-label=\"Malta National Identification Number\"\n></span>";

const meta = {
  title: 'Headless/Malta National Identification Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
