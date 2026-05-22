import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TileMap from './TileMap';

const meta = {
  title: 'Examples/TileMap',
  component: TileMap,
  tags: ['autodocs']
} satisfies Meta<typeof TileMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
