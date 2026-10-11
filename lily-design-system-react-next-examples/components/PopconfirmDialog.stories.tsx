import type { Meta, StoryObj } from '@storybook/react-vite';
import PopconfirmDialog from './PopconfirmDialog';

const meta = {
  title: 'Headless/PopconfirmDialog',
  component: PopconfirmDialog,
  tags: ['autodocs']
} satisfies Meta<typeof PopconfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
