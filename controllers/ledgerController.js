const Ledger = require('../models/Ledger');

exports.deleteSubEntry = async (req, res) => {
  const { ledgerId, entryId } = req.params;

  try {
    const updatedLedger = await Ledger.findByIdAndUpdate(
      ledgerId,
      { $pull: { entries: { _id: entryId } } },
      { new: true }
    );

    if (!updatedLedger) {
      return res.status(404).json({ error: 'Ledger not found' });
    }

    res.json({ message: 'Sub-entry deleted', ledger: updatedLedger });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
