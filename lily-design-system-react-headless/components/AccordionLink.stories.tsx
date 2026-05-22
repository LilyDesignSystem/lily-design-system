import type { Meta, StoryObj } from '@storybook/react-vite';
import AccordionLink from './AccordionLink';

const meta = {
  title: 'Headless/AccordionLink',
  component: AccordionLink,
  tags: ['autodocs']
} satisfies Meta<typeof AccordionLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
