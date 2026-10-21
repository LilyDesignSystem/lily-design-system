import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"alba-community-health-index-input\"\n  type=\"text\"\n  aria-label=\"Community Health Index\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Alba Community Health Index Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
