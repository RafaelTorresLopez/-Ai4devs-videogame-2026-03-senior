import {
  VIEW,
  COLORS,
  PADDLE_SPEED,
  PADDLE_W,
  PADDLE_H,
  PADDLE_MARGIN_BOTTOM,
  BALL_R,
  BALL_SPEED_BASE,
  BALL_SPEED_PER_LEVEL,
  BALL_SPEED_MAX,
  BRICK_ROWS,
  BRICK_COLS,
  BRICK_TOP,
  BRICK_HEIGHT,
  BRICK_GAP_X,
  BRICK_GAP_Y,
  BRICK_SIDE_PAD,
  BRICK_MAX_HITS,
  LIVES_START,
  POINTS_PER_BRICK_BASE,
  DT_CAP,
} from "./constants.js";
import { ensureSfx, sfx } from "./sfx.js";

/**
 * @typedef {{
 *   x: number;
 *   y: number;
 *   w: number;
 *   h: number;
 *   row: number;
 *   alive: boolean;
 *   maxHits: number;
 *   hitsRemaining: number;
 * }} Brick
 */

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

export class Game {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this.canvas = canvas;
    const c2d = canvas.getContext("2d");
    if (!c2d) throw new Error("2D context no disponible");
    this.ctx = c2d;

    /** @type {number | null} */
    this._raf = null;
    /** @type {number | undefined} */
    this._lastT;

    this._keys = { left: false, right: false };
    this._mouseOver = false;
    this._mouseTargetX = VIEW.width / 2;

    this._bindInput();
    this._resetSession();
  }

  _bindInput() {
    const { canvas } = this;

    window.addEventListener("keydown", (e) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") this._keys.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") this._keys.right = true;
      if (e.code === "Space") {
        e.preventDefault();
        ensureSfx();
        this._tryLaunch();
        if (this.phase === "gameover") this._resetSession();
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") this._keys.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD") this._keys.right = false;
    });

    canvas.addEventListener("pointerenter", () => {
      this._mouseOver = true;
    });
    canvas.addEventListener("pointerleave", () => {
      this._mouseOver = false;
    });
    canvas.addEventListener("pointermove", (e) => {
      this._mouseOver = true;
      this._mouseTargetX = this._clientToCanvasX(e.clientX);
    });
    canvas.addEventListener("pointerdown", (e) => {
      ensureSfx();
      canvas.focus({ preventScroll: true });
      this._mouseTargetX = this._clientToCanvasX(e.clientX);
      this._tryLaunch();
      if (this.phase === "gameover") this._resetSession();
    });

    canvas.tabIndex = 0;
    canvas.setAttribute("role", "application");
  }

  /** @param {number} clientX */
  _clientToCanvasX(clientX) {
    const rect = this.canvas.getBoundingClientRect();
    const scale = this.canvas.width / rect.width;
    return (clientX - rect.left) * scale;
  }

  _speedForLevel() {
    return clamp(
      BALL_SPEED_BASE + (this.level - 1) * BALL_SPEED_PER_LEVEL,
      BALL_SPEED_BASE,
      BALL_SPEED_MAX,
    );
  }

  /** @param {number} level */
  _rollBrickMaxHits(level) {
    if (level <= 1) return 1;
    const u = Math.random() + (level - 1) * 0.11;
    let h = 1;
    if (u > 0.58) h = 2;
    if (u > 1.04) h = 3;
    if (u > 1.46) h = 4;
    if (u > 1.82) h = 5;
    return Math.min(h, BRICK_MAX_HITS);
  }

  _resetSession() {
    this.phase = "ready";
    this.level = 1;
    this.lives = LIVES_START;
    this.score = 0;
    this.paddle = {
      x: (VIEW.width - PADDLE_W) / 2,
      y: VIEW.height - PADDLE_MARGIN_BOTTOM - PADDLE_H,
      w: PADDLE_W,
      h: PADDLE_H,
    };
    this.ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: BALL_R,
    };
    this._bricks = this._makeBricks();
    this._syncBallOnPaddle();
  }

  /** @returns {Brick[]} */
  _makeBricks() {
    const usable = VIEW.width - BRICK_SIDE_PAD * 2;
    const cellW = (usable - (BRICK_COLS - 1) * BRICK_GAP_X) / BRICK_COLS;
    /** @type {Brick[]} */
    const list = [];
    const level = this.level;
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        const x = BRICK_SIDE_PAD + col * (cellW + BRICK_GAP_X);
        const y = BRICK_TOP + row * (BRICK_HEIGHT + BRICK_GAP_Y);
        const maxHits = this._rollBrickMaxHits(level);
        list.push({
          x,
          y,
          w: cellW,
          h: BRICK_HEIGHT,
          row,
          alive: true,
          maxHits,
          hitsRemaining: maxHits,
        });
      }
    }
    return list;
  }

  _syncBallOnPaddle() {
    const { paddle, ball } = this;
    ball.x = paddle.x + paddle.w / 2;
    ball.y = paddle.y - ball.r - 1;
    ball.vx = 0;
    ball.vy = 0;
  }

  _normalizeBallSpeed() {
    const { ball } = this;
    const target = this._speedForLevel();
    const s = Math.hypot(ball.vx, ball.vy);
    if (s < 1e-6) return;
    ball.vx *= target / s;
    ball.vy *= target / s;
  }

  _tryLaunch() {
    if (this.phase !== "ready") return;
    const spread = (Math.random() - 0.5) * (Math.PI / 1.7);
    const sp = this._speedForLevel();
    this.ball.vx = Math.sin(spread) * sp;
    this.ball.vy = -Math.cos(spread) * sp;
    this.phase = "running";
  }

  _remainingBricks() {
    return this._bricks.filter((b) => b.alive).length;
  }

  _completeLevel() {
    this.level += 1;
    this._bricks = this._makeBricks();
    this.phase = "ready";
    this._syncBallOnPaddle();
  }

  _loseLife() {
    this.lives -= 1;
    if (this.lives <= 0) {
      this.phase = "gameover";
      return;
    }
    this.phase = "ready";
    this._syncBallOnPaddle();
  }

  /** @param {number} dt */
  _updatePaddle(dt) {
    const { paddle } = this;
    let left = paddle.x;

    if (this._mouseOver) {
      left = this._mouseTargetX - paddle.w / 2;
    }

    if (this._keys.left) left -= PADDLE_SPEED * dt;
    if (this._keys.right) left += PADDLE_SPEED * dt;

    paddle.x = clamp(left, 0, VIEW.width - paddle.w);

    if (this.phase === "ready") this._syncBallOnPaddle();
  }

  /** @param {number} dt */
  _updateBall(dt) {
    if (this.phase !== "running") return;

    const { ball } = this;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    let wallHit = false;

    if (ball.x - ball.r < 0) {
      ball.x = ball.r;
      ball.vx *= -1;
      wallHit = true;
    } else if (ball.x + ball.r > VIEW.width) {
      ball.x = VIEW.width - ball.r;
      ball.vx *= -1;
      wallHit = true;
    }

    if (ball.y - ball.r < 0) {
      ball.y = ball.r;
      ball.vy *= -1;
      wallHit = true;
    }

    if (wallHit) {
      sfx.wall();
      this._normalizeBallSpeed();
    }

    if (ball.y - ball.r > VIEW.height) {
      this._loseLife();
      return;
    }

    this._brickCollisions();
    this._paddleCollision();
  }

  _paddleCollision() {
    const { ball, paddle } = this;
    if (ball.vy <= 0) return;

    const padTop = paddle.y;
    const padBottom = paddle.y + paddle.h;
    const padLeft = paddle.x;
    const padRight = paddle.x + paddle.w;

    if (ball.y + ball.r < padTop || ball.y - ball.r > padBottom) return;
    if (ball.x + ball.r < padLeft || ball.x - ball.r > padRight) return;

    ball.y = padTop - ball.r - 0.01;

    const hit = clamp((ball.x - (padLeft + paddle.w / 2)) / (paddle.w / 2), -1, 1);
    const maxBounce = Math.PI / 2.6;
    const angle = hit * maxBounce;
    const speed = this._speedForLevel();
    ball.vx = Math.sin(angle) * speed;
    ball.vy = -Math.cos(angle) * speed;
    sfx.paddle();
  }

  _brickCollisions() {
    const { ball } = this;
    for (const b of this._bricks) {
      if (!b.alive) continue;

      const closestX = clamp(ball.x, b.x, b.x + b.w);
      const closestY = clamp(ball.y, b.y, b.y + b.h);
      const dx = ball.x - closestX;
      const dy = ball.y - closestY;
      if (dx * dx + dy * dy >= ball.r * ball.r) continue;

      b.hitsRemaining -= 1;
      const destroyed = b.hitsRemaining <= 0;
      if (destroyed) {
        b.alive = false;
        this.score += POINTS_PER_BRICK_BASE * b.maxHits;
      }
      sfx.brick(destroyed);

      const overlapL = ball.x + ball.r - b.x;
      const overlapR = b.x + b.w - (ball.x - ball.r);
      const overlapT = ball.y + ball.r - b.y;
      const overlapB = b.y + b.h - (ball.y - ball.r);
      const minX = Math.min(overlapL, overlapR);
      const minY = Math.min(overlapT, overlapB);

      if (minX < minY) {
        ball.vx *= -1;
        ball.x += ball.vx > 0 ? minX : -minX;
      } else {
        ball.vy *= -1;
        ball.y += ball.vy > 0 ? minY : -minY;
      }

      this._normalizeBallSpeed();

      if (this._remainingBricks() === 0) {
        this._completeLevel();
      }
      return;
    }
  }

  _tick() {
    const now = performance.now() / 1000;
    const last = this._lastT ?? now;
    let dt = now - last;
    this._lastT = now;
    dt = clamp(dt, 0, DT_CAP);

    this._updatePaddle(dt);
    this._updateBall(dt);

    this._draw();
  }

  _draw() {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, w, h);

    for (const b of this._bricks) {
      if (!b.alive) continue;
      const base = COLORS.brickPalette[b.row % COLORS.brickPalette.length];
      ctx.fillStyle = base;
      ctx.fillRect(b.x, b.y, b.w, b.h);

      if (b.maxHits > 1) {
        const t = 1 - (b.hitsRemaining - 1) / (b.maxHits - 1 || 1);
        ctx.fillStyle = `rgba(0,0,0,${0.15 + t * 0.35})`;
        ctx.fillRect(b.x, b.y, b.w, b.h);
      }

      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);

      if (b.maxHits > 1) {
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.font = "bold 13px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(b.hitsRemaining), b.x + b.w / 2, b.y + b.h / 2);
      }
    }

    const { paddle, ball } = this;
    ctx.fillStyle = COLORS.paddle;
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

    ctx.fillStyle = COLORS.ball;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = COLORS.hud;
    ctx.font = "600 15px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`Puntos: ${this.score} · Nivel: ${this.level}`, 12, 10);
    ctx.textAlign = "right";
    ctx.fillText(`Vidas: ${this.lives}`, w - 12, 10);

    if (this.phase === "ready") {
      ctx.textAlign = "center";
      ctx.font = "14px system-ui, sans-serif";
      ctx.fillText("Espacio o clic para lanzar la pelota", w / 2, VIEW.height - 72);
    }

    if (this.phase === "gameover") {
      ctx.fillStyle = COLORS.overlay;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#e6edf3";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "700 26px system-ui, sans-serif";
      ctx.fillText("Fin de la partida", w / 2, h / 2 - 20);
      ctx.font = "16px system-ui, sans-serif";
      ctx.fillStyle = COLORS.hud;
      ctx.fillText(
        `Nivel alcanzado: ${this.level} · Puntos: ${this.score} · Pulsa Espacio para reiniciar`,
        w / 2,
        h / 2 + 16,
      );
    }
  }

  start() {
    const loop = () => {
      this._tick();
      this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
  }

  stop() {
    if (this._raf != null) {
      cancelAnimationFrame(this._raf);
      this._raf = null;
    }
  }
}
