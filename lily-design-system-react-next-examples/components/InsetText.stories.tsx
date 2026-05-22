import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import InsetText from './InsetText';

const meta = {
  title: 'Examples/InsetText',
  component: InsetText,
  tags: ['autodocs']
} satisfies Meta<typeof InsetText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
