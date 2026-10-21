import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"suomi-henkilotunnus-input\"\n  type=\"text\"\n  aria-label=\"Personal Identity Code\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Suomi Henkilotunnus Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
