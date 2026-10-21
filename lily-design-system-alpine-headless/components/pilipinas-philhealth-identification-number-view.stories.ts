import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"pilipinas-philhealth-identification-number-view\"\n  aria-label=\"PhilHealth Identification Number (PIN)\"\n></span>";

const meta = {
  title: 'Headless/Pilipinas Philhealth Identification Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
