import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Popup from './Popup';

const meta = {
  title: 'Examples/Popup',
  component: Popup,
  tags: ['autodocs']
} satisfies Meta<typeof Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
