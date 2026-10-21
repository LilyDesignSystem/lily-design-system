import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"ellada-dematerialised-securities-system-input\"\n  type=\"text\"\n  aria-label=\"Dematerialised Securities System\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Ellada Dematerialised Securities System Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
