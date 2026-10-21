import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"eire-individual-health-identifier-input\"\n  type=\"text\"\n  aria-label=\"\"\n  inputmode=\"numeric\"\n  pattern=\"[0-9]{10}\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Eire Individual Health Identifier Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
