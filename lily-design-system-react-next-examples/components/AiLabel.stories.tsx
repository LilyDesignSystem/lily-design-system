import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AiLabel from './AiLabel';

const meta = {
  title: 'Examples/AiLabel',
  component: AiLabel,
  tags: ['autodocs']
} satisfies Meta<typeof AiLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
