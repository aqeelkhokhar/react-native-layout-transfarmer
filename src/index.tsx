export const calculateAspectRatio = (width: number, height: number): number => {
  return width / height;
};

export const calculateDestinationDimensions = (
  sourceWidth: number,
  sourceHeight: number,
  destinationWidth: number,
  destinationHeight: number
): { width: number; height: number; isFullWidth: boolean } => {
  const sourceAspectRatio = calculateAspectRatio(sourceWidth, sourceHeight);
  const destinationAspectRatio = calculateAspectRatio(
    destinationWidth,
    destinationHeight
  );

  if (sourceAspectRatio > destinationAspectRatio) {
    const result = {
      width: destinationWidth,
      height: (destinationWidth * sourceHeight) / sourceWidth,
      isFullWidth: true,
    };
    return result;
  } else {
    const result = {
      width: (destinationHeight * sourceWidth) / sourceHeight,
      height: destinationHeight,
      isFullWidth: false,
    };
    return result;
  }
};

export const calculateHeightFromWidth = (
  sourceWidth: number,
  sourceHeight: number,
  destinationWidth: number
): number => {
  return (destinationWidth * sourceHeight) / sourceWidth;
};

export const calculateWidthFromHeight = (
  sourceWidth: number,
  sourceHeight: number,
  destinationHeight: number
): number => {
  return (destinationHeight * sourceWidth) / sourceHeight;
};

export const calculateScalingFactors = (
  sourceWidth: number,
  sourceHeight: number,
  destinationWidth: number,
  destinationHeight: number
): { scaleX: number; scaleY: number } => {
  return {
    scaleX: destinationWidth / sourceWidth,
    scaleY: destinationHeight / sourceHeight,
  };
};

export const calculateObjectTransformedValues = (
  sourceX: number,
  sourceY: number,
  sourceWidth: number,
  sourceHeight: number,
  scaleX: number,
  scaleY: number
): { x: number; y: number; width: number; height: number } => {
  return {
    x: sourceX * scaleX,
    y: sourceY * scaleY,
    width: sourceWidth * scaleX,
    height: sourceHeight * scaleY,
  };
};

export const applyObjectZoomScale = (
  transformedWidth: number,
  transformedHeight: number,
  zoomScale: number
): { width: number; height: number } => {
  return {
    width: transformedWidth * zoomScale,
    height: transformedHeight * zoomScale,
  };
};

export const calculateFontSize = (
  sourceFontSize: number,
  scaleX: number
): number => {
  return sourceFontSize * scaleX;
};

export const transformObject = (
  sourceObject: {
    x: number;
    y: number;
    width: number;
    height: number;
    zoomScale?: number;
  },
  scaleX: number,
  scaleY: number
): {
  x: number;
  y: number;
  width: number;
  height: number;
} => {
  const transformed = calculateObjectTransformedValues(
    sourceObject.x,
    sourceObject.y,
    sourceObject.width,
    sourceObject.height,
    scaleX,
    scaleY
  );

  let result = { ...transformed };
  if (sourceObject.zoomScale && sourceObject.zoomScale !== 1) {
    const scaledDimensions = applyObjectZoomScale(
      transformed.width,
      transformed.height,
      sourceObject.zoomScale
    );
    result.width = scaledDimensions.width;
    result.height = scaledDimensions.height;
  }

  return result;
};

export const transformRotation = (rotation: number): number => {
  return rotation;
};

export const batchTransformObjects = (
  sourceObjects: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    zoomScale?: number;
    [key: string]: any;
  }>,
  scaleX: number,
  scaleY: number
): Array<{
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  [key: string]: any;
}> => {
  return sourceObjects.map((obj) => {
    const transformed = transformObject(obj, scaleX, scaleY);

    return {
      ...obj,
      x: transformed.x,
      y: transformed.y,
      width: transformed.width,
      height: transformed.height,
    };
  });
};

export const calculateProportionalHeight = (
  sourceWidth: number,
  sourceHeight: number,
  destinationWidth: number
): number => {
  return (destinationWidth * sourceHeight) / sourceWidth;
};

export const calculateProportionalWidth = (
  sourceWidth: number,
  sourceHeight: number,
  destinationHeight: number
): number => {
  return (destinationHeight * sourceWidth) / sourceHeight;
};

export const scaleValue = (value: number, scale: number): number => {
  return value * scale;
};

export const scaleHorizontal = (
  value: number,
  sourceWidth: number,
  destinationWidth: number
): number => {
  return value * (destinationWidth / sourceWidth);
};

export const scaleVertical = (
  value: number,
  sourceHeight: number,
  destinationHeight: number
): number => {
  return value * (destinationHeight / sourceHeight);
};

export const scaleUniform = (
  value: number,
  sourceWidth: number,
  sourceHeight: number,
  destinationWidth: number,
  destinationHeight: number
): number => {
  const scaleX = destinationWidth / sourceWidth;
  const scaleY = destinationHeight / sourceHeight;
  return value * Math.min(scaleX, scaleY);
};
