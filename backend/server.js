const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('../'));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password here if you set one
  database: 'ayesha_expense_tracker',
  waitForConnections: true,
  connectionLimit: 10
});

app.get('/api/health', async (req, res) => {
  try { await pool.query('SELECT 1'); res.json({ status: 'ok', database: 'connected' }); }
  catch (e) { res.status(500).json({ error: 'Database connection failed', detail: e.message }); }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.transaction_id, t.user_id, t.category_id, c.category_name,
       t.amount, t.transaction_type, t.description, t.transaction_date
       FROM transactions t JOIN categories c ON c.category_id=t.category_id
       WHERE t.user_id=? ORDER BY t.transaction_date DESC`, [req.query.user_id || 1]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/transactions', async (req, res) => {
  const { user_id=1, category_id, amount, transaction_type, description='', transaction_date } = req.body;
  if (!category_id || !amount || !transaction_type || !transaction_date)
    return res.status(400).json({ error: 'category_id, amount, transaction_type and transaction_date are required' });
  try {
    const [r] = await pool.query(
      'INSERT INTO transactions(user_id,category_id,amount,transaction_type,description,transaction_date) VALUES(?,?,?,?,?,?)',
      [user_id, category_id, amount, transaction_type, description, transaction_date]);
    res.status(201).json({ transaction_id: r.insertId, message: 'Transaction added' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/transactions/:id', async (req, res) => {
  const { category_id, amount, transaction_type, description='', transaction_date } = req.body;
  try {
    const [r] = await pool.query(
      'UPDATE transactions SET category_id=?,amount=?,transaction_type=?,description=?,transaction_date=? WHERE transaction_id=?',
      [category_id, amount, transaction_type, description, transaction_date, req.params.id]);
    res.json({ updated: r.affectedRows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try { const [r] = await pool.query('DELETE FROM transactions WHERE transaction_id=?', [req.params.id]); res.json({ deleted: r.affectedRows }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/categories', async (req, res) => {
  try { const [rows] = await pool.query('SELECT * FROM categories WHERE user_id=? ORDER BY category_name', [req.query.user_id || 1]); res.json(rows); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/categories', async (req, res) => {
  const { user_id=1, category_name, category_type } = req.body;
  try { const [r] = await pool.query('INSERT INTO categories(user_id,category_name,category_type) VALUES(?,?,?)',[user_id,category_name,category_type]); res.status(201).json({category_id:r.insertId}); }
  catch(e){res.status(500).json({error:e.message});}
});
app.delete('/api/categories/:id', async (req,res) => {
  try {const [r]=await pool.query('DELETE FROM categories WHERE category_id=?',[req.params.id]);res.json({deleted:r.affectedRows});}
  catch(e){res.status(500).json({error:e.message});}
});

app.get('/api/budgets', async (req,res) => {
  try {const [rows]=await pool.query('SELECT b.*,c.category_name FROM budgets b JOIN categories c ON c.category_id=b.category_id WHERE b.user_id=? ORDER BY b.year DESC,b.month DESC',[req.query.user_id||1]);res.json(rows);}
  catch(e){res.status(500).json({error:e.message});}
});
app.post('/api/budgets', async (req,res) => {
  const {user_id=1,category_id,monthly_limit,month,year}=req.body;
  try {const [r]=await pool.query('INSERT INTO budgets(user_id,category_id,monthly_limit,month,year) VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE monthly_limit=VALUES(monthly_limit)',[user_id,category_id,monthly_limit,month,year]);res.status(201).json({budget_id:r.insertId,message:'Budget saved'});}
  catch(e){res.status(500).json({error:e.message});}
});
app.delete('/api/budgets/:id', async (req,res) => {
  try {const [r]=await pool.query('DELETE FROM budgets WHERE budget_id=?',[req.params.id]);res.json({deleted:r.affectedRows});}
  catch(e){res.status(500).json({error:e.message});}
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Ayesha MoneyBloom server running at http://localhost:${PORT}`));
