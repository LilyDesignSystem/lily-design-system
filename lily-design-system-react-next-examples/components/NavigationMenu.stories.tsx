import type { Meta, StoryObj } from '@storybook/react-vite';
import NavigationMenu from './NavigationMenu';

const meta = {
  title: 'Headless/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs']
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
