import type { Meta, StoryObj } from '@storybook/react-vite';
import BodyText from './BodyText';

const meta = {
  title: 'Headless/BodyText',
  component: BodyText,
  tags: ['autodocs']
} satisfies Meta<typeof BodyText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
