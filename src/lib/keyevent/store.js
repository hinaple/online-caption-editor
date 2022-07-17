import { writable } from "svelte/store";

export default {
    press: writable([]),
    down: writable([]),
    up: writable([])
}