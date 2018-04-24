//その方向にひっくり返せるかの
enum direcion {
  NONE        = 0b00000000,
  UPPER       = 0b00000001,
  UPPER_LEFT  = 0b00000010,
  LEFT        = 0b00000100,
  LOWER_LEFT  = 0b00001000,
  LOWER       = 0b00010000,
  LOWER_RIGHT = 0b00100000,
  RIGHT       = 0b01000000,
  UPPER_RIGHT = 0b10000000,
}

export default direcion