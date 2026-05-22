import type { Meta, StoryObj } from '@storybook/react-vite';
import AccordionListItem from './AccordionListItem';

const meta = {
  title: 'Headless/AccordionListItem',
  component: AccordionListItem,
  tags: ['autodocs']
} satisfies Meta<typeof AccordionListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
