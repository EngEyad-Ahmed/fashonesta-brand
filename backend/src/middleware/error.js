export function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function notFound(req, res) {
  res.status(404).json({
    error: "العنوان غير موجود",
    path: req.originalUrl,
  });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "انتهت الجلسة، سجلي الدخول مرة أخرى" });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "رمز الدخول غير صالح" });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err.status === 403) {
    return res.status(403).json({ error: err.message });
  }

  if (err.type === "entity.parse.failed" || err.status === 400) {
    return res.status(400).json({ error: "بيانات الطلب غير صالحة" });
  }

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ error: "هذه البيانات مسجلة بالفعل" });
  }

  console.error("[error]", err.message);

  if (process.env.NODE_ENV === "production") {
    return res.status(500).json({ error: "خطأ في الخادم، حاولي مرة أخرى" });
  }

  res.status(500).json({
    error: "خطأ في الخادم",
    message: err.message,
    ...(err && { sql: err.sql }),
  });
}