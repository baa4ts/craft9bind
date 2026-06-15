export interface Dns {
    name: string;
    class: string;
    type: string;
    value: string;
    ttl?: number;
    priority?: number;
}