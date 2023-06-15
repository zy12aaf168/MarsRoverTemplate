import { Camera,Grid,Instruction,MarsInitializer,Planet,RobotArm,RoverBase,Direction,RawInstruction, createMars } from "../mars-rover";
describe("Marsinitializer", () => {
  it("Should initialize grids with appropriate values", () => {
    // Arrange
    const expectedGrids: Grid[][] = [
      [
        { x: 0, y: 0, occupyingVehicle: null },
        { x: 1, y: 0, occupyingVehicle: null },
        { x: 2, y: 0, occupyingVehicle: null },
        { x: 3, y: 0, occupyingVehicle: null },
        { x: 4, y: 0, occupyingVehicle: null },
        { x: 5, y: 0, occupyingVehicle: null },
      ],
      [
        { x: 0, y: 1, occupyingVehicle: null },
        { x: 1, y: 1, occupyingVehicle: null },
        { x: 2, y: 1, occupyingVehicle: null },
        { x: 3, y: 1, occupyingVehicle: null },
        { x: 4, y: 1, occupyingVehicle: null },
        { x: 5, y: 1, occupyingVehicle: null },
      ],
      [
        { x: 0, y: 2, occupyingVehicle: null },
        { x: 1, y: 2, occupyingVehicle: null },
        { x: 2, y: 2, occupyingVehicle: null },
        { x: 3, y: 2, occupyingVehicle: null },
        { x: 4, y: 2, occupyingVehicle: null },
        { x: 5, y: 2, occupyingVehicle: null },
      ],
      [
        { x: 0, y: 3, occupyingVehicle: null },
        { x: 1, y: 3, occupyingVehicle: null },
        { x: 2, y: 3, occupyingVehicle: null },
        { x: 3, y: 3, occupyingVehicle: null },
        { x: 4, y: 3, occupyingVehicle: null },
        { x: 5, y: 3, occupyingVehicle: null },
      ],
      [
        { x: 0, y: 4, occupyingVehicle: null },
        { x: 1, y: 4, occupyingVehicle: null },
        { x: 2, y: 4, occupyingVehicle: null },
        { x: 3, y: 4, occupyingVehicle: null },
        { x: 4, y: 4, occupyingVehicle: null },
        { x: 5, y: 4, occupyingVehicle: null },
      ],
      [
        { x: 0, y: 5, occupyingVehicle: null },
        { x: 1, y: 5, occupyingVehicle: null },
        { x: 2, y: 5, occupyingVehicle: null },
        { x: 3, y: 5, occupyingVehicle: null },
        { x: 4, y: 5, occupyingVehicle: null },
        { x: 5, y: 5, occupyingVehicle: null },
      ],
    ];

    // Act
    const actualGrid = MarsInitializer(5,5);


    // Assert
    expect(actualGrid).toEqual(expectedGrids);
  });
});


describe("DropOffTests", () => {
  it("Should drop off rover at correct point", () => {
    // arrange
    const mars = createMars(3,3);

    // act & assert
    expect(mars.dropOffRover("Rover1", {x:1,y:2},"N")).toBe(true);
    expect(mars.dropOffRover("Rover2", {x:2,y:3}, "E")).toBe(true);
    expect(mars.dropOffRover("Rover3", {x:0,y:0}, "N")).toBe(true);
    expect(mars.dropOffRover("Rover4", {x:3,y:3}, "N")).toBe(true);
    
    const grid1 = mars.grids[2][1];
    const grid2 = mars.grids[3][2];

    expect(grid1.occupyingVehicle).not.toEqual(null);
    expect(grid1.occupyingVehicle?.currentGrid?.x).toBe(1)
    expect(grid1.occupyingVehicle?.currentGrid?.y).toBe(2)
    expect(grid1.occupyingVehicle?.planet).toBe(mars);
    expect(grid1.occupyingVehicle?.direction).toBe("N");

    expect(grid2.occupyingVehicle?.planet).not.toEqual(null);
    expect(grid2.occupyingVehicle?.currentGrid?.x).toBe(2)
    expect(grid2.occupyingVehicle?.currentGrid?.y).toBe(3)
    expect(grid2.occupyingVehicle?.planet).toBe(mars);
    expect(grid2.occupyingVehicle?.direction).toBe("E");

    expect(mars.rovers.size).toBe(4);
    expect(mars.rovers.get("Rover1")).toBe(grid1.occupyingVehicle);
    expect(mars.rovers.get("Rover2")).toBe(grid2.occupyingVehicle);
  })

  it("should return false when invalid grid positions are provided", () => {
    // arrange
    const mars = createMars(3,2);

    // act & assert
    expect(mars.dropOffRover("Rover1", {x:3,y:3},"N")).toBe(false);
    expect(mars.dropOffRover("Rover2", {x:-1,y:2}, "E")).toBe(false);

    expect(mars.rovers.size).toBe(0);
  })
})

describe("sendInstructionToRover", () => {
  it("should move rovers succesfully", () => {
    //arrange
    const mars = createMars(5,5);

    //act
    mars.dropOffRover("rover1", {x:1,y:2} ,"N")
    mars.dropOffRover("rover2", {x:3,y:3}, "E")


    "LMLMLMLMM".split("").forEach(s => {
      mars.sendInstructionToRover("rover1", s as RawInstruction)
    });

    "MMRMMRMRRM".split("").forEach(s => {
      mars.sendInstructionToRover("rover2", s as RawInstruction)
    });

    //assert
    const rover1 = mars.rovers.get("rover1");
    
    expect(rover1).not.toBe(null)
    expect(rover1?.currentGrid?.x).toBe(1);
    expect(rover1?.currentGrid?.y).toBe(3);
    expect(rover1?.direction).toBe("N")

    const rover2 = mars.rovers.get("rover2");
    expect(rover2).not.toBe(null)
    expect(rover2?.currentGrid?.x).toBe(5);
    expect(rover2?.currentGrid?.y).toBe(1);
    expect(rover2?.direction).toBe("E")
  })
})
