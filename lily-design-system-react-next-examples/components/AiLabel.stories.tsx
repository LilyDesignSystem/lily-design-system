import type { Meta, StoryObj } from '@storybook/react-vite';
import AiLabel from './AiLabel';

const meta = {
  title: 'Headless/AiLabel',
  component: AiLabel,
  tags: ['autodocs']
} satisfies Meta<typeof AiLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
