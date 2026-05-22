import type { Meta, StoryObj } from '@storybook/react-vite';
import RadioGroup from './RadioGroup';

const meta = {
  title: 'Headless/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs']
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
