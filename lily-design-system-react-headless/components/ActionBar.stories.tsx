import type { Meta, StoryObj } from '@storybook/react-vite';
import ActionBar from './ActionBar';

const meta = {
  title: 'Headless/ActionBar',
  component: ActionBar,
  tags: ['autodocs']
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
