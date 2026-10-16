import * as api from '../index';

it('exports the documented public API', () => {
  expect(Object.keys(api).sort()).toMatchSnapshot();
});
