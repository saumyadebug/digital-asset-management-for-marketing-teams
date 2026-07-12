/* ============================================================
   CloudVault DAM — Activity Log Page Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  damMountLayout('activity-log', 'Activity Log');
  populateUserFilter();
  renderActivityTimeline();

  document.getElementById('activitySearch').addEventListener('input', damDebounce(renderActivityTimeline, 200));
  document.getElementById('activityUserFilter').addEventListener('change', renderActivityTimeline);
  document.getElementById('activityActionFilter').addEventListener('change', renderActivityTimeline);
});

async function populateUserFilter() {

    const sel = document.getElementById("activityUserFilter");

    sel.innerHTML = '<option value="">All Users</option>';

    try {

        const response = await fetch(
            "http://localhost:5000/api/assets",
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
        );

        const result = await response.json();

        if (!result.success) return;

        const users = [...new Set(result.data.map(a => a.UploadedByName))];

        users.forEach(user => {

            const option = document.createElement("option");

            option.value = user;
            option.textContent = user;

            sel.appendChild(option);

        });

    }
    catch(err){

        console.log(err);

    }

}


async function renderActivityTimeline() {

    const timeline = document.getElementById("activityTimeline");

    const q = document.getElementById("activitySearch").value.toLowerCase();

    const selectedUser =
        document.getElementById("activityUserFilter").value;

    try {

        const response = await fetch(
            "http://localhost:5000/api/assets",
            {
                headers:{
                    Authorization:
                        "Bearer " + localStorage.getItem("token")
                }
            }
        );

        const result = await response.json();

        if(!result.success) return;

        let assets = result.data;

        if(selectedUser){

            assets = assets.filter(a =>
                a.UploadedByName === selectedUser
            );

        }

        if(q){

            assets = assets.filter(a =>
                a.OriginalFileName.toLowerCase().includes(q)
            );

        }

        timeline.innerHTML = assets.map(asset => `

            <div class="timeline-item">

                <div class="d-flex align-items-start gap-3">

                    <div class="stat-icon bg-tint-blue">

                        <i class="bi bi-upload"></i>

                    </div>

                    <div>

                        <div>

                            <strong>${asset.UploadedByName}</strong>

                            uploaded

                            <span class="fw-semibold">

                                ${asset.OriginalFileName}

                            </span>

                        </div>

                        <small class="text-muted-2">

                            ${new Date(asset.UploadedAt)
                                .toLocaleString()}

                        </small>

                    </div>

                </div>

            </div>

        `).join("");
        const emptyState = document.getElementById("activityEmptyState");

if (emptyState) {
    emptyState.classList.toggle("d-none", assets.length !== 0);
}

    }

    catch(err){

        console.log(err);

    }

}

  
