import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GraphicBlock from './GraphicBlock';

const meta = {
  title: 'Examples/GraphicBlock',
  component: GraphicBlock,
  tags: ['autodocs']
} satisfies Meta<typeof GraphicBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
