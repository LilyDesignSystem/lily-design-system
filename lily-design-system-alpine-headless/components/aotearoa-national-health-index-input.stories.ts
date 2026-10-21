import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"aotearoa-national-health-index-input\"\n  type=\"text\"\n  aria-label=\"National Health Index (NHI) Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Aotearoa National Health Index Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
