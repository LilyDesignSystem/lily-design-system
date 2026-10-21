import type { Meta, StoryObj } from '@storybook/react-vite';
import CheckboxGroup from './CheckboxGroup';

const meta = {
  title: 'Headless/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs']
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

export const Default: Story = {};
