import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"ellada-dematerialised-securities-system-view\"\n  aria-label=\"Dematerialised Securities System\"\n></span>";

const meta = {
  title: 'Headless/Ellada Dematerialised Securities System View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
