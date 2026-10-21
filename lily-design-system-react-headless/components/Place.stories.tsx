import type { Meta, StoryObj } from '@storybook/react-vite';
import Place from './Place';

const meta = {
  title: 'Headless/Place',
  component: Place,
  tags: ['autodocs']
} satisfies Meta<typeof Place>;

export default meta;
type Story = StoryObj<typeof Place>;

export const Default: Story = {};
