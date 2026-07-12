/* ============================================================
   CloudVault DAM — Dashboard Page Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  damMountLayout('dashboard', 'Dashboard');

  // Update welcome message
  const welcome = document.getElementById('welcomeMessage');
  if (welcome && DAM_DATA.currentUser) {
    const firstName = DAM_DATA.currentUser.name.split(' ')[0];
    welcome.textContent = `Welcome back, ${firstName} 👋`;
  }

  renderRecentUploads();
  renderRecentActivity();
  drawDashboardCharts();

  document.addEventListener('dam:redraw-charts', drawDashboardCharts);
  document.querySelector('.theme-switch')?.addEventListener('click', () => setTimeout(drawDashboardCharts, 60));
  loadDashboardStats();
});

async function renderRecentUploads() {

  const tbody = document.getElementById("recentUploadsBody");

  if (!tbody) return;

  try {

    const response = await fetch(
    "http://localhost:5000/api/assets",
    {
        headers: {
            Authorization:
                "Bearer " + localStorage.getItem("token")
        }
    }
);

    const result = await response.json();

    if (!result.success) return;

    const assets = result.data.slice(0, 6);

    tbody.innerHTML = assets.map(asset => {

      let icon = "bi-file-earmark";
      let color = "#64748B";

      if (asset.FileType.startsWith("image/")) {
        icon = "bi-image";
        color = "#2563EB";
      }
      else if (asset.FileType.startsWith("video/")) {
        icon = "bi-camera-reels";
        color = "#8B5CF6";
      }
      else if (asset.FileType.startsWith("application/")) {
        icon = "bi-file-earmark-pdf";
        color = "#EF4444";
      }

      return `
        <tr>

          <td>
            <div class="d-flex align-items-center gap-2">

              <div
                class="file-icon-thumb"
                style="background:${color}22;color:${color};">

                <i class="bi ${icon}"></i>

              </div>

              <div>

                <div class="fw-semibold">
                  ${asset.OriginalFileName}
                </div>

                <small class="text-muted-2">

                  ${(asset.FileSize / (1024 * 1024)).toFixed(2)} MB

                </small>

              </div>

            </div>
          </td>

          <td>

            ${asset.CategoryName ?? "-"}

          </td>

          <td>

            ${asset.UploadedByName || "Unknown"}

          </td>

          <td>

            ${new Date(asset.UploadedAt).toLocaleDateString()}

          </td>

          <td>

            <span class="chip chip-success">
              Uploaded
            </span>

          </td>

        </tr>
      `;

    }).join("");

  }
  catch (err) {

    console.log(err);

  }

}

async function renderRecentActivity() {

    const list = document.getElementById("recentActivityList");

    if (!list) return;

    try {

        const response = await fetch(
            "http://localhost:5000/api/assets",
            {
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("token")
                }
            }
        );

        const result = await response.json();

        if (!result.success) return;

        const assets = result.data.slice(0, 5);

        list.innerHTML = assets.map(asset => `

            <div class="d-flex align-items-start gap-3 mb-3">

                <div class="stat-icon bg-tint-blue mb-0"
                     style="width:36px;height:36px;">

                    <i class="bi bi-upload"></i>

                </div>

                <div>

                    <div style="font-size:.83rem;">

                        <strong>${asset.UploadedByName || "Unknown"}</strong>

                        uploaded

                        <span class="fw-semibold">

                            ${asset.OriginalFileName}

                        </span>

                    </div>

                    <small class="text-muted-2">

                        ${new Date(asset.UploadedAt).toLocaleString()}

                    </small>

                </div>

            </div>

        `).join("");

    }

    catch(err){

        console.log(err);

    }

}

function drawDashboardCharts() {
  damDrawBarChart('monthlyUploadsChart', DAM_DATA.monthlyUploads);
  damDrawDonutChart('categoryDonutChart', DAM_DATA.categoryDistribution);

  const legend = document.getElementById('categoryLegend');
  if (legend) {
    legend.innerHTML = DAM_DATA.categoryDistribution.map(c => `
      <div class="legend-item"><span class="legend-dot" style="background:${c.color};"></span>${c.label} (${c.value})</div>
    `).join('');
  }
}

async function loadDashboardStats() {

  console.log("Loading dashboard stats...");

  try {

    const response = await fetch(
    "http://localhost:5000/api/assets/stats",
    {
        headers: {
            Authorization:
                "Bearer " + localStorage.getItem("token")
        }
    }
);

    console.log("Response:", response);

    const result = await response.json();

    console.log("Result:", result);

    if (!result.success) return;

    document.getElementById("totalFiles").textContent =
      result.data.totalFiles;

    document.getElementById("images").textContent =
      result.data.images;

    document.getElementById("videos").textContent =
      result.data.videos;

    document.getElementById("documents").textContent =
      result.data.documents;

    const bytes = Number(result.data.totalStorage);

    const mb = (bytes / (1024 * 1024)).toFixed(2);

    document.getElementById("storageUsed").textContent =
      mb + " MB";

  }
  catch (error) {

    console.log("ERROR:", error);

  }

}
