import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"kypros-national-passport-number-view\"\n  aria-label=\"National Passport Number\"\n></span>";

const meta = {
  title: 'Headless/Kypros National Passport Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
