import gleam/int
import gleam/io
import lustre
import lustre/element/html.{a, button, div, h1, img, p}
import lustre/element.{text}
import lustre/event.{on_click}
import lustre/attribute.{alt, class, href, id, rel, src, target}

pub fn main() {
  let app = lustre.simple(init, update, render)
  let assert Ok(_) = lustre.start(app, "div")

  Nil
}

fn init() {
  0
}

type Msg {
  Incr
  Decr
}

fn update(state, msg) {
  io.print("update: " <> int.to_string(state))
  case msg {
    Incr -> state + 1
    Decr -> state - 1
  }
}

fn render(state) {
  div(
    [id("app")],
    [
      div(
        [],
        [
          a(
            [href("https://vitejs.dev"), target("_blank"), rel("noreferrer")],
            [img([src("/vite.svg"), class("logo"), alt("Vite logo")])],
          ),
          a(
            [
              href("https://hexdocs.pm/lustre/3.0.0-rc.8/index.html"),
              target("_blank"),
              rel("noreferrer"),
            ],
            [img([src("/gleam.svg"), class("logo gleam"), alt("Gleam logo")])],
          ),
          h1([], [text("Vite + Lustre")]),
          div(
            [class("card")],
            [
              button(
                [on_click(Incr)],
                [text("count is "), text(int.to_string(state))],
              ),
            ],
          ),
        ],
      ),
      p(
        [class("read-the-docs")],
        [text("Client on the Vite and Gleam logos to learn more")],
      ),
    ],
  )
}
