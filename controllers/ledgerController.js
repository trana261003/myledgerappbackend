const Ledger = require('../models/Ledger');

// DELETE ENTRY
exports.deleteSubEntry = async (req, res) => {
  const { ledgerId, entryId } = req.params;

  try {
    const updatedLedger = await Ledger.findOneAndUpdate(
      { _id: ledgerId, userId: req.user.id }, // ✅ SECURE
      { $pull: { entries: { _id: entryId } } },
      { new: true }
    );

    if (!updatedLedger) {
      return res.status(404).json({ error: 'Ledger not found' });
    }

    res.json({ message: 'Entry deleted', ledger: updatedLedger });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};




// ======================================== old working =================================
// const Ledger = require('../models/Ledger');

// exports.deleteSubEntry = async (req, res) => {
//   const { ledgerId, entryId } = req.params;

//   try {
//     const updatedLedger = await Ledger.findByIdAndUpdate(
//       ledgerId,
//       { $pull: { entries: { _id: entryId } } },
//       { new: true }
//     );

//     if (!updatedLedger) {
//       return res.status(404).json({ error: 'Ledger not found' });
//     }

//     res.json({ message: 'Sub-entry deleted', ledger: updatedLedger });
//   } catch (error) {
//     console.error('Delete error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
