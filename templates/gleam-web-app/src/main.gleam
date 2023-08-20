import gleam/int

pub type HtmlElement

@external(javascript, "./ffi.ts", "eventListener")
pub fn event_listener(
  element element: HtmlElement,
  event event: String,
  handler handler: fn() -> Nil,
) -> Nil

@external(javascript, "./ffi.ts", "select")
pub fn select(selector selector: String) -> HtmlElement

@external(javascript, "./ffi.ts", "update")
pub fn update(
  elem elem: HtmlElement,
  attr attr: String,
  updater updater: fn(String) -> String,
) -> Nil

pub fn main() {
  select("#app")
  |> update(
    "innerHTML",
    fn(_) {
      "<div>
    <a href='https://vitejs.dev' target='_blank'>
      <img src='/vite.svg' class='logo' alt='Vite logo' />
    </a>
    <a href='https://gleam.run' target='_blank'>
      <img src='/gleam.svg' class='logo gleam' alt='Gleam logo' />
    </a>
    <h1>Vite + Gleam</h1>
    <div class='card'>
      <button id='counter' type='button'>Count is: <span id='count'>0</span></button>
    </div>
    <p class='read-the-docs'>
      Click on the Vite and Gleam logos to learn more
    </p>
  </div>"
    },
  )

  event_listener(select("#counter"), "click", onclick)
}

fn onclick() {
  use old <- update(select("#count"), "innerText")

  case int.parse(old) {
    Ok(v) -> int.to_string(v + 1)
    Error(_) -> old
  }
}
