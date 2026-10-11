import type { Meta, StoryObj } from '@storybook/react-vite';
import StatusLight from './StatusLight';

const meta = {
  title: 'Headless/StatusLight',
  component: StatusLight,
  tags: ['autodocs']
} satisfies Meta<typeof StatusLight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
