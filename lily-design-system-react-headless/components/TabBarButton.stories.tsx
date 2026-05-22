import type { Meta, StoryObj } from '@storybook/react-vite';
import TabBarButton from './TabBarButton';

const meta = {
  title: 'Headless/TabBarButton',
  component: TabBarButton,
  tags: ['autodocs']
} satisfies Meta<typeof TabBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
