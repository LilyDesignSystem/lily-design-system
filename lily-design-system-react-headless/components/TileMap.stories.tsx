import type { Meta, StoryObj } from '@storybook/react-vite';
import TileMap from './TileMap';

const meta = {
  title: 'Headless/TileMap',
  component: TileMap,
  tags: ['autodocs']
} satisfies Meta<typeof TileMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
