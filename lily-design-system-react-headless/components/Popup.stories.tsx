import type { Meta, StoryObj } from '@storybook/react-vite';
import Popup from './Popup';

const meta = {
  title: 'Headless/Popup',
  component: Popup,
  tags: ['autodocs']
} satisfies Meta<typeof Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
