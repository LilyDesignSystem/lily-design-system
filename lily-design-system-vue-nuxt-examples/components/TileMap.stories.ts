import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TileMap from './TileMap.vue';

const meta = {
  title: 'Headless/TileMap',
  component: TileMap,
  tags: ['autodocs']
} satisfies Meta<typeof TileMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
