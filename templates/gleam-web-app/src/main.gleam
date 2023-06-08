import gleam/io
import gleam/int

pub external fn randint(max: Int) -> Int =
  "./ffi.ts" "randInt"

pub external fn mathy(x: Int, y: Int) -> Int =
  "./ffi.ts" "mathy"

pub fn main() {
  io.println("Hello from ts_gleam!")
  let x = randint(100)
  let y = randint(500)

  io.println("x = " <> int.to_string(x) <> ", y = " <> int.to_string(y))

  let res = mathy(x, y)

  io.println("result = " <> int.to_string(res))
}
