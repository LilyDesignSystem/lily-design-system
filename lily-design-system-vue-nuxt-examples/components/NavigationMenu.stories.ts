import type { Meta, StoryObj } from '@storybook/vue3-vite';
import NavigationMenu from './NavigationMenu.vue';

const meta = {
  title: 'Headless/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs']
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
