import type { Meta, StoryObj } from '@storybook/react-vite';
import Visible from './Visible';

const meta = {
  title: 'Headless/Visible',
  component: Visible,
  tags: ['autodocs']
} satisfies Meta<typeof Visible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
