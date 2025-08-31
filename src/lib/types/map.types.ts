export type TileServer = "light" | "dark" | "satellite";

export type AddressFromCoords = {
    house_number: string;
    road: string;
    city: string;
    postcode: string;
    country: string;
    lat: number;
    lon: number;
}