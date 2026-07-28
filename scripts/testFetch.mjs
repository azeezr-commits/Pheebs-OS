import { RealityAdapter } from '../src/packages/observer/realityAdapter.ts';

async function test() {
  const result = await RealityAdapter.fetchAndObserve('exec_test', 'https://maps.app.goo.gl/218Lfq4ivbL8nNn76');
  console.log('NAME:', result.observations.businessName.value);
  console.log('SOURCE:', result.observations.businessName.source);
}
test();
