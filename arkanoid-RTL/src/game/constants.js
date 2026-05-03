/** Resolución lógica (coordenadas internas del canvas). */
export const VIEW = {
  width: 640,
  height: 480,
};

export const COLORS = {
  bg: "#1a2332",
  paddle: "#58a6ff",
  ball: "#f0f6fc",
  hud: "#8b949e",
  overlay: "rgba(15, 20, 25, 0.88)",
  brickPalette: ["#3fb950", "#56d364", "#7ee787", "#79c0ff", "#a371f7"],
};

/** Pala: velocidad tipo arcade (px/s). */
export const PADDLE_SPEED = 560;
export const PADDLE_W = 88;
export const PADDLE_H = 12;
/** Distancia del borde inferior del canvas al borde superior de la pala. */
export const PADDLE_MARGIN_BOTTOM = 40;

export const BALL_R = 6;
/** Velocidad base de la pelota al nivel 1 (px/s). */
export const BALL_SPEED_BASE = 340;
/** Incremento por cada nivel superado. */
export const BALL_SPEED_PER_LEVEL = 24;
/** Tope para que siga siendo jugable. */
export const BALL_SPEED_MAX = 580;

export const BRICK_ROWS = 5;
export const BRICK_COLS = 10;
export const BRICK_TOP = 56;
export const BRICK_HEIGHT = 20;
export const BRICK_GAP_X = 4;
export const BRICK_GAP_Y = 4;
export const BRICK_SIDE_PAD = 20;
/** Máximo de golpes que puede requerir un ladrillo. */
export const BRICK_MAX_HITS = 5;

export const LIVES_START = 3;
/** Puntos al destruir un ladrillo (multiplicado por golpes máximos del bloque). */
export const POINTS_PER_BRICK_BASE = 100;

export const DT_CAP = 1 / 30;
