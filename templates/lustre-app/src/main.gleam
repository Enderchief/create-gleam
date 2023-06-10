import gleam/int
import lustre
import lustre/element.{a, button, div, h1, img, p, text}
import lustre/event.{on_click}
import lustre/attribute.{alt, class, href, id, src, target}
import lustre/cmd

pub fn main() {
  let app = lustre.application(#(0, cmd.none()), update, render)
  lustre.start(app, "#app")
}

pub type Action {
  Incr
}

fn update(state, action) {
  case action {
    Incr -> #(state + 1, cmd.none())
  }
}

fn render(state) {
  div(
    [],
    [
      a(
        [href("https://vitejs.dev"), target("_blank")],
        [img([src("/vite.svg"), class("logo"), alt("Vite logo")])],
      ),
      a(
        [href("https://gleam.run"), target("_blank")],
        [img([src("/gleam.svg"), class("logo gleam"), alt("Vite logo")])],
      ),
      a(
        [href("https://hexdocs.pm/lustre/"), target("_blank")],
        [img([src("/react.svg"), class("logo react"), alt("React logo")])],
      ),
      h1([], [text("Vite + Gleam & Lustre")]),
      div(
        [class("card")],
        [
          button(
            [on_click(Incr)],
            [text("Count is: "), text(int.to_string(state))],
          ),
          p(
            [class("read-the-docs")],
            [text("Click on the Vite, Gleam and Lustre logos to learn more")],
          ),
        ],
      ),
    ],
  )
}
