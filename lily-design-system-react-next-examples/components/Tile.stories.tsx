import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Tile from './Tile';

const meta = {
  title: 'Examples/Tile',
  component: Tile,
  tags: ['autodocs']
} satisfies Meta<typeof Tile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
