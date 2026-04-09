export const validateBooking = (req, res, next) => {
  const { roomId, startTime, endTime } = req.body;

  // 1. Finns allt?
  if (!roomId || !startTime || !endTime) {
    return res
      .status(400)
      .json({ message: "roomId, startTime and endTime are required" });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  // 2. Logisk ordning?
  if (start >= end) {
    return res
      .status(400)
      .json({ message: "startTime must be before endTime" });
  }

  // 3. Dåtid?
  if (start < now) {
    return res
      .status(400)
      .json({ message: "Starttiden kan inte vara i dåtid." });
  }

  next();
};
