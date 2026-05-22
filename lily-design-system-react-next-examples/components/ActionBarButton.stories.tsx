import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ActionBarButton from './ActionBarButton';

const meta = {
  title: 'Examples/ActionBarButton',
  component: ActionBarButton,
  tags: ['autodocs']
} satisfies Meta<typeof ActionBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
