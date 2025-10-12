const token = localStorage.getItem("token");
if(!token){
  window.location.href = "/login.html";
}

const tableBody = document.getElementById("campaigns");
const form = document.getElementById("campaign-form");

async function loadCampaigns(){
  const res = await fetch("/api/campaigns/", {
    headers: { "Authorization": token }
  });
  const data = await res.json();
  tableBody.innerHTML = "";
  data.forEach(c=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.campaign_name}</td>
      <td>${c.client_name}</td>
      <td>${c.status}</td>
      <td>${c.start_date}</td>
      <td>
        <button onclick="editCampaign('${c._id}')">Edit</button>
        <button onclick="deleteCampaign('${c._id}')">Delete</button>
      </td>`;
    tableBody.appendChild(tr);
  });
}

form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const res = await fetch("/api/campaigns/", {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization": token
    },
    body: JSON.stringify(data)
  });
  if(res.ok){
    alert("Campaign added!");
    form.reset();
    loadCampaigns();
  }
});

async function deleteCampaign(id){
  if(confirm("Delete campaign?")){
    await fetch(`/api/campaigns/${id}`, {
      method:"DELETE",
      headers:{ "Authorization": token }
    });
    loadCampaigns();
  }
}

async function editCampaign(id){
  const newStatus = prompt("Enter new status (Active/Completed):");
  if(newStatus){
    await fetch(`/api/campaigns/${id}`, {
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        "Authorization": token
      },
      body: JSON.stringify({status: newStatus})
    });
    loadCampaigns();
  }
}

document.getElementById("logout").onclick = ()=>{
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

loadCampaigns();
