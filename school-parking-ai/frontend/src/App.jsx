import { useCallback, useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const vehicleLabels = {
  BICYCLE: "Xe đạp",
  ELECTRIC_BICYCLE: "Xe đạp điện",
  ELECTRIC_MOTORBIKE: "Xe máy điện",
  MOTORBIKE: "Xe máy"
};

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Có lỗi xảy ra.");
  return data;
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value ?? "—"}</p>
    </div>
  );
}

export default function App() {
  const [dashboard, setDashboard] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [areas, setAreas] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [users, setUsers] = useState([]);
  const [plateNumber, setPlateNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("BICYCLE");
  const [ownerId, setOwnerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    setError("");
    try {
      const [dash, vehicleData, areaData, sessionData] = await Promise.all([
        request("/dashboard"),
        request("/vehicles"),
        request("/parking/areas"),
        request("/parking")
      ]);
      setDashboard(dash.data);
      setVehicles(vehicleData.data);
      setAreas(areaData.data);
      setSessions(sessionData.data);
      // owner list comes from vehicle owner plus seeded known users via API not exposed separately
      const ownerMap = new Map();
      vehicleData.data.forEach(v => {
        if (v.owner) ownerMap.set(v.owner.id, v.owner);
      });
      setUsers([...ownerMap.values()]);
      if (!areaId && areaData.data[0]) setAreaId(String(areaData.data[0].id));
      if (!vehicleId && vehicleData.data[0]) setVehicleId(String(vehicleData.data[0].id));
    } catch (err) {
      setError(err.message);
    }
  }, [areaId, vehicleId]);

  useEffect(() => { refresh(); }, [refresh]);

  async function addVehicle(event) {
    event.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      if (!ownerId) throw new Error("Chọn chủ phương tiện trước. Nếu danh sách trống, hãy chạy seed hoặc thêm người dùng vào database.");
      await request("/vehicles", {
        method: "POST",
        body: JSON.stringify({ plateNumber, type: vehicleType, ownerId: Number(ownerId) })
      });
      setPlateNumber("");
      setNotice("Đã thêm phương tiện.");
      await refresh();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function checkIn(event) {
    event.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      await request("/parking/check-in", {
        method: "POST",
        body: JSON.stringify({ vehicleId: Number(vehicleId), areaId: Number(areaId) })
      });
      setNotice("Đã ghi nhận xe vào bãi.");
      await refresh();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function checkOut(id) {
    setBusy(true); setError(""); setNotice("");
    try {
      await request(`/parking/check-out/${id}`, { method: "PUT" });
      setNotice("Đã ghi nhận xe ra khỏi bãi.");
      await refresh();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function askAI(event) {
    event.preventDefault();
    if (!question.trim()) return;
    setBusy(true); setError(""); setAnswer("");
    try {
      const result = await request("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ question })
      });
      setAnswer(result.answer);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen">
      <header className="bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-blue-300">School Parking AI</p>
            <h1 className="mt-1 text-xl font-bold sm:text-2xl">Quản lý bãi giữ xe trường học</h1>
          </div>
          <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-300">Bản học tập MVP</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8">
        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {notice && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</div>}

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div><h2 className="text-lg font-bold">Tổng quan</h2><p className="text-sm text-slate-500">Số liệu được lấy từ PostgreSQL.</p></div>
            <button onClick={refresh} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50">↻ Làm mới</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Tổng phương tiện" value={dashboard?.totalVehicles} icon="🚲" />
            <StatCard title="Người dùng" value={dashboard?.totalUsers} icon="👥" />
            <StatCard title="Xe đang gửi" value={dashboard?.parkingNow} icon="🅿️" />
            <StatCard title="Chỗ còn trống" value={dashboard?.availableSlots} icon="🟢" />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Thêm phương tiện</h2>
            <p className="mb-4 text-sm text-slate-500">Đăng ký phương tiện cho học sinh hoặc giáo viên.</p>
            <form onSubmit={addVehicle} className="space-y-3">
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2.5" placeholder="Biển số / mã xe" value={plateNumber} onChange={e => setPlateNumber(e.target.value)} required />
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2.5" value={vehicleType} onChange={e => setVehicleType(e.target.value)}>
                {Object.entries(vehicleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2.5" value={ownerId} onChange={e => setOwnerId(e.target.value)} required>
                <option value="">Chọn chủ phương tiện</option>
                {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
              </select>
              <button disabled={busy} className="w-full rounded-lg bg-blue-700 px-4 py-2.5 font-semibold text-white hover:bg-blue-800 disabled:opacity-50">Thêm phương tiện</button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Ghi nhận gửi xe</h2>
            <p className="mb-4 text-sm text-slate-500">Chọn phương tiện đã đăng ký và khu vực phù hợp.</p>
            <form onSubmit={checkIn} className="space-y-3">
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2.5" value={vehicleId} onChange={e => setVehicleId(e.target.value)} required>
                <option value="">Chọn phương tiện</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.plateNumber} — {vehicleLabels[v.type]}</option>)}
              </select>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2.5" value={areaId} onChange={e => setAreaId(e.target.value)} required>
                <option value="">Chọn khu vực</option>
                {areas.map(a => <option key={a.id} value={a.id}>{a.name} (còn {a.available} chỗ)</option>)}
              </select>
              <button disabled={busy || !vehicles.length || !areas.length} className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">Xác nhận xe vào</button>
            </form>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Khu vực bãi xe</h2>
            <div className="space-y-3">
              {areas.map(area => <div key={area.id} className="rounded-xl bg-slate-50 p-4">
                <div className="flex justify-between gap-3"><span className="font-semibold">{area.name}</span><span className="text-sm text-slate-500">{area.occupied}/{area.capacity}</span></div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(area.capacity ? area.occupied / area.capacity * 100 : 0, 100)}%` }} /></div>
                <p className="mt-1 text-xs text-slate-500">Còn {area.available} chỗ</p>
              </div>)}
              {!areas.length && <p className="text-sm text-slate-500">Chưa có khu vực. Hãy chạy lệnh seed.</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Xe đang ở trong bãi</h2>
            <div className="space-y-3">
              {sessions.map(session => <div key={session.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
                <div>
                  <p className="font-semibold">{session.vehicle.plateNumber}</p>
                  <p className="text-xs text-slate-500">{session.vehicle.owner.name} · {session.area.name}</p>
                  <p className="text-xs text-slate-400">{new Date(session.entryAt).toLocaleString("vi-VN")}</p>
                </div>
                <button disabled={busy} onClick={() => checkOut(session.id)} className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-200 disabled:opacity-50">Ghi nhận lấy xe</button>
              </div>)}
              {!sessions.length && <p className="text-sm text-slate-500">Hiện không có xe đang gửi.</p>}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-2xl">🤖</div>
            <div><h2 className="text-lg font-bold">Trợ lý AI bãi xe</h2><p className="text-sm text-slate-500">Hỏi về số liệu tổng hợp, sức chứa và tình hình bãi xe.</p></div>
          </div>
          <form onSubmit={askAI} className="space-y-3">
            <textarea maxLength={2000} rows={3} className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-violet-500" placeholder="Ví dụ: Khu vực nào còn nhiều chỗ trống nhất?" value={question} onChange={e => setQuestion(e.target.value)} />
            <button disabled={busy || !question.trim()} className="rounded-lg bg-violet-700 px-5 py-2.5 font-semibold text-white hover:bg-violet-800 disabled:opacity-50">{busy ? "Đang xử lý..." : "Gửi câu hỏi cho AI"}</button>
          </form>
          {answer && <div className="mt-4 whitespace-pre-wrap rounded-xl bg-violet-50 p-4 leading-7 text-slate-800"><p className="mb-2 font-bold text-violet-900">AI trả lời</p>{answer}</div>}
        </section>

        <p className="text-center text-xs text-slate-400">School Parking AI · Dự án học tập. Chưa dùng cho vận hành thực tế khi chưa có xác thực và phân quyền.</p>
      </main>
    </div>
  );
}
