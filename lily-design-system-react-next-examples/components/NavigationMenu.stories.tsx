import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NavigationMenu from './NavigationMenu';

const meta = {
  title: 'Examples/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs']
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
