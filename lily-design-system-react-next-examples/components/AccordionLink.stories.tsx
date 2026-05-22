import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AccordionLink from './AccordionLink';

const meta = {
  title: 'Examples/AccordionLink',
  component: AccordionLink,
  tags: ['autodocs']
} satisfies Meta<typeof AccordionLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
