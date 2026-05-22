import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TabBarButton from './TabBarButton';

const meta = {
  title: 'Examples/TabBarButton',
  component: TabBarButton,
  tags: ['autodocs']
} satisfies Meta<typeof TabBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
