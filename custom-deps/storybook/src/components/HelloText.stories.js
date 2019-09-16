import { storiesOf } from '@storybook/vue';
import HelloText from './HelloText';
import Readme from './HelloText.md';

storiesOf('Common|HelloText', module)
  .add('HelloText', () => ({
    components: { HelloText },
    template: `,
      <hello-text :text="msg1" />
    `,
    data() {
      return {
        msg1: 'World'
      };
    }
  }), {
    info: {
      summary: Readme
    }
  });
