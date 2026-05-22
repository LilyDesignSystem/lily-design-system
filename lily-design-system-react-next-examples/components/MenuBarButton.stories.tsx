import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MenuBarButton from './MenuBarButton';

const meta = {
  title: 'Examples/MenuBarButton',
  component: MenuBarButton,
  tags: ['autodocs']
} satisfies Meta<typeof MenuBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
