import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<kbd class="kbd-shortcut" aria-label="Control K"><kbd class="kbd-shortcut-key">Ctrl</kbd><span class="kbd-shortcut-separator" aria-hidden="true">+</span><kbd class="kbd-shortcut-key">K</kbd></kbd>`;

const meta = {
  title: 'Headless/KbdShortcut',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
