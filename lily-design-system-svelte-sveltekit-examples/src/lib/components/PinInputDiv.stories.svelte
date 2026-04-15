<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PinInputDiv from './PinInputDiv.svelte';

  const { Story } = defineMeta({
    title: 'Examples/PinInputDiv',
    component: PinInputDiv,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Pin Input Div'}}
/>
