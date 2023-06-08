export function eventListener(
  element: HTMLElement,
  event: keyof HTMLElementEventMap,
  handler: VoidFunction,
) {
  element.addEventListener(event, handler);
}

export function select(tag: string) {
  return document.querySelector(tag);
}

export function update(
  elem: HTMLElement,
  attr: string,
  updater: (old: string) => string,
) {
  elem[attr] = updater(elem[attr]);
}
