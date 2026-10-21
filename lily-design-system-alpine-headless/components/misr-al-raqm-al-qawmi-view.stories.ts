import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"misr-al-raqm-al-qawmi-view\"\n  aria-label=\"الرقم القومي (Al-Raqm Al-Qawmi)\"\n></span>";

const meta = {
  title: 'Headless/Misr Al Raqm Al Qawmi View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
