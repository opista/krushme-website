import { KrushemMachineStatus } from "@/types";
import { getAllRestaurants } from "../get-all-restaurants";

const response = (data: unknown, ok = true) =>
  ({
    ok,
    json: jest.fn().mockResolvedValue(data),
  }) as unknown as Response;

describe("getAllRestaurants", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("combines the static location and dynamic status files", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce(
      response([{ version: "commit-hash" }])
    );
    jest.spyOn(global, "fetch").mockResolvedValueOnce(
      response({
        locations: [
          {
            id: "restaurant-1",
            address: "1 High Street",
            coords: { longitude: -1, latitude: 52 },
            link: "https://www.kfc.co.uk/restaurant-1",
            hours: [],
            name: "KFC Test",
          },
          {
            id: "restaurant-2",
            address: "2 High Street",
            coords: { longitude: -2, latitude: 53 },
            link: "https://www.kfc.co.uk/restaurant-2",
            hours: [],
            name: "KFC Unknown",
          },
        ],
      })
    );
    jest.spyOn(global, "fetch").mockResolvedValueOnce(
      response({
        statuses: [
          {
            id: "restaurant-1",
            krushemMachineStatus: KrushemMachineStatus.Working,
            lastChecked: 1_725_000_000_000,
          },
        ],
        stats: { working: 1, broken: 0, unknown: 1, total: 2 },
      })
    );

    await expect(getAllRestaurants()).resolves.toEqual({
      locations: [
        expect.objectContaining({
          id: "restaurant-1",
          krushemMachineStatus: KrushemMachineStatus.Working,
          lastChecked: 1_725_000_000_000,
        }),
        expect.objectContaining({
          id: "restaurant-2",
          krushemMachineStatus: KrushemMachineStatus.Unknown,
          lastChecked: undefined,
        }),
      ],
      stats: { working: 1, broken: 0, unknown: 1, total: 2 },
    });
  });

  it("requires the split location and status files", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce(
      response([{ version: "commit-hash" }])
    );
    jest.spyOn(global, "fetch").mockResolvedValueOnce(response(null, false));
    jest.spyOn(global, "fetch").mockResolvedValueOnce(response(null, false));

    await expect(getAllRestaurants()).rejects.toThrow("locations.json");
  });
});
