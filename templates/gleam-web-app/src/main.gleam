import gleam/int

pub external type HtmlElement

pub external fn event_listener(
  element: HtmlElement,
  event: String,
  handler: fn() -> Nil,
) -> Nil =
  "./ffi.ts" "eventListener"

pub external fn select(selector: String) -> HtmlElement =
  "./ffi.ts" "select"

pub external fn update(
  elem: HtmlElement,
  attr: String,
  updater: fn(String) -> String,
) -> Nil =
  "./ffi.ts" "update"

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
  select("#count")
  |> update(
    "innerText",
    fn(old) {
      case int.parse(old) {
        Ok(v) -> int.to_string(v + 1)
        Error(_) -> old
      }
    },
  )
}
