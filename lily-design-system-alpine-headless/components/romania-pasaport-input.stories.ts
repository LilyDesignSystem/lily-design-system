import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"romania-pasaport-input\"\n  type=\"text\"\n  aria-label=\"Romanian Passport\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Romania Pasaport Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
