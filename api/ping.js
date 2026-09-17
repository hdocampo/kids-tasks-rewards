// api/ping.js
const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  'https://uosxwtjonxileaqcirwb.supabase.co',
  'sb_publishable_gKWzhzpTHcfG5yFJPo5AuA_JlfU2S6N'
);

module.exports = async function handler(req, res) {
  try {
    const { error } = await sb
      .from('heartbeat')
      .upsert({ id: 1, pinged_at: new Date().toISOString() });
    if (error) throw error;
    console.log('[Tasky Ping] Supabase activo ✅', new Date().toISOString());
    res.status(200).json({ ok: true, ping: new Date().toISOString() });
  } catch (err) {
    console.error('[Tasky Ping] Error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
};