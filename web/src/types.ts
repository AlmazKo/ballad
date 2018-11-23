/**
 * Amount of pixels
 */
export type px = number;

/**
 * int
 */
export type int = number;

/**
 * float
 */
export type float = number;

/**
 * unsigned int
 */
export type uint = int;

/**
 * index
 */
export type index = uint;

/**
 * Color:
 * @example '#fff', 'red', 'rgba(0,0,0,0)'
 */
export type color = string;

/**
 * Milliseconds
 */
export type ms = int;

/**
 * Seconds with ms
 */
export type secm = float;
/**
 * Seconds
 */
export type sec = int;

/**
 * timestamp (sec)
 */
export type ts = sec;

/**
 * timestamp with milliseconds
 */
export type tsm = secm;

/**
 * A double-precision floating-point number which describes the number of milliseconds
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp}
 */
export type DOMHighResTimeStamp = number;

export type Locale = 'cn' | 'en' | 'es' | 'hi' | 'id' | 'pt' | 'ru' | 'vi';