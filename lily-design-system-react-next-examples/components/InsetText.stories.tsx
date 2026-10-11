import type { Meta, StoryObj } from '@storybook/react-vite';
import InsetText from './InsetText';

const meta = {
  title: 'Headless/InsetText',
  component: InsetText,
  tags: ['autodocs']
} satisfies Meta<typeof InsetText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
