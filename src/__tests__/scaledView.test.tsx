import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ScaledView } from '../index';
import { getFitScale } from '../ScaledView';

const layout = (width: number, height: number) => ({
  nativeEvent: { layout: { x: 0, y: 0, width, height } },
});

const contentStyle = () => {
  const flat = screen.getByTestId('scaled-view-content').props.style;
  return Object.assign({}, ...[flat].flat(Infinity));
};

describe('getFitScale', () => {
  const design = { width: 100, height: 200 };
  const box = { width: 300, height: 300 };
  it('supports every fit mode', () => {
    expect(getFitScale(design, box, 'contain')).toBe(1.5);
    expect(getFitScale(design, box, 'cover')).toBe(3);
    expect(getFitScale(design, box, 'width')).toBe(3);
    expect(getFitScale(design, box, 'height')).toBe(1.5);
  });
  it('returns 1 for an invalid design size', () => {
    expect(getFitScale({ width: 0, height: 10 }, box, 'contain')).toBe(1);
  });
});

describe('ScaledView', () => {
  it('hides the content until it is measured', () => {
    render(
      <ScaledView designWidth={100} designHeight={200}>
        <Text>hello</Text>
      </ScaledView>
    );
    expect(contentStyle()).toMatchObject({
      width: 100,
      height: 200,
      opacity: 0,
    });
    expect(screen.getByText('hello')).toBeTruthy();
  });

  it('scales to fit the measured box', () => {
    render(
      <ScaledView designWidth={100} designHeight={200}>
        <Text>hello</Text>
      </ScaledView>
    );
    fireEvent(screen.getByTestId('scaled-view'), 'layout', layout(300, 300));
    expect(contentStyle().opacity).toBe(1);
    expect(contentStyle().transform).toEqual([{ scale: 1.5 }]);
  });

  it('honours the fit prop and ignores a repeated identical layout', () => {
    render(<ScaledView designWidth={100} designHeight={200} fit="cover" />);
    const box = screen.getByTestId('scaled-view');
    fireEvent(box, 'layout', layout(300, 300));
    fireEvent(box, 'layout', layout(300, 300));
    expect(contentStyle().transform).toEqual([{ scale: 3 }]);
    fireEvent(box, 'layout', layout(100, 100));
    expect(contentStyle().transform).toEqual([{ scale: 1 }]);
  });

  it('passes the style to the outer box', () => {
    render(
      <ScaledView designWidth={10} designHeight={10} style={{ flex: 1 }} />
    );
    const flat = Object.assign(
      {},
      ...[screen.getByTestId('scaled-view').props.style].flat(Infinity)
    );
    expect(flat).toMatchObject({ flex: 1, overflow: 'hidden' });
  });
});
