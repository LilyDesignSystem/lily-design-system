import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"bharat-aadhaar-view\"\n  aria-label=\"Aadhaar (आधार)\"\n></span>";

const meta = {
  title: 'Headless/Bharat Aadhaar View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
