import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Tile from './Tile.vue';

const meta = {
  title: 'Examples/Tile',
  component: Tile,
  tags: ['autodocs']
} satisfies Meta<typeof Tile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
