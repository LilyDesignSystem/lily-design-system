import type { Meta, StoryObj } from '@storybook/react-vite';
import AspectRatioContainer from './AspectRatioContainer';

const meta = {
  title: 'Headless/AspectRatioContainer',
  component: AspectRatioContainer,
  tags: ['autodocs']
} satisfies Meta<typeof AspectRatioContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
