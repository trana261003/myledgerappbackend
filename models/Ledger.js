// models/Ledger.js
const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  date: String,
  // amount: Number
  amount: {
    type: Number,
    required: true
  }
});

const ledgerSchema = new mongoose.Schema({
  personName: String,
  bankName: String,
  ledgerName: String,
  type: { type: String, enum: ['Credit', 'Debit'] },
  year: String, // e.g., "2023-24"
  entries: [entrySchema],
  // total: Number
  total: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Ledger', ledgerSchema);
