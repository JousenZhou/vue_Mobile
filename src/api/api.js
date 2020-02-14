import fly from "./fly";

export function testApi(params) {
    return fly.get("/cityjson", params);
}