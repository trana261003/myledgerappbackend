// routes/ledgerRoutes.js
const express = require('express');
const router = express.Router();
const Ledger = require('../models/Ledger');

// POST: Save a new ledger
// router.post('/ledger', async (req, res) => {
//   try {
//     const { bankName, ledgerName, year } = req.body;

//     // Optional: Prevent duplicate ledger name for same bank and year
//     // const existing = await Ledger.findOne({ bankName, ledgerName, year });
//     // if (existing) {
//     //   return res.status(400).json({ error: 'Ledger already exists for this bank and year' });
//     // }

//     const ledger = new Ledger(req.body);
//     await ledger.save();
//     res.status(201).json({ message: 'Ledger saved successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// router.post('/ledger', async (req, res) => {
//   try {
//     const { bankName, ledgerName, type, year, entries, total } = req.body;

//     console.log("🟢 Received Data:", req.body);  // ✅ Debug log

//     if (!bankName || !ledgerName || !type || !year || !entries || entries.length === 0) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const ledger = new Ledger({ bankName, ledgerName, type, year, entries, total });
//     const saved = await ledger.save();

//     console.log("✅ Saved:", saved); // Confirm save
//     res.status(201).json({ message: 'Ledger saved successfully' });
//   } catch (err) {
//     console.error("❌ Save error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });


router.post('/ledger', async (req, res) => {
  try {
    const { personName, bankName, ledgerName, type, year, entries, total } = req.body;

    if (!personName || !bankName || !ledgerName || !type || !year || !entries || entries.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if the ledger already exists
    const existingLedger = await Ledger.findOne({ personName, bankName, ledgerName, type, year });

    if (existingLedger) {
      // Append new entries
      existingLedger.entries.push(...entries);

      // Update total
      existingLedger.total += total;

      const updated = await existingLedger.save();
      console.log("✅ Updated Ledger:", updated);
      return res.status(200).json({ message: 'Ledger updated successfully', ledger: updated });
    } else {
      // Create a new ledger if not exists
      const newLedger = new Ledger({personName, bankName, ledgerName, type, year, entries, total });
      const saved = await newLedger.save();
      console.log("✅ Created New Ledger:", saved);
      return res.status(201).json({ message: 'Ledger created successfully', ledger: saved });
    }

  } catch (err) {
    console.error("❌ Save error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// Update single entry inside a ledger
router.put('/ledger/update-entry/:ledgerId/:entryId', async (req, res) => {
  try {
    const { ledgerId, entryId } = req.params;
    const { date, amount } = req.body;

    const ledger = await Ledger.findById(ledgerId);
    if (!ledger) return res.status(404).json({ error: 'Ledger not found' });

    const entry = ledger.entries.id(entryId);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });

    // Update fields
    entry.date = date;
    entry.amount = amount;

    // Recalculate total
    ledger.total = ledger.entries.reduce((sum, e) => sum + e.amount, 0);

    await ledger.save();
    res.json({ message: 'Entry updated successfully' });

  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ error: err.message });
  }
});




// GET: Balance Sheet by year
// router.get('/balance-sheet/:year', async (req, res) => {
//   try {
//     const year = req.params.year;
//     const ledgers = await Ledger.find({ year });

//     const creditLedgers = ledgers.filter(l => l.type === 'Credit');
//     const debitLedgers = ledgers.filter(l => l.type === 'Debit');

//     res.json({
//       credit: creditLedgers,
//       debit: debitLedgers
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// GET: Balance Sheet by year and personName (both required)
router.get('/balance-sheet/:year/:personName', async (req, res) => {
  try {
    const { year, personName } = req.params;

    const ledgers = await Ledger.find({ year, personName });

    const creditLedgers = ledgers.filter(l => l.type === 'Credit');
    const debitLedgers = ledgers.filter(l => l.type === 'Debit');

    res.json({
      credit: creditLedgers,
      debit: debitLedgers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});






// GET: All unique years
router.get('/years', async (req, res) => {
  try {
    const years = await Ledger.distinct('year');
    res.json(years);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: All unique ledger names
router.get('/ledger-names', async (req, res) => {
  try {
    const names = await Ledger.distinct('ledgerName');
    res.json(names);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET: All unique ledger names
router.get('/person-names', async (req, res) => {
  try {
    const names = await Ledger.distinct('personName');
    res.json(names);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Entries by ledger name
router.get('/ledger-entries/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const entries = await Ledger.find({ ledgerName: name });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET: Entries by ledger name
router.get('/ledger-entries/person/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const entries = await Ledger.find({ personName: name });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
