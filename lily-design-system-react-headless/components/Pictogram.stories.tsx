import type { Meta, StoryObj } from '@storybook/react-vite';
import Pictogram from './Pictogram';

const meta = {
  title: 'Headless/Pictogram',
  component: Pictogram,
  tags: ['autodocs']
} satisfies Meta<typeof Pictogram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
