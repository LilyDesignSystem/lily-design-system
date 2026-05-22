import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Icon from './Icon';

const meta = {
  title: 'Examples/Icon',
  component: Icon,
  tags: ['autodocs']
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
