import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"cymru-rhif-y-gwasanaeth-iechyd-gwladol-input\"\n  type=\"text\"\n  aria-label=\"National Health Service Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Cymru Rhif YGwasanaeth Iechyd Gwladol Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
