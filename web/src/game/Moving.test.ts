// import { KeyQueue, KeyboardMoving } from '../game2/controller/MovingKeys';
//
// test('MovingKeys Simple', () => {
//   const mv = new KeyboardMoving();
//
//   mv.add(10);
//   mv.remove(10);
//   expect(mv.next()).toBe(10);
//   expect(mv.next()).toBe(0);
// });
//
// test('MovingKeys 2', () => {
//   const mv = new KeyboardMoving();
//
//   mv.add(10);
//   mv.add(20);
//   mv.remove(20);
//   expect(mv.next()).toBe(10);
//   expect(mv.next()).toBe(20);
//   mv.remove(10);
//   expect(mv.next()).toBe(0);
// });
//
// test('MovingKeys 3', () => {
//   const mv = new KeyboardMoving();
//
//   mv.add(10);
//   expect(mv.next()).toBe(10);
//   expect(mv.next()).toBe(10);
//   expect(mv.next()).toBe(10);
//
//   mv.add(20);
//   mv.remove(20);
//
//   expect(mv.next()).toBe(20);
//   expect(mv.next()).toBe(10);
//   expect(mv.next()).toBe(10);
//
//
//   mv.remove(10);
//   expect(mv.next()).toBe(0);
//
// });
//
//
// test('KeyQueue add/remove', () => {
//   const kq = new KeyQueue();
//
//   expect(kq.add(10)).toBe(true);
//   expect(kq.add(10)).toBe(false);
//   expect(kq.remove(10)).toBe(true);
//   expect(kq.remove(10)).toBe(false);
// });
//
// test('KeyQueue peek with one', () => {
//   const kq = new KeyQueue();
//
//   expect(kq.peek()).toBe(0);
//   expect(kq.add(10)).toBe(true);
//   expect(kq.peek()).toBe(10);
//   expect(kq.remove(10)).toBe(true);
//   expect(kq.peek()).toBe(0);
//
// });
//
//
// test('KeyQueue with many', () => {
//   const kq = new KeyQueue();
//
//   expect(kq.add(10)).toBe(true);
//   expect(kq.add(20)).toBe(true);
//   expect(kq.add(30)).toBe(true);
//   expect(kq.peek()).toBe(10);
//
//
//   kq.remove(10);
//   expect(kq.peek()).toBe(20);
//
//   kq.remove(30);
//   expect(kq.peek()).toBe(20);
//
//   kq.remove(20);
//   expect(kq.peek()).toBe(0);
//
// });
//
//
// import { KeyQueue, KeyboardMoving } from '../game2/controller/MovingKeys';
//
// test('MovingKeys Simple', () => {
//   const mv = new KeyboardMoving();
//
//   mv.add(10);
//   mv.remove(10);
//   expect(mv.next()).toBe(10);
//   expect(mv.next()).toBe(0);
// });
//
// test('MovingKeys 2', () => {
//   const mv = new KeyboardMoving();
//
//   mv.add(10);
//   mv.add(20);
//   mv.remove(20);
//   expect(mv.next()).toBe(10);
//   expect(mv.next()).toBe(20);
//   mv.remove(10);
//   expect(mv.next()).toBe(0);
// });
//
// test('MovingKeys 3', () => {
//   const mv = new KeyboardMoving();
//
//   mv.add(10);
//   expect(mv.next()).toBe(10);
//   expect(mv.next()).toBe(10);
//   expect(mv.next()).toBe(10);
//
//   mv.add(20);
//   mv.remove(20);
//
//   expect(mv.next()).toBe(20);
//   expect(mv.next()).toBe(10);
//   expect(mv.next()).toBe(10);
//
//
//   mv.remove(10);
//   expect(mv.next()).toBe(0);
//
// });
//
//
// test('KeyQueue add/remove', () => {
//   const kq = new KeyQueue();
//
//   expect(kq.add(10)).toBe(true);
//   expect(kq.add(10)).toBe(false);
//   expect(kq.remove(10)).toBe(true);
//   expect(kq.remove(10)).toBe(false);
// });
//
// test('KeyQueue peek with one', () => {
//   const kq = new KeyQueue();
//
//   expect(kq.peek()).toBe(0);
//   expect(kq.add(10)).toBe(true);
//   expect(kq.peek()).toBe(10);
//   expect(kq.remove(10)).toBe(true);
//   expect(kq.peek()).toBe(0);
//
// });
//
//
// test('KeyQueue with many', () => {
//   const kq = new KeyQueue();
//
//   expect(kq.add(10)).toBe(true);
//   expect(kq.add(20)).toBe(true);
//   expect(kq.add(30)).toBe(true);
//   expect(kq.peek()).toBe(10);
//
//
//   kq.remove(10);
//   expect(kq.peek()).toBe(20);
//
//   kq.remove(30);
//   expect(kq.peek()).toBe(20);
//
//   kq.remove(20);
//   expect(kq.peek()).toBe(0);
//
// });
//
//
