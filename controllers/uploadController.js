const uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const url = `${req.protocol}://${req.get('host')}/brand-images/${req.file.filename}`;
  res.json({ url });
};

export default { uploadImage };