import type { Meta, StoryObj } from '@storybook/react-vite';
import Tile from './Tile';

const meta = {
  title: 'Headless/Tile',
  component: Tile,
  tags: ['autodocs']
} satisfies Meta<typeof Tile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
