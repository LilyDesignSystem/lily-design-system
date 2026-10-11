import type { Meta, StoryObj } from '@storybook/react-vite';
import Details from './Details';

const meta = {
  title: 'Headless/Details',
  component: Details,
  tags: ['autodocs']
} satisfies Meta<typeof Details>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
