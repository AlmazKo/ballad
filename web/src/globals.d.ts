/**
 * Amount of pixels
 */
declare type px = number;

/**
 * int
 */
declare type int = number;

/**
 * float
 */
declare type float = number;

/**
 * unsigned int
 */
declare type uint = int;

/**
 * index
 */
declare type index = uint;

/**
 * Color:
 * @example '#fff', 'red', 'rgba(0,0,0,0)'
 */
declare type color = string;

/**
 * Milliseconds
 */
declare type ms = int;

/**
 * Seconds with ms
 */
declare type secm = float;
/**
 * Seconds
 */
declare type sec = int;

/**
 * timestamp (sec)
 */
declare type ts = sec;

/**
 * timestamp with milliseconds
 */
declare type tsm = secm;

/**
 * A double-precision floating-point number which describes the number of milliseconds
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp}
 */
declare type DOMHighResTimeStamp = tsm;