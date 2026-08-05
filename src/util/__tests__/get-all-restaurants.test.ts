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
        v: 2,
        u: 1_725_000_000,
        r: [
          ["restaurant-1", "KFC Test", "1 High Street", 52, -1, "/restaurant-1", []],
          ["restaurant-2", "KFC Unknown", "2 High Street", 53, -2, "/restaurant-2", []],
        ],
      })
    );
    jest.spyOn(global, "fetch").mockResolvedValueOnce(
      response({
        v: 2,
        r: [["restaurant-1", 0, 1_725_000_000]],
        t: [1, 0, 1, 2],
        u: 1_725_000_000,
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
