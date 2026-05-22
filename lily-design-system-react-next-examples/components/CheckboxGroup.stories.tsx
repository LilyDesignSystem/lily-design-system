import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CheckboxGroup from './CheckboxGroup';

const meta = {
  title: 'Examples/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs']
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
