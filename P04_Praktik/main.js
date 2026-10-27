
const projects = [
    { id: 1, title: "Sistem Inventaris Keuangan", category: "Web App", budget: 2500000, completed: true },
    { id: 2, title: "Sistem Kasir Digital POS", category: "Desktop App", budget: 5000000, completed: true },
    { id: 3, title: "Landing Page Profil Perusahaan", category: "Web App", budget: 1500000, completed: false },
    { id: 4, title: "Aplikasi Presensi GPS Mobile", category: "Mobile App", budget: 4500000, completed: false }
];
let selectedCategory = "Semua";
let searchKeyword = "";
const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
};
const updateStats = () => {
    const totalProjects = projects.length;
    const totalBudget = projects.reduce((acc, curr) => acc + curr.budget, 0);
    const completedCount = projects.filter(item => item.completed).length;
    document.getElementById("stat-total-projects").textContent = totalProjects;
    document.getElementById("stat-total-budget").textContent = formatRupiah(totalBudget);
    document.getElementById("stat-completed-projects").textContent = completedCount;
};
const renderProjects = () => {
    const container = document.getElementById("project-list");
    const filteredList = projects.filter(proj => {
        const matchesCategory = selectedCategory === "Semua" || proj.category === selectedCategory;
        const matchesSearch = proj.title.toLowerCase().includes(searchKeyword.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    if (filteredList.length === 0) {
        container.innerHTML = "<p class='empty-message'>Tidak ada proyek yang sesuai.</p>";
        return;
    }
    const htmlString = filteredList.map(proj => {
        const badgeClass = proj.completed ? "badge-success" : "badge-pending";
        const statusText = proj.completed ? "Selesai" : "Dalam Pengerjaan";
        const toggleText = proj.completed ? "Jadikan Proses" : "Ubah Status";
        return `
            <div class="project-card">
                <div class="project-info">
                    <span class="project-category">${proj.category}</span>
                    <h4>${proj.title}</h4>
                    <p class="project-budget">${formatRupiah(proj.budget)}</p>
                    <span class="badge ${badgeClass}">${statusText}</span>
                </div>
                <div class="project-actions">
                    <button type="button" class="btn-action btn-toggle" data-action="toggle" data-id="${proj.id}">${toggleText}</button>
                    <button type="button" class="btn-action btn-delete" data-action="delete" data-id="${proj.id}">Hapus Proyek</button>
                </div>
            </div>
        `;
    }).join("");
    container.innerHTML = htmlString;
};
const refreshDashboard = () => {
    updateStats();
    renderProjects();
};
document.addEventListener("DOMContentLoaded", () => {
    const projectForm = document.getElementById("project-form");
    const titleInput = document.getElementById("project-title");
    const categoryInput = document.getElementById("project-category");
    const budgetInput = document.getElementById("project-budget");
    const completedInput = document.getElementById("project-completed");
    const searchInput = document.getElementById("search-project");
    const filterButtons = document.querySelectorAll(".btn-filter");
    projectForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = titleInput.value.trim();
        const category = categoryInput.value;
        const budget = Number(budgetInput.value);
        const completed = completedInput.checked;
        if (title === "") {
            alert("Judul proyek tidak boleh kosong!");
            titleInput.focus();
            return;
        }
        if (budgetInput.value.trim() === "" || !Number.isFinite(budget) || budget <= 0) {
            alert("Estimasi anggaran harus lebih besar dari 0!");
            budgetInput.focus();
            return;
        }
        const newProject = {
            id: Date.now(),
            title: title,
            category: category,
            budget: budget,
            completed: completed
        };
        projects.push(newProject);
        projectForm.reset();
        selectedCategory = "Semua";
        searchInput.value = "";
        searchKeyword = "";
        filterButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.category === "Semua"));
        refreshDashboard();
    });
    searchInput.addEventListener("input", (e) => {
        searchKeyword = e.target.value.trim();
        renderProjects();
    });
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            selectedCategory = btn.dataset.category;
            filterButtons.forEach(b => b.classList.toggle("active", b === btn));
            renderProjects();
        });
    });
    document.getElementById("project-list").addEventListener("click", (e) => {
        const button = e.target.closest("button[data-action]");
        if (!button) return;
        const projectId = Number(button.dataset.id);
        const action = button.dataset.action;
        const projectIndex = projects.findIndex(proj => proj.id === projectId);
        if (projectIndex === -1) return;
        if (action === "toggle") {
            projects[projectIndex].completed = !projects[projectIndex].completed;
        } else if (action === "delete") {
            const confirmed = confirm("Apakah kamu yakin ingin menghapus proyek ini?");
            if (!confirmed) return;
            projects.splice(projectIndex, 1);
        }
        refreshDashboard();
    });
    refreshDashboard();
});
