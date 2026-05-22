import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Pictogram from './Pictogram';

const meta = {
  title: 'Examples/Pictogram',
  component: Pictogram,
  tags: ['autodocs']
} satisfies Meta<typeof Pictogram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
