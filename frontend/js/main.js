const API_BASE = "/api/campaigns";

async function fetchCampaigns() {
  const status = document.getElementById("filterStatus").value;
  const search = document.getElementById("search").value;
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (search) params.append("search", search);
  const res = await fetch(`${API_BASE}?${params.toString()}`);
  const data = await res.json();
  populateTable(data.campaigns || []);
  updateDashboard(data.meta || {});
}

function populateTable(campaigns) {
  const tbody = document.querySelector("#campaignsTable tbody");
  tbody.innerHTML = "";
  campaigns.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.campaign_name}</td>
      <td>${c.client_name}</td>
      <td>${c.start_date || ""}</td>
      <td>
        <select data-id="${c.id}" class="status-select">
          <option ${c.status === 'Active' ? 'selected' : ''}>Active</option>
          <option ${c.status === 'Paused' ? 'selected' : ''}>Paused</option>
          <option ${c.status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>
      </td>
      <td>
        <button data-id="${c.id}" class="delete-btn">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".status-select").forEach(sel => {
    sel.addEventListener("change", async (e) => {
      const id = e.target.getAttribute("data-id");
      const status = e.target.value;
      await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      await fetchCampaigns();
    });
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      if (!confirm("Delete this campaign?")) return;
      const id = e.target.getAttribute("data-id");
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      await fetchCampaigns();
    });
  });
}

function updateDashboard(meta) {
  document.getElementById("total").innerText = `Total: ${meta.total || 0}`;
  document.getElementById("active").innerText = `Active: ${meta.active || 0}`;
  document.getElementById("paused").innerText = `Paused: ${meta.paused || 0}`;
  document.getElementById("completed").innerText = `Completed: ${meta.completed || 0}`;
}

document.getElementById("campaignForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    campaign_name: document.getElementById("campaign_name").value,
    client_name: document.getElementById("client_name").value,
    start_date: document.getElementById("start_date").value,
    status: document.getElementById("status").value
  };
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (res.ok) {
    document.getElementById("campaignForm").reset();
    fetchCampaigns();
  } else {
    const err = await res.json();
    alert(err.error || "Error adding campaign");
  }
});

document.getElementById("refreshBtn").addEventListener("click", fetchCampaigns);

document.getElementById("search").addEventListener("keydown", (e) => {
  if (e.key === "Enter") fetchCampaigns();
});

// initial load
fetchCampaigns();
