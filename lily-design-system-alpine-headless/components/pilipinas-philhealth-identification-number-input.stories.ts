import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"pilipinas-philhealth-identification-number-input\"\n  type=\"text\"\n  aria-label=\"PhilHealth Identification Number (PIN)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Pilipinas Philhealth Identification Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
