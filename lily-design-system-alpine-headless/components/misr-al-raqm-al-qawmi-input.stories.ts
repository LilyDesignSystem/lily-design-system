import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"misr-al-raqm-al-qawmi-input\"\n  type=\"text\"\n  aria-label=\"الرقم القومي (Al-Raqm Al-Qawmi)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Misr Al Raqm Al Qawmi Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
