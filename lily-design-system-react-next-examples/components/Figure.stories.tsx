import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Figure from './Figure';

const meta = {
  title: 'Examples/Figure',
  component: Figure,
  tags: ['autodocs']
} satisfies Meta<typeof Figure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
