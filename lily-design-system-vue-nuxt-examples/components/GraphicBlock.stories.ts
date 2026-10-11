import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GraphicBlock from './GraphicBlock.vue';

const meta = {
  title: 'Headless/GraphicBlock',
  component: GraphicBlock,
  tags: ['autodocs']
} satisfies Meta<typeof GraphicBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
