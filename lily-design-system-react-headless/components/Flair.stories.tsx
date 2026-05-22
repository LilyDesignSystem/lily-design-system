import type { Meta, StoryObj } from '@storybook/react-vite';
import Flair from './Flair';

const meta = {
  title: 'Headless/Flair',
  component: Flair,
  tags: ['autodocs']
} satisfies Meta<typeof Flair>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
