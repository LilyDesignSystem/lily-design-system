import type { Meta, StoryObj } from '@storybook/react-vite';
import MenuBarButton from './MenuBarButton';

const meta = {
  title: 'Headless/MenuBarButton',
  component: MenuBarButton,
  tags: ['autodocs']
} satisfies Meta<typeof MenuBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
