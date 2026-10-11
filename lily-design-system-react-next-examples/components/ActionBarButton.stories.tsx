import type { Meta, StoryObj } from '@storybook/react-vite';
import ActionBarButton from './ActionBarButton';

const meta = {
  title: 'Headless/ActionBarButton',
  component: ActionBarButton,
  tags: ['autodocs']
} satisfies Meta<typeof ActionBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
