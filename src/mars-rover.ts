export type Direction = "N" | "S" | "W" | "E";
export type RawInstruction = "L" | "R" | "M"


export type Planet = {
    // planetName: string;
    // roverLimit: number;
    // gravity: Gravity

}

export const MarsInitializer = (cordsX: number, cordsY: number): Grid[][] => {
    const gridArr = new Array<Grid[]>;
    for (let y = 0; y <= cordsY; y++) {
        const row = new Array<Grid>;
        for (let x = 0; x <= cordsX; x++) {
            row.push({ x, y, occupyingVehicle: null })
        }
        gridArr.push(row);
    }
    return gridArr;
}

export type Mars = Planet & {
    xcord: number; ycord: number;
    grids: Grid[][];
    rovers: Map<string, MarsRover>;
    dropOffRover: (roverName: string, gridCoord: GridCoordinates, direction: Direction) => boolean;
    sendInstructionToRover: (roverName: string, instruction: RawInstruction) => boolean
}


export type GridCoordinates = {
    x: number;
    y: number;
}


export type Grid = GridCoordinates & {
    occupyingVehicle: MarsRover | null;
}

export type Instruction = {
    start: () => Grid;
    end: Grid;
    rover: RoverBase;
}

export type RoverBase = {
    roverName: string;

    // robotArm: RobotArm;
    // camera: Camera;
}


export type MarsRover = RoverBase & {
    planet: Mars;
    direction: Direction;
    currentGrid: Grid | null;
    move: () => boolean;
}

export type RobotArm = {

}

export type Camera = {

}

export const createMars = (xcord: number, ycord: number): Mars => {
    const grids = MarsInitializer(xcord, ycord);
    const rovers = new Map<string, MarsRover>();


    const dropOffRover = (roverName: string, gridDropOff: GridCoordinates, direction: Direction) => {
        function marsRoverFactory(): MarsRover {
            const marsRover: MarsRover = {
                roverName: roverName,
                currentGrid: null,
                direction: direction,
                planet: mars,
                move: function () {
                    const directionToFunctionMap = new Map<Direction, (x: number, y: number) => [number, number]>([
                        ["E", (x, y) => [x+1, y]],
                        ["N", (x, y) => [x, y+1]],
                        ["S", (x, y) => [x, y-1]],
                        ["W", (x, y) => [x-1, y]],
                    ]);

                    const directionToFunc = directionToFunctionMap.get(this.direction);
                    var that = this;
                    if (directionToFunc && that.currentGrid) {
                        const [xNew,yNew] = directionToFunc(that.currentGrid.x, that.currentGrid.y);
                        if (isWithinBoundariesOfGrid({x: xNew,y: yNew},xcord,ycord)){
                            const movingToGrid = that.planet.grids[yNew][xNew];
                            if(movingToGrid.occupyingVehicle === null){
                                that.currentGrid.occupyingVehicle = null;
                                that.currentGrid = movingToGrid;
                                movingToGrid.occupyingVehicle = this;
                                return true;
                            }
                        }
                    }
                    return false;
                }
            };
            return marsRover;
        }

        if (isWithinBoundariesOfGrid(gridDropOff, xcord, ycord)) {
            const grid = grids[gridDropOff.y][gridDropOff.x]
            if (grid !== null) {
                const marsRover = marsRoverFactory();
                marsRover.currentGrid = grid;
                grid.occupyingVehicle = marsRover;
                marsRover.direction = direction;
                rovers.set(roverName, marsRover);
                return true;
            }
        }
        return false;
    }

    const sendInstructionToRover = (roverName: string, instruction: RawInstruction) => {
        const directionMap = new Map<string, Direction>([
            ["L-E", "N"],
            ["L-N", "W"],
            ["L-S", "E"],
            ["L-W", "S"],
            ["R-E", "S"],
            ["R-N", "E"],
            ["R-S", "W"],
            ["R-W", "N"],
          ]);

        const rover = rovers.get(roverName);
        if (rover !== undefined) {
            if(instruction === "M"){
                rover.move();
            }
            console.log(instruction + "   " + rover.direction);
            const direction = directionMap.get(`${instruction}-${rover.direction}`)
             if (direction) {
                console.log(instruction);
                rover.direction = direction as Direction
                return true;
            }
        }
        return false;
    };

    const mars: Mars = {
        rovers,
        xcord,
        ycord,
        grids,
        dropOffRover,
        sendInstructionToRover,
    };

    return mars;
}


const isWithinBoundariesOfGrid = (gridDropOff: GridCoordinates, xCord:number, yCord: number) : boolean => {
    return gridDropOff.x >= 0 && gridDropOff.y >= 0 && gridDropOff.x <= xCord && gridDropOff.y <= yCord
}