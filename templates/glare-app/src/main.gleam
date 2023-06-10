import glare/element.{a, button, div, h1, img, p}
import glare/property.{alt, class, href, src, target}
import glare/hooks.{create_signal}
import glare/event.{onclick}
import glare

pub fn main() {
  glare.render(render(), glare.select("#app"))
}

fn render() {
  let #(count, set_count) = create_signal(0)

  div([
    a([
      img([])
      |> src("/vite.svg")
      |> class("logo")
      |> alt("Vite logo"),
    ])
    |> href("https://vitejs.dev")
    |> target("_blank"),
    a([
      img([])
      |> src("/gleam.svg")
      |> class("logo gleam")
      |> alt("Gleam logo"),
    ])
    |> href("https://vitejs.dev")
    |> target("_blank"),
    a([
      img([])
      |> src("/solid.svg")
      |> class("logo solid")
      |> alt("Solid logo"),
    ])
    |> href("https://hexdocs.pm/glare")
    |> target("_blank"),
    h1([glare.text("Vite + Gleam & Glare")]),
    div([
      button([glare.text("Count is: "), glare.signal(count)])
      |> onclick(fn() { set_count(count() + 1) }),
      p([glare.text("Click on the Vite, Gleam and Glare logos to learn more")])
      |> class("read-the-docs"),
    ]),
  ])
}
