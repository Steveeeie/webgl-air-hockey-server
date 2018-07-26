const GenerateTable = () => {
  let table = [];
  let tableHeight = 42;
  let tableWidth = 24;
  let goalWidth = 8;
  let goalDepth = 3;
  let cornerRadius = 3;
  let cornerSteps = 4;
  let endLength = (tableWidth - goalWidth - cornerRadius * 2) / 2;
  let centerX = tableWidth / 2;
  let centerY = tableHeight / 2;

  //Top Left
  table.push([
    { x: -(goalWidth / 2), y: centerY },
    { x: -(goalWidth / 2) - endLength, y: centerY }
  ]);

  //Top Right
  table.push([
    { x: goalWidth / 2, y: centerY },
    { x: goalWidth / 2 + endLength, y: centerY }
  ]);

  //Goal Top Back
  table.push([
    { x: -(goalWidth / 2), y: centerY + goalDepth },
    { x: goalWidth / 2, y: centerY + goalDepth }
  ]);

  //Goal Top Left
  table.push([
    { x: -(goalWidth / 2), y: centerY + goalDepth },
    { x: -(goalWidth / 2), y: centerY }
  ]);

  //Goal Top Right
  table.push([
    { x: goalWidth / 2, y: centerY + goalDepth },
    { x: goalWidth / 2, y: centerY }
  ]);

  //Right
  table.push([
    { x: centerX, y: centerY - cornerRadius },
    { x: centerX, y: -centerY + cornerRadius }
  ]);

  //Left
  table.push([
    { x: -centerX, y: centerY - cornerRadius },
    { x: -centerX, y: -centerY + cornerRadius }
  ]);

  //Bottom Left
  table.push([
    { x: -(goalWidth / 2), y: -centerY },
    { x: -(goalWidth / 2) - endLength, y: -centerY }
  ]);

  //Bottom Right
  table.push([
    { x: goalWidth / 2, y: -centerY },
    { x: goalWidth / 2 + endLength, y: -centerY }
  ]);

  //Goal bottom Back
  table.push([
    { x: -(goalWidth / 2), y: -centerY - goalDepth },
    { x: goalWidth / 2, y: -centerY - goalDepth }
  ]);

  //Goal bottom Left
  table.push([
    { x: -(goalWidth / 2), y: -centerY - goalDepth },
    { x: -(goalWidth / 2), y: -centerY }
  ]);

  //Goal bottom Right
  table.push([
    { x: goalWidth / 2, y: -centerY - goalDepth },
    { x: goalWidth / 2, y: -centerY }
  ]);

  createCorner(
    { x: centerX, y: centerY },
    { x: centerX - cornerRadius, y: centerY - cornerRadius }
  );

  createCorner(
    { x: -centerX, y: centerY },
    { x: -centerX + cornerRadius, y: centerY - cornerRadius }
  );

  createCorner(
    { x: centerX, y: -centerY },
    { x: centerX - cornerRadius, y: -centerY + cornerRadius }
  );

  createCorner(
    { x: -centerX, y: -centerY },
    { x: -centerX + cornerRadius, y: -centerY + cornerRadius }
  );

  function createCorner(start, end) {
    const sizeX = end.x - start.x;
    const sizeY = end.y - start.y;
    let sum = 0;
    let map = [];

    for (let i = 0; i < cornerSteps + 1; i++) {
      sum += i;
      map.push(sum);
    }

    function stepWidth(index, size) {
      return size / map[cornerSteps] * map[index];
    }

    for (let i = 0; i < cornerSteps; i++) {
      const currentX = stepWidth(i, sizeX) + start.x;
      const currentY = stepWidth(cornerSteps - i, sizeY) + start.y;
      const nextX = stepWidth(i + 1, sizeX) + start.x;
      const nextY = stepWidth(cornerSteps - i - 1, sizeY) + start.y;
      table.push([{ x: currentX, y: currentY }, { x: nextX, y: nextY }]);
    }
  }

  return table;
};

export default GenerateTable;
